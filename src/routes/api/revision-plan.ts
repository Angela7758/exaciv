import {createFileRoute} from '@tanstack/react-router';
export const Route=createFileRoute('/api/revision-plan')({server:{handlers:{POST:async({request})=>{
 const {handleRevisionPlan}=await import('@/lib/ai/revision-plan.server');
 return handleRevisionPlan(request);
}}}});