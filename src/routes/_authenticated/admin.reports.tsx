import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/reports')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('reports'));await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Signalements — Administration','Gestion ExaCiv : signalements, données réelles et accès autorisé.'),component:()=> <AdminRecords section="reports"/>});
