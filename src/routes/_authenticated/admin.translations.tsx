import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/translations')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('translations'));await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Traductions — Administration','Gestion ExaCiv : traductions, données réelles et accès autorisé.'),component:()=> <AdminRecords section="translations"/>});
