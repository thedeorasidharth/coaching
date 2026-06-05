import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  title: "EduSpark Excellence | Best Coaching Institute in Sheoganj for IIT-JEE & NEET",
  description: "EduSpark Excellence is the best coaching institute in Sheoganj, Rajasthan for IIT-JEE, NEET, competitive exam prep, and school coaching (classes VI-XII). Study with expert faculty, advanced smart classes, and personal mentoring.",
  keywords: [
    "coaching institute sheoganj",
    "best coaching in sheoganj",
    "eduspark excellence",
    "competitive exam coaching",
    "school coaching sheoganj",
    "coaching classes rajasthan",
    "IIT JEE coaching in Sheoganj",
    "NEET coaching in Sheoganj",
    "Physics coaching in Sheoganj",
    "XI XII foundation classes",
    "EduSpark Sheoganj",
    "Science Coaching Sheoganj"
  ],
  authors: [{ name: "EduSpark Excellence" }],
  metadataBase: new URL("https://edusparksheoganj.in"),
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
    title: "EduSpark Excellence | Best Coaching Institute in Sheoganj",
    description: "Prepare for IIT-JEE, NEET, competitive exams, and school board foundation classes at Sheoganj's top coaching institute. Proven results with expert faculty.",
    url: "https://edusparksheoganj.in",
    siteName: "EduSpark Excellence",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "EduSpark Excellence Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSpark Excellence | Best Coaching Institute in Sheoganj",
    description: "Join EduSpark Excellence in Sheoganj for top-tier IIT-JEE, NEET, and school coaching classes. Proven learning methods and expert mentorship.",
    images: ["/logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://edusparksheoganj.in/#organization",
    "name": "EduSpark Excellence",
    "url": "https://edusparksheoganj.in",
    "logo": {
      "@type": "ImageObject",
      "url": "https://edusparksheoganj.in/logo.png",
      "width": "512",
      "height": "512"
    },
    "image": "https://edusparksheoganj.in/logo.png",
    "description": "EduSpark Excellence is Sheoganj's leading coaching institute for competitive exams like IIT-JEE (Main & Advanced), NEET-UG, and school board (XI-XII) foundation classes.",
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
            "name": "EduSpark Excellence",
            "sameAs": "https://edusparksheoganj.in"
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
            "name": "EduSpark Excellence",
            "sameAs": "https://edusparksheoganj.in"
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
            "name": "EduSpark Excellence",
            "sameAs": "https://edusparksheoganj.in"
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
        <GoogleAnalytics gaId="G-CH822ES6FZ" />
      </body>
    </html>
  );
}
