import {useEffect,useRef,useState} from 'react';

export function useDecorativeMotion(){
  const ref=useRef<HTMLDivElement>(null);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    let visible=true;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setPaused(!visible||document.hidden||reduced.matches);
    const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);update();}):undefined;
    observer?.observe(node);
    document.addEventListener('visibilitychange',update);
    reduced.addEventListener('change',update);
    update();
    return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);};
  },[]);
  return {ref,paused};
}