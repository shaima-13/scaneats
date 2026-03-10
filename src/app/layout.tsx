import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScanEats | Intelligent Food Safety Scanner",
  description: "Barcode-based food advisory system for diabetic and allergy-sensitive users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="main-layout">
          {children}
        </main>
      </body>
    </html>
  );
}
