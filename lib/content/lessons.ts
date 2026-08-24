import rawLessons from "@/content/generated/lessons.json";
import rawGlossary from "@/content/generated/glossary.json";
import { lessonCollectionSchema, type LessonDocument } from "./schema";

export const lessons: LessonDocument[] = lessonCollectionSchema.parse(rawLessons);
export const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
export const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export const phases = [...new Map(lessons.map((lesson) => [lesson.phaseKey, { key: lesson.phaseKey, label: lesson.phase }])).values()];

export const glossary = rawGlossary as Array<{
  term: string;
  definition: string;
  phase: string;
  href: string;
  tags: string[];
}>;
