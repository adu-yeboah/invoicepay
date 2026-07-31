import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Invoice Pay",
  description:
    "Invoice Pay is a simple and efficient invoicing application designed to streamline your billing process. With its user-friendly interface and powerful features, you can easily create, manage, and send invoices to your clients. Whether you're a freelancer, small business owner, or part of a larger organization, Invoice Pay helps you get paid faster and stay organized.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storageKey = 'invoicepay-theme';
                const theme = localStorage.getItem(storageKey) || 'system';

                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={` antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
