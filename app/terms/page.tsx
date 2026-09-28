import type { Metadata } from "next";
import { Suspense } from "react";
import { TermsExplorer } from "@/components/TermsExplorer";
import { glossary } from "@/lib/content/lessons";

export const metadata: Metadata = { title: "AI Glossary", description: "Search concepts beside their definitions, related ideas, and visual labs." };

export default function TermsPage() {
  return <main id="main-content" className="terms-page"><Suspense fallback={<section className="page-intro"><h1>Glossary</h1><p>Browse concepts and their lessons. Interactive filtering becomes available when the page loads.</p><ul>{glossary.map((item) => <li key={item.href}><a href={item.href}>{item.term}</a> — {item.definition}</li>)}</ul></section>}><TermsExplorer items={glossary} /></Suspense></main>;
}
