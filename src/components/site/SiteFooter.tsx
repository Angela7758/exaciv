import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useT, type MessageKey } from "@/lib/i18n";

const COLS: { title: MessageKey; links: [string, MessageKey][] }[] = [
  { title: "footer.produit", links: [["/examen", "nav.exam"], ["/parcours", "nav.parcours"], ["/methode", "nav.methode"], ["/tarifs", "nav.tarifs"]] },
  { title: "footer.ressources", links: [["/faq", "nav.faq"], ["/examen", "footer.regles"], ["/ressources", "footer.conseils"], ["/ressources", "footer.blog"]] },
  { title: "footer.aide", links: [["/contact", "footer.contact"], ["/faq", "footer.centre"]] },
  { title: "footer.legal", links: [["/mentions-legales", "footer.mentions"], ["/confidentialite", "footer.confidentialite"], ["/cgv", "footer.cgu"]] },
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-card">
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-2 max-w-48 text-sm text-muted-foreground">{t('footer.tagline')}</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{t(c.title)}</h3>
            <ul className="mt-2 space-y-1">
              {c.links.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-muted-foreground hover:text-primary">{t(label)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page border-t py-4 text-xs text-muted-foreground">
        {t('footer.independence')}
      </div>
    </footer>
  );
}
