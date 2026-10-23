import {useEffect, type ReactNode} from 'react';
import {Menu} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from '@/components/ui/sheet';

export function MobileDrawer({open,onOpenChange,label,children,id}:{open:boolean;onOpenChange:(open:boolean)=>void;label:string;children:ReactNode;id:string}){
  useEffect(()=>{
    const query=window.matchMedia('(min-width: 1024px)');
    const close=()=>{if(query.matches)onOpenChange(false);};
    query.addEventListener('change',close);
    return ()=>query.removeEventListener('change',close);
  },[onOpenChange]);
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild><Button variant="ghost" size="icon" className="mobile-menu-trigger" aria-label={label} aria-expanded={open} aria-controls={id}><Menu/></Button></SheetTrigger>
    <SheetContent id={id} className="mobile-drawer" aria-describedby={undefined}>
      <SheetTitle className="mobile-drawer-title">{label}</SheetTitle>
      <div className="mobile-drawer-scroll">{children}</div>
    </SheetContent>
  </Sheet>;
}