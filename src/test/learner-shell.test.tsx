import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {describe,expect,it,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';

vi.mock('@tanstack/react-router',()=>{
  const state={location:{pathname:'/app',href:'/app',search:{}}};
  return {
    Link:({to,children,...rest}:{to:string;children:React.ReactNode;[k:string]:unknown})=>{const {search,activeOptions,activeProps,...rest2}=rest;return <a href={to} {...rest2}>{children}</a>;},
    Outlet:()=><div data-testid="outlet"/>,
    useRouterState:({select}:{select?:(s:typeof state)=>unknown})=>select?select(state):state,
    useNavigate:()=>async()=>undefined,
  };
});
vi.mock('@tanstack/react-start',()=>({useServerFn:(fn:unknown)=>fn}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{signOut:async()=>({error:null})}}}));
vi.mock('@/lib/learning.functions',()=>({saveLocale:async()=>{},updateProfile:async()=>({})}));
const profile={display_name:'Test',locale:'fr',parcours:'naturalisation',avatar_url:null};
vi.mock('@/lib/learning.queries',()=>({
  catalogueOptions:{queryKey:['catalogue'],queryFn:async()=>({lessons:[]})},
  learningOptions:{queryKey:['learning'],queryFn:async()=>({profile,completions:[]})},
  reviewLearningOptions:{queryKey:['review-learning'],queryFn:async()=>({profile,completions:[]})},
  reviewCatalogueOptions:{queryKey:['review-catalogue'],queryFn:async()=>({lessons:[]})},
}));
vi.mock('@/lib/session.queries',()=>({sessionOptions:()=>({queryKey:['session'],queryFn:async()=>null})}));
vi.mock('@/lib/admin/queries',()=>({accessOptions:{queryKey:['admin','access'],queryFn:async()=>['admin']}}));

import {AppShell} from '@/components/learning/AppShell';
import {I18nProvider} from '@/lib/i18n';

function Shell(){
  const qc=new QueryClient({defaultOptions:{queries:{retry:false}}});
  qc.setQueryData(['learning'],{profile,completions:[]});
  qc.setQueryData(['catalogue'],{lessons:[]});
  qc.setQueryData(['admin','access'],['admin']);
  return <QueryClientProvider client={qc}><I18nProvider><AppShell/></I18nProvider></QueryClientProvider>;
}

describe('Learner shell',()=>{
  it('renders the learner space for a user with an admin role without any /admin link',async()=>{
    render(<Shell/>);
    expect(screen.getByRole('link',{name:/Mon compte/})).toBeDefined();
    expect(screen.queryByRole('link',{name:/Administration/})).toBeNull();
    expect(document.querySelector('a[href="/admin"]')).toBeNull();
    cleanup();
  });
  it('keeps the learner destinations and the logout action',async()=>{
    render(<Shell/>);
    expect(screen.getByRole('link',{name:/ExaCiv – mon espace/})).toBeDefined();
    expect(screen.getByRole('link',{name:/Abonnement/})).toBeDefined();
    expect(screen.getByRole('link',{name:/Aide/})).toBeDefined();
    expect(screen.getByRole('button',{name:/Se déconnecter/})).toBeDefined();
    cleanup();
  });
});
