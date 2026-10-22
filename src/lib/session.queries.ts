import {queryOptions} from '@tanstack/react-query';
import {getSession,listSessions} from './session.functions';
export const sessionOptions=(id:string)=>queryOptions({queryKey:['session',id],queryFn:()=>getSession({data:{id}})});
export const sessionsOptions=queryOptions({queryKey:['sessions'],queryFn:()=>listSessions()});
