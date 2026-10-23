ALTER TABLE public.profiles DROP CONSTRAINT profiles_locale_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_locale_check CHECK (locale IN ('fr','zh','en','ar','es','ru','pt'));