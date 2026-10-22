export type ParcoursId = "naturalisation" | "resident" | "sejour";

export const PARCOURS: {
  id: ParcoursId;
  title: string;
  short: string;
  description: string;
  tone: "orange" | "blue" | "green";
}[] = [
  {
    id: "naturalisation",
    title: "Naturalisation",
    short: "Demande de nationalité française",
    description:
      "Préparez l’examen civique dans le cadre d’une demande de naturalisation ou de réintégration dans la nationalité française.",
    tone: "orange",
  },
  {
    id: "resident",
    title: "Carte de résident",
    short: "Première demande de carte de résident",
    description:
      "Approfondissez vos connaissances sur les valeurs, les institutions et la vie en société en France.",
    tone: "blue",
  },
  {
    id: "sejour",
    title: "Carte de séjour pluriannuelle",
    short: "Première demande de carte pluriannuelle",
    description: "Consolidez vos repères essentiels sur la vie en société française.",
    tone: "green",
  },
];

export const ELIGIBILITY_NOTE =
  "Les conditions d’application et les dispenses dépendent de votre situation : référez-vous aux informations officielles.";

export const OFFICIAL_SOURCE = {
  label: "service-public.fr",
  url: "https://www.service-public.fr/",
};

export const FAQ: { q: string; a: string; link?: { to: string; label: string; external?: boolean } }[] = [
  {
    q: "ExaCiv est-il un site officiel ?",
    a: "Non. ExaCiv est une plateforme indépendante de préparation.",
  },
  {
    q: "L’examen officiel est-il en français ?",
    a: "Oui, l’examen civique se passe en français. Nos leçons sont rédigées en français clair ; des aides dans d’autres langues pourront accompagner votre compréhension.",
    link: { to: OFFICIAL_SOURCE.url, label: "Vérifier sur service-public.fr", external: true },
  },
  {
    q: "Le test gratuit nécessite-t-il un compte ?",
    a: "Non. Vous pouvez faire le test gratuit sans créer de compte. Un compte vous permettra ensuite de sauvegarder vos résultats.",
    link: { to: "/test-gratuit", label: "Faire le test gratuit" },
  },
  {
    q: "ExaCiv permet-il de s’inscrire à l’examen officiel ?",
    a: "Non. L’inscription se fait auprès des organismes habilités. Un abonnement ExaCiv ne remplace pas les frais ni les démarches officielles.",
    link: { to: "/examen", label: "Comprendre l’examen" },
  },
  {
    q: "Puis-je retrouver ma progression sur plusieurs appareils ?",
    a: "Oui, une fois connecté à votre compte, votre progression sera associée à votre compte et accessible depuis vos appareils.",
  },
];

export const RESOURCES = [
  {
    slug: "comprendre-examen-civique",
    title: "Comprendre l’examen civique en 5 minutes",
    excerpt: "Format, thèmes abordés et conseils pour bien commencer vos révisions.",
    body: [
      "L’examen civique prend la forme d’un questionnaire à choix multiples portant sur les principes et valeurs de la République, les institutions, les droits et devoirs, l’histoire et la vie en société.",
      "Les règles exactes (nombre de questions, durée, seuil de réussite) dépendent de votre démarche et peuvent évoluer : vérifiez toujours les informations officielles avant votre examen.",
      "Commencez par un test de découverte pour identifier vos points à renforcer, puis avancez thème par thème.",
    ],
  },
  {
    slug: "devise-et-symboles",
    title: "La devise et les symboles de la République",
    excerpt: "Liberté, Égalité, Fraternité, Marianne, le drapeau, la Marseillaise : l’essentiel.",
    body: [
      "La devise de la République française est « Liberté, Égalité, Fraternité ». Elle est inscrite dans la Constitution de 1958.",
      "Les symboles de la République comprennent notamment le drapeau tricolore bleu, blanc, rouge, l’hymne national La Marseillaise, et Marianne.",
      "Le 14 juillet est la fête nationale française.",
    ],
  },
  {
    slug: "la-laicite",
    title: "La laïcité, expliquée simplement",
    excerpt: "Ce que garantit la laïcité et ce qu’elle implique au quotidien.",
    body: [
      "La laïcité garantit la liberté de conscience : chacun est libre de croire ou de ne pas croire, et de pratiquer sa religion dans le respect de la loi.",
      "Elle repose notamment sur la loi de 1905 concernant la séparation des Églises et de l’État.",
      "L’État est neutre : il ne reconnaît ni ne subventionne aucun culte, et traite tous les citoyens de manière égale.",
    ],
  },
];
