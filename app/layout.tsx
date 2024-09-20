import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

const inter = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Advent Calendar 2024',
  description: 'Woo - Christmas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
