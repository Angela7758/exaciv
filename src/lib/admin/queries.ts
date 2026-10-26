import {queryOptions} from '@tanstack/react-query';
import {adminAccess,adminData,adminQuestions,availableTests,adminOverviewData} from './admin.functions';
export const accessOptions=queryOptions({queryKey:['admin','access'],queryFn:()=>adminAccess()});
export const overviewOptions=(days:7|30|90=7)=>queryOptions({queryKey:['admin','fidelity-overview',days],queryFn:()=>adminOverviewData({data:{days}})});
export const questionsOptions=queryOptions({queryKey:['admin','questions'],queryFn:()=>adminQuestions()});
export const testsOptions=queryOptions({queryKey:['configured-tests'],queryFn:()=>availableTests()});
export const adminOptions=(section:'overview'|'questions'|'imports'|'tests'|'lessons'|'translations'|'media'|'users'|'reports'|'audit',days=7)=>queryOptions({queryKey:['admin',section,days],queryFn:()=>adminData({data:{section,days}})});
