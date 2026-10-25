import {z} from 'zod';
export const QUESTION_TYPES=['knowledge','scenario','unclassified'] as const;
export const questionTypeSchema=z.enum(QUESTION_TYPES);
export const practiceCountSchema=z.union([z.literal(5),z.literal(10),z.literal(20)]);
export const practiceInputSchema=z.object({count:practiceCountSchema.default(10),questionType:z.enum(['all',...QUESTION_TYPES]).default('all'),theme:z.string().optional(),correction:z.enum(['immediate','fin']).default('immediate'),chrono:z.boolean().default(false)});
export type QuestionType=typeof QUESTION_TYPES[number];