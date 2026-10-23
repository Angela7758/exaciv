import {useState,type ImgHTMLAttributes} from 'react';

/** Keeps the image's layout slot and meaningful alternative text on load failure. */
export function SafeImage(props:ImgHTMLAttributes<HTMLImageElement>) {
  const [failed,setFailed]=useState(false);
  if(failed||!props.src)return <span className={`image-unavailable ${props.className??''}`} role="img" aria-label={props.alt||'Image indisponible'}>{props.alt||'Image indisponible'}</span>;
  return <img {...props} onError={event=>{setFailed(true);props.onError?.(event);}}/>;
}