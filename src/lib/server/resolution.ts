// Basic content resolution utilities

import yts from 'yt-search';
import pMemoize from 'p-memoize';

async function ytFirstVideoIdInt(search: string): Promise<string | null> {
  let r = await yts(search);
  return r.videos ? r.videos[0].videoId : null;
}

export const ytFirstVideoId = pMemoize(ytFirstVideoIdInt);
