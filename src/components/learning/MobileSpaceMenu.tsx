import {useEffect,useState} from 'react';
import {Link} from '@tanstack/react-router';
import {useQuery} from '@tanstack/react-query';
import {BookOpen,Home,Target,Route,FileX,ChartNoAxesColumn,Crown,Settings,LifeBuoy,Shield} from 'lucide-react';
import {MobileDrawer} from '@/components/site/MobileDrawer';
import {useUiT} from '@/lib/i18n/internal';
import {accessOptions} from '@/lib/admin/queries';

const destinations=[
 {to:'/app',label:'Accueil',icon:Home},
 {to:'/app/parcours',label:'Mon parcours',icon:Route},
 {to:'/app/lecons',label:'Leçons',icon:BookOpen},
 {to:'/app/entrainement',label:'S’entraîner',icon:Target},
 {to:'/app/examen-blanc',label:'Examen blanc',icon:Target},
 {to:'/app/mes-erreurs',label:'Mes erreurs',icon:FileX},
 {to:'/app/progression',label:'Progression',icon:ChartNoAxesColumn},
 {to:'/app/abonnement',label:'Abonnement',icon:Crown},
 {to:'/app/tests',label:'Tests disponibles',icon:Target},
 {to:'/app/mon-compte',label:'Mon compte',icon:Settings},
] as const;
export function MobileSpaceMenu({pathname}:{pathname:string}){
 const [open,setOpen]=useState(false);const ui=useUiT();const {data:roles}=useQuery(accessOptions);
 useEffect(()=>setOpen(false),[pathname]);
 return <div className="learning-mobile-menu-entry"><MobileDrawer id="learning-mobile-menu" open={open} onOpenChange={setOpen} label={ui('Mon espace')}><nav className="mobile-drawer-nav" aria-label={ui('Mon espace')}>{destinations.map(n=><Link to={n.to} key={n.to} activeOptions={{exact:n.to==='/app'}} activeProps={{className:'nav-selected','aria-current':'page'}} onClick={()=>setOpen(false)}><n.icon/>{ui(n.label)}</Link>)}{Boolean(roles?.length)&&<Link to="/admin" className="admin-secondary-link" onClick={()=>setOpen(false)}><Shield/>{ui("Administration")}</Link>}<Link to="/faq" search={{q:''}} onClick={()=>setOpen(false)}><LifeBuoy/>{ui("Aide")}</Link><Link to="/" onClick={()=>setOpen(false)}><Home/>ExaCiv</Link></nav></MobileDrawer></div>;
}