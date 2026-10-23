import {createFileRoute} from '@tanstack/react-router';
import {AdminBilling} from '@/components/admin/AdminPages';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/billing')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('overview'));},head:()=>seo('Paiements — Administration','Gestion ExaCiv : paiements, données réelles et accès autorisé.'),component:()=> <AdminBilling/>});
