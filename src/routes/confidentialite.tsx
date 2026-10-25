import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/confidentialite")({
  head: () => seo("Politique de confidentialité", "Politique de confidentialité du site ExaCiv.com."),
  component: () => (
    <>
      <PageHero eyebrow="Légal" title="Politique de confidentialité" />
      <section className="container-page max-w-3xl space-y-4 pb-16 text-foreground/85">
        <p>Le test gratuit fonctionne sans compte : vos réponses restent dans votre navigateur et ne sont pas enregistrées sur nos serveurs.</p>
        <h2 className="pt-2 text-xl font-semibold text-foreground">Vos droits</h2>
        <p>Une fois connecté, vous pouvez à tout moment télécharger une copie de vos données (droits d’accès et à la portabilité) et supprimer définitivement votre compte (droit à l’effacement) depuis « Mon compte », rubrique « Vos données ». La suppression efface votre profil, votre progression, vos erreurs, vos plans de révision et vos signalements.</p>
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Document en cours de rédaction : les informations juridiques définitives (éditeur, hébergeur, contact) seront publiées avant l’ouverture des comptes.</p>
      </section>
    </>
  ),
});
