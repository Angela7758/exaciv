import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';

export function LessonIllustration({lessonId}: {lessonId: string}) {
  const illustration = LESSON_ILLUSTRATIONS[lessonId];
  if (!illustration) return null;
  return <figure className="lesson-illustration" lang="fr" dir="ltr">
    <img src={illustration.src} alt={illustration.alt} width={1376} height={768} decoding="async" />
  </figure>;
}