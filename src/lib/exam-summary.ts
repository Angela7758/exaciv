export function latestCompleteExam<T extends {kind:string;total:number;completed_at:string|null}>(sessions:readonly T[]):T|undefined {
 return sessions.filter(s=>s.kind==='exam'&&s.total===40&&s.completed_at!==null).sort((a,b)=>(b.completed_at??'').localeCompare(a.completed_at??''))[0];
}