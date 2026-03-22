/**
 * Builds a Google Fonts CSS2 URL for heading + body families from brand.json.
 * Skips values that look like full CSS stacks (contain a comma).
 */
export function buildGoogleFontsStylesheetHref(
  headingFont: string,
  bodyFont: string,
): string | null {
  const faces = new Set<string>();
  for (const raw of [headingFont, bodyFont]) {
    const t = raw.trim();
    if (t && !t.includes(",")) {
      faces.add(t);
    }
  }
  if (faces.size === 0) return null;

  const weights = "400;500;600;700";
  const parts = Array.from(faces).map(
    (name) =>
      `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@${weights}`,
  );
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

export function GoogleFontLinks({
  headingFont,
  bodyFont,
}: {
  headingFont: string;
  bodyFont: string;
}) {
  const href = buildGoogleFontsStylesheetHref(headingFont, bodyFont);
  if (!href) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={href} />
    </>
  );
}
