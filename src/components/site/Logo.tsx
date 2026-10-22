import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="relative inline-flex items-baseline text-2xl font-extrabold tracking-tight text-foreground" aria-label="ExaCiv – accueil">
      Exa<span className="text-primary">C</span>
      <span className="relative text-secondary">
        iv
        <span aria-hidden className="absolute -right-2 -top-2 text-xs text-secondary">✦</span>
      </span>
    </Link>
  );
}
