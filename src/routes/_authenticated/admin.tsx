import {createFileRoute,Outlet} from '@tanstack/react-router';
import {seo} from '@/lib/seo';
import {accessOptions} from '@/lib/admin/queries';
import {AdminShell,AdminError} from '@/components/admin/AdminShell';
export const Route=createFileRoute('/_authenticated/admin')({head:()=>({...seo('Administration','Gestion du catalogue et des tests ExaCiv.'),meta:[...seo('Administration','Gestion du catalogue et des tests ExaCiv.').meta,{name:'robots',content:'noindex, nofollow'}]}),loader:({context})=>context.queryClient.ensureQueryData(accessOptions),component:AdminShell,errorComponent:AdminError,pendingComponent:()=> <p>Chargement de l’administration…</p>});
