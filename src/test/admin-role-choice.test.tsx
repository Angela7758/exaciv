import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,describe,expect,it,vi} from 'vitest';
vi.mock('@/lib/admin/admin.functions',()=>({adminCommand:vi.fn(),uploadAdminMedia:vi.fn(),deleteAdminMedia:vi.fn()}));
vi.mock('@/lib/admin/queries',()=>({adminOptions:vi.fn(),questionsOptions:{}}));
vi.mock('@/components/admin/AdminQuestions',()=>({LiveBadges:()=>null}));
vi.mock('@/components/admin/LessonForm',()=>({LessonForm:()=>null}));
vi.mock('@tanstack/react-router',()=>({Link:({children,to}:{children:React.ReactNode;to:string})=><a href={to}>{children}</a>,Outlet:()=>null,useRouterState:()=>'/admin'}));
vi.mock('@/components/site/BrandLogo',()=>({BrandLogo:()=> <span>ExaCiv</span>}));
vi.mock('@/components/site/MobileDrawer',()=>({MobileDrawer:()=>null}));
import {RoleChoice} from '@/components/admin/AdminPages';
import {AdminFrame} from '@/components/admin/AdminShell';
afterEach(cleanup);
describe('Admin role choice',()=>{
 it('keeps the editor and reviewer frame without a language control',()=>{
  render(<AdminFrame roles={['editor','reviewer']}><p>Contenu administratif</p></AdminFrame>);
  expect(screen.queryByRole('combobox')).toBeNull();
  expect(screen.getByRole('link',{name:'Questions'})).toBeDefined();
  expect(screen.queryByRole('link',{name:'Comptes'})).toBeNull();
 });
 it('requires an explicit role selection instead of preselecting editor',()=>{
  render(<RoleChoice id="test-role" label="Rôle du compte sans rôle"/>);
  const choice=screen.getByRole('combobox') as HTMLSelectElement;
  expect(choice.value).toBe('');
  expect(choice.selectedOptions[0]?.value).toBe('');
  fireEvent.change(choice,{target:{value:'reviewer'}});
  expect(choice.value).toBe('reviewer');
 });
});