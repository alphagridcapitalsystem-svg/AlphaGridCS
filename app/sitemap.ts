import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.alphagridcs.online",
      priority: 1,
      lastModified: new Date(),
    },

    {
      url: "https://www.alphagridcs.online/about",
      priority: 0.8,
      lastModified: new Date(),
    },

    {
      url: "https://www.alphagridcs.online/contact",
      priority: 0.8,
      lastModified: new Date(),
    },

    {
      url: "https://www.alphagridcs.online/faq",
      priority: 0.8,
      lastModified: new Date(),
    },

    {
      url: "https://www.alphagridcs.online/security",
      priority: 0.8,
      lastModified: new Date(),
    },
  ];
}
