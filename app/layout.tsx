import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advent Calendar 2024",
  description: "Woo - Christmas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="relative min-w-screen min-h-screen bg-black">
          <div
            aria-hidden
            className="absolute inset-0 h-full w-full"
            style={{ background: "#252B31" }}
          >
            <img src="/corner.png" className="absolute w-1/12 top-0 left-0" />
            <img
              src="/corner.png"
              className="absolute w-1/12 top-0 right-0 rotate-90"
            />
            <img
              src="/corner.png"
              className="absolute w-1/12 bottom-0 right-0 rotate-180"
            />
            <img
              src="/corner.png"
              className="absolute w-1/12 bottom-0 left-0 -rotate-90"
            />
          </div>
          <div className="py-2 z-10 relative w-full md:w-2/3 mx-auto p-4 min-h-screen">
            <Link href="/">
              <img src="/header.png" className="w-2/5 mx-auto my-4" />
            </Link>
            <img src="/divider.png" className="w-1/2 mx-auto my-4" />
            <section className="text-white">{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
