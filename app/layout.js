import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./components/AuthProvider";
import Nav from "./components/Nav";

export const metadata = {
  title: "The Commercial Hive",
  description: "Where future commercial lawyers develop commercial judgement.",
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
              <div className="flex items-center gap-4">
                <span className="font-display font-semibold text-sm">The Commercial Hive</span>
                <Link href="/glossary" className="text-[12.5px] text-charcoal-soft hover:text-charcoal">Glossary</Link>
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
