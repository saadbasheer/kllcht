import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import Background from "@/components/Background";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kll/Chat - Create disposable communication channels",
  description: "Create disposable communication channels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Toaster />{" "}
          <div className="relative min-h-screen">
            {children}
            <Background />{" "}
          </div>
        </ThemeProvider>{" "}
      </body>
    </html>
  );
}
