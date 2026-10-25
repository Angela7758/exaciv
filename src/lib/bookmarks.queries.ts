import {queryOptions} from '@tanstack/react-query';
import {getBookmarks} from './bookmarks.functions';
export const bookmarksOptions=queryOptions({queryKey:['bookmarks'],queryFn:()=>getBookmarks()});