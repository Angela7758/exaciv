import {useState,type ImgHTMLAttributes} from 'react';
import {ImageOff} from 'lucide-react';

/** Keeps the image's layout slot and meaningful alternative text on load failure. */
export function SafeImage(props:ImgHTMLAttributes<HTMLImageElement> & {fallbackSrc?:string}) {
  const [failedSource,setFailedSource]=useState<string>();
  const [failedFallback,setFailedFallback]=useState<string>();
  const {fallbackSrc,...imageProps}=props;
  const failed=failedSource===props.src;
  if(failed&&fallbackSrc&&fallbackSrc!==props.src&&failedFallback!==fallbackSrc)return <img {...imageProps} src={fallbackSrc} onError={()=>setFailedFallback(fallbackSrc)}/>;
  if(failed||!props.src)return <span className={`image-unavailable ${props.className??''}`} role="img" aria-label={props.alt||'Image indisponible'}><ImageOff aria-hidden="true"/><span>{props.alt||'Image indisponible'}</span></span>;
  return <img {...imageProps} onError={event=>{setFailedSource(props.src);props.onError?.(event);}}/>;
}