-- Les réponses, explications et options des questions ne doivent plus être lisibles
-- avec la clé publique (anon / authenticated). Avant ce correctif, GRANT SELECT sur toute
-- la table permettait de télécharger la banque complète avec ses réponses via l'API.
--
-- Les lectures légitimes passent par :
--   * les fonctions SECURITY DEFINER (sessions, examens, tentatives) : non concernées ;
--   * getCatalogue (serveur) : colonnes non sensibles via la clé publique,
--     questions du test gratuit via la clé serveur (service_role).
--
-- ATTENTION : toute nouvelle colonne de learning_questions destinée à être lue par le
-- navigateur doit désormais recevoir son propre GRANT SELECT (colonne).
--
-- Retour arrière :
--   GRANT SELECT ON public.learning_questions TO anon, authenticated;

REVOKE SELECT ON public.learning_questions FROM anon, authenticated;
GRANT SELECT (id, theme, exam_theme, pathways, question_type, classification_reviewed_at, lesson_id, position, published)
  ON public.learning_questions TO anon, authenticated;
