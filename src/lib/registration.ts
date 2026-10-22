import {z} from 'zod';
import type {SessionQuestion} from './sessions';
export const localeSchema=z.enum(['fr','zh','en','ar','es','ru']);
export const objectiveSchema=z.object({parcours:z.enum(['naturalisation','resident','sejour']),locale:localeSchema,goal_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()});
export type Objective=z.infer<typeof objectiveSchema>;
type Draft={name:string;email:string;password:string};
// Credentials remain in memory only, never browser storage; refresh returns to step one.
let draft:Draft|undefined;
export function setRegistrationDraft(value:Draft){draft=value;}
export function getRegistrationDraft(){return draft;}
export function clearRegistrationDraft(){draft=undefined;}
export const diagnosticSchema=z.object({key:z.string().uuid().optional(),questions:z.array(z.object({id:z.string(),theme:z.string(),question:z.string(),options:z.array(z.string()),answer:z.number(),explanation:z.string(),source:z.string()})).length(10),answers:z.array(z.number().int().min(0).max(3).nullable()).length(10),seconds:z.number().nonnegative()});
export function diagnosticScore(questions:Pick<SessionQuestion,'theme'|'answer'>[],answers:(number|null)[]){const themes:Record<string,{correct:number;total:number}>={};let correct=0;questions.forEach((q,i)=>{const t=themes[q.theme]??{correct:0,total:0};t.total++;if(answers[i]===q.answer){correct++;t.correct++;}themes[q.theme]=t;});return {correct,total:questions.length,percent:questions.length?Math.round(correct/questions.length*100):0,themes};}
export function recordedProgress(answers:Record<string,number>,total:number){const answered=Object.keys(answers).filter(k=>/^\d+$/.test(k)&&Number(k)<total&&Number(k)>=0).length;return {answered,unanswered:total-answered,percent:total?Math.round(answered/total*100):0};}
export const demoDiagnostic={questions:Array.from({length:10},(_,i)=>({id:`diagnostic-demo-${i}`,theme:i<4?'Institutions françaises':i<7?'Valeurs de la République':'Droits et devoirs',question:'Démonstration',options:['A','B','C','D'],answer:0,explanation:'',source:''})),answers:[0,0,0,0,0,0,1,0,1,1],seconds:300};
export function registrationConsentAccepted(value:unknown){return value==='on';}

export const pendingDiagnosticSchema=z.object({key:z.string().uuid(),ids:z.array(z.string()).length(10),answers:z.array(z.number().int().min(0).max(3)).length(10),consent:z.literal(true)});
export function consentedDiagnostic(raw:string|null){if(!raw)return null;try{const result=pendingDiagnosticSchema.safeParse(JSON.parse(raw));return result.success?result.data:null;}catch{return null;}}
