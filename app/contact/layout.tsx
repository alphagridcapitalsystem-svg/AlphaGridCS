import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | AlphaGrid Capital System",

  description:
    "Contact AlphaGrid Capital System for customer support, investment inquiries, account assistance, and general questions.",

  keywords: [
    "AlphaGrid contact",
    "investment support",
    "customer support",
    "help center",
    "telegram support",
  ],

  openGraph: {
    title: "Contact | AlphaGrid Capital System",

    description:
      "Get in touch with AlphaGrid Capital System support.",

    url: "https://yourdomain.com/contact",

    siteName: "AlphaGrid Capital System",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact | AlphaGrid Capital System",
    description:
      "Get in touch with AlphaGrid Capital System support.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://yourdomain.com/contact",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
