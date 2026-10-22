import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const COLS = [
  { title: "Produit", links: [["/examen", "L’examen"], ["/parcours", "Parcours"], ["/methode", "Méthode"], ["/tarifs", "Tarifs"]] },
  { title: "Ressources", links: [["/faq", "FAQ"], ["/ressources", "Conseils"], ["/test-gratuit", "Test gratuit"]] },
  { title: "Aide", links: [["/contact", "Nous contacter"], ["/faq", "Centre d’aide"]] },
  { title: "Légal", links: [["/mentions-legales", "Mentions légales"], ["/confidentialite", "Confidentialité"], ["/cookies", "Cookies"], ["/cgv", "Conditions d’utilisation"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-56 text-sm text-muted-foreground">Préparez l’examen civique avec confiance.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-3 space-y-2">
              {c.links.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-primary">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col gap-2 border-t py-5 text-xs text-muted-foreground md:flex-row md:justify-between">
        <p>Plateforme indépendante de préparation, non affiliée à l’administration.</p>
        <p>© {new Date().getFullYear()} ExaCiv.com</p>
      </div>
    </footer>
  );
}
