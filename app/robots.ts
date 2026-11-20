import type { MetadataRoute } from "next";
import { isLaunched, siteUrl } from "@/lib/siteUrl";

// Crawlers may visit every page. Before launch the pages themselves say
// "noindex" (app/layout.tsx), which crawlers can only see if they're allowed
// in, so nothing is blocked here; the sitemap is offered once the site is live.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: isLaunched ? new URL("/sitemap.xml", siteUrl).href : undefined,
  };
}
