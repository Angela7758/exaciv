import {queryOptions} from '@tanstack/react-query';
import {getMastery,getReviewBatch} from './review.functions';
export const reviewQuestionsOptions=(question?:string)=>queryOptions({queryKey:['review-questions',question??'batch'],queryFn:()=>getReviewBatch({data:question?{question}:{}}),staleTime:Infinity});
export const masteryOptions=queryOptions({queryKey:['mastery'],queryFn:()=>getMastery()});