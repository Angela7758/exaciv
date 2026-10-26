import {EXAM_THEMES} from './schema';
import {questionTypeSchema} from '@/lib/practice-rules';

export const BULK_MAX=200;
export interface BulkUpdate {ids:string[];theme?:string|undefined;question_type?:string|undefined;classification_source?:string|undefined;}

// Mirrors the server rules in admin_command(questions_bulk_update): the server stays
// authoritative; this client copy gives immediate French feedback and is unit-tested.
export function validateBulkUpdate(update:BulkUpdate):string|null{
 if(!Array.isArray(update.ids)||update.ids.length===0)return 'Sélectionnez au moins une question.';
 if(update.ids.length>BULK_MAX)return `Une action groupée est limitée à ${BULK_MAX} questions.`;
 if(new Set(update.ids).size!==update.ids.length)return 'La sélection contient un identifiant en double.';
 const theme=update.theme?.trim()??'';const type=update.question_type?.trim()??'';const source=update.classification_source?.trim()??'';
 if(!theme&&!type)return 'Choisissez un thème officiel ou un type de question à appliquer.';
 if(theme&&!EXAM_THEMES.includes(theme))return 'Le thème doit être l’un des cinq thèmes officiels.';
 if(type&&!questionTypeSchema.safeParse(type).success)return 'Type de question invalide.';
 if(type&&type!=='unclassified'&&!source)return 'Une justification fiable de classification est requise pour ce type.';
 return null;
}

// Drafts only: a bulk change never touches the published catalogue row.
export function bulkUpdateNotice(publishedCount:number):string|null{
 return publishedCount>0?'Cette modification sera visible par les apprenants seulement après republication.':null;
}
