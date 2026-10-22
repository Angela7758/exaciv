import { createFileRoute } from "@tanstack/react-router";
import { AccountSoon } from "@/components/site/AccountSoon";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/connexion")({
  head: () => seo("Se connecter", "Connectez-vous à votre compte ExaCiv."),
  component: () => <AccountSoon title="Se connecter" />,
});
