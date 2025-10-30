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
  title: "Styragon — Luxury Digital Agency",
  description: "Premium SAAS and Web Design Studio",
  generator: "v0.app",
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
