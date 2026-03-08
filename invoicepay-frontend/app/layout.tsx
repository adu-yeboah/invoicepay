import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "Invoice Pay",
  description:
    "Invoice Pay is a simple and efficient invoicing application designed to streamline your billing process. With its user-friendly interface and powerful features, you can easily create, manage, and send invoices to your clients. Whether you're a freelancer, small business owner, or part of a larger organization, Invoice Pay helps you get paid faster and stay organized.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-1.jpg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/logo-1.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning  className={cn("font-sans", inter.variable)} >
      <body
        className={` antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="invoicepay-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
