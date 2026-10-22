import { queryOptions } from '@tanstack/react-query';
import { getCatalogue,getLearning } from './learning.functions';
export const catalogueOptions=queryOptions({queryKey:['catalogue'],queryFn:()=>getCatalogue(),staleTime:300000});
export const learningOptions=queryOptions({queryKey:['learning'],queryFn:()=>getLearning()});
