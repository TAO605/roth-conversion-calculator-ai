const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.roth-conversion-calculator-ai.shop";

export const siteConfig = {
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  siteName: "Roth Conversion Calculator",
};
