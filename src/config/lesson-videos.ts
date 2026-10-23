import devise from '@/assets/videos/lesson-devise.mp4.asset.json';
import laicite from '@/assets/videos/lesson-laicite.mp4.asset.json';
import parlement from '@/assets/videos/lesson-parlement.mp4.asset.json';
import president from '@/assets/videos/lesson-president.mp4.asset.json';
import vote from '@/assets/videos/lesson-vote.mp4.asset.json';
import symboles from '@/assets/videos/lesson-symboles.mp4.asset.json';
import egalite from '@/assets/videos/lesson-egalite.mp4.asset.json';

// Archive only: editorial animations with an unverified AAC audio track, not verified teaching videos.
export const LESSON_VIDEO_INVENTORY = [
 {lessonId:'devise',title:'La devise de la République',url:devise.url},
 {lessonId:'laicite',title:'La laïcité',url:laicite.url},
 {lessonId:'parlement',title:'Le rôle du Parlement',url:parlement.url},
 {lessonId:'president',title:'Le Président de la République',url:president.url},
 {lessonId:'vote',title:'Le droit de vote',url:vote.url},
 {lessonId:'symboles',title:'Les symboles de la République',url:symboles.url},
 {lessonId:'egalite',title:'L’égalité',url:egalite.url},
].map(video=>({...video,source:'Animation éditoriale issue de l’illustration (origine déclarée)',language:'Non vérifiée (piste AAC présente)',contentVerified:false,rightsVerified:false}));
export const LESSON_VIDEOS: Record<string,string> = {};
