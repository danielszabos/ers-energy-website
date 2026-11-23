import { handleSurveyPost } from "@/lib/surveyRequest";

// Where the contact page's survey form sends its answers. All the work is in
// lib/surveyRequest, which a Cloudflare Worker can call the same way.
export function POST(request: Request) {
  return handleSurveyPost(request, process.env, {
    development: process.env.NODE_ENV === "development",
  });
}
