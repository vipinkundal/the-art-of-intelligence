import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/LibraryExplorer";
import { lessons } from "@/lib/content/lessons";

export const metadata: Metadata = { title: "Visual Lab Library", description: "Browse the complete visual AI learning sequence by phase and mechanism." };

export default function LessonsPage() {
  return <main id="main-content" className="library-page"><header className="page-intro"><span className="section-kicker">{lessons.length} lessons · {lessons.filter((lesson) => lesson.reviewStatus === "reviewed").length} reviewed</span><h1>The visual learning library.</h1><p>Explore a phase or search across the library. Reviewed lessons include checked explanations, worked calculations, and interactive diagrams. The remaining lessons are being reviewed.</p></header><LibraryExplorer lessons={lessons} /></main>;
}
