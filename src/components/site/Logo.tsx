import { Link } from "@tanstack/react-router";
import logo from '@/assets/exaciv-approved-logo.png.asset.json';

export function Logo() {
  return (
    <Link to="/" className="site-logo" aria-label="ExaCiv – accueil">
      <img src={logo.url} alt="ExaCiv" width={218} height={88}/>
    </Link>
  );
}
