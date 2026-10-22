import {OFFICIAL_TRACKS} from './official-programme';
import type {ParcoursId} from './content';
export const EXAM_FACTS:Record<ParcoursId,{questions:number;minutes:number;minimum:number;condition:string;source:string}>={
 naturalisation:{questions:40,minutes:45,minimum:32,condition:'Pour la naturalisation ou la réintégration par décret, sous réserve des dispenses applicables.',source:OFFICIAL_TRACKS.naturalisation.url},
 resident:{questions:40,minutes:45,minimum:32,condition:'Pour une première carte de résident, lorsque l’examen est requis selon votre situation.',source:OFFICIAL_TRACKS.resident.url},
 sejour:{questions:40,minutes:45,minimum:32,condition:'Pour une première carte de séjour pluriannuelle, lorsque l’examen est requis selon votre situation.',source:OFFICIAL_TRACKS.sejour.url},
};
export const METHOD_STEPS=[
 {title:'Découvrir',description:'Des leçons claires et illustrées.',destination:'/app/lecons',tone:'orange'},
 {title:'S’entraîner',description:'Des QCM avec des explications.',destination:'/app/entrainement',tone:'blue'},
 {title:'Corriger',description:'Comprendre et revoir ses erreurs.',destination:'/app/mes-erreurs',tone:'green'},
 {title:'Simuler',description:'Des examens blancs pour se préparer.',destination:'/app/examen-blanc',tone:'blue'},
] as const;
export const HELP_RESOURCES=[
 {title:'Règles officielles de l’examen',description:'Les informations du ministère sur l’examen civique.',href:'https://formation-civique.interieur.gouv.fr/examen-civique/',external:true,tone:'orange'},
 {title:'Guide du candidat',description:'Comprendre l’épreuve et les modalités de votre démarche.',href:'/examen',external:false,tone:'blue'},
 {title:'Conseils pour réviser',description:'Des conseils et recommandations pour votre préparation.',href:'/methode',external:false,tone:'green'},
] as const;