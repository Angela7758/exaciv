import {useQuery} from '@tanstack/react-query';
import {Languages} from 'lucide-react';
import {supabase} from '@/integrations/supabase/client';
import {useUiT} from '@/lib/i18n/internal';
import {summarizeByLocale} from '@/lib/activity';
import {LearningCard} from './primitives';

const NAMES: Record<string,string> = {en:'English',es:'Español',ar:'العربية',ru:'Русский',pt:'Português'};

export function LanguageProgress(){
  const ui=useUiT();
  const q=useQuery({queryKey:['learning','by-language'],queryFn:async()=>{
    const [a,c,s]=await Promise.all([
      supabase.from('learning_activity').select('locale,kind,ref'),
      supabase.from('learning_completions').select('lesson_id'),
      supabase.from('learning_sessions').select('id,correct,total,completed_at'),
    ]);
    const err=a.error??c.error??s.error; if(err) throw err;
    return summarizeByLocale(a.data??[],(c.data??[]).map(r=>r.lesson_id),s.data??[]);
  }});
  return <LearningCard className="language-progress">
    <h2><Languages/>{ui("Progression par langue")}</h2>
    {q.isPending?<p role="status">{ui("Chargement…")}</p>:q.isError?<p role="alert" className="text-critical">{ui("Impossible de charger la progression par langue.")}</p>:
    <div className="language-progress-table" role="table">
      <div role="row" className="head"><span role="columnheader">{ui("Langue")}</span><span role="columnheader">{ui("Leçons terminées")}</span><span role="columnheader">{ui("Vidéos vues")}</span><span role="columnheader">{ui("Taux de réussite")}</span></div>
      {q.data.map(r=><div role="row" key={r.locale}><span role="cell" lang={r.locale} dir={r.locale==='ar'?'rtl':'ltr'}><b>{NAMES[r.locale]}</b></span><span role="cell">{r.lessons}</span><span role="cell">{r.videos}</span><span role="cell">{r.total?`${Math.round(r.correct/r.total*100)} % (${r.correct}/${r.total})`:'—'}</span></div>)}
    </div>}
    <p className="language-progress-note">{ui("Comptées à partir d’aujourd’hui, selon la langue de l’interface pendant l’activité. Les activités précédentes n’ont pas de langue enregistrée.")}</p>
  </LearningCard>;
}
