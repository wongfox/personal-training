import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personal Growth OS",
    short_name: "Growth OS",
    description: "Your daily training system for communication, confidence and leadership.",
    id: "/",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f2ed",
    theme_color: "#16150f",
    categories: ["education", "productivity", "lifestyle"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Today's training", url: "/home" },
      { name: "Ask your coach", url: "/coach" },
      { name: "Practice", url: "/practice" },
    ],
  };
}
