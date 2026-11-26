// Checks on the site postcode typed into the survey form, used in the browser
// and again on the server. Whether the full postcode exists is looked up on
// the server only, in lib/postcodeLookup.

// The UK's 121 postcode areas: the letters a postcode starts with (WN, M,
// SW…). Checked against the official list of postcodes, so a made-up one like
// "AA1 1AA" is caught straight away.
const postcodeAreas = new Set(
  `AB AL B BA BB BD BH BL BN BR BS BT CA CB CF CH CM CO CR CT CV CW DA DD DE DG DH DL DN DT DY
   E EC EH EN EX FK FY G GL GU HA HD HG HP HR HS HU HX IG IP IV KA KT KW KY L LA LD LE LL LN LS LU
   M ME MK ML N NE NG NN NP NR NW OL OX PA PE PH PL PO PR RG RH RM S SA SE SG SK SL SM SN SO SP SR
   SS ST SW SY TA TD TF TN TQ TR TS TW UB W WA WC WD WF WN WR WS WV YO ZE`.split(/\s+/),
);

// The shape of a postcode, checked with the spaces taken out: an area, a
// district number (maybe with a letter, as in SW1A), then a digit and two
// letters.
const postcodePattern = /^([A-Z]{1,2})\d[A-Z\d]?\d[A-Z]{2}$/;

/** A postcode written the standard way: "wn71ap" → "WN7 1AP". */
export function tidyPostcode(value: string) {
  const compact = value.replace(/\s+/g, "").toUpperCase();
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

/** The problem with a postcode, phrased for the visitor, or undefined if it could be real. */
export function postcodeProblem(value: string): string | undefined {
  const match = postcodePattern.exec(value.replace(/\s+/g, "").toUpperCase());
  if (!match) return "Enter a full UK postcode, like WN7 1AP";
  if (!postcodeAreas.has(match[1])) {
    return `There are no UK postcodes starting "${match[1]}". Check the postcode`;
  }
  return undefined;
}
