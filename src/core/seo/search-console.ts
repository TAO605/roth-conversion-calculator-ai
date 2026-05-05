type EnvLike = Record<string, string | undefined>;

const verificationTokenPattern = /^[A-Za-z0-9_-]{8,128}$/;
const defaultGoogleSiteVerificationToken = "HRbRO-Uc1Qg324AW4DLI681t-BqvwgwJxfTt3w9VXqk";

export function getGoogleSiteVerificationToken(env: EnvLike = process.env): string | null {
  const token = (env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? defaultGoogleSiteVerificationToken).trim();

  return token && verificationTokenPattern.test(token) ? token : null;
}

export function buildGoogleSiteVerification(env: EnvLike = process.env): { google: string } | undefined {
  const token = getGoogleSiteVerificationToken(env);

  return token ? { google: token } : undefined;
}
