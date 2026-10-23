# Feuille de route — vérification et réparation globales ExaCiv

## Reprise stricte des références — 23 octobre à 15:19 UTC
- [x] Corriger les proportions du premier écran et des cartes Parcours/Méthode de l’accueil.
- [x] Corriger la composition FAQ, bandeau final et pied de page.
- [x] Ajuster la présentation du Parcours sans modifier les données ni le Dashboard.
- [ ] Vérifier le Parcours connecté : la session automatique est indisponible pour le compte demandeur ; nécessite connexion dans l’aperçu.

## Mobile — demande du 23 octobre à 10:39 UTC
## Cinq captures — demande du 23 octobre à 11:25 UTC
- [x] Agenda partagé avec Dashboard, dates locales et activité réelle ; créer, recharger, modifier, terminer et supprimer vérifiés sur le compte.
- [x] Cours vertical, français permanent, traduction séparée et prononciation locale ; micro synthétique vérifié, écoute humaine non vérifiée.
- [x] Salutation commune ; 14 destinations vérifiées à 390 et 1440 px.
- [x] Inventaire : 7 cours publiés, 4 nouveaux brouillons, résumés complétés, cinq couvertures disponibles ; deux thèmes non publiés marqués Bientôt disponible.
- [x] Session espagnole : source française et traduction séparée, choix conservé ; 104 tests réussis.
- [ ] Relecture humaine et publication des quatre nouveaux cours : attend validation éditoriale ; aucun nouveau cours publié.

- [x] Remplacer le menu public superposé par un tiroir accessible et rendre toutes les destinations du compte accessibles sur téléphone.
- [x] Corriger les largeurs réelles, le premier écran mobile et les fenêtres, sans masquage global ni changement des données.
- [x] Fiabiliser les animations existantes, le retour tactile et les interactions CIVI.
- [x] Contrôler six largeurs, six langues, navigation connectée/déconnectée et réduction du mouvement ; fournir captures et aperçu animé.

## Administration
- [x] Permissions serveur et Cloud, rôles protégés et journal des opérations.
- [x] Import CSV/JSON : modèle, mapping, validation, différences, drafts et rapport.
- [x] Questions versionnées : édition, examen humain, publication vers le catalogue existant.
- [x] Tests configurables et tentatives indépendantes avec règles et questions figées.
- [x] Gestion des cours, traductions, médias, comptes et signalements avec données réelles (édition JSON structurée pour cours, traductions et médias).
- [x] Vérifications permissions, import et parcours publication → tentative → résultats.

## Corrections du 23 octobre
- [x] Questions françaises et traduction séparée dans six langues ; écoute et préférences vérifiées.
- [x] Images propres, proportions et états d’échec ; sept vidéos inventoriées et non vérifiées retirées de l’affichage.
- [x] Cadre commun et seize pages contrôlés à 1440, 768 et 390 px ; captures avant/après et bilan fournis.
- [ ] Réactiver des vidéos pédagogiques : attend des contenus et autorisations d’utilisation confirmés.

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
- [x] Aides de session corrigées : sources françaises intactes, questions et options lues dans la langue affichée, descriptions d’images traduites ; leçons et sessions vérifiées dans les cinq langues à 1440 et 390 px, sans débordement ni erreur.
- [x] Pages internes étendues au portugais ; 267 extraits par langue pour les leçons, questions, options, explications et thèmes. Originaux accessibles, repli français et scores inchangés.
- [x] Cinq langues vérifiées sur le compte existant à 1440 et 390 px : 14 vues, préférences persistées puis restaurées, aucun débordement ni erreur. Traduction portugaise authentifiée vérifiée ; 69 tests réussis.
- [x] Cartes méthode, étapes, FAQ et CTA d’accueil : anglais, espagnol, arabe, russe et portugais vérifiés à 1440 et 390 px ; mini-QCM, FAQ et lien vers le test fonctionnels, aucun débordement. Portugais désormais aussi enregistré dans le compte.
- [x] Sept illustrations pédagogiques propres aux sept leçons publiées, style pastel des thèmes du Dashboard ; affichage sur le compte existant vérifié à 1440 et 390 px, sans débordement ni erreur.
- [x] Agrandissement des illustrations au clic dans le détail de leçon : aperçu plein écran avec description traduite, fermeture Échap/croix, pastille « Agrandir l'image » traduite, style aligné sur les cartes de thèmes ; vérifié à 1440 et 390 px, tests i18n réussis.
- [x] Interfaces internes en anglais, chinois, arabe, espagnol, russe et portugais avec repli français ; traductions pédagogiques séparées des originaux français.
- [x] Vérifier les leçons, sessions, examens et préférences de langue avec les données du compte existant : cinq langues persistées puis préférence initiale restaurée, questions/corrections/résultats réels, bureau et mobile sans débordement ni erreur d’exécution

## Services externes
- [ ] Gestion des paiements : attend la connexion d’un fournisseur de paiement réel.

## Reprise images 1–10 — demande du 23 octobre à 13:44 UTC
- [x] Étoile principale de CIVI séparée proprement (pixels transparents, recomposition identique) et animée ; les deux petites étoiles restent sur le corps.
- [x] Faux bouton lecture supprimé de l’image de leçon ; toute la carte d’aperçu mène à la méthode.
- [x] Icônes fonctionnelles au-dessus des titres des quatre cartes méthode, base gauche commune.
- [x] Titres des cartes parcours d’accueil : 22 px → 24,2 px (+10 %), 20 px → 22 px sur mobile.
- [x] Nouveaux textes d’accueil branchés sur les six langues (En savoir plus, Exemples d’interface, boutons des cartes, correction, alt appareils).
- [x] Vérification visuelle six largeurs (360–1440) et cinq pages publiques : aucun débordement, menu mobile verrouillé, espagnol et arabe RTL contrôlés, 104 tests réussis.

## Reprise images du 23 octobre à 14:45 UTC — terminée
- [x] Hero d'accueil aligné sur la référence : CIVI debout sur une pile de livres (image dérivée du CIVI officiel), pastilles de thèmes à gauche reliées par une pointillée, barre de chiffres sous le héros
- [x] Méthode : quatre cartes blanches numérotées 01–04, icônes en cercles teintés, titres centrés, anneau de score 28/40 pour Simuler, badge « Réponse incorrecte » pour Corriger
- [x] Page Parcours : descriptions des cinq étapes et sous-titre des thèmes alignés sur la référence, illustration de chapitre en fond, anneaux de progression sur les cartes de thèmes
- [x] Bas d'accueil : CTA avec CIVI agrandi à droite, bouton orange centré ; FAQ et pied de page conformes
- [x] Vérifié : build OK, 104 tests, captures 1440/390 px sans débordement
