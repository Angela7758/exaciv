import {SafeImage} from '@/components/site/SafeImage';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';
import {LESSON_IMAGE_MESSAGES} from '@/config/lesson-illustration-translations';
import {useI18n} from '@/lib/i18n';
import {useUiT} from '@/lib/i18n/internal';
import {resolveContentMessage} from '@/lib/i18n/content';
import {Maximize2} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';

export function LessonIllustration({lessonId}:{lessonId:string}) {
  const {locale} = useI18n();
  const ui = useUiT();
  const [zoom, setZoom] = useState(false);
  const illustration = LESSON_ILLUSTRATIONS[lessonId];
  if (!illustration) return null;
  const description = resolveContentMessage(locale, illustration.alt, LESSON_IMAGE_MESSAGES);
  return <figure className="lesson-illustration" lang={description.fallback ? 'fr' : locale}>
    <Button variant="ghost" type="button" className="lesson-illustration-trigger" onClick={() => setZoom(true)} aria-label={ui("Agrandir l'image")}>
      <SafeImage src={illustration.src} alt={description.text} width={1376} height={768} decoding="async" />
      <span className="lesson-illustration-zoom"><Maximize2 aria-hidden="true"/>{ui("Agrandir l'image")}</span>
    </Button>
    <Dialog open={zoom} onOpenChange={setZoom}>
      <DialogContent className="lesson-illustration-lightbox">
        <DialogTitle lang={description.fallback ? 'fr' : locale}>{description.text}</DialogTitle>
        <SafeImage src={illustration.src} alt={description.text} width={1376} height={768} decoding="async" />
      </DialogContent>
    </Dialog>
    <figcaption className="lesson-text-link"><Button asChild variant="outline"><a href="#lesson-text">Lire la leçon</a></Button></figcaption>
  </figure>;
}
