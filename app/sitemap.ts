import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `${process.env.BASE_URL}`, lastModified: new Date() },
    { url: `${process.env.BASE_URL}/chat` },
    { url: `${process.env.BASE_URL}/login` },
    { url: `${process.env.BASE_URL}/register` },
    { url: `${process.env.BASE_URL}/about` },
    { url: `${process.env.BASE_URL}/my-projects` },
  ];
}

function escapeXml(unsafeStr: string) {
  return unsafeStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
