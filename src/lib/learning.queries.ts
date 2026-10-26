import { queryOptions } from '@tanstack/react-query';
import { getCatalogue,getLearning } from './learning.functions';
import { lessonHeroMedia } from './admin/admin.functions';
export const lessonHeroOptions=(lessonId:string)=>queryOptions({queryKey:['lesson-hero',lessonId],queryFn:()=>lessonHeroMedia({data:{lessonId}}),staleTime:1800000});
export const catalogueOptions=queryOptions({queryKey:['catalogue'],queryFn:()=>getCatalogue(),staleTime:300000});
export const learningOptions=queryOptions({queryKey:['learning'],queryFn:()=>getLearning()});

export const freeCatalogueOptions=queryOptions({queryKey:['free-catalogue'],queryFn:()=>getCatalogue({data:{freeTest:true}}),staleTime:300000});

export const reviewLearningOptions=queryOptions({queryKey:['review-learning'],queryFn:()=>getLearning({data:{concealCorrections:true}})});
export const reviewCatalogueOptions=queryOptions({queryKey:['review-catalogue'],queryFn:()=>getCatalogue({data:{concealCorrections:true}})});
