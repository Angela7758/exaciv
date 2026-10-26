import {lessonLayoutSchema} from '@/lib/admin/schema';
export function editorialLessonLayout(value:unknown){const parsed=lessonLayoutSchema.safeParse(value);return parsed.success?parsed.data:null;}
export function lastLessonSection(body:readonly string[]){return body.length?body.length-1:null;}
export async function completeThenPractice<T>(complete:()=>Promise<unknown>,start:()=>Promise<T>){await complete();return start();}