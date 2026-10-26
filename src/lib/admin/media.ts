export const MEDIA_MAX_BYTES=3*1024*1024;
export const MEDIA_RIGHTS=['Créé pour ExaCiv','Licence libre (préciser)','Autorisation écrite'] as const;

// Content sniffing: the declared MIME type is never trusted on its own.
export function detectImageMime(head:Uint8Array):'image/png'|'image/jpeg'|'image/webp'|null{
 if(head.length>=8&&head[0]===0x89&&head[1]===0x50&&head[2]===0x4e&&head[3]===0x47&&head[4]===0x0d&&head[5]===0x0a&&head[6]===0x1a&&head[7]===0x0a)return 'image/png';
 if(head.length>=3&&head[0]===0xff&&head[1]===0xd8&&head[2]===0xff)return 'image/jpeg';
 if(head.length>=12&&head[0]===0x52&&head[1]===0x49&&head[2]===0x46&&head[3]===0x46&&head[8]===0x57&&head[9]===0x45&&head[10]===0x42&&head[11]===0x50)return 'image/webp';
 return null;
}

export function sanitizeMediaFilename(name:string):string{
 const base=name.split(/[\\/]/).pop()??'image';
 const clean=base.normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
 return clean||'image';
}

export interface MediaUploadInput {name:string;size:number;head:Uint8Array;alt:string;rights:string;}
export function validateMediaUpload(input:MediaUploadInput):string|null{
 if(!input.alt.trim())return 'Le texte alternatif est requis.';
 if(!input.rights.trim())return 'L’autorisation d’utilisation est requise.';
 if(input.size<=0)return 'Le fichier est vide.';
 if(input.size>MEDIA_MAX_BYTES)return 'Fichier trop volumineux (3 Mo maximum).';
 const ext=sanitizeMediaFilename(input.name).split('.').pop()??'';
 if(ext==='svg'||input.name.toLowerCase().endsWith('.svg'))return 'Les fichiers SVG ne sont pas acceptés.';
 if(!['png','jpg','jpeg','webp'].includes(ext))return 'Format non accepté : PNG, JPG ou WebP uniquement.';
 if(!detectImageMime(input.head))return 'Le contenu du fichier ne correspond pas à une image PNG, JPG ou WebP.';
 return null;
}
