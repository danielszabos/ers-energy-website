import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// Every page on this site is fully static; the build fails if that changes.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: {
    default: "ERS Energy | Commercial roofing and solar PV contractor",
    template: "%s | ERS Energy",
  },
  description:
    "Award-winning roof refurbishment, repairs and solar PV for industrial and commercial buildings across the UK. Based in Leigh, Greater Manchester.",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "ERS Energy",
    title: "ERS Energy | Commercial roofing and solar PV contractor",
    description:
      "Award-winning roof refurbishment, repairs and solar PV for industrial and commercial buildings across the UK.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e2420",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hide scroll-reveal content only when JS can reveal it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only rounded-[2px] bg-brand-green px-4 py-3 font-heading font-semibold text-deep-base focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to main content
        </a>
        <Nav logo={<Logo animate className="h-full" />} />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
