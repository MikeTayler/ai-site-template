import type { Metadata } from "next";
import "@ai-site/components/tokens.css";
import "@ai-site/components/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Site",
  description: "Content-driven static site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
