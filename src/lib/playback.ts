import type { Song, List } from '$lib/types';
import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
import { resolveYt, resolveSpotify } from '$lib/resolution';

export async function playTrackOnYt(song: Song, toast: ToastContext) {
  toast.create({ description: 'Started YouTube search!' });
  let ytURL = await resolveYt(song);
  if (ytURL) {
    window.open(ytURL, '_blank');
  } else {
    toast.create({ type: 'error', description: `Not able to find the song ${song.title} on YouTube` });
  }
}

export async function playTrackOnSpotify(song: Song, toast: ToastContext) {
  toast.create({ description: 'Started Spotify search!' });
  let spURL = await resolveSpotify(song);
  if (spURL) {
    window.open(spURL, '_blank');
  } else {
    toast.create({ type: 'error', description: `Not able to find the song ${song.title} on Spotify` });
  }
}

export async function playListOnYt(list: List, toast: ToastContext) {
  // This uses the comma hack to create a temporary playlist. A problem with
  // this approach is that the URL length is going to set an upper bound on the
  // length of the playlist.

  toast.create({ description: 'Finding tracks and creating a playlist, it might take some time' });
  const urls = await Promise.all(list.blocks.filter(b => b.type === 'mbrecording').map(b => b.data).map(resolveYt));
  const ids = urls.filter(url => url != null).map(url => url.split('v=', 2)[1]);

  window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`, '_blank');
}
