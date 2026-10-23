# Feuille de route — vérification et réparation globales ExaCiv

## Fait
- [x] Barre latérale : libellés tronqués proprement (ellipsis), mode réduit propre, breakpoint ≤1100 px pour le gabarit de référence
- [x] Page « Mon compte » : styles absents recréés (cartes, colonnes, mobile)
- [x] « Écouter » : synthèse vocale navigateur (question + options), arrêt au changement de question/page, état lecture/arrêt, message si navigateur incompatible
- [x] « Traduire » : traduction serveur via passerelle IA (5 langues, RTL arabe), repli masquable, « Écouter la traduction », jamais la réponse avant révélation
- [x] Préférences compte : « Afficher l'aide à la traduction » + langue d'aide, persistées (migration profiles.translation_help / help_locale)
- [x] Examen blanc : aides marquées « Entraînement avec aide »
- [x] Audit banque : 41 questions publiées relues — 0 doublon, 0 réponse hors limites, 0 option vide, 0 sans explication ; « 5 ans » déjà correct ; 26 sources génériques remplacées par références exactes + date et état de vérification
- [x] Responsive : 13 pages × 4 largeurs (1440/1024/768/390) sans débordement (1 px résiduel corrigé)
- [x] Build OK, 60/60 tests

## Reste (non bloquant)
- [x] Cartes méthode, étapes, FAQ et CTA d’accueil : anglais, espagnol, arabe, russe et portugais vérifiés à 1440 et 390 px ; mini-QCM, FAQ et lien vers le test fonctionnels, aucun débordement. Portugais conservé dans le navigateur, autres pages avec repli français.
- [x] Sept illustrations pédagogiques propres aux sept leçons publiées, style pastel des thèmes du Dashboard ; affichage sur le compte existant vérifié à 1440 et 390 px, sans débordement ni erreur.
- [x] Traduire les interfaces internes en anglais, chinois, arabe, espagnol et russe avec repli français ; conserver les cours et questions en français
- [x] Vérifier les leçons, sessions, examens et préférences de langue avec les données du compte existant : cinq langues persistées puis préférence initiale restaurée, questions/corrections/résultats réels, bureau et mobile sans débordement ni erreur d’exécution
