"use server";

import {
  allSurveyFields,
  normaliseSurvey,
  validateSurvey,
  type SurveyErrors,
  type SurveyValues,
} from "@/lib/survey";

export type SurveyResult = { ok: true } | { ok: false; errors?: SurveyErrors };

/**
 * Receives a survey request from the contact page questionnaire.
 *
 * Anyone can call this directly, not only the form, so every answer is checked
 * again here with the same rules the form uses.
 */
export async function requestSurvey(input: unknown): Promise<SurveyResult> {
  const data = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  const values = Object.fromEntries(
    allSurveyFields.map((field) => [field, typeof data[field] === "string" ? data[field] : ""]),
  ) as SurveyValues;

  const errors = validateSurvey(values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const request = normaliseSurvey(values);

  // TODO before launch: send the request somewhere the team will see it (an
  // email to the office, a CRM, ...). Until then it only appears in the server
  // log: the terminal running `npm run dev`, or the Vercel function logs.
  console.info("Survey request received", request);

  return { ok: true };
}
