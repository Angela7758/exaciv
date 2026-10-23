import {describe,expect,it} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {I18nProvider,useI18n} from '@/lib/i18n';

function Consumer(){
  const {t,setLocale}=useI18n();
  return <button onClick={()=>setLocale('pt')}>{t('home.cta.button')}</button>;
}

describe('Shared locale provider',()=>{
  it('keeps consumers connected across updates and restores the browser language',()=>{
    localStorage.removeItem('exaciv-locale');
    const view=render(<I18nProvider><Consumer/></I18nProvider>);
    fireEvent.click(screen.getByRole('button',{name:'Faire un test gratuit'}));
    expect(localStorage.getItem('exaciv-locale')).toBe('pt');
    view.rerender(<I18nProvider><Consumer/></I18nProvider>);
    expect(screen.getByRole('button',{name:'Fazer um teste gratuito'})).toBeDefined();
    cleanup();
    render(<I18nProvider><Consumer/></I18nProvider>);
    expect(screen.getByRole('button',{name:'Fazer um teste gratuito'})).toBeDefined();
    cleanup();
    localStorage.removeItem('exaciv-locale');
  });
});