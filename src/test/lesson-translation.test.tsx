import {afterEach,describe,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import {LessonTranslation} from '@/components/learning/LessonTranslation';
const mocks=vi.hoisted(()=>({translate:vi.fn(),speech:vi.fn()}));
vi.mock('@tanstack/react-start',()=>({useServerFn:(fn:unknown)=>fn}));
vi.mock('@/lib/translate.functions',()=>({translateQuestionTexts:mocks.translate}));
vi.mock('@/lib/i18n/internal',()=>({useUiT:()=>((text:string)=>text)}));
vi.mock('@/lib/speech',()=>({streamSpeech:mocks.speech}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
describe('Traduction séparée des leçons',()=>{
 it('ne réutilise pas une traduction pour une autre source française',async()=>{
  mocks.translate.mockResolvedValueOnce({translations:['First passage']}).mockResolvedValueOnce({translations:['Second passage']});
  const result=render(<LessonTranslation text="Premier passage" helpLocale="en"/>);
  fireEvent.click(screen.getByRole('button',{name:'Traduire'}));
  await screen.findByText('First passage');
  result.rerender(<LessonTranslation text="Deuxième passage" helpLocale="en"/>);
  expect(screen.queryByText('First passage')).toBeNull();
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'fr'}});
  expect(screen.getByText('Deuxième passage')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'en'}});
  await screen.findByText('Second passage');
  expect(mocks.translate).toHaveBeenLastCalledWith({data:{texts:['Deuxième passage'],target:'en'}});
 });
 it('signale un résultat absent au lieu de présenter le français comme traduction',async()=>{
  mocks.translate.mockResolvedValue({translations:[]});
  render(<LessonTranslation text="Source française" helpLocale="en"/>);
  fireEvent.click(screen.getByRole('button',{name:'Traduire'}));
  await screen.findByRole('alert');
  expect(screen.queryByText('Source française')).toBeNull();
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'fr'}});
  await waitFor(()=>expect(screen.queryByRole('alert')).toBeNull());
  expect(screen.getByText('Source française')).toBeInTheDocument();
 });
});