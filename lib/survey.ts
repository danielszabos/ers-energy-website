// The contact page's survey request questionnaire: its steps, the choices in its
// dropdowns and the checks on each answer. The form in the browser and the code
// that receives it (lib/surveyRequest) both use these, so they always apply the
// same rules.
import { emailProblem } from "@/lib/emailAddress";
import { postcodeProblem, tidyPostcode } from "@/lib/postcode";
import { services } from "@/lib/site";

/**
 * What /api/survey answers: sent, or the answers it found a problem with.
 * `confirmPostcode` when the postcode isn't on the official list but could be
 * a new building's: sending again with `postcodeConfirmed` goes ahead.
 */
export type SurveyResult =
  | { ok: true }
  | { ok: false; errors?: SurveyErrors; confirmPostcode?: boolean };

/**
 * A hidden box in the form that people never see, so never fill in. Automated
 * spam fills in every box, and a request with this one filled in is dropped.
 */
export const SURVEY_TRAP_FIELD = "leave_blank";

export type SurveyField =
  | "name"
  | "business"
  | "email"
  | "phone"
  | "preferredContact"
  | "postcode"
  | "service"
  | "property";

export type SurveyValues = Record<SurveyField, string>;
export type SurveyErrors = Partial<Record<SurveyField, string>>;

export const surveySteps: { title: string; intro: string; fields: SurveyField[] }[] = [
  {
    title: "About You",
    intro: "Let's start with who we'll be speaking to.",
    fields: ["name", "business"],
  },
  {
    title: "Contact",
    intro: "How should we get in touch to arrange your survey?",
    fields: ["email", "phone", "preferredContact"],
  },
  {
    title: "The Service",
    intro: "Tell us what you need and where the building is.",
    fields: ["postcode", "service", "property"],
  },
];

export const serviceOptions: readonly string[] = [
  ...services.map((service) => service.title),
  "Roofing and solar together",
  "Not sure yet",
];

export const propertyOptions: readonly string[] = [
  "Warehouse or distribution centre",
  "Factory or industrial unit",
  "Office",
  "Retail or showroom",
  "Agricultural building",
  "School, hospital or public building",
  "Other",
];

/**
 * How the customer is told ERS will get back to them ("Someone from the team
 * will ___ soon"), going by the contact method they chose, if any.
 */
export function contactPromise(preferredContact: string) {
  if (preferredContact === "Phone") return "call you";
  if (preferredContact === "Email") return "email you";
  return "be in touch";
}

type FieldConfig = { label: string; hint?: string; missing: string } & (
  | {
      type: "text" | "email" | "tel";
      autoComplete: string;
      maxLength: number;
      uppercase?: boolean;
      /** Shows a "Preferred" switch by this box, which sets preferredContact to this. */
      preference?: string;
    }
  | { type: "select"; options: readonly string[]; placeholder: string }
  // Not a question of its own: set by the "Preferred" switches beside the boxes
  // whose `preference` is one of these options. Empty means no preference, so
  // `missing` is only for an answer that isn't one of the options.
  | { type: "preference"; options: readonly string[] }
);

export const surveyFields: Record<SurveyField, FieldConfig> = {
  name: {
    label: "Your name",
    type: "text",
    autoComplete: "name",
    maxLength: 100,
    missing: "Enter your name",
  },
  business: {
    label: "Business name",
    type: "text",
    autoComplete: "organization",
    maxLength: 150,
    missing: "Enter your business name",
  },
  email: {
    label: "Email address",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
    preference: "Email",
    missing: "Enter your email address",
  },
  phone: {
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    maxLength: 30,
    preference: "Phone",
    missing: "Enter your phone number",
  },
  preferredContact: {
    label: "Preferred contact",
    type: "preference",
    options: ["Email", "Phone"],
    missing: "Choose email or phone, or neither",
  },
  postcode: {
    label: "Site postcode",
    hint: "The postcode of the building the work is for.",
    type: "text",
    autoComplete: "postal-code",
    maxLength: 10,
    uppercase: true,
    missing: "Enter the postcode of the building",
  },
  service: {
    label: "Service needed",
    type: "select",
    options: serviceOptions,
    placeholder: "Choose a service",
    missing: "Choose the service you need",
  },
  property: {
    label: "Property type",
    type: "select",
    options: propertyOptions,
    placeholder: "Choose a property type",
    missing: "Choose the type of property",
  },
};

export const allSurveyFields = surveySteps.flatMap((step) => step.fields);

export const emptySurvey: SurveyValues = {
  name: "",
  business: "",
  email: "",
  phone: "",
  preferredContact: "",
  postcode: "",
  service: "",
  property: "",
};

/**
 * Reads a phone number however it was written ("07523 817995",
 * "+44 (0)7523 817995", "0044 7523 817995", "+353 87 123 4567") as either a UK
 * number with its leading 0 or a number abroad as + and its digits. Null if
 * it has anything but digits, spaces, brackets, dots, dashes and a leading +.
 */
function readPhone(raw: string): { uk: string } | { abroad: string } | null {
  if (!/^\+?[\d\s().-]+$/.test(raw.trim())) return null;
  let number = raw
    .replace(/[\s.-]/g, "")
    .replace(/^\+44\(0\)/, "+44")
    .replace(/[()]/g, "");
  if (/^00[1-9]/.test(number)) number = `+${number.slice(2)}`;
  // "+44 07…" happens too: the 0 after +44 is dropped either way.
  if (number.startsWith("+44")) number = `0${number.slice(3).replace(/^0/, "")}`;
  return number.startsWith("+") ? { abroad: number } : { uk: number };
}

// How long UK numbers are, by the digit after the 0 (Ofcom's numbering plan):
// 01 landlines are 11 digits, or 10 in a few old areas; 02, 03, 05 and 07
// numbers are 11; 08 numbers are 10 or 11. 04 and 06 aren't used, and 09
// numbers are premium rate.
const ukLengths: Record<string, number[]> = {
  "1": [10, 11],
  "2": [11],
  "3": [11],
  "5": [11],
  "7": [11],
  "8": [10, 11],
};

function phoneProblem(value: string): string | undefined {
  const phone = readPhone(value);
  if (!phone) return "Enter a phone number using only digits and spaces";
  if ("abroad" in phone) {
    // A number abroad only gets a length check: country code and number
    // together are 8 to 15 digits, and no country code starts with 0.
    return /^\+[1-9]\d{7,14}$/.test(phone.abroad)
      ? undefined
      : "Enter the full number, including the country code";
  }
  const number = phone.uk;
  if (!number.startsWith("0")) {
    return "Start with 0 for a UK number, or + and the country code for one abroad";
  }
  if (number[1] === "9") return "Please give a number that isn't premium rate (09)";
  if (ukLengths[number[1]]?.includes(number.length)) return undefined;
  return number[1] === "7"
    ? "Mobile numbers have 11 digits, like 07123 456789"
    : "Enter the full number, including the area code, like 0161 496 0000";
}

/**
 * A phone number written the standard way, whatever way it was typed: UK
 * numbers with the usual spacing ("07523 817995", "0161 496 0000",
 * "020 7946 0000", "01942 368021"), numbers abroad as + and their digits.
 */
function tidyPhone(value: string): string {
  const phone = readPhone(value);
  if (!phone) return value;
  if ("abroad" in phone) return phone.abroad;
  const n = phone.uk;
  const split = (...sizes: number[]) => {
    const parts: string[] = [];
    let at = 0;
    for (const size of sizes) parts.push(n.slice(at, (at += size)));
    return [...parts, n.slice(at)].filter(Boolean).join(" ");
  };
  if (n.startsWith("02")) return split(3, 4);
  // Big cities' four-digit codes: 0113 to 0118, and 0121 to 0191.
  if (/^01(1\d|\d1)/.test(n) && n.length === 11) return split(4, 3);
  if (/^0[358]/.test(n)) return split(4, 3);
  return split(5);
}


/** The problem with one answer, phrased for the visitor, or undefined if it's fine. */
export function validateField(field: SurveyField, raw: string): string | undefined {
  const value = raw.trim();
  const config = surveyFields[field];

  if (config.type === "select") {
    return config.options.includes(value) ? undefined : config.missing;
  }
  if (config.type === "preference") {
    return !value || config.options.includes(value) ? undefined : config.missing;
  }
  if (!value) return config.missing;
  if (value.length > config.maxLength) {
    return `Keep this to ${config.maxLength} characters or fewer`;
  }

  switch (field) {
    case "email":
      return emailProblem(value);
    case "phone":
      return phoneProblem(value);
    case "postcode":
      return postcodeProblem(value);
    default:
      return undefined;
  }
}

export function validateSurvey(
  values: SurveyValues,
  fields: readonly SurveyField[] = allSurveyFields,
): SurveyErrors {
  const errors: SurveyErrors = {};
  for (const field of fields) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

/**
 * Trims every answer and writes some the standard way: the postcode
 * ("wn71ap" → "WN7 1AP"), the phone number ("+44 (0)7523817995" →
 * "07523 817995") and the email's domain in lower case.
 */
export function normaliseSurvey(values: SurveyValues): SurveyValues {
  const clean = { ...values };
  for (const field of allSurveyFields) {
    clean[field] = values[field].trim().replace(/\s+/g, " ");
  }
  clean.postcode = tidyPostcode(clean.postcode);
  clean.phone = tidyPhone(clean.phone);
  const at = clean.email.lastIndexOf("@");
  clean.email = clean.email.slice(0, at) + clean.email.slice(at).toLowerCase();
  return clean;
}
