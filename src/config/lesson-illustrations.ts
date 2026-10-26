import devise from '@/assets/lesson-devise.jpg';
import laicite from '@/assets/lesson-laicite-blue.jpg';
import parlement from '@/assets/lesson-parlement.jpg';
import president from '@/assets/lesson-president.jpg';
import vote from '@/assets/lesson-vote.jpg';
import symboles from '@/assets/lesson-symboles.jpg';
import egalite from '@/assets/lesson-egalite.jpg';
import history from '@/assets/topic-history.jpg';
import society from '@/assets/topic-society.jpg';

// Editorial illustrations accompany the Cloud lesson; they never replace its content.
const optionalHero=import.meta.glob<string>('/src/assets/lesson-devise-hero.png',{eager:true,query:'?url',import:'default'});
export const LESSON_ILLUSTRATIONS: Record<string, {src: string; alt: string}> = {
  devise: {src: optionalHero['/src/assets/lesson-devise-hero.png']??devise, alt: optionalHero['/src/assets/lesson-devise-hero.png']?'Un bâtiment républicain avec le drapeau français et la devise Liberté, Égalité, Fraternité.':'Des citoyens réunis autour de Marianne, pour illustrer la liberté, l’égalité et la fraternité.'},
  laicite: {src: laicite, alt: 'Des élèves accueillis dans une école publique française.'},
  parlement: {src: parlement, alt: 'Illustration de l’Assemblée nationale et du Sénat, avec un livre représentant la loi.'},
  president: {src: president, alt: 'Illustration de la présidence, avec un palais, une urne et cinq calendriers évoquant le mandat de cinq ans.'},
  vote: {src: vote, alt: 'Une citoyenne dépose une enveloppe dans une urne, devant des électeurs et un isoloir.'},
  symboles: {src: symboles, alt: 'Le drapeau tricolore, Marianne et une partition évoquant l’hymne national.'},
  egalite: {src: egalite, alt: 'Une femme et un homme devant une balance équilibrée, avec des équipes travaillant ensemble.'},
  'revolution-1789': {src: history,alt:'Carte de France, patrimoine et livre pour les repères historiques.'},
  'territoire-francais': {src: history,alt:'Carte de France et paysages pour les repères territoriaux.'},
  domiciliation: {src: society,alt:'Famille et services de proximité dans la société française.'},
  'medecin-traitant': {src: society,alt:'Médecin et services de santé pour le suivi médical.'},
};