import {createFileRoute} from '@tanstack/react-router';
import {AdminRecords} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/users')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('users'));},head:()=>seo('Comptes — Administration','Gestion ExaCiv : comptes, données réelles et accès autorisé.'),component:()=> <AdminRecords section="users"/>});
