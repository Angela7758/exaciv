import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {bookmarkInput} from './bookmarks';
export const getBookmarks=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const r=await context.supabase.from('learning_bookmarks').select('kind,item_id,created_at').eq('user_id',context.userId).order('created_at',{ascending:false});
 if(r.error)throw new Error('Marqueurs indisponibles.');
 return r.data.map(row=>({...row,kind:bookmarkInput.shape.kind.parse(row.kind)}));
});
export const setBookmark=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(bookmarkInput).handler(async({data,context})=>{
 const db=context.supabase;
 const r=data.active?await db.from('learning_bookmarks').upsert({user_id:context.userId,kind:data.kind,item_id:data.itemId},{onConflict:'user_id,kind,item_id',ignoreDuplicates:true}):await db.from('learning_bookmarks').delete().eq('user_id',context.userId).eq('kind',data.kind).eq('item_id',data.itemId);
 if(r.error)throw new Error('Le marqueur n’a pas été enregistré. Réessayez.');
 return {success:true};
});