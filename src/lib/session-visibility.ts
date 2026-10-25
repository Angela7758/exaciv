import {recordedAnswer,type LearningSession} from './sessions';
/** Keep the persisted snapshot intact; project only the allowed correction into browser responses. */
export function learnerSession(s:LearningSession):LearningSession{
 return {...s,questions:s.questions.map((q,i)=>{
  const reveal=Boolean(s.completed_at)||(s.kind!=='exam'&&s.test_rules?.correction!=='fin'&&s.test_rules?.instant_feedback!==false&&recordedAnswer(s,i)!==undefined);
  if(reveal)return q;
  return {id:q.id,theme:q.theme,exam_theme:q.exam_theme,question:q.question,options:q.options,option_ids:q.option_ids,question_type:q.question_type,classification_reviewed_at:q.classification_reviewed_at,content_revision:q.content_revision,lesson_id:q.lesson_id,answer:-1,explanation:'',source:'',source_url:null};
 })};
}