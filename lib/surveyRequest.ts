// Receives a survey request from the contact page and sends the emails. It
// takes a standard web Request and gives back a Response, so the same function
// serves /api/survey on Vercel (app/api/survey/route.ts) and in a Cloudflare
// Worker, where `env` is the Worker's environment instead of process.env.
import {
  SURVEY_TRAP_FIELD,
  allSurveyFields,
  normaliseSurvey,
  validateSurvey,
  type SurveyResult,
  type SurveyValues,
} from "@/lib/survey";
import { sendSurveyEmails, surveyEmailSettings } from "@/lib/surveyEmail";

// Far more than seven short answers need: anything bigger isn't the form.
const MAX_BODY = 10_000;

export async function handleSurveyPost(
  request: Request,
  env: Record<string, string | undefined>,
  {
    /** Without a Resend key, log the request instead of failing (local development). */
    development = false,
  } = {},
): Promise<Response> {
  const reply = (body: SurveyResult, status: number) => Response.json(body, { status });

  // Only this site's own pages may send requests.
  if (!sameOrigin(request)) return reply({ ok: false }, 403);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply({ ok: false }, 413);
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    data = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return reply({ ok: false }, 400);
  }

  // Spam: look like it worked, send nothing.
  const trap = data[SURVEY_TRAP_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") return reply({ ok: true }, 200);

  // Anyone can call this directly, not only the form, so every answer is
  // checked again here with the same rules the form uses.
  const values = Object.fromEntries(
    allSurveyFields.map((field) => [field, typeof data[field] === "string" ? data[field] : ""]),
  ) as SurveyValues;
  const errors = validateSurvey(values);
  if (Object.keys(errors).length > 0) return reply({ ok: false, errors }, 400);

  const survey = normaliseSurvey(values);
  const settings = surveyEmailSettings(env);
  if (!settings) {
    if (development) {
      console.info("Survey request received (no RESEND_API_KEY set, so no emails sent)", survey);
      return reply({ ok: true }, 200);
    }
    // Better to say so, and ask them to call, than to lose the enquiry.
    console.error("Survey request not sent: RESEND_API_KEY isn't set");
    return reply({ ok: false }, 503);
  }

  try {
    await sendSurveyEmails(survey, settings);
    return reply({ ok: true }, 200);
  } catch (error) {
    console.error("Survey request not sent", error);
    return reply({ ok: false }, 502);
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Browsers always send Origin with a fetch POST; tools that leave it out
  // still have to pass every other check.
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
