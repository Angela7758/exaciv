export const OFFICIAL_TRACKS={
 naturalisation:{label:'Naturalisation',url:'https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/questions-de-connaissance-pour-lexamen-civique-nationalite-francaise.html'},
 resident:{label:'Carte de résident',url:'https://formation-civique.interieur.gouv.fr/examen-civique/liste-officielle-des-questions-de-connaissance-cr/'},
 sejour:{label:'Carte de séjour pluriannuelle',url:'https://formation-civique.interieur.gouv.fr/examen-civique/liste-officielle-des-questions-de-connaissance-csp/'}
} as const;
export const OFFICIAL_TOPICS=[
 {title:'Principes et valeurs de la République française',description:'Devise, symboles, liberté, égalité, fraternité et laïcité.',tone:'blue',art:'valeurs',url:'https://formation-civique.interieur.gouv.fr/fiches-par-thematiques/principes-et-valeurs-de-la-republique/'},
 {title:'Système institutionnel et politique',description:'Institutions, démocratie, élections et participation citoyenne.',tone:'orange',art:'institutions',url:'https://formation-civique.interieur.gouv.fr/fiches-par-thematiques/systeme-institutionnel-et-politique/'},
 {title:'Droits et devoirs',description:'Libertés fondamentales, obligations et respect des lois.',tone:'green',art:'droits',url:'https://formation-civique.interieur.gouv.fr/fiches-par-thematiques/droits-et-devoirs/'},
 {title:'Histoire, géographie et culture',description:'Repères historiques, territoire français et patrimoine culturel.',tone:'blue',art:'histoire',url:'https://formation-civique.interieur.gouv.fr/fiches-par-thematiques/histoire-geographie-et-culture/'},
 {title:'Vivre dans la société française',description:'École, travail, santé, famille et vie quotidienne.',tone:'green',art:'societe',url:'https://formation-civique.interieur.gouv.fr/fiches-par-thematiques/vivre-dans-la-societe-fran%C3%A7aise/'},
] as const;
export const LEGACY_TOPIC_MAP:Readonly<Record<string,string>>={
 'Valeurs de la République':OFFICIAL_TOPICS[0].title,
 'Principes et valeurs':OFFICIAL_TOPICS[0].title,
 'Institutions':OFFICIAL_TOPICS[1].title,
 'Institutions françaises':OFFICIAL_TOPICS[1].title,
 'Droits et devoirs':OFFICIAL_TOPICS[2].title,
 'Histoire':OFFICIAL_TOPICS[3].title,
 'Histoire et symboles':OFFICIAL_TOPICS[3].title,
 'France et Europe':OFFICIAL_TOPICS[3].title,
 'Vie en société':OFFICIAL_TOPICS[4].title,
 'Société française':OFFICIAL_TOPICS[4].title,
};
export function officialTopic(topic:string){return LEGACY_TOPIC_MAP[topic]??topic;}
export function officialTrack(parcours:string){return OFFICIAL_TRACKS[parcours==='resident'?'resident':parcours==='sejour'?'sejour':'naturalisation'];}