import type { MetadataRoute } from "next"

const siteUrl = "https://bluepaymobile2026.vercel.app"

const publicRoutes = [
  "",
  "/about",
  "/features",
  "/faq",
  "/reviews",
  "/testimonies",
  "/support",
  "/security",
  "/privacy",
  "/terms",
  "/dangote-ipo",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
