import {createFileRoute} from '@tanstack/react-router';
import {NewPassword} from '@/components/learning/NewPassword';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/nouveau-mot-de-passe')({head:()=>seo('Créer un nouveau mot de passe','Retrouvez votre parcours ExaCiv avec un nouveau mot de passe sécurisé.'),component:NewPassword});
