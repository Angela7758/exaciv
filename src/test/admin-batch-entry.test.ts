import {describe,it,expect} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {validateBulkUpdate,bulkUpdateNotice,BULK_MAX} from '@/lib/admin/bulk';
import {payloadToLessonForm,lessonFormToPayload,validateLessonForm,type LessonPayload} from '@/lib/admin/lesson-form';
import {detectImageMime,sanitizeMediaFilename,validateMediaUpload,MEDIA_MAX_BYTES} from '@/lib/admin/media';
import {IMPORT_FIELDS,parseImport,validateImport,defaultMapping,synonymMapping,detectSimpleMapping,isSimpleColumns,simpleRowToImportRow,simpleRowsToImportRows,csvSimpleTemplate,draftsToCsv,errorReportCsv} from '@/lib/admin/import';
import {emptyQuestion,type Draft} from '@/lib/admin/schema';

const THEME='Système institutionnel et politique';
const PNG=new Uint8Array([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const JPG=new Uint8Array([0xff,0xd8,0xff,0xe0]);
const WEBP=new Uint8Array([0x52,0x49,0x46,0x46,0,0,0,0,0x57,0x45,0x42,0x50]);

describe('Actions groupées sur les questions',()=>{
 it('refuse une sélection vide, en double ou trop grande',()=>{
  expect(validateBulkUpdate({ids:[],theme:THEME})).toMatch(/au moins une/);
  expect(validateBulkUpdate({ids:['a','a'],theme:THEME})).toMatch(/double/);
  expect(validateBulkUpdate({ids:Array.from({length:BULK_MAX+1},(_,i)=>'q'+i),theme:THEME})).toMatch(/200/);
 });
 it('refuse un thème non officiel et une demande vide',()=>{
  expect(validateBulkUpdate({ids:['a'],theme:'Histoire'})).toMatch(/cinq thèmes officiels/);
  expect(validateBulkUpdate({ids:['a']})).toMatch(/Choisissez/);
 });
 it('exige une justification pour un type classé',()=>{
  expect(validateBulkUpdate({ids:['a'],question_type:'knowledge'})).toMatch(/justification/i);
  expect(validateBulkUpdate({ids:['a'],question_type:'knowledge',classification_source:'Relecture éditoriale documentée'})).toBeNull();
  expect(validateBulkUpdate({ids:['a'],question_type:'unclassified'})).toBeNull();
 });
 it('annonce la republication seulement si des questions sont en ligne',()=>{
  expect(bulkUpdateNotice(0)).toBeNull();
  expect(bulkUpdateNotice(2)).toMatch(/republication/);
 });
});

describe('Formulaire de cours',()=>{
 const payload:LessonPayload={title:'La devise de la République',topic:'Principes et valeurs de la République française',minutes:8,objective:'Comprendre la devise',introduction:'Introduction',body:['Une première section suffisamment longue pour être valide.'],takeaway:['Liberté, Égalité, Fraternité'],source_url:'https://www.elysee.fr/',layout:{objectives:['Savoir expliquer la devise'],pillars:[{key:'liberte',title:'Liberté',text:'Texte du pilier'}],example:{title:'Exemple',text:'Texte de l’exemple'}},hero_media_id:'',hero_override:false};
 it('recharge et réenregistre un contenu identique (round-trip)',()=>{
  expect(lessonFormToPayload(payloadToLessonForm(payload))).toEqual(payload);
 });
 it('refuse un titre vide, un thème invalide et une source non https',()=>{
  const form=payloadToLessonForm(payload);
  expect(validateLessonForm({...form,title:''})).toContain('Le titre doit contenir au moins 5 caractères.');
  expect(validateLessonForm({...form,topic:'Histoire'})).toContain('Choisissez l’un des cinq thèmes officiels.');
  expect(validateLessonForm({...form,source_url:'http://exemple.fr'})).toContain('L’adresse de la source doit commencer par https://');
 });
 it('refuse une section trop courte et un pilier incomplet',()=>{
  const form=payloadToLessonForm(payload);
  expect(validateLessonForm({...form,body:['trop court']}).some(e=>e.includes('20 caractères'))).toBe(true);
  expect(validateLessonForm({...form,pillars:[{key:'',title:'Liberté',text:''}]}).some(e=>e.includes('pilier'))).toBe(true);
 });
});

describe('Export et modèle simple',()=>{
 const draft={id:'q-1',payload:{...emptyQuestion,id:'q-1',theme:THEME,exam_theme:THEME,question:'Quelle est la durée du mandat présidentiel ?',options:[{id:'a',text:'4 ans'},{id:'b',text:'5 ans'},{id:'c',text:'7 ans'},{id:'d',text:'10 ans'}],correct_option_id:'b',explanation:'Le mandat du président dure cinq ans.',source:'Constitution',source_url:'https://www.legifrance.gouv.fr/'},status:'draft',revision:1,updated_at:''} as Draft;
 it('exporte exactement les colonnes IMPORT_FIELDS et se réimporte sans erreur',()=>{
  const csv=draftsToCsv([draft]);
  expect(csv.split('\n')[0]?.replace(/\r$/,'')).toBe(IMPORT_FIELDS.join(','));
  const parsed=parseImport(csv,'export.csv');
  const preview=validateImport(parsed.rows,defaultMapping(parsed.columns),[]);
  expect(preview[0]?.status).toBe('new');
  expect(preview[0]?.payload?.correct_option_id).toBe('b');
 });
 it('convertit le modèle simple en options identifiées avec la bonne réponse',()=>{
  const parsed=parseImport(csvSimpleTemplate(),'simple.csv');
  expect(isSimpleColumns(parsed.columns)).toBe(true);
  const converted=simpleRowsToImportRows(parsed.rows,parsed.columns);
  expect(converted).not.toBeNull();
  const preview=validateImport(converted!.rows,defaultMapping([...IMPORT_FIELDS]),[]);
  expect(preview[0]?.status).toBe('new');
  expect(preview[0]?.payload?.options.map(o=>o.id)).toEqual(['a','b','c','d']);
  expect(preview[0]?.payload?.correct_option_id).toBe('a');
 });
 it('détecte les en-têtes synonymes sans tenir compte de la casse ni des accents',()=>{
  const mapping=synonymMapping(['ID','Texte','Thème officiel','Parcours','Difficulté','Lien source']);
  expect(mapping.id).toBe('ID');
  expect(mapping.question).toBe('Texte');
  expect(mapping.theme).toBe('Thème officiel');
  expect(mapping.pathways).toBe('Parcours');
  expect(detectSimpleMapping(['Question','OPTION_A','option_b','option_c','option_d','Bonne réponse','Explication','Thème','Parcours','Difficulté','Source','Lien source'])).not.toBeNull();
 });
 it('produit un rapport d’erreurs ligne par ligne en CSV',()=>{
  const preview=validateImport([{id:'x'}],defaultMapping(['id']),[]);
  const csv=errorReportCsv(preview);
  expect(csv).toContain('ligne,id,statut,raisons');
  expect(csv).toContain('error');
 });
});

describe('Validation des médias téléversés',()=>{
 it('reconnaît PNG, JPG et WebP par le contenu',()=>{
  expect(detectImageMime(PNG)).toBe('image/png');
  expect(detectImageMime(JPG)).toBe('image/jpeg');
  expect(detectImageMime(WEBP)).toBe('image/webp');
  expect(detectImageMime(new Uint8Array([0x3c,0x73,0x76,0x67]))).toBeNull();
 });
 it('refuse SVG, fichier trop gros et contenu non image',()=>{
  expect(validateMediaUpload({name:'a.svg',size:100,head:PNG,alt:'alt',rights:'Créé pour ExaCiv'})).toMatch(/SVG/);
  expect(validateMediaUpload({name:'a.png',size:MEDIA_MAX_BYTES+1,head:PNG,alt:'alt',rights:'Créé pour ExaCiv'})).toMatch(/3 Mo/);
  expect(validateMediaUpload({name:'a.png',size:100,head:new Uint8Array([1,2,3]),alt:'alt',rights:'Créé pour ExaCiv'})).toMatch(/contenu/);
 });
 it('exige le texte alternatif et l’autorisation',()=>{
  expect(validateMediaUpload({name:'a.png',size:100,head:PNG,alt:'',rights:'Créé pour ExaCiv'})).toMatch(/alternatif/);
  expect(validateMediaUpload({name:'a.png',size:100,head:PNG,alt:'alt',rights:''})).toMatch(/autorisation/);
  expect(validateMediaUpload({name:'a.png',size:100,head:PNG,alt:'alt',rights:'Créé pour ExaCiv'})).toBeNull();
 });
 it('assainit les noms de fichiers',()=>{
  expect(sanitizeMediaFilename('../Été 2026/photo (1).PNG')).toBe('photo-1.png');
 });
});

describe('Migration 0035',()=>{
 const dir=join(__dirname,'../../drizzle/migrations');
 const files=readdirSync(dir).filter(f=>f.endsWith('.sql')).sort();
 const sql=readFileSync(join(dir,'0035_admin_media_bucket_and_bulk_actions.sql'),'utf8');
 it('est la migration qui suit 0034',()=>{
  expect(files.filter(f=>f>'0034')).toContain('0035_admin_media_bucket_and_bulk_actions.sql');
 });
 it('restreint le bucket admin-media avec admin_can',()=>{
  expect(sql).toContain("bucket_id='admin-media'");
  expect(sql).toContain("public.admin_can('edit')");
 });
 it('ajoute les actions groupées, l’export plafonné et la suppression de média',()=>{
  expect(sql).toContain("'questions_bulk_update'");
  expect(sql).toContain("'questions_export'");
  expect(sql).toContain('LIMIT 2000');
  expect(sql).toContain("'media_delete'");
  expect(sql).toContain('200 questions');
 });
});
