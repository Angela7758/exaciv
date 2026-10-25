import {useState} from 'react';
import {useSuspenseQuery,useQueryClient} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {Bookmark} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {bookmarksOptions} from '@/lib/bookmarks.queries';
import {setBookmark} from '@/lib/bookmarks.functions';
import {useUiT} from '@/lib/i18n/internal';
export function BookmarkButton({kind,itemId,iconOnly=false}:{kind:'question'|'lesson';itemId:string;iconOnly?:boolean}){
 const ui=useUiT();const {data:rows}=useSuspenseQuery(bookmarksOptions);const qc=useQueryClient();const save=useServerFn(setBookmark);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const active=rows.some(r=>r.kind===kind&&r.item_id===itemId);
 return <><Button type="button" size="sm" variant="outline" disabled={busy} aria-pressed={active} aria-label={ui('À revoir')} title={ui('À revoir')} className="fidelity-bookmark" onClick={async()=>{setBusy(true);setError('');try{await save({data:{kind,itemId,active:!active}});await qc.invalidateQueries({queryKey:['bookmarks']});}catch{setError(ui('Le marqueur n’a pas été enregistré. Réessayez.'));}finally{setBusy(false);}}}><Bookmark fill={active?'currentColor':'none'}/>{!iconOnly&&ui('À revoir')}</Button>{error&&<p role="alert">{error}</p>}</>;
}