import type { Metadata } from "next";
import { Suspense } from "react";
import { TermsExplorer } from "@/components/TermsExplorer";
import { glossary } from "@/lib/content/lessons";

export const metadata: Metadata = { title: "AI Glossary", description: "Search concepts beside their definitions, related ideas, and visual labs." };

export default function TermsPage() {
  return <main id="main-content" className="terms-page"><Suspense fallback={<p className="loading-state">Loading the concept graph…</p>}><TermsExplorer items={glossary} /></Suspense></main>;
}
