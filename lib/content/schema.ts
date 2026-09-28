import { z } from "zod";
import { linearModels } from "./linear-algebra.ts";
import { distributionModels } from "./distributions.ts";
import { probabilityModels } from "./probability-foundations.ts";
import { inferenceModels } from "./statistical-inference.ts";

const parameterSchema = z.object({
  id: z.string(),
  label: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  initial: z.number(),
  unit: z.string(),
});

const labBase = z.object({
  title: z.string(),
  summary: z.string(),
  equation: z.string(),
  accessibilitySummary: z.string(),
  takeaway: z.string(),
  parameter: parameterSchema,
  seed: z.number().int().nonnegative(),
});

export const labSpecSchema = z.discriminatedUnion("engine", [
  labBase.extend({ engine: z.literal("calculation"), model: z.enum(["bernoulli", "binomial", "bayes", "entropy", "cross-entropy", "kl", "perplexity", "brier", "markov", "early-stopping", "eigen", "conformal", "conditional", "confidence", ...linearModels, ...distributionModels, ...probabilityModels, ...inferenceModels]), assumptions: z.string().min(20) }),
  labBase.extend({ engine: z.literal("geometry"), vectors: z.array(z.tuple([z.number(), z.number()])), transform: z.tuple([z.number(), z.number(), z.number(), z.number()]) }),
  labBase.extend({ engine: z.literal("probability"), modes: z.array(z.number()), spread: z.number().positive() }),
  labBase.extend({ engine: z.literal("optimization"), minima: z.array(z.number()), curvature: z.number().positive() }),
  labBase.extend({ engine: z.literal("sequence"), tokens: z.array(z.string()) }),
  labBase.extend({ engine: z.literal("retrieval"), query: z.string(), documents: z.array(z.string()) }),
  labBase.extend({ engine: z.literal("transport"), particles: z.number().int().positive(), targetShape: z.number().int() }),
  labBase.extend({ engine: z.literal("signal"), frequency: z.number().positive(), kernel: z.array(z.number()) }),
  labBase.extend({ engine: z.literal("reinforcement"), states: z.number().int().positive(), rewardAt: z.number().int().nonnegative() }),
  labBase.extend({ engine: z.literal("systems"), stages: z.array(z.string()), bottleneck: z.number().int().nonnegative() }),
  labBase.extend({ engine: z.literal("evaluation"), positiveRate: z.number(), baseRate: z.number() }),
  labBase.extend({ engine: z.literal("timeline"), events: z.array(z.number().int()) }),
  labBase.extend({ engine: z.literal("graph"), nodeCount: z.number().int().positive(), density: z.number() }),
]);

export const lessonDocumentSchema = z.object({
  id: z.string(),
  slug: z.string(),
  canonicalSlug: z.string(),
  reviewStatus: z.enum(["pending", "reviewed"]),
  legacyPath: z.string(),
  phase: z.string(),
  phaseKey: z.string(),
  title: z.string(),
  summary: z.string(),
  prerequisites: z.array(z.string()),
  outcomes: z.array(z.string()),
  tags: z.array(z.string()),
  updatedAt: z.string(),
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
  headings: z.array(z.string()),
  labs: z.array(labSpecSchema).min(1),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});

export const lessonCollectionSchema = z.array(lessonDocumentSchema);

export type LabSpec = z.infer<typeof labSpecSchema>;
export type LessonDocument = z.infer<typeof lessonDocumentSchema>;

export type LessonNarrative = {
  hook: string;
  overview: string;
  concepts: Array<{ title: string; explanation: string }>;
  process: string[];
  formulas: Array<{ label: string; expression: string; meaning: string }>;
  example: { title: string; setup: string; steps: string[]; result: string };
  pitfalls: string[];
  implementation: string[];
  takeaways: string[];
};
