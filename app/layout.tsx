import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.styragon.com'),
  title: {
    default: "Styragon — Luxury Digital Agency",
    template: "%s — Styragon",
  },
  description: "Premium SAAS and Web Design Studio",
  openGraph: {
    title: "Styragon — Luxury Digital Agency",
    description: "Premium SAAS and Web Design Studio",
    url: "https://www.styragon.com",
    siteName: "Styragon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@styragon",
    creator: "@styragon",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${cinzel.variable} ${cormorantGaramond.variable} font-sans antialiased`} suppressHydrationWarning>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
