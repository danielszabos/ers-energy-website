// Whether a postcode exists, and where it is, from postcodes.io: a free
// service that looks postcodes up in the official list the Office for
// National Statistics publishes. Only the postcode is sent. Run on the server,
// with nothing but fetch, so it works on Vercel, in local development and in a
// Cloudflare Worker.

const SERVICE = "https://api.postcodes.io";

export type PostcodeLookup =
  /** A real postcode, and where it is ("Wigan", "Truro, Cornwall") if known. */
  | { found: true; place?: string }
  /**
   * Not on the list. `canConfirm` when its district exists (WN7 is real, WN7
   * 9ZZ isn't listed): a new building's postcode can take a few months to be
   * added, so the visitor may say it's right and send it anyway.
   */
  | { found: false; problem: string; canConfirm: boolean };

type PostcodeResult = { admin_district?: string | null; parish?: string | null };

/** The result for a path, or null if postcodes.io has nothing there. */
async function get(path: string, signal: AbortSignal): Promise<PostcodeResult | null> {
  const response = await fetch(`${SERVICE}${path}`, { signal });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Postcode lookup failed (${response.status})`);
  return ((await response.json()) as { result: PostcodeResult }).result;
}

/**
 * Looks up a postcode written the standard way ("WN7 1AP"). Undefined when the
 * lookup can't tell (postcodes.io is slow or down): better to let a postcode
 * through than to turn a customer away because of a hiccup.
 */
export async function lookUpPostcode(postcode: string): Promise<PostcodeLookup | undefined> {
  const compact = postcode.replace(/\s+/g, "");
  const district = postcode.split(" ")[0];
  try {
    const signal = AbortSignal.timeout(3000);
    const result = await get(`/postcodes/${encodeURIComponent(compact)}`, signal);
    if (result) return { found: true, place: placeName(result) };
    // A postcode that's been retired still pins down where the building is.
    if (await get(`/terminated_postcodes/${encodeURIComponent(compact)}`, signal)) {
      return { found: true };
    }
    if (!(await get(`/outcodes/${encodeURIComponent(district)}`, signal))) {
      return {
        found: false,
        problem: `There are no UK postcodes starting "${district}". Check the postcode`,
        canConfirm: false,
      };
    }
    return {
      found: false,
      problem: `We couldn't find ${postcode}. Check it's right: a new building's postcode may not be listed yet`,
      canConfirm: true,
    };
  } catch {
    return undefined;
  }
}

/**
 * Where a postcode is, for the enquiry: the council area, after the parish
 * when it has one ("Wigan", "Truro, Cornwall").
 */
function placeName({ admin_district: district, parish }: PostcodeResult) {
  if (!district) return undefined;
  const hasParish = parish && !parish.endsWith("unparished area") && parish !== district;
  return hasParish ? `${parish}, ${district}` : district;
}
