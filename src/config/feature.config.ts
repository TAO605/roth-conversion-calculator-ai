export const featureConfig = {
  coreCalculator: {
    enabled: true,
    version: "1.0.0",
    locked: true,
  },
  aiAssistant: {
    enabled: true,
    version: "1.0.0",
    grayRate: 100,
    mountPosition: "result-panel",
  },
  pdfReport: {
    enabled: true,
    version: "1.0.176",
    grayRate: 100,
    mountPosition: "result-actions",
  },
  shareLink: {
    enabled: true,
    version: "1.0.0",
    grayRate: 100,
    mountPosition: "result-actions",
  },
} as const;
