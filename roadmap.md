# ExaCiv
- [x] Implement batch 2 references 10–15: mobile dashboard, single practice screen with active S’entraîner navigation, public pricing, stored mock results and provider-validated password reset. Public pages and invalid-link controls checked at desktop/mobile sizes; isolated app layout checks passed without overflow. Personal sessions and successful email reset still await an authorized account; reused artwork/spacing differ from references.
- [x] Implement nine new reference screens: /inscription, /bienvenue, /mot-de-passe-oublie, /examen, /methode, /faq, /abonnement/confirmer, /parcours, and mobile-only /. Preserve desktop home and validated app pages; Public forms, search, objective summaries and navigation checked at 1600/390px; 18 tests passed. Authenticated confirmation/profile updates and email delivery still require a usable authorized account; artwork and mobile composition retain differences.
- [x] Implement four new reference states: setup step 2, public free-test result, practice session question, and mock submission modal (image 5 overrides image 4); preserve real session data and verify desktop/mobile transitions. Demo checks passed; personal registration/submission verification awaits an authorized signed-in account.
- [ ] Correct homepage scale against the latest original reference; audit all page text/rendering and repair concrete UX/display defects without redesigning approved screens.
- [x] Match approved Connexion/Inscription, practice entry and mock-exam introduction references; verify controls, persistent starts/resume and desktop/tablet/mobile screenshots. Remaining visual differences: reused CIVI pose/background and spacing; Google/email delivery not tested end-to-end.
- [ ] Restore approved public homepage/logo/header/hero; add only Accueil to navigation, compare desktop/mobile and provide screenshots.
- [ ] Payments and associated admin tracking deferred by user; waits for explicit reactivation and provider configuration.
- [ ] Replace revision sources with verified official programme references and align learning paths without presenting invented questions as official.
- [ ] Implement reference-faithful Leçons, Progression and Mon compte with separate demo data and saved real account settings.
- [ ] Compare three final desktop renders to references and verify tablet/mobile and account save flow.
- [x] Add learner-entered incorrect answers and an authenticated AI Gateway personalised revision plan; real generation and saved-plan recovery verified.
- [ ] Add reference-faithful mock session, mistake library and subscription selection pages.
- [x] Verify three pages at 1600×900, 1440px, tablet and mobile; demonstrations remain separate from personal records.
- [x] Implement lesson details, persistent practice feedback and mock-exam results from new references.
- [x] Verify linked flows, real scoring, refresh recovery and desktop/mobile layouts; exact reference fidelity remains limited by starter chapter content and CIVI artwork.
- [x] Preserve confirmed home and pricing.
- [x] Shared app/quiz visual system matching supplied references.
- [x] Ten-question anonymous test with real scoring and explanations.
- [x] Accounts, profiles, protected application and durable learning progress.
- [x] Dashboard, learning map, lessons and practice flows.
- [x] Verify desktop/mobile, calculations, persistence and access controls.
## Pending external inputs
- [ ] Verify registration/profile save and real exam submission with an authorized account; no usable browser session was available.
- [ ] Exact homepage Paris foreground/platform and screen-specific CIVI poses remain unmatched with available extracted assets.
- [ ] Editorial approval of the 40-question training catalogue and reference chapter lesson content (Liberté, Égalité, Fraternité).
- [ ] Original high-resolution CIVI thinking pose for exact quiz artwork fidelity.
- [ ] Non-French translations (French UI is active; locale preferences and RTL metadata are prepared).
- [ ] Live payment configuration and final legal/contact details.

## Correctifs six captures (2026-10-22)
- [x] Catalogue /app/lecons : styles catalogue-*/approved-theme-* absents → page non stylée ; bloc CSS ajouté (bannière, filtres, grille thèmes 3/2/1, leçons recommandées)
- [x] Progression /app/progression : metric-ring/analytics-* sans CSS, cercles SVG sans fill:none → disques noirs géants ; styles ajoutés (anneaux 82px, fill:none, graphe d'activité contenu)
- [x] Accueil : cartes parcours/avantages/tarifs égales, badge « Le plus choisi », 6 langues réelles (plus de « … »), focus FAQ clavier uniquement, CTA final ordre mobile texte→bouton→CIVI, logo pied de page sans bloc blanc
- [ ] Vérification connectée des pages /app/lecons et /app/progression (nécessite la connexion de l'utilisatrice dans l'aperçu)
