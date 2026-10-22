import {it,vi} from 'vitest';
import {writeFileSync} from 'node:fs';
import {renderToString} from 'react-dom/server';
import {createRouter,createRootRoute,createMemoryHistory,RouterProvider} from '@tanstack/react-router';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
vi.mock('@/lib/learning.functions',()=>({getLearning:vi.fn(),getCatalogue:vi.fn()}));
vi.mock('@/lib/session.functions',()=>({getSession:vi.fn(),submitAnswer:vi.fn(),startSession:vi.fn(),listSessions:vi.fn(),advanceSession:vi.fn(),finishSession:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{getUser:async()=>({data:{user:null}})}}}));
import {AppShell} from '@/components/learning/AppShell';
import {Dashboard} from '@/components/learning/Dashboard';
import {PracticeSession} from '@/components/learning/PracticeSession';
import {SessionResults} from '@/components/learning/SessionResults';
import {OFFICIAL_TOPICS} from '@/config/official-programme';
it('captures isolated visual fixtures without changing account data',async()=>{
 for(const [name,path] of [['dashboard','/app'],['practice','/app/entrainement/session/example'],['results','/app/examen-blanc/resultats/example']]){
 const qc=new QueryClient();qc.setQueryData(['learning'],{profile:{display_name:'Compte de test',parcours:'naturalisation',avatar_url:'',goal_date:null},completions:[],attempts:[],sessions:[]});qc.setQueryData(['catalogue'],{lessons:OFFICIAL_TOPICS.map((t,i)=>({id:String(i),title:['Laïcité','Le Parlement','Droits','Histoire','Société'][i],topic:t.title})),questions:[],practiceCounts:{}});
 const session={id:'example',kind:'exam',parcours:'naturalisation',lesson_id:null,total:40,correct:34,current_index:39,started_at:'2026-10-22T12:00:00Z',completed_at:'2026-10-22T12:38:00Z',deadline:null,questions:Array.from({length:40},(_,i)=>({id:String(i),theme:['Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe'][Math.floor(i/8)],question:'Question de test',options:['Oui','Non'],answer:0,explanation:'Test',source:''})),answers:Object.fromEntries(Array.from({length:40},(_,i)=>[String(i),i%8<([8,7,7,6,6][Math.floor(i/8)]??0)?0:1]))};qc.setQueryData(['session','example'],session);
 const root=createRootRoute({component:()=> <QueryClientProvider client={qc}><AppShell content={name==='dashboard'?<Dashboard/>:name==='practice'?<PracticeSession id="example" demo/>:<SessionResults id="example"/>}/></QueryClientProvider>});const router=createRouter({routeTree:root,history:createMemoryHistory({initialEntries:[path]})});await router.load();writeFileSync(`/tmp/browser/batch-two/${name}.html`,renderToString(<RouterProvider router={router}/>));
 }
});
