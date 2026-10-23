import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || node.getBoundingClientRect().top < window.innerHeight){setVisible(true);return;}
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    setReady(true);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0, rootMargin:'0px 0px 80px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);
  return <div ref={ref} className={`reveal ${ready?'reveal-ready':''} ${visible ? 'reveal-visible' : ''} ${className}`}>{children}</div>;
}
