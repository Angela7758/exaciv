import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/media')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('media'));await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Médias — Administration','Gestion ExaCiv : médias, données réelles et accès autorisé.'),component:()=> <AdminRecords section="media"/>});
