import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roth Conversion Calculator",
    short_name: "RothCalc",
    description: "Educational Roth conversion tax and break-even calculator.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#007AFF",
    categories: ["finance", "productivity", "education"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
