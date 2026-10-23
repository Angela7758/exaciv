import {createFileRoute} from '@tanstack/react-router';
import {AdminOverview} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('overview'));},head:()=>seo('Vue d’ensemble — Administration','Gestion ExaCiv : vue d’ensemble, données réelles et accès autorisé.'),component:()=> <AdminOverview/>});
