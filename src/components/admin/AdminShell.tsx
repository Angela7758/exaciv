import {Link,Outlet,type ErrorComponentProps} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {LayoutDashboard,Library,Upload,ClipboardList,BookOpen,Languages,Image,Users,Flag,ChartNoAxesColumn,Shield,ArrowLeft,Receipt,Bell,ChevronDown,ExternalLink,HelpCircle,User} from 'lucide-react';
import {BrandLogo} from '@/components/site/BrandLogo';
import {accessOptions} from '@/lib/admin/queries';
import {can} from '@/lib/admin/schema';
import {useEffect,useState} from 'react';
import {useRouterState} from '@tanstack/react-router';
import {MobileDrawer} from '@/components/site/MobileDrawer';
import {Button} from '@/components/ui/button';
import {Tooltip,TooltipProvider,TooltipTrigger,TooltipContent} from '@/components/ui/tooltip';
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem} from '@/components/ui/dropdown-menu';
import {useUiT} from '@/lib/i18n/internal';
import {useI18n} from '@/lib/i18n';
const links=[{to:'/admin',label:'Vue d’ensemble',icon:LayoutDashboard,p:'overview'},{to:'/admin/questions',label:'Questions',icon:Library,p:'content'},{to:'/admin/import',label:'Importer',icon:Upload,p:'edit'},{to:'/admin/tests',label:'Tests',icon:ClipboardList,p:'content'},{to:'/admin/lessons',label:'Cours',icon:BookOpen,p:'content'},{to:'/admin/translations',label:'Traductions',icon:Languages,p:'content'},{to:'/admin/media',label:'Médias',icon:Image,p:'content'},{to:'/admin/users',label:'Comptes',icon:Users,p:'users'},{to:'/admin/reports',label:'Signalements',icon:Flag,p:'reports'},{to:'/admin/analytics',label:'Statistiques',icon:ChartNoAxesColumn,p:'overview'},{to:'/admin/billing',label:'Paiements',icon:Receipt,p:'audit'},{to:'/admin/settings',label:'Rôles et journal',icon:Shield,p:'roles'}] as const;
export function AdminShell(){
 const {data:roles}=useSuspenseQuery(accessOptions);
 const [open,setOpen]=useState(false);
 const path=useRouterState({select:s=>s.location.pathname});
 useEffect(()=>setOpen(false),[path]);
 if(!roles.length)return <div className="admin-denied"><h1>Accès réservé</h1><p>Ce compte n’a pas de rôle d’administration.</p><Link to="/app">Retour à mon espace</Link></div>;
 return <AdminFrame roles={roles} open={open} onOpenChange={setOpen}><Outlet/></AdminFrame>;
}
const bottomLinks=[{to:'/app/abonnement',label:'Abonnement',icon:Receipt},{to:'/faq',label:'Aide',icon:HelpCircle},{to:'/app/mon-compte',label:'Mon compte',icon:User}] as const;
export function AdminFrame({roles,children,open=false,onOpenChange=()=>{}}:{roles:string[];children:React.ReactNode;open?:boolean;onOpenChange?:(open:boolean)=>void}){
 const u=useUiT();const {locale,setLocale}=useI18n();
 const visible=links.filter(l=>l.p==='overview'||can(roles,l.p));
 const label=roles.map(r=>u({admin:'Administrateur',editor:'Éditeur',reviewer:'Vérificateur',operations:'Opérations'}[r]??r)).join(' · ');
 const navigation=<>{visible.map(l=><Link to={l.to} key={l.to} activeOptions={{exact:true}} activeProps={{className:'active','aria-current':'page'}} onClick={()=>onOpenChange(false)}><l.icon size={19}/><span>{u(l.label)}</span></Link>)}<div className="admin-nav-divider"/>{bottomLinks.map(l=><Link to={l.to} key={l.to} onClick={()=>onOpenChange(false)}><l.icon size={19}/><span>{u(l.label)}</span></Link>)}</>;
 return <TooltipProvider><div className="admin-layout fidelity-admin-shell"><aside className="admin-sidebar"><Link to="/admin" className="admin-brand"><BrandLogo/></Link><span className="admin-caption">{u('ADMINISTRATION')}</span><nav aria-label={u('Administration')}>{navigation}</nav></aside><div className="admin-main"><header className="admin-topbar"><b>ExaCiv · {u('Administration')}</b><MobileDrawer id="admin-mobile-menu" open={open} onOpenChange={onOpenChange} label={u('Administration')}><nav className="mobile-drawer-nav" aria-label={u('Administration')}>{navigation}</nav></MobileDrawer><div className="admin-topbar-tools"><Tooltip><TooltipTrigger asChild><span tabIndex={0} aria-disabled="true"><Button variant="ghost" size="icon" disabled aria-label={u('Notifications')}><Bell/></Button></span></TooltipTrigger><TooltipContent>{u('Bientôt')}</TooltipContent></Tooltip><select aria-label={u('Langue de l’interface')} value={locale} onChange={e=>setLocale(e.target.value as typeof locale)}>{['fr','zh','en','ar','es','ru'].map(l=><option key={l} value={l}>{l.toUpperCase()}</option>)}</select><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="admin-account"><span className="admin-avatar">{label.slice(0,1).toUpperCase()||'—'}</span><span>{label}</span><ChevronDown/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem asChild><Link to="/app/mon-compte">{u('Mon compte')}</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/app">{u('Espace apprenant')}</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu><Link to="/app" className="admin-learner-link">{u('Espace apprenant')}<ExternalLink/></Link></div></header><main className="admin-content">{children}</main></div></div></TooltipProvider>;
}
export function AdminError({error}:ErrorComponentProps){return <div className="admin-denied"><h1>Accès indisponible</h1><p role="alert">{error instanceof Error?error.message:'Chargement impossible.'}</p><Link to="/app">Retour à mon espace</Link></div>;}
