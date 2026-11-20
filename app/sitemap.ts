import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

// Every page, for search engines. Add new pages here.
const pages = ["/", "/about", "/services", "/gallery", "/contact", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: new URL(path, siteUrl).href }));
}
