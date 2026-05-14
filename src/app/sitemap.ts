import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/data/blog";
import { db } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/courses`,  lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/pricing`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/live`,     lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/blog`,     lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/help`,     lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${BASE_URL}/terms`,    lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`,  lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Course pages — from real DB
  let coursePages: MetadataRoute.Sitemap = [];
  try {
    const courses = await db.course.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, isFeatured: true, updatedAt: true },
    });
    coursePages = courses.map((course) => ({
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: course.updatedAt.toISOString(),
      changeFrequency: "weekly",
      priority: course.isFeatured ? 0.85 : 0.75,
    }));
  } catch {
    // DB unavailable at build time — omit course pages from sitemap
  }

  // Blog post pages — static data (no DB table for blog yet)
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: post.featured ? 0.7 : 0.6,
  }));

  return [...staticPages, ...coursePages, ...blogPages];
}
