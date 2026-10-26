import {useMemo,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {Plus,Trash2,ArrowUp,ArrowDown,Eye,Code,ImageOff} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {EXAM_THEMES} from '@/lib/admin/schema';
import {payloadToLessonForm,lessonFormToPayload,validateLessonForm,type LessonFormState,type LessonPayload} from '@/lib/admin/lesson-form';
import {adminMediaSignedUrl} from '@/lib/admin/admin.functions';
import {verifiedMediaQuery} from '@/lib/admin/queries';
import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';

function ListEditor({label,items,onChange,min=0,textarea=false}:{label:string;items:string[];onChange:(items:string[])=>void;min?:number;textarea?:boolean}){
 const set=(i:number,v:string)=>onChange(items.map((x,n)=>n===i?v:x));
 const move=(i:number,dir:-1|1)=>{const next=[...items];const item=next.splice(i,1)[0];if(item===undefined)return;next.splice(i+dir,0,item);onChange(next);};
 return <fieldset className="admin-list-editor"><legend>{label}</legend>{items.map((v,i)=><div className="admin-list-row" key={i}>
  {textarea?<textarea value={v} onChange={e=>set(i,e.target.value)} aria-label={`${label} ${i+1}`}/>:<input value={v} onChange={e=>set(i,e.target.value)} aria-label={`${label} ${i+1}`}/>}
  <Button type="button" variant="ghost" size="icon" aria-label={`Monter ${label} ${i+1}`} disabled={i===0} onClick={()=>move(i,-1)}><ArrowUp/></Button>
  <Button type="button" variant="ghost" size="icon" aria-label={`Descendre ${label} ${i+1}`} disabled={i===items.length-1} onClick={()=>move(i,1)}><ArrowDown/></Button>
  <Button type="button" variant="ghost" size="icon" aria-label={`Supprimer ${label} ${i+1}`} disabled={items.length<=min} onClick={()=>onChange(items.filter((_,n)=>n!==i))}><Trash2/></Button>
 </div>)}<Button type="button" variant="outline" size="sm" onClick={()=>onChange([...items,''])}><Plus/>Ajouter</Button></fieldset>;
}

function LessonPreview({form,heroUrl}:{form:LessonFormState;heroUrl:string|null}){
 const payload=lessonFormToPayload(form);
 return <div className="admin-lesson-preview" aria-label="Aperçu apprenant">
  <p className="admin-preview-caption">Aperçu apprenant (lecture seule, aucun progrès enregistré)</p>
  <h3 lang="fr">{payload.title||'Titre du cours'}</h3>
  <p className="lesson-meta">{form.minutes} min · {form.topic||'Thème officiel'}</p>
  {payload.layout&&payload.layout.objectives.length>0&&<section className="lesson-objectives"><h4>Objectifs de la leçon</h4><ul>{payload.layout.objectives.map(o=><li key={o}>{o}</li>)}</ul></section>}
  {heroUrl?<img className="lesson-hero" src={heroUrl} alt=""/>:form.hero_media_id?null:<p className="admin-note"><ImageOff size={14}/> Aucune image téléversée choisie.</p>}
  <div className="lesson-continuous-body" lang="fr">{(payload.body??[]).map((t,i)=><p key={i} className="lesson-source-text">{t}</p>)}</div>
  {payload.layout&&payload.layout.pillars.length>0&&<div className="lesson-pillars">{payload.layout.pillars.map(p=><section key={p.key} className="lesson-pillar"><div><h4>{p.title}</h4><p>{p.text}</p></div></section>)}</div>}
  {payload.layout&&payload.layout.example.title&&<section className="lesson-example"><div><h4>{payload.layout.example.title}</h4><p>{payload.layout.example.text}</p></div></section>}
  <section className="lesson-summary"><h4>À retenir</h4><ol>{(payload.takeaway??[]).map((t,i)=><li key={i}><span>{i+1}</span>{t}</li>)}</ol></section>
 </div>;
}

export function LessonForm({lessonId,payload,busy,onSave,onCancel}:{lessonId:string;payload:LessonPayload;busy:boolean;onSave:(payload:LessonPayload)=>void;onCancel:()=>void}){
 const [form,setForm]=useState<LessonFormState>(()=>payloadToLessonForm(payload));
 const [dirty,setDirty]=useState(false);
 const [errors,setErrors]=useState<string[]>([]);
 const [jsonOpen,setJsonOpen]=useState(false);
 const [jsonEdit,setJsonEdit]=useState(false);
 const [jsonText,setJsonText]=useState('');
 const [preview,setPreview]=useState(false);
 const {data:media}=useQuery({...verifiedMediaOptionsQuery});
 const signedUrl=useServerFn(adminMediaSignedUrl);
 const [heroUrl,setHeroUrl]=useState<string|null>(null);
 const staticArt=LESSON_ILLUSTRATIONS[lessonId];
 const update=(next:Partial<LessonFormState>)=>{setForm(f=>({...f,...next}));setDirty(true);};
 const jsonValue=useMemo(()=>JSON.stringify(lessonFormToPayload(form),null,2),[form]);
 async function chooseHero(id:string){update({hero_media_id:id});setHeroUrl(null);if(id){try{const r=await signedUrl({data:{id}});setHeroUrl(r.url);}catch{setHeroUrl(null);}}}
 function save(){const found=validateLessonForm(form);setErrors(found);if(found.length)return;onSave(lessonFormToPayload(form));setDirty(false);}
 function cancel(){if(dirty&&!window.confirm('Des modifications ne sont pas enregistrées. Quitter sans enregistrer ?'))return;onCancel();}
 function applyJson(){try{const parsed=JSON.parse(jsonText) as LessonPayload;setForm(payloadToLessonForm(parsed));setDirty(true);setJsonEdit(false);setErrors([]);}catch{setErrors(['JSON invalide.']);}}
 return <div className="admin-form lesson-form">
  <label>Titre<input value={form.title} onChange={e=>update({title:e.target.value})}/></label>
  <div className="admin-form-grid">
   <label>Thème officiel<select value={EXAM_THEMES.includes(form.topic)?form.topic:''} onChange={e=>update({topic:e.target.value})}><option value="">Choisir un thème officiel</option>{EXAM_THEMES.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
   <label>Durée (minutes)<input type="number" min={1} max={120} value={form.minutes} onChange={e=>update({minutes:Number(e.target.value)})}/></label>
  </div>
  <label>Objectif<input value={form.objective} onChange={e=>update({objective:e.target.value})}/></label>
  <label>Introduction<textarea value={form.introduction} onChange={e=>update({introduction:e.target.value})}/></label>
  <ListEditor label="Section de cours" items={form.body} min={1} textarea onChange={body=>update({body})}/>
  <ListEditor label="Point « À retenir »" items={form.takeaway} min={1} onChange={takeaway=>update({takeaway})}/>
  <label>Adresse de la source officielle (https)<input type="url" value={form.source_url} onChange={e=>update({source_url:e.target.value})}/></label>
  <fieldset className="admin-list-editor"><legend>Image principale</legend>
   {staticArt&&!form.hero_media_id&&<p className="admin-note">Illustration statique actuelle conservée{form.hero_override?'':' (l’image téléversée ne la remplace que si vous la choisissez)'}.</p>}
   <select aria-label="Image principale" value={form.hero_media_id} onChange={e=>void chooseHero(e.target.value)}>
    <option value="">Aucune image téléversée</option>
    {(media??[]).map(m=><option key={m.id} value={m.id}>{m.title} · {m.language}</option>)}
   </select>
   {form.hero_media_id&&<label className="admin-check"><input type="checkbox" checked={form.hero_override} onChange={e=>update({hero_override:e.target.checked})}/>Remplacer l’illustration statique existante</label>}
  </fieldset>
  <details className="admin-advanced" open={jsonOpen} onToggle={e=>setJsonOpen((e.target as HTMLDetailsElement).open)}>
   <summary><Code size={14}/> Avancé : JSON</summary>
   {jsonEdit?<><textarea className="admin-json" value={jsonText} onChange={e=>setJsonText(e.target.value)}/><div className="admin-actions"><Button type="button" variant="outline" size="sm" onClick={applyJson}>Appliquer le JSON</Button><Button type="button" variant="ghost" size="sm" onClick={()=>setJsonEdit(false)}>Annuler</Button></div></>
   :<><pre>{jsonValue}</pre><Button type="button" variant="ghost" size="sm" onClick={()=>{setJsonText(jsonValue);setJsonEdit(true);}}>Modifier le JSON</Button></>}
  </details>
  {errors.length>0&&<ul role="alert" className="admin-error">{errors.map(e=><li key={e}>{e}</li>)}</ul>}
  <div className="admin-actions">
   <Button type="button" variant="outline" onClick={()=>setPreview(!preview)}><Eye/>{preview?'Masquer l’aperçu':'Aperçu apprenant'}</Button>
   <Button type="button" variant="outline" onClick={cancel}>Annuler</Button>
   <Button type="button" variant="cta" disabled={busy} onClick={save}>Enregistrer sans publication</Button>
  </div>
  {preview&&<LessonPreview form={form} heroUrl={heroUrl}/>}
 </div>;
}

import {queryOptions} from '@tanstack/react-query';
const verifiedMediaOptionsQuery=queryOptions({queryKey:['admin','verified-media'],queryFn:()=>verifiedMediaOptions()});
