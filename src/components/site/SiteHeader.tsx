import { Link } from "@tanstack/react-router";
import { Menu, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { LanguageMenu } from "./LanguageMenu";
import {MobileDrawer} from './MobileDrawer';
import { useT, type MessageKey } from "@/lib/i18n";

const NAV: { to: string; key: MessageKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/examen", key: "nav.exam" },
  { to: "/parcours", key: "nav.parcours" },
  { to: "/methode", key: "nav.methode" },
  { to: "/tarifs", key: "nav.tarifs" },
  { to: "/faq", key: "nav.faq" },
];

export function SiteHeader({auth=false}:{auth?:boolean}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const locationKey = useRouterState({ select: (state) => state.location.href });
  const reference=useRouterState({select:s=>['/examen','/methode','/faq','/parcours','/tarifs'].includes(s.location.pathname)});
  const home = useRouterState({select:state=>state.location.pathname==='/' });
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user))); }, [locationKey]);
  useEffect(()=>setOpen(false),[locationKey]);
  return (
    <header className={`sticky top-0 z-40 px-3 pt-3 ${home||reference?'approved-home-header':''} ${auth?'approved-auth-header':''}`}>
      <div className="container-page flex h-16 items-center justify-between rounded-2xl border bg-card/95 shadow-soft backdrop-blur">
        <Logo />
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{exact:true}} className="text-sm font-medium text-foreground hover:text-primary" activeProps={{ className: "text-primary nav-selected", "aria-current": "page" }}>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <LanguageMenu />
          {!auth&&<Link to={signedIn ? '/app' : '/connexion'} className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary">
            <User className="size-4 fill-current" /> {signedIn ? t('nav.space') : t('nav.login')}
          </Link>}
          <Button asChild variant={auth?'outline':'cta'} size="lg" className={auth?'auth-free-test':'text-base'}>
            <Link to="/test-gratuit">{t('nav.test')}</Link>
          </Button>
        </div>
        <div className="public-mobile-tools flex shrink-0 items-center gap-1 lg:hidden"><LanguageMenu mobile /><MobileDrawer id="public-mobile-menu" open={open} onOpenChange={setOpen} label={t('nav.menuOpen')}>
          <nav className="mobile-drawer-nav" aria-label="Navigation mobile">
            {NAV.map(n=><Link key={n.to} to={n.to} activeOptions={{exact:true}} activeProps={{className:'nav-selected', 'aria-current':'page'}} onClick={()=>setOpen(false)}>{t(n.key)}</Link>)}
            <Link to={signedIn?'/app':'/connexion'} onClick={()=>setOpen(false)}><User/>{signedIn?t('nav.space'):t('nav.login')}</Link>
          </nav>
          <Button asChild variant="cta" size="lg" className="mobile-drawer-cta"><Link to="/test-gratuit" onClick={()=>setOpen(false)}>{t('nav.test')}</Link></Button>
        </MobileDrawer></div>
      </div>
    </header>
  );
}
