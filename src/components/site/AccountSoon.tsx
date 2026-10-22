import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import civi from "@/assets/civi-astuce.png";

export function AccountSoon({ title }: { title: string }) {
  return (
    <section className="container-page max-w-lg py-16 text-center">
      <img src={civi} alt="" aria-hidden width={430} height={497} className="mx-auto w-32" />
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-muted-foreground">
        Les comptes ExaCiv ne sont pas encore ouverts. Le test gratuit est déjà disponible, sans inscription.
      </p>
      <Button asChild variant="cta" size="lg" className="mt-6"><Link to="/test-gratuit">Faire un test gratuit</Link></Button>
    </section>
  );
}
