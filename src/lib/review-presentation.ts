import type {SessionQuestion} from './sessions';
export function concealedReviewQuestion(q:SessionQuestion){
 const {answer,explanation,source,source_url,correct_option_id,...safe}=q;
 return safe;
}
export function reviewNavigation(index:number,total:number){return Math.min(index+1,total);}