import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonShell } from "@/components/lesson/LessonShell";
import { lessonLoaders } from "@/content/generated/lesson-loaders";
import { lessonBySlug, lessons } from "@/lib/content/lessons";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug.split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const lesson = lessonBySlug.get(slug);
  return lesson ? { title: lesson.title, description: lesson.summary } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join("/");
  const lesson = lessonBySlug.get(slug);
  const loader = lessonLoaders[slug];
  if (!lesson || !loader) notFound();
  const Content = (await loader()).default;
  return <LessonShell lesson={lesson}><Content /></LessonShell>;
}
