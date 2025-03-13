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

  const batchSize = 8;
  const resolveInBatches = async (items: typeof list.blocks) => {
    let results: (string | null)[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(b => resolveYt(b.data).catch(() => null)));
      results.push(...batchResults);
    }
    return results.filter(url => url !== null);
  };

  const urls = await resolveInBatches(list.blocks.filter(b => b.type === 'mbrecording' && b.data.title));
  const ids = urls.map(url => url.split('v=', 2)[1]);

  if (ids.length === 0) {
    toast.create({ description: 'Error in finding tracks for the playlist, please retry', type: 'error' });
    return;
  }

  window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`, '_blank');
}
