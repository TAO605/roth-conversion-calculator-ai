import { buildDeferredGtagLoaderScript, getGaMeasurementId } from "@/core/analytics/ga";

export function GoogleAnalytics() {
  const measurementId = getGaMeasurementId();

  if (!measurementId) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: buildDeferredGtagLoaderScript(measurementId) }}
      id="ga4-deferred-loader"
    />
  );
}
