import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/settings')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('audit'));},head:()=>seo('Journal et rôles — Administration','Gestion ExaCiv : journal et rôles, données réelles et accès autorisé.'),component:()=> <AdminRecords section="audit"/>});
