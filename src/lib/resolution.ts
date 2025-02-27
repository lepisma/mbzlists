import type { Song } from '$lib/types';

export async function resolveYt(song: Song): Promise<string | null> {
  let term = encodeURIComponent(song.title + ' ' + song.artist.title);
  let res = await fetch(`/api/resolve/track/${term}?resolver=yt`);
  let data = await res.json();

  return data.success ? `https://youtube.com/watch?v=${data.ytid}` : null;
}
