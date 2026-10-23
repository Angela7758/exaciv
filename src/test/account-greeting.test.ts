import {expect,it} from 'vitest';
import {greetingName} from '@/components/learning/AccountGreeting';
it('greets the actual first name',()=>{expect(greetingName('  Amina Martin ')).toBe('Bonjour Amina !');});
it('omits an absent name',()=>{expect(greetingName('  ')).toBe('Bonjour !');});