import {createFileRoute} from '@tanstack/react-router';
import {AdminQuestions} from '@/components/admin/AdminQuestions';
import {questionsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/questions')({loader:async({context})=>{await context.queryClient.ensureQueryData(questionsOptions);},head:()=>seo('Questions — Administration','Gestion ExaCiv : questions, données réelles et accès autorisé.'),component:()=> <AdminQuestions/>});
