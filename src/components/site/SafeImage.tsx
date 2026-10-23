import {useState,type ImgHTMLAttributes} from 'react';

/** Keeps the image's layout slot and meaningful alternative text on load failure. */
export function SafeImage(props:ImgHTMLAttributes<HTMLImageElement> & {fallbackSrc?:string}) {
  const [failed,setFailed]=useState(false);
  const {fallbackSrc,...imageProps}=props;
  if(failed&&fallbackSrc)return <img {...imageProps} src={fallbackSrc} onError={undefined}/>;
  if(failed||!props.src)return <span className={`image-unavailable ${props.className??''}`} role="img" aria-label={props.alt||'Image indisponible'}>{props.alt||'Image indisponible'}</span>;
  return <img {...imageProps} onError={event=>{setFailed(true);props.onError?.(event);}}/>;
}