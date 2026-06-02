import Script from "next/script";
import { buildGtagConfigScript, buildGtagScriptSrc, getGaMeasurementId } from "@/core/analytics/ga";

export function GoogleAnalytics() {
  const measurementId = getGaMeasurementId();

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script id="ga4-loader" src={buildGtagScriptSrc(measurementId)} strategy="lazyOnload" />
      <Script
        dangerouslySetInnerHTML={{ __html: buildGtagConfigScript(measurementId) }}
        id="ga4-config"
        strategy="lazyOnload"
      />
    </>
  );
}
