import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/lesson/LessonShell";
import { PhaseHub } from "@/components/lesson/PhaseHub";
import { lessonLoaders } from "@/content/generated/lesson-loaders";
import { lessonBySlug, lessons, routeDocuments } from "@/lib/content/lessons";

export const dynamicParams = false;

export function generateStaticParams() {
  return routeDocuments.map((lesson) => ({ slug: lesson.slug.split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const route = routeDocuments.find((lesson) => lesson.slug === slug);
  const lesson = route ? lessonBySlug.get(route.canonicalSlug) : undefined;
  return lesson ? { title: lesson.title, description: lesson.summary, alternates: { canonical: `/lessons/${lesson.slug}/` } } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join("/");
  const route = routeDocuments.find((lesson) => lesson.slug === slug);
  const lesson = route ? lessonBySlug.get(route.canonicalSlug) : undefined;
  const loader = lesson && lessonLoaders[lesson.slug];
  if (!lesson || !loader) notFound();
  const Content = (await loader()).default;
  const phaseLessons = lessons.filter((candidate) => candidate.phaseKey === lesson.phaseKey);
  const isPhaseHub = lesson.slug === lesson.phaseKey && phaseLessons.length > 1;
  if (isPhaseHub) return <PhaseHub phase={lesson} lessons={phaseLessons}><Content /></PhaseHub>;
  return <LessonShell lesson={lesson}><Content /></LessonShell>;
}
