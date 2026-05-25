import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "t00ns puzzle",
  description: "A simple image puzzle game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
