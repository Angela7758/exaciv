import {createFileRoute} from '@tanstack/react-router';
import {AdminImport} from '@/components/admin/AdminImport';
import {questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/import')({loader:async({context})=>{await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Importer des questions — Administration','Gestion ExaCiv : importer des questions, données réelles et accès autorisé.'),component:()=> <AdminImport/>});
