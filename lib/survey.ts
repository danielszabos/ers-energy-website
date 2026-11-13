// The contact page's survey request questionnaire: its steps, the choices in its
// dropdowns and the checks on each answer. The form in the browser and the
// server action both use these, so they always apply the same rules.
import { services } from "@/lib/site";

export type SurveyField =
  | "name"
  | "business"
  | "email"
  | "phone"
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
    fields: ["email", "phone"],
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

type FieldConfig = { label: string; hint?: string; missing: string } & (
  | {
      type: "text" | "email" | "tel";
      autoComplete: string;
      maxLength: number;
      uppercase?: boolean;
    }
  | { type: "select"; options: readonly string[]; placeholder: string }
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
    missing: "Enter your email address",
  },
  phone: {
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    maxLength: 30,
    missing: "Enter your phone number",
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
  postcode: "",
  service: "",
  property: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]+$/;
// Checked with the spaces removed.
const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/i;

/** The problem with one answer, phrased for the visitor, or undefined if it's fine. */
export function validateField(field: SurveyField, raw: string): string | undefined {
  const value = raw.trim();
  const config = surveyFields[field];

  if (config.type === "select") {
    return config.options.includes(value) ? undefined : config.missing;
  }
  if (!value) return config.missing;
  if (value.length > config.maxLength) {
    return `Keep this to ${config.maxLength} characters or fewer`;
  }

  switch (field) {
    case "email":
      return emailPattern.test(value)
        ? undefined
        : "Enter an email address like name@company.co.uk";
    case "phone": {
      const digits = value.replace(/\D/g, "").length;
      return phonePattern.test(value) && digits >= 10 && digits <= 15
        ? undefined
        : "Enter a full phone number, including the area code";
    }
    case "postcode":
      return postcodePattern.test(value.replace(/\s+/g, ""))
        ? undefined
        : "Enter a full UK postcode, like WN7 1AP";
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

/** Trims every answer and writes the postcode the standard way ("wn71ap" → "WN7 1AP"). */
export function normaliseSurvey(values: SurveyValues): SurveyValues {
  const clean = { ...values };
  for (const field of allSurveyFields) {
    clean[field] = values[field].trim().replace(/\s+/g, " ");
  }
  const postcode = clean.postcode.replace(/\s+/g, "").toUpperCase();
  clean.postcode = `${postcode.slice(0, -3)} ${postcode.slice(-3)}`;
  return clean;
}
