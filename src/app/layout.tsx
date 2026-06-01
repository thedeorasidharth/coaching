import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "EDUSPARK – Study Center For Excellence | IIT-JEE & NEET Coaching in Sheoganj",
  description: "EDUSPARK is Sheoganj's premier coaching institute for IIT-JEE, NEET, and XI-XII Foundation. Learn from expert IIT Delhi alumni and leverage state-of-the-art AI smart classes, located near Ambuja Cement, Gaushala Road.",
  keywords: [
    "IIT JEE coaching in Sheoganj",
    "NEET coaching in Sheoganj",
    "Best coaching institute in Sheoganj",
    "Physics coaching in Sheoganj",
    "XI XII foundation classes",
    "Coaching near Ambuja Cement Sheoganj",
    "EDUSPARK Sheoganj",
    "Science Coaching Sheoganj",
    "EDUSPARK Study Center"
  ],
  authors: [{ name: "EDUSPARK Sheoganj" }],
  metadataBase: new URL("https://edusparksheoganj.com"),
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "EDUSPARK Sheoganj | IIT-JEE & NEET Coaching Study Center",
    description: "Sheoganj's leading coaching center for IIT-JEE, NEET-UG, and XI-XII Foundation preparation. Learn from expert IIT Delhi alumni and leverage state-of-the-art AI smart classes.",
    url: "https://edusparksheoganj.com",
    siteName: "EDUSPARK Sheoganj",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "EDUSPARK Study Center Logo"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "EDUSPARK Sheoganj | IIT-JEE & NEET Coaching Center",
    description: "Join EDUSPARK near Ambuja Cement, Sheoganj for top-tier Physics, Chemistry, and Biology/Maths conceptual preparation.",
    images: ["/logo.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://edusparksheoganj.com/#organization",
    "name": "EDUSPARK STUDY CENTER",
    "url": "https://edusparksheoganj.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://edusparksheoganj.com/logo.png",
      "width": "512",
      "height": "512"
    },
    "image": "https://edusparksheoganj.com/logo.png",
    "description": "EDUSPARK is Sheoganj's leading coaching institute for competitive exams like IIT-JEE (Main & Advanced), NEET-UG, and school board (XI-XII) foundation classes.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Krishna Prime Complex, Opposite Ambuja Cement, Gaushala Road",
      "addressLocality": "Sheoganj",
      "addressRegion": "Rajasthan",
      "postalCode": "307027",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.1481",
      "longitude": "73.0182"
    },
    "telephone": ["+919460234151", "+917976049149"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "15:00",
        "closes": "19:00"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+919460234151",
        "contactType": "Admissions & Inquiries",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+917976049149",
        "contactType": "Academic Support & Counseling",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    "sameAs": [
      "https://www.instagram.com/edusparksheoganj/"
    ]
  };

  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Course",
          "name": "IIT-JEE Premium Coaching Program",
          "description": "Rigorous training course for JEE Main & Advanced prep featuring deep physics, chemistry, and mathematics focus under Dr. Mahipal Singh Deora.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "EDUSPARK Sheoganj",
            "sameAs": "https://edusparksheoganj.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Course",
          "name": "NEET Medical Entrance Prep",
          "description": "Comprehensive preparation course for NEET-UG aspirants with mock exam repetitions and detailed biological/chemical core conceptual learning.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "EDUSPARK Sheoganj",
            "sameAs": "https://edusparksheoganj.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Course",
          "name": "XI-XII Foundation Science Classes",
          "description": "Dual curriculum science foundation classes designed for high school boards while setting conceptual structures for competitive exam requirements.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "EDUSPARK Sheoganj",
            "sameAs": "https://edusparksheoganj.com"
          }
        }
      }
    ]
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        {/* Structured Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, courseListSchema])
          }}
        />
        {children}
      </body>
    </html>
  );
}
