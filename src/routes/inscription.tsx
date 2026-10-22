import { createFileRoute } from "@tanstack/react-router";
import { AccountSoon } from "@/components/site/AccountSoon";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/inscription")({
  head: () => seo("Créer un compte", "Créez votre compte ExaCiv pour sauvegarder vos progrès."),
  component: () => <AccountSoon title="Créer un compte" />,
});
