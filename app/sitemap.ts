import { getAllPersonalities } from "@/actions/chatAction";
import { Personality } from "@/lib/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [celebs] = await Promise.all([getAllPersonalities({})]);
  const celebEntries: MetadataRoute.Sitemap = celebs.data.map(
    (celeb: Personality) => {
      const formattedTitle = celeb.fullName
        .trim()
        .replaceAll(" ", "-")
        .replaceAll(".", "");
      const lowercaseformattedTitle = formattedTitle.toLowerCase();
      const decodedTitle = decodeURIComponent(lowercaseformattedTitle);
      return {
        url: `${process.env.BASE_URL}personality/${escapeXml(decodedTitle)}`,
        lastModified: new Date() 
      };
    }
  );
  return [
    { url: `${process.env.BASE_URL}`, lastModified: new Date() },
    { url: `${process.env.BASE_URL}chat` },
    { url: `${process.env.BASE_URL}celebrities` },
    { url: `${process.env.BASE_URL}login` },
    { url: `${process.env.BASE_URL}register` },
    { url: `${process.env.BASE_URL}about` },
    { url: `${process.env.BASE_URL}my-projects` },
    ...celebEntries
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
