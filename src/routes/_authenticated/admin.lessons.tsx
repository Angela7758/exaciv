import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/lessons')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('lessons'));await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Cours — Administration','Gestion ExaCiv : cours, données réelles et accès autorisé.'),component:()=> <AdminRecords section="lessons"/>});
