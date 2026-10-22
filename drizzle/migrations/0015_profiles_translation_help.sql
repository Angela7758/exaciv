ALTER TABLE public.profiles ADD COLUMN translation_help boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN help_locale text NOT NULL DEFAULT 'en';
COMMENT ON COLUMN public.profiles.translation_help IS 'Affiche l’entrée Traduire sur les questions d’entraînement';
COMMENT ON COLUMN public.profiles.help_locale IS 'Langue d’aide à la traduction des questions (zh, en, ar, es, ru)';