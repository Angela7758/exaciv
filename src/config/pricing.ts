// Single source of truth for ExaCiv plan prices and benefits.
export type PlanId = "decouverte" | "essentiel" | "pass";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  variant: "neutral" | "cta" | "default";
}

export const PLANS: Plan[] = [
  {
    id: "decouverte",
    name: "Découverte",
    price: "0 €",
    features: ["Test de découverte", "Aperçu des leçons", "Résultat immédiat"],
    cta: "Commencer gratuitement",
    variant: "neutral",
  },
  {
    id: "essentiel",
    name: "Essentiel",
    price: "9,90 €",
    period: "/ mois",
    features: ["Leçons complètes", "QCM illimités", "Corrections expliquées", "Suivi des progrès"],
    cta: "Choisir Essentiel",
    variant: "cta",
  },
  {
    id: "pass",
    name: "Pass Révision",
    price: "24,90 €",
    period: "/ 3 mois",
    features: [
      "Tout le contenu de l’offre Essentiel",
      "Examens blancs chronométrés",
      "Révisions ciblées par thème",
      "Suivi des progrès avancé",
    ],
    cta: "Choisir le Pass",
    variant: "default",
  },
];

export const PRICING_NOTE = "Tarifs ExaCiv de préparation, hors frais de l’examen officiel.";

/** Online payment is not configured yet: paid plans must never simulate a purchase. */
export const PAYMENTS_ENABLED = false;
