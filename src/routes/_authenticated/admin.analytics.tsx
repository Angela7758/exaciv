import {createFileRoute} from '@tanstack/react-router';
import {AdminOverview} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/analytics')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('overview'));},head:()=>seo('Statistiques — Administration','Gestion ExaCiv : statistiques, données réelles et accès autorisé.'),component:()=> <AdminOverview analytics/>});
