import {createFileRoute} from '@tanstack/react-router';
import {PreparationMethod} from '@/components/site/PublicPreparation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/methode')({head:()=>seo('La méthode ExaCiv','Découvrir, s’entraîner, corriger et simuler : votre préparation en quatre étapes.'),component:Page});
function Page(){return <PreparationMethod/>;}
