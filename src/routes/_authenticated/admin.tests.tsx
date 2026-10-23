import {createFileRoute} from '@tanstack/react-router';
import {AdminTests} from '@/components/admin/AdminTests';
import {adminOptions,questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/tests')({loader:async({context})=>{await context.queryClient.ensureQueryData(adminOptions('tests'));await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Tests — Administration','Gestion ExaCiv : tests, données réelles et accès autorisé.'),component:()=> <AdminTests/>});
