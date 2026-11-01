import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import { ServiceWorkerRegistrar } from "@/components/pwa/service-worker-registrar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "Personal Growth OS", template: "%s · Personal Growth OS" },
  description: "A daily training system for communication, confidence and leadership. One skill at a time.",
  applicationName: "Personal Growth OS",
  icons: { icon: "/icons/192", apple: "/icons/apple" },
  appleWebApp: { capable: true, title: "Growth OS", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply a stored theme preference before paint to avoid a flash. */}
        <InlineScript html={`try{var t=localStorage.getItem("pgos-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`} />
      </head>
      <body className="min-h-full bg-bg text-ink">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
