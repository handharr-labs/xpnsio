import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@handharr-labs/forge-web-client";
import { ThemeProvider } from "@handharr-labs/forge-ui-uno";
import { AuthClientProvider } from "@/shared/presentation/providers/AuthClientProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xpnsio",
  description: "Know how much budget you have left, stay aware of your spending.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AuthClientProvider>
              {children}
            </AuthClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
