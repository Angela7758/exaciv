import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const COLS = [
  { title: "Produit", links: [["/examen", "L’examen"], ["/parcours", "Parcours"], ["/methode", "Méthode"], ["/tarifs", "Tarifs"]] },
  { title: "Ressources", links: [["/faq", "FAQ"], ["/examen", "Règles officielles"], ["/ressources", "Conseils"], ["/ressources", "Blog"]] },
  { title: "Aide", links: [["/contact", "Nous contacter"], ["/faq", "Centre d’aide"]] },
  { title: "Légal", links: [["/mentions-legales", "Mentions légales"], ["/confidentialite", "Confidentialité"], ["/cgv", "Conditions d’utilisation"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-card">
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-2 max-w-48 text-sm text-muted-foreground">Préparez l’examen civique avec confiance.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-2 space-y-1">
              {c.links.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-muted-foreground hover:text-primary">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page border-t py-4 text-xs text-muted-foreground">
        Plateforme indépendante de préparation, non affiliée à l’administration.
      </div>
    </footer>
  );
}
