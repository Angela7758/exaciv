import { createFileRoute } from "@tanstack/react-router";
import { AccountSoon } from "@/components/site/AccountSoon";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => seo("Mot de passe oublié", "Réinitialisez le mot de passe de votre compte ExaCiv."),
  component: () => <AccountSoon title="Mot de passe oublié" />,
});
