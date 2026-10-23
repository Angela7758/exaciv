import {useUiT} from '@/lib/i18n/internal';
import {Link} from '@tanstack/react-router';
import {Home,Route,Target,User} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {MobileSpaceMenu} from './MobileSpaceMenu';
export function mobileDestination(pathname:string){return pathname==='/app'?'home':pathname.startsWith('/app/entrainement')||pathname.startsWith('/app/examen-blanc')||pathname.startsWith('/app/resultats')?'practice':pathname.startsWith('/app/mon-compte')||pathname.startsWith('/app/profil')?'profile':'pathway';}
export function MobileNavigation({pathname}:{pathname:string}){const ui=useUiT();const active=mobileDestination(pathname);return <><MobileSpaceMenu pathname={pathname}/><nav className="app-mobile-nav" aria-label={ui("Navigation de mon espace")}>{[{to:'/app',label:ui("Accueil"),key:'home',icon:Home},{to:'/app/parcours',label:ui("Parcours"),key:'pathway',icon:Route},{to:'/app/entrainement',label:ui("S’entraîner"),key:'practice',icon:Target},{to:'/app/mon-compte',label:ui("Profil"),key:'profile',icon:User}].map(n=><Button asChild variant="ghost" key={n.key}><Link to={n.to} activeOptions={{exact:true}} aria-current={active===n.key?'page':undefined}><n.icon/><span>{n.label}</span></Link></Button>)}</nav></>;}
