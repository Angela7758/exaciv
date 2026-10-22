// Sample questions for the free discovery test. Content written and reviewed by ExaCiv,
// not official exam questions.
export interface TestQuestion {
  id: string;
  theme: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
}

export const FREE_TEST: TestQuestion[] = [
  {
    id: "q1",
    theme: "Principes et valeurs",
    question: "Quelle est la devise de la République française ?",
    options: ["Unité, Paix, Solidarité", "Liberté, Égalité, Fraternité", "Démocratie, Justice, Laïcité"],
    answer: 1,
    explanation: "La devise « Liberté, Égalité, Fraternité » est inscrite à l’article 2 de la Constitution de 1958.",
    source: "Constitution du 4 octobre 1958, article 2",
  },
  {
    id: "q2",
    theme: "Principes et valeurs",
    question: "La laïcité garantit-elle la liberté de conscience ?",
    options: ["Vrai", "Faux"],
    answer: 0,
    explanation: "La laïcité permet à chacun de croire ou de ne pas croire et de pratiquer sa religion dans le respect de la loi.",
    source: "Loi du 9 décembre 1905, article 1er",
  },
  {
    id: "q3",
    theme: "Institutions",
    question: "Pour combien d’années le Président de la République est-il élu ?",
    options: ["4 ans", "5 ans", "7 ans"],
    answer: 1,
    explanation: "Depuis la réforme de 2000, le mandat présidentiel dure 5 ans (quinquennat).",
    source: "Constitution, article 6",
  },
  {
    id: "q4",
    theme: "Institutions",
    question: "Quelles sont les deux assemblées qui composent le Parlement ?",
    options: [
      "L’Assemblée nationale et le Sénat",
      "Le Sénat et le Conseil d’État",
      "L’Assemblée nationale et le Conseil constitutionnel",
    ],
    answer: 0,
    explanation: "Le Parlement comprend l’Assemblée nationale et le Sénat, qui votent la loi.",
    source: "Constitution, article 24",
  },
  {
    id: "q5",
    theme: "Droits et devoirs",
    question: "À partir de quel âge peut-on voter en France (pour les citoyens français) ?",
    options: ["16 ans", "18 ans", "21 ans"],
    answer: 1,
    explanation: "Le droit de vote est ouvert aux citoyens français majeurs, c’est-à-dire âgés de 18 ans.",
    source: "Code électoral, article L2",
  },
  {
    id: "q6",
    theme: "Histoire et symboles",
    question: "Quelle est la date de la fête nationale française ?",
    options: ["1er mai", "8 mai", "14 juillet"],
    answer: 2,
    explanation: "Le 14 juillet est la fête nationale, en référence à 1789 et à la fête de la Fédération de 1790.",
    source: "Loi du 6 juillet 1880",
  },
  {
    id: "q7",
    theme: "Droits et devoirs",
    question: "L’égalité entre les femmes et les hommes est-elle un principe de la République ?",
    options: ["Vrai", "Faux"],
    answer: 0,
    explanation: "L’égalité entre les femmes et les hommes est garantie par la Constitution et la loi.",
    source: "Préambule de la Constitution de 1946, alinéa 3",
  },
  {
    id: "q8",
    theme: "Histoire et symboles",
    question: "Quel est l’hymne national de la France ?",
    options: ["La Marseillaise", "Le Chant des partisans", "L’Internationale"],
    answer: 0,
    explanation: "La Marseillaise est l’hymne national, mentionné à l’article 2 de la Constitution.",
    source: "Constitution, article 2",
  },
];

export function scoreTest(answers: (number | null)[], questions: TestQuestion[] = FREE_TEST) {
  let correct = 0;
  const byTheme: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    const t = (byTheme[q.theme] ??= { correct: 0, total: 0 });
    t.total++;
    if (answers[i] === q.answer) {
      correct++;
      t.correct++;
    }
  });
  return { correct, wrong: questions.length - correct, total: questions.length, byTheme };
}
