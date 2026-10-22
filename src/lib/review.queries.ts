import {queryOptions} from '@tanstack/react-query';
import {getMastery} from './review.functions';
export const masteryOptions=queryOptions({queryKey:['mastery'],queryFn:()=>getMastery()});