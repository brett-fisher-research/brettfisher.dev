import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

const GA_ID = "G-C7NHJXQQ24";
const SITE_NAME = "Brett Fisher";
const SITE_URL = "https://brettfisher.dev";
const SITE_DESCRIPTION =
  "Brett Fisher's blog — a software engineer writing about JavaScript, React, TypeScript, and the things he learns along the way.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.variable}>
      <body>
        <div className="site">
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="site-title">
                Brett Fisher
              </Link>
              <nav className="site-nav">
                <Link href="/about">About</Link>
              </nav>
            </div>
          </header>

          <main className="site-main">
            <div className="container">{children}</div>
          </main>

          <footer className="site-footer">
            <div className="container site-footer__inner">
              <span>© {new Date().getFullYear()} Brett Fisher</span>
              <a
                href="https://github.com/brett-fisher-research"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </footer>
        </div>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
