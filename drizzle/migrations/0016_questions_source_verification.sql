ALTER TABLE public.learning_questions ADD COLUMN source_verified_at timestamptz;
ALTER TABLE public.learning_questions ADD COLUMN source_status text NOT NULL DEFAULT 'a_verifier';
COMMENT ON COLUMN public.learning_questions.source_verified_at IS 'Date de vérification de la source officielle';
COMMENT ON COLUMN public.learning_questions.source_status IS 'verifiee | a_verifier : état de vérification de la source';