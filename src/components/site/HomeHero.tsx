import type React from 'react';
import {SafeImage} from '@/components/site/SafeImage';
import {Link} from '@tanstack/react-router';
import {useState} from 'react';
import {BookOpen,CheckCircle2,FileText,Landmark,Users,Star,Play,ArrowRight,X,RotateCcw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useT} from '@/lib/i18n';
import paris from '@/assets/hero-paris.jpg';
import {useDecorativeMotion} from '@/hooks/use-decorative-motion';

function HeroCivi(){const t=useT();const {ref,paused}=useDecorativeMotion();const [open,setOpen]=useState(false);return <div ref={ref} className={`home-civi ${paused?'motion-paused':''}`}><Button variant="ghost" className="home-civi-btn" aria-expanded={open} aria-label={t('home.hero.civiAsk')} onClick={()=>setOpen(!open)}><SafeImage src={civi} alt={t('home.hero.civiAlt')}/></Button>{open&&<div className="home-civi-tip" role="status"><p>{t('home.hero.civiAsk')}</p><Button variant="ghost" size="icon" aria-label={t('common.close')} onClick={()=>setOpen(false)}><X/></Button></div>}</div>;}
import civi from '@/assets/civi.png';
import stone from '@/assets/home-reference-stone.png.asset.json';

export function HomeHero(){
 const t=useT();const {ref,paused}=useDecorativeMotion();const [answer,setAnswer]=useState(true);const [validated,setValidated]=useState(false);
 return <section className="approved-home-hero"><SafeImage className="home-paris" src={paris} alt="" aria-hidden/>
  <div className="home-hero-inner"><div className="home-copy">
   <p className="home-overline hero-enter" style={{'--i':0} as React.CSSProperties}>{t('home.hero.overline')}</p>
   <h1 className="hero-enter" style={{'--i':1} as React.CSSProperties}>{t('home.hero.title1')}<br/>{' '}{t('home.hero.title2')} <span>{t('home.hero.accent')}</span></h1>
   <p className="home-description hero-enter" style={{'--i':2} as React.CSSProperties}>{t('home.hero.description')}</p>
   <div className="home-actions hero-enter" style={{'--i':3} as React.CSSProperties}><Button asChild variant="cta" size="xl"><Link to="/test-gratuit"><Play className="fill-current"/>{t('home.hero.ctaTest')}</Link></Button><Button asChild variant="outline" size="xl"><Link to="/methode">{t('home.hero.ctaMethode')}<ArrowRight className="rtl-flip"/></Link></Button></div>
   <p className="home-no-card hero-enter" style={{'--i':4} as React.CSSProperties}>{t('home.hero.noCard')}</p>
   <div className="home-benefits hero-enter" style={{'--i':4} as React.CSSProperties}>{(['home.hero.b1','home.hero.b2','home.hero.b3'] as const).map(k=><span key={k}><CheckCircle2/>{t(k)}</span>)}</div>
  </div>
  <div ref={ref} className={`home-learning-scene hero-enter ${paused?'motion-paused':''}`} style={{'--i':5} as React.CSSProperties} onPointerMove={e=>{if(e.pointerType!=='mouse'||!ref.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=ref.current.getBoundingClientRect();ref.current.style.setProperty('--px',`${(((e.clientX-r.left)/r.width)-.5)*8}px`);ref.current.style.setProperty('--py',`${(((e.clientY-r.top)/r.height)-.5)*8}px`);}} onPointerLeave={()=>{ref.current?.style.setProperty('--px','0px');ref.current?.style.setProperty('--py','0px');}}>
   <div className="home-lesson-card"><header><span><BookOpen/>{t('home.hero.lesson')}</span><span>3/5 <i/><i/><i/><i/><i/></span></header>
    <p className="home-example-label">{t('home.methode.example')}</p>
    <div className="home-lesson-question"><p>{t('home.hero.question')}</p><div className="home-example-answers"><Button variant="outline" className={answer?'chosen':''} aria-pressed={answer} onClick={()=>{setAnswer(true);setValidated(false);}}><CheckCircle2/>{t('home.hero.vrai')}</Button><Button variant="outline" className={!answer?'chosen':''} aria-pressed={!answer} onClick={()=>{setAnswer(false);setValidated(false);}}><span className="home-radio"/>{t('home.hero.faux')}</Button></div>
     <Button variant="interactive" onClick={()=>setValidated(true)} disabled={validated}>{t('home.hero.validate')}</Button>
     {validated&&<Button variant="ghost" size="icon" className="home-example-reset" aria-label="Recommencer l’exemple" onClick={()=>{setValidated(false);setAnswer(true);}}><RotateCcw/></Button>}
     <div className="home-explanation" aria-live="polite"><FileText/><p>{validated?(answer?t('home.hero.correct'):t('home.hero.review')):''}{t('home.hero.explanation')}</p></div>
    </div>
   </div>
   <div className="home-path-chip chip-institutions"><Landmark/><span>{t('home.hero.chip1')}</span><CheckCircle2/></div><div className="home-path-chip chip-rights"><Users/><span>{t('home.hero.chip2')}</span><span className="home-radio"/></div><div className="home-path-chip chip-democracy"><Star/><span>{t('home.hero.chip3')}</span></div><SafeImage className="home-stone-platform" src={stone.url} alt=""/><HeroCivi/>
  </div></div>
 </section>;
}
