import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,describe,expect,it,vi} from 'vitest';
vi.mock('@/lib/admin/admin.functions',()=>({adminCommand:vi.fn(),uploadAdminMedia:vi.fn(),deleteAdminMedia:vi.fn()}));
vi.mock('@/lib/admin/queries',()=>({adminOptions:vi.fn(),questionsOptions:{}}));
vi.mock('@/components/admin/AdminQuestions',()=>({LiveBadges:()=>null}));
vi.mock('@/components/admin/LessonForm',()=>({LessonForm:()=>null}));
import {RoleChoice} from '@/components/admin/AdminPages';
afterEach(cleanup);
describe('Admin role choice',()=>{
 it('requires an explicit role selection instead of preselecting editor',()=>{
  render(<RoleChoice id="test-role" label="Rôle du compte sans rôle"/>);
  const choice=screen.getByRole('combobox') as HTMLSelectElement;
  expect(choice.value).toBe('');
  expect(choice.selectedOptions[0]?.value).toBe('');
  fireEvent.change(choice,{target:{value:'reviewer'}});
  expect(choice.value).toBe('reviewer');
 });
});