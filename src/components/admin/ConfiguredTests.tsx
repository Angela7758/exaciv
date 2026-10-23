import {useState} from 'react';
import {useSuspenseQuery,useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {useServerFn} from '@tanstack/react-start';
import {ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {testsOptions} from '@/lib/admin/queries';
import {startConfiguredTest} from '@/lib/admin/admin.functions';
export function ConfiguredTests(){const {data:tests}=useSuspenseQuery(testsOptions);const [busy,setBusy]=useState('');const [error,setError]=useState('');const start=useServerFn(startConfiguredTest);const nav=useNavigate();const qc=useQueryClient();return <section><h1>Tests disponibles</h1>{!tests.length&&<p>Aucun test supplémentaire disponible pour votre parcours.</p>}<div className="admin-test-grid">{tests.map(t=><article className="admin-test-card" key={t.id}><h2>{t.title}</h2><p>{t.question_count} questions · {t.duration_minutes?t.duration_minutes+' minutes':'Sans limite de temps'}</p><p>{t.instant_feedback?'Correction après chaque réponse':'Correction à la fin'} · {t.allow_aids?'Aides disponibles':'Sans aide'}</p><Button variant="cta" disabled={Boolean(busy)} onClick={async()=>{setBusy(t.id);setError('');try{const s=await start({data:{id:t.id}});await qc.invalidateQueries({queryKey:['sessions']});if(s.kind==='exam')await nav({to:'/app/examen-blanc/session',search:{session:s.id}});else await nav({to:'/app/entrainement/session/$id',params:{id:s.id}});}catch(e){setError(e instanceof Error?e.message:'Session indisponible.');}finally{setBusy('');}}}>Commencer<ArrowRight/></Button></article>)}</div>{error&&<p role="alert">{error}</p>}</section>;}
