# Feuille de route ExaCiv

## Fidélité six pages — 25 octobre 18:43 UTC
- [x] Suivi PAGE 3 : rapport fourni, titres équilibrés et ponctuation liée, fil retiré, aides sur la ligne du thème ; PAGE 2 contrôlée à 1440/390, 209 tests OK et build OK. Publication ciblée 00bd63c42e5c38e429b75e64248c030ddbf47e77 ; identité du commit servi non prouvée. Aucune migration ; PAGE 4 non commencée.
- [ ] Correctif page 2 : navigation courte et mobile, aides en-tête, icônes pleines, pluriel 0/1 contrôlés ; 209 tests OK ; publication et identité exacte servie à confirmer.
- [ ] 1. Session d’entraînement : affichage 1440/1158/390, marqueurs/filtre et navigation/reprise vérifiés ; soumission réelle de 5 réponses, corrections immédiates, suivant et finalisation contrôlés avec le compte isolé page 2. Vérification de la version publiée encore requise.
- [ ] 2. Résultats courts : écran et titres pratique/révision/examen court réalisés ; 199 tests OK, réponses 3 justes/2 fausses finalisées, examen court incorrect et examen vide contrôlés, continuation 8 questions avec thème/chrono conservés, captures 1440/1158/390 sans débordement. Limites : pratique avec blanc refusée par les règles existantes ; confidentialité globale non garantie car test gratuit et catalogue public restent accessibles ; fidélité CIVI approximative ; version publiée à vérifier. Aucune nouvelle migration ni modification du scoring.
- [ ] 3. Révision plein écran : route et liens, lot réel de 10, réponses alternées justes/fausses via RPC, correction/suivant/terminer et passer/quitter sans écriture vérifiés avec compte isolé ; réponses réseau/DOM/état React sans correction avant validation, CIVI et captures 1440/1158/390 contrôlés ; 209 tests OK. Fidélité pixel exacte et identité du commit servi non établies ; publication et rapport à fournir.
- [ ] 4. Résultats examen : écran implémenté, 215 tests OK/build OK, fixtures navigateur 1440/390 (vide, 31/40, 32/40, corrections/contact) ; aucun examen réel de 40 questions au compte isolé, catalogue indisponible. Publication et rapport en cours ; cycle réel bloqué par contenu, SHA servi non prouvable.
- [ ] 5. Leçon continue : layout et page continue 1440/390 contrôlés ; signet ajouté/retiré, garde serveur refusant avant À retenir, sauvegarde/reprise et laïcité → completion → session de leçon vérifiés au compte isolé ; micro synthétique enregistré/relu ; 220 tests et build OK. Devise : 2 questions, exercice de 5 indisponible ; bâtiment séparé absent ; SHA servi à vérifier. Aucune migration, PAGE 6 non commencée.
- [ ] 6. Administration : indicateurs par période et priorités calculées avec permissions existantes ; publier et rapporter.
- [x] Migration additive unique 0032 : marqueurs et layout nullable appliqués, export personnel et validation layout testés ; bâtiment de la devise absent, blocs non encore affichés (page 5 à faire).

## Lot 1b — corrections résiduelles
- [x] Unifier thèmes TypeScript/SQL et noms visibles sans modifier les questions — tests batch1b, question reprise avec un seul thème canonique.
- [x] Partager les libellés réels de sessions et corriger les pluriels — tests des cinq types, six langues synchronisées, historique et 1 jour contrôlés.
- [x] Corriger thèmes indisponibles et continuation Dashboard — capture 1440 px ouverte, deux lignes sans lien/chevron.
- [x] Corriger numérotation du chapitre, progression et source des leçons — tests 50/100 %, chapitre 1/2/3 et Constitution article 2 contrôlés.
- [x] Corriger boutons disponibles/examen et présentation des traductions — capture examen et dialogue ; aide fermée à l'ouverture, options sans numéros.
- [x] Vérifier tests et compte réel — 180/180 ; reprise après rafraîchissement, lecture et ouverture correction contrôlées. Soumission de réponses, nouvelle session et finalisation : non vérifiées, hors corrections 1b.
- [x] Demander la publication et livrer le rapport avec les quatre captures 1440 px — demande acceptée ; URL HTTP 200, version déployée non vérifiée avec le compte réel.

## Lot 1 — règles et affichages
- [x] 1. Sessions sans réponse non évaluées ; erreurs et blancs distincts — tests batch1/exam-summary et compte réel, filtre 38 blancs séparés de 2 erreurs.
- [x] 2. Révision et liste par lots de dix — test cap, dialogue 2 erreurs, liste 10 puis 20 via Afficher plus. Soumission de révision : not verified.
- [ ] 3. Entraînement limité au disponible côté client et serveur — code, tests 1/3/8/9/0 et fonction Cloud contrôlés ; démarrage réel et lecture du snapshot : not verified (compte isolé absent).
- [x] 4. Types internes masqués aux apprenants — tests learnerQuestionTypes, contrôle visuel et ligne 28/12 absente. Compte classifié réel : not verified.
- [ ] 5. Démarrage/reprise/examen indisponible cohérents — bouton indisponible contrôlé, disponibilité partagée testée ; reprise d’examen actif et recommencer : not verified (aucun examen actif).
- [x] 6. Corrections Progression, parcours, Dashboard et sélecteurs — captures 1440/390 ouvertes ; pagination/clavier et deux thèmes non dépliables contrôlés. Écriture des préférences : not verified.
- [x] Tests : 153/153 ; compilation automatique OK ; captures 1440/390 ouvertes et rapport avec limites.

## Nouveau contrat six pages — 25 octobre 07:53 UTC
- [x] Cartographier les six pages et les dernières références ; appliquer le cadre partagé et les couleurs locales.
- [x] Refaire Mon parcours conformément à la référence, puis contrôler l'écran réel.
- [x] Aligner Dashboard, catalogue, détail, entraînement et examen sans toucher aux pages publiques.
- [x] Corriger les opérations réalisables et bloquer les simulations sans configuration vérifiée 28/12.
- [x] Vérifier 1440/390 px, captures ouvertes ; écritures uniquement en compte isolé (aucune session créée).
- [x] Livrer six lignes d'acceptation, captures ouvertes et limites explicites.

## Limites connues (reportées au rapport)
- Simulation 40 questions indisponible : thème « Vivre dans la société française » sans questions publiées ; classification 28/12 non vérifiée (0 question classée) — la ligne 28/12 ne s'affiche que si la couverture vérifiée la justifie.
- Marqueurs/bookmarks de questions en examen : non implémentés.
