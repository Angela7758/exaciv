import {useState} from 'react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {Search,Clock,Compass,Check,BookOpen,ArrowRight,Play} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {filterLessonRows,demoThemes} from '@/lib/account-settings';
import {TOPICS} from '@/config/learning';
import {ReferenceThemes} from './ReferenceThemes';
import civi from '@/assets/civi-approved-star.png.asset.json';
import skyline from '@/assets/reference-catalogue-skyline.png.asset.json';
import valuesArt from '@/assets/reference-valeurs.png.asset.json';
import institutionsArt from '@/assets/reference-institutions.png.asset.json';
export function CourseCatalogue({demo=false}:{demo?:boolean}){
 const {data:c}=useSuspenseQuery(catalogueOptions);const {data:d}=useSuspenseQuery(learningOptions);const [search,setSearch]=useState('');const [theme,setTheme]=useState('all');const [status,setStatus]=useState('all');
 const next=c.lessons.find(l=>!d.completions.some(x=>x.lesson_id===l.id));
 const demoLessons=[{id:'laicite',title:'La laïcité et la liberté de conscience',topic:TOPICS[1].title,minutes:10,status:'current',description:'Découvrez les principes de la laïcité, son rôle dans la société et la liberté de conscience.'},{id:c.lessons.find(l=>/parlement|institution/i.test(l.title))?.id??c.lessons[0]?.id??'laicite',title:'Le rôle du Parlement',topic:TOPICS[0].title,minutes:8,status:'new',description:'Comprenez le fonctionnement, les missions et le rôle du Parlement dans la Ve République.'}];
 const rows=demo?demoLessons:c.lessons.map(l=>({...l,status:d.completions.some(x=>x.lesson_id===l.id)?'done':l.id===next?.id?'current':'new',description:l.body[0]??''}));const filtered=filterLessonRows(rows,search,theme,status);
 const counts=demo?demoThemes:TOPICS.map(t=>{const ls=c.lessons.filter(l=>l.topic===t.title);return {total:ls.length,done:ls.filter(l=>d.completions.some(x=>x.lesson_id===l.id)).length};});
 const targets=TOPICS.map(t=>c.lessons.find(l=>l.topic===t.title&&!d.completions.some(x=>x.lesson_id===l.id))?.id??c.lessons.find(l=>l.topic===t.title)?.id);const resume=demo?'laicite':next?.id??c.lessons[0]?.id;
 return <div className="approved-pages catalogue-page"><section className="catalogue-banner"><img className="catalogue-skyline" src={skyline.url} alt="Architecture civique française"/><img className="catalogue-civi" src={civi.url} alt="CIVI vous accompagne"/><div><h1>Aujourd’hui, faites un pas de plus</h1><p>Reprenez votre dernière leçon et continuez votre préparation<br className="desktop-break"/> à l’examen civique avec confiance.</p>{resume&&<Button asChild variant="cta"><Link to="/app/lecons/$slug" params={{slug:resume}}><Play/>Reprendre ma leçon<ArrowRight/></Link></Button>}</div></section>
 <div className="catalogue-filters"><label><Search/><input aria-label="Rechercher une leçon" placeholder="Rechercher une leçon" value={search} onChange={e=>setSearch(e.target.value)}/></label><select aria-label="Thème des leçons" value={theme} onChange={e=>setTheme(e.target.value)}><option value="all">Tous les thèmes</option>{[...new Set(rows.map(l=>l.topic))].map(t=><option key={t}>{t}</option>)}</select><div className="catalogue-status">{[['current','En cours',Clock],['new','À découvrir',Compass],['done','Terminées',Check]].map(([id,label,I])=>{const Icon=I as typeof Clock;return <Button key={id as string} variant={status===id?'interactive':'outline'} aria-pressed={status===id} onClick={()=>setStatus(status===id?'all':id as string)}><Icon/>{label as string}</Button>;})}</div></div>
 <div className="approved-section-heading"><h2>Vos thèmes</h2><Button variant="link" onClick={()=>{setTheme('all');setStatus('all');}}>Voir tous les thèmes<ArrowRight/></Button></div><ReferenceThemes counts={counts} targets={targets} buttons demo={demo}/>
 <div className="approved-section-heading"><h2>{search||theme!=='all'||status!=='all'?'Leçons':'Leçons recommandées'}</h2><Button variant="link" onClick={()=>{setSearch('');setTheme('all');setStatus('all');}}>Voir toutes les leçons<ArrowRight/></Button></div><div className="recommended-grid">{filtered.map((l,i)=><Link to="/app/lecons/$slug" params={{slug:l.id}} className="recommended-lesson" key={l.id}><BookOpen/><div><h3>{l.title}</h3><span><Clock/>{l.minutes} min <b>{l.status==='done'?'Terminée':l.status==='current'?'En cours':'À découvrir'}</b></span><p>{l.description}</p></div><img src={(i%2?institutionsArt:valuesArt).url} alt=""/></Link>)}</div>{!filtered.length&&<p className="empty-activity">Aucune leçon ne correspond à ces filtres.</p>}
 </div>;
}