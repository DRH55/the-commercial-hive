import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./components/AuthProvider";
import Nav from "./components/Nav";

const DESCRIPTION =
  "Where future commercial lawyers develop commercial judgement. Read plain-English commercial analysis, take on real scenarios, and build a public portfolio you can show employers.";

export const metadata = {
  metadataBase: new URL("https://www.thecommercialhive.com"),
  title: { default: "The Commercial Hive", template: "%s | The Commercial Hive" },
  description: DESCRIPTION,
  applicationName: "The Commercial Hive",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "The Commercial Hive",
    locale: "en_GB",
    title: "The Commercial Hive",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="print:hidden"><Nav /></div>
          {children}
          <footer className="border-t border-line px-6 py-10 mt-10 print:hidden">
            <div className="max-w-[1120px] mx-auto flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-display font-semibold text-sm">The Commercial Hive</span>
                <Link href="/glossary" className="text-[12.5px] text-charcoal-soft hover:text-charcoal">Glossary</Link>
                <Link href="/privacy" className="text-[12.5px] text-charcoal-soft hover:text-charcoal">Privacy</Link>
                <Link href="/terms" className="text-[12.5px] text-charcoal-soft hover:text-charcoal">Terms</Link>
              </div>
              <p className="text-[12.5px] text-charcoal-soft">
                <a href="mailto:contact@thecommercialhive.com" className="hover:text-charcoal">contact@thecommercialhive.com</a>
                <span className="mx-2">·</span>
                thecommercialhive.com
              </p>
            </div>
          </footer>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
