import { useEffect } from 'react';

/** Site-wide decorative interactions: cursor spotlight on cards, press ripple on buttons, progressive reveal of content blocks. Respects reduced motion. */
export function InteractionFx() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element | null)?.closest?.('.home-method-card,.pathway-public-cards>article,.method-cards>article,.pricing-reference-plan,.learning-card') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.('[data-slot=button],button,a.home-more-link') as HTMLElement | null;
      if (!btn || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true') return;
      const r = btn.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'fx-ripple';
      const size = Math.max(r.width, r.height);
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      // Never reposition an already positioned control (e.g. dialog close buttons): switching absolute→relative on pointerdown moved it out from under the pointer, so the click was lost.
      if (getComputedStyle(btn).position === 'static') btn.classList.add('fx-pressable'); else btn.classList.add('fx-pressable-clip');
      btn.appendChild(s);
      window.setTimeout(() => s.remove(), 600);
    };
    // Progressive reveal of generic blocks not already wrapped by <Reveal>
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('fx-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const scan = () => {
      document.querySelectorAll<HTMLElement>('main section:not(.approved-home-hero):not(.public-paris-hero):not(.fx-seen), main .learning-card:not(.fx-seen), main .pathway-public-cards>article:not(.fx-seen), main .method-cards>article:not(.fx-seen), main .pricing-reference-plan:not(.fx-seen), main .help-resources>a:not(.fx-seen)').forEach((el) => {
        if (el.closest('.reveal, .app-layout, [role=dialog]')) return;
        el.classList.add('fx-seen');
        if (el.getBoundingClientRect().top < window.innerHeight || el.contains(document.activeElement)) return;
        el.style.setProperty('--fx-delay', `${Array.from(el.parentElement?.children ?? []).indexOf(el) % 4 * 70}ms`);
        el.classList.add('fx-wait');
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    const onFocus = (e: FocusEvent) => {
      const el = (e.target as Element | null)?.closest('.fx-wait');
      if (el) { el.classList.add('fx-in'); io.unobserve(el); }
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener('focusin', onFocus); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerdown', onDown); };
  }, []);
  return <div className="fx-scroll-progress" aria-hidden />;
}
