import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/LibraryExplorer";
import { lessons } from "@/lib/content/lessons";

export const metadata: Metadata = { title: "Visual Lab Library", description: "Browse the complete visual AI learning sequence by phase and mechanism." };

export default function LessonsPage() {
  return <main id="main-content" className="library-page"><header className="page-intro"><span className="section-kicker">382 topic-specific experiments</span><h1>The visual lab library.</h1><p>Navigate by learning dependency, filter within a phase, and open the instrument that makes each concept inspectable.</p></header><LibraryExplorer lessons={lessons} /></main>;
}
