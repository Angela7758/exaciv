import { useEffect } from 'react';

/** Site-wide decorative interactions: cursor spotlight on cards, press ripple on buttons, progressive reveal of content blocks. Respects reduced motion. */
export function InteractionFx() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element | null)?.closest?.('.card-hover,.learning-card,.home-method-card,.topic-card') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.('[data-slot=button],button,a.home-more-link') as HTMLElement | null;
      if (!btn || btn.hasAttribute('disabled')) return;
      const r = btn.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'fx-ripple';
      const size = Math.max(r.width, r.height);
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(s);
      window.setTimeout(() => s.remove(), 600);
    };
    // Progressive reveal of generic blocks not already wrapped by <Reveal>
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('fx-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const scan = () => {
      document.querySelectorAll<HTMLElement>('main section:not(.approved-home-hero):not(.fx-seen), main .learning-card:not(.fx-seen)').forEach((el) => {
        if (el.closest('.reveal')) return;
        el.classList.add('fx-seen');
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add('fx-wait');
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerdown', onDown); };
  }, []);
  return <div className="fx-scroll-progress" aria-hidden />;
}
