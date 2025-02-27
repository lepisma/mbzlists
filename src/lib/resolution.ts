import type { Song } from '$lib/types';

export async function resolveYt(song: Song): Promise<string | null> {
  let res = await fetch(`/api/resolve/track?resolver=youtube&title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist.title)}`);
  let data = await res.json();

  return data.success ? `https://youtube.com/watch?v=${data.id}` : null;
}

export async function resolveSpotify(song: Song): Promise<string | null> {
  let res = await fetch(`/api/resolve/track?resolver=spotify&title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist.title)}`);
  let data = await res.json();

  return data.success ? `https://open.spotify.com/track/${data.id}` : null;
}
