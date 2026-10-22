import {z} from 'zod';
export const revisionInput=z.object({mistakes:z.array(z.object({question:z.string().trim().min(1).max(1000),response:z.string().trim().min(1).max(1000)})).min(1).max(20),minutes:z.number().int().min(5).max(60)});
export const revisionPlanSchema=z.object({summary:z.string(),priorities:z.array(z.string()),days:z.array(z.object({title:z.string(),tasks:z.array(z.string()),selfCheck:z.string()}))});
export type RevisionPlan=z.infer<typeof revisionPlanSchema>;
export type RevisionInput=z.infer<typeof revisionInput>;
export function safeGatewayError(status:number,body:string){try{const data=JSON.parse(body);const message=data.message??data.error?.message; if(typeof message==='string'&&message.trim())return message.slice(0,1500);}catch{/* Non-JSON provider error. */}return status===429?'Trop de demandes. Réessayez plus tard.':'La génération est indisponible. Votre saisie est conservée.';}