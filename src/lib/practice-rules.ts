import {z} from 'zod';
export const QUESTION_TYPES=['knowledge','scenario','unclassified'] as const;
export const questionTypeSchema=z.enum(QUESTION_TYPES);
export const practiceCountSchema=z.union([z.literal(5),z.literal(10),z.literal(20)]);
export const practiceInputSchema=z.object({count:practiceCountSchema.default(10),questionType:z.enum(['all',...QUESTION_TYPES]).default('all'),theme:z.string().optional(),correction:z.enum(['immediate','fin']).default('immediate'),chrono:z.boolean().default(false)});
export type QuestionType=typeof QUESTION_TYPES[number];
export function effectivePracticeCount(requested:5|10|20,available:number){return Math.min(practiceCountSchema.parse(requested),Math.max(0,Math.floor(available)));}
export function learnerQuestionTypes(coverage:readonly {knowledge:number;scenario:number}[]){const knowledge=coverage.reduce((n,t)=>n+t.knowledge,0),scenario=coverage.reduce((n,t)=>n+t.scenario,0);return knowledge+scenario===0?[]:[{id:'all',disabled:false},{id:'knowledge',disabled:knowledge===0},{id:'scenario',disabled:scenario===0}] as const;}