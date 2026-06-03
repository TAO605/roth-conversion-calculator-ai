const defaultSiteUrl = "https://www.roth-conversion-calculator-ai.shop";

export function normalizeSiteUrl(value: string | undefined): string {
  const rawSiteUrl = value?.trim() || defaultSiteUrl;

  return rawSiteUrl.replace(/\/+$/, "");
}

export const siteConfig = {
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  siteName: "Roth Conversion Calculator",
};
