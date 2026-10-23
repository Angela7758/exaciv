import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';
import {LESSON_IMAGE_MESSAGES} from '@/config/lesson-illustration-translations';
import {useI18n} from '@/lib/i18n';
import {resolveContentMessage} from '@/lib/i18n/content';

export function LessonIllustration({lessonId}: {lessonId: string}) {
  const {locale} = useI18n();
  const illustration = LESSON_ILLUSTRATIONS[lessonId];
  if (!illustration) return null;
  const description = resolveContentMessage(locale, illustration.alt, LESSON_IMAGE_MESSAGES);
  return <figure className="lesson-illustration" lang={description.fallback ? 'fr' : locale}>
    <img src={illustration.src} alt={description.text} width={1376} height={768} decoding="async" />
  </figure>;
}