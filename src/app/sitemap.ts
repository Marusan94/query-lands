import type { MetadataRoute } from "next";
import { challenges } from "@/lib/curriculum";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/sql`, lastModified: new Date() },
    { url: `${base}/sql/simulacro`, lastModified: new Date() },
    ...challenges.map((c) => ({ url: `${base}/sql/${c.id}`, lastModified: new Date() })),
  ];
}
