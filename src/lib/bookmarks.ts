import {z} from 'zod';
export const bookmarkInput=z.object({kind:z.enum(['question','lesson']),itemId:z.string().min(1).max(200),active:z.boolean()});
export type LearningBookmark={kind:'question'|'lesson';item_id:string;created_at:string};
export function markedMistakes<T extends {key:string}>(rows:T[],bookmarks:LearningBookmark[]){const ids=new Set(bookmarks.filter(b=>b.kind==='question').map(b=>b.item_id));return rows.filter(r=>ids.has(r.key));}