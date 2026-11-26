import { handleEmailCheck } from "@/lib/surveyRequest";

// Checks the survey form's email address when the visitor leaves the Contact
// step. All the work is in lib/surveyRequest, which a Cloudflare Worker can
// call the same way.
export function POST(request: Request) {
  return handleEmailCheck(request);
}
