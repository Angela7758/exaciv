import {describe,it,expect,vi} from 'vitest';
vi.mock('@/integrations/supabase/client',()=>({supabase:{}}));
import {validateNewPassword} from '@/lib/password-recovery';
import {mobileDestination} from '@/components/learning/MobileNavigation';
describe('batch two rules',()=>{
 it('requires at least eight password characters',()=>{expect(validateNewPassword('1234567','1234567').password).not.toBe('');expect(validateNewPassword('12345678','12345678').password).toBe('');});
 it('requires matching password confirmation',()=>{expect(validateNewPassword('12345678','87654321').confirmation).not.toBe('');expect(validateNewPassword('12345678','12345678').confirmation).toBe('');});
 it('practice keeps the practice destination active',()=>expect(mobileDestination('/app/entrainement/session/abc')).toBe('practice'));
 it('dashboard keeps home active',()=>expect(mobileDestination('/app')).toBe('home'));
});
