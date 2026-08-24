import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Art of Intelligence — Visual Learning Lab", template: "%s — The Art of Intelligence" },
  description: "A visual, interactive field guide to the mechanisms behind artificial intelligence.",
};

const themeScript = `(function(){try{var saved=localStorage.getItem('aoi-theme');var system=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=saved||system}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>The Art of Intelligence</span><p>Build mental models you can inspect, stress, and remember.</p><span>Updated 2026</span></footer>
      </body>
    </html>
  );
}
