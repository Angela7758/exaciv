import { Link } from "@tanstack/react-router";
import { Globe, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const NAV = [
  { to: "/examen", label: "L’examen" },
  { to: "/parcours", label: "Parcours" },
  { to: "/methode", label: "Méthode" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/ressources", label: "Ressources" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="container-page flex h-16 items-center justify-between rounded-2xl border bg-card/95 shadow-soft backdrop-blur">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground" title="Français (autres langues bientôt)">
            <Globe className="size-4" /> FR
          </span>
          <Link to="/connexion" className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary">
            <User className="size-4" /> Se connecter
          </Link>
          <Button asChild variant="cta">
            <Link to="/test-gratuit">Faire un test gratuit</Link>
          </Button>
        </div>
        <button className="lg:hidden" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="container-page mt-2 rounded-2xl border bg-card p-4 shadow-card lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent">
                {n.label}
              </Link>
            ))}
            <Link to="/connexion" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent">
              Se connecter
            </Link>
            <Button asChild variant="cta" size="lg" className="mt-2">
              <Link to="/test-gratuit" onClick={() => setOpen(false)}>Faire un test gratuit</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
