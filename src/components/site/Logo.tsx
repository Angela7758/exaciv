import { Link } from "@tanstack/react-router";
import { BrandLogo } from "./BrandLogo";

export function Logo() {
  return (
    <Link to="/" className="site-logo" aria-label="ExaCiv – accueil">
      <BrandLogo />
    </Link>
  );
}
