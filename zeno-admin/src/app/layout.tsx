import "./globals.css";
import { Teachers } from "next/font/google";
const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${teachers.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}