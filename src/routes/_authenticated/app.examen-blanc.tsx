import {createFileRoute,Outlet} from '@tanstack/react-router';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc')({head:()=>seo('Examen-blanc','Votre espace personnel de préparation ExaCiv.'),component:Outlet});
