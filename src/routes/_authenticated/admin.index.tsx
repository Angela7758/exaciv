import {createFileRoute} from '@tanstack/react-router';
import {AdminOverview} from '@/components/admin/AdminOverview';
import {overviewOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/admin/')({loader:async({context})=>{await context.queryClient.ensureQueryData(overviewOptions());},head:()=>seo('Vue d’ensemble — Administration','Priorités ExaCiv, couverture du catalogue et simulations : indicateurs réels réservés à l’administration.'),component:()=> <AdminOverview/>});
