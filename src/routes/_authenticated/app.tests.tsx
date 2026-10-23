import {createFileRoute} from '@tanstack/react-router';
import {ConfiguredTests} from '@/components/admin/ConfiguredTests';
import {testsOptions} from '@/lib/admin/queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/tests')({loader:({context})=>context.queryClient.ensureQueryData(testsOptions),head:()=>seo('Tests disponibles','Tests ExaCiv publiés pour votre parcours, avec résultats enregistrés.'),component:ConfiguredTests});
