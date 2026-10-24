import paris from "@/assets/hero-paris.jpg";

/**
 * Fond Paris partagé par toutes les pages publiques.
 * Même image, même cadrage (object-fit/object-position définis par
 * `.public-paris-bg` dans styles.css), sans animation ni clé liée à la route,
 * pour que le fond reste strictement identique lors de la navigation.
 */
export function PublicHeroBackground({ className = "", shared = false }: { className?: string; shared?: boolean }) {
  // The public layout owns the stable layer; leaf pages only own their content.
  if (!shared) return null;
  return <img className={`public-paris-bg ${className}`.trim()} src={paris} alt="" aria-hidden />;
}
