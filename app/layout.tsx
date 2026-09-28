import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SampahKu - Kelola Sampah Jadi Berkah",
  description: "Platform digital pengelolaan sampah Pasar Sumur Batu, Bandung",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}