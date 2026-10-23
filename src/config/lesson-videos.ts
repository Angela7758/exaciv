import devise from '@/assets/videos/lesson-devise.mp4.asset.json';
import laicite from '@/assets/videos/lesson-laicite.mp4.asset.json';
import parlement from '@/assets/videos/lesson-parlement.mp4.asset.json';
import president from '@/assets/videos/lesson-president.mp4.asset.json';
import vote from '@/assets/videos/lesson-vote.mp4.asset.json';
import symboles from '@/assets/videos/lesson-symboles.mp4.asset.json';
import egalite from '@/assets/videos/lesson-egalite.mp4.asset.json';

// Short silent animated clips derived from each lesson illustration (editorial, not lesson content).
export const LESSON_VIDEOS: Record<string, string> = {
  devise: devise.url, laicite: laicite.url, parlement: parlement.url, president: president.url,
  vote: vote.url, symboles: symboles.url, egalite: egalite.url,
};
