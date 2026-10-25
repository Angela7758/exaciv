import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {QuestionAids} from '@/components/learning/QuestionAids';
import {QUESTION_HELP_LOCALES,localQuestionTranslation,visibleQuestionTexts} from '@/lib/question-aids';

const mocks=vi.hoisted(()=>({translate:vi.fn(),save:vi.fn(),speech:vi.fn((_text:string,_lang:string,_signal:AbortSignal)=>new Promise<void>(()=>{}))}));
vi.mock('@tanstack/react-start',()=>({useServerFn:(fn:unknown)=>fn}));
vi.mock('@/lib/translate.functions',()=>({translateQuestionTexts:mocks.translate}));
vi.mock('@/lib/account-settings.functions',()=>({saveHelpPreference:mocks.save}));
vi.mock('@/lib/i18n/internal',()=>({useUiT:()=>((text:string)=>text)}));
vi.mock('@/lib/speech',()=>({streamSpeech:mocks.speech}));
const source={questionId:'president',question:'Pour combien d’années le Président de la République est-il élu ?',options:['4 ans','5 ans','7 ans','10 ans'],helpEnabled:true,helpLocale:'fr'};
afterEach(()=>{cleanup();vi.clearAllMocks();});
describe('Question assistance rules',()=>{
 it('does not open help automatically for a saved non-French help language',()=>{render(<QuestionAids {...source} helpLocale="zh"/>);expect(screen.queryByRole('combobox')).toBeNull();expect(mocks.translate).not.toHaveBeenCalled();});
 it('offers exactly the six requested languages without Portuguese',()=>{
  expect(QUESTION_HELP_LOCALES.map(l=>l.label)).toEqual(['Français','中文','English','العربية','Español','Русский']);
 });
 it('retains French order and excludes unrevealed explanations',()=>{
  expect(visibleQuestionTexts('Question',['A','B'])).toEqual(['Question','A','B']);
  expect(visibleQuestionTexts('Question',['A','B'],'Correction')).toEqual(['Question','A','B','Correction']);
 });
 it('returns French source directly',()=>{expect(localQuestionTranslation('fr',['Question','A','B'])).toEqual(['Question','A','B']);});
 it('opens and closes French without translation service',()=>{
  render(<QuestionAids {...source}/>);expect(screen.queryByText(source.question)).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Traduire'}));
  expect(screen.getByText(source.question)).toBeInTheDocument();expect(mocks.translate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Masquer la traduction'}));expect(screen.queryByText(source.question)).toBeNull();
 });
 it('hides the translation entry and restores it from the account preference',()=>{
  const r=render(<QuestionAids {...source} helpEnabled={false}/>);expect(screen.queryByRole('button',{name:'Traduire'})).toBeNull();
  r.rerender(<QuestionAids {...source}/>);expect(screen.getByRole('button',{name:'Traduire'})).toBeInTheDocument();
 });
 it('only saves help locale, keeps ordered translations and never sends the hidden correction',async()=>{
  mocks.save.mockResolvedValue({success:true});mocks.translate.mockResolvedValue({translations:['中文问题','甲','乙','丙','丁']});
  render(<QuestionAids {...source}/>);fireEvent.click(screen.getByRole('button',{name:'Traduire'}));
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'zh'}});
  await waitFor(()=>expect(screen.getByText('中文问题')).toBeInTheDocument());
  expect(mocks.save).toHaveBeenCalledWith({data:{help_locale:'zh'}});
  expect(mocks.translate).toHaveBeenCalledWith({data:{texts:[source.question,...source.options],target:'zh'}});
  expect(screen.getAllByRole('listitem').map(l=>l.textContent)).toEqual(['甲','乙','丙','丁']);
 });
 it('always reads the primary source in French and aborts on question change',()=>{
  const r=render(<QuestionAids {...source} helpLocale="ar"/>);fireEvent.click(screen.getByRole('button',{name:'Écouter'}));
  expect(mocks.speech).toHaveBeenCalledWith([source.question,...source.options].join('. '),'fr',expect.any(AbortSignal));
  const signal=mocks.speech.mock.calls[0]?.[2] as AbortSignal|undefined;
  r.rerender(<QuestionAids {...source} questionId="next"/>);expect(signal?.aborted).toBe(true);
 });
});