import type { Metadata } from "next";
import { Teachers } from "next/font/google";
import "./globals.css";

const teachers = Teachers({
  subsets: ["latin"],
  variable: "--font-teachers",
  weight: ["400", "500", "600", "700"], 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${teachers.variable} antialiased`}
        style={{
          backgroundColor: '#f9fafb', 
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          color: '#1f2937',
        }}
      >
        {children}
      </body>
    </html>
  );
}