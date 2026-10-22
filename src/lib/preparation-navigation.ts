export const PREPARATION_DESTINATIONS=['/app','/app/parcours','/app/lecons','/app/entrainement','/app/mes-erreurs','/app/examen-blanc','/abonnement/confirmer'] as const;
export function preparationDestination(value:unknown){return PREPARATION_DESTINATIONS.find(p=>p===value)??'/app';}
export function rememberDestination(value:unknown){sessionStorage.setItem('exaciv-destination',preparationDestination(value));}
export function selectedPlan(value:unknown):'pass'|'decouverte'|'essentiel'{return value==='pass'?'pass':value==='decouverte'?'decouverte':'essentiel';}