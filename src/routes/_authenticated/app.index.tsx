import {createFileRoute} from '@tanstack/react-router';
import {Dashboard} from '@/components/learning/Dashboard';
import {sessionsOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/')({loader:({context})=>context.queryClient.ensureQueryData(sessionsOptions),head:()=>seo('Votre tableau de bord','Retrouvez vos leçons, votre objectif et votre progression.'),component:Dashboard});
