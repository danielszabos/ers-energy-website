// Where the site lives, for link previews, the sitemap and robots.txt.
//
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every build: the project's
// shortest custom domain (ersenergy.co.uk once it's connected), or its
// .vercel.app address until then. It's read when the site is built, so after
// connecting the domain, redeploy once for these to switch over.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  productionHost ? `https://${productionHost}` : "http://localhost:3000",
);

/**
 * True once the site is on its own domain. Until then it asks search engines
 * not to list it: the old site is still the one at ersenergy.co.uk, and the
 * contact form isn't sending enquiries anywhere yet.
 */
export const isLaunched = productionHost ? !productionHost.endsWith(".vercel.app") : false;
