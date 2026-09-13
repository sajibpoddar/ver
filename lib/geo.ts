const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const points = [...code.toUpperCase()].map(
    (char) => 127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...points);
}

export function countryName(code: string): string {
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export function topCountry(
  breakdown: Record<string, number>
): { code: string; count: number } | null {
  const entries = Object.entries(breakdown);
  if (entries.length === 0) return null;
  const [code, count] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { code, count };
}
