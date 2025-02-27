// Basic content resolution utilities

import yts from 'yt-search';

export async function ytFirstVideoId(search: string): Promise<string | null> {
  let r = await yts(search);
  return r.videos ? r.videos[0].videoId : null;
}
