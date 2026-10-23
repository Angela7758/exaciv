import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/learning/Dashboard';
import {LanguageProgress} from '@/components/learning/LanguageProgress';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/')({head:()=>seo('Votre tableau de bord','Retrouvez vos leçons, votre objectif et votre progression.'),component:()=><><Dashboard/><div className="language-progress-wrap"><LanguageProgress/></div></>});
