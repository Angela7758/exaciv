import {createFileRoute,Outlet} from '@tanstack/react-router';
import {accessOptions} from '@/lib/admin/queries';
import {AdminShell,AdminError} from '@/components/admin/AdminShell';
export const Route=createFileRoute('/_authenticated/admin')({loader:({context})=>context.queryClient.ensureQueryData(accessOptions),component:AdminShell,errorComponent:AdminError,pendingComponent:()=> <p>Chargement de l’administration…</p>});
