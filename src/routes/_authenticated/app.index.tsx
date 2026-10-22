import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/learning/Dashboard';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/')({head:()=>seo('Votre tableau de bord','Retrouvez vos leçons, votre objectif et votre progression.'),component:Dashboard});
