import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n, LOCALE_IDS, LOCALE_LABELS, type Locale } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { saveLocale } from '@/lib/learning.functions';
import {PUBLIC_LOCALES} from '@/config/interface-languages';

export function LanguageMenu({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  async function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      try { await saveLocale({ data: { locale: next } }); } catch { /* preference kept locally */ }
    }
  }

  return (
    <div ref={ref} className={`language-menu ${mobile ? 'language-menu-mobile' : ''}`}>
      <Button
        variant="ghost"
        className="language-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.language')}
        onClick={() => setOpen(!open)}
      >
        <Globe className="size-4" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="size-3.5" />
      </Button>
      {open && (
        <ul className="language-list" role="listbox" aria-label={t('nav.language')}>
          {PUBLIC_LOCALES.map((id) => (
            <li key={id}>
              <button
                type="button"
                role="option"
                aria-selected={id === locale}
                className={id === locale ? 'active' : ''}
                onClick={() => void choose(id)}
              >
                <span>{LOCALE_LABELS[id]}</span>
                {id === locale && <Check className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
