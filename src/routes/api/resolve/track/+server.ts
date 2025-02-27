import { json } from '@sveltejs/kit';
import { ytFirstVideoId, spotifyTrackId } from '$lib/server/resolution';

export async function GET({ request }) {
  const url = new URL(request.url);
  const resolver = url.searchParams.get('resolver');
  const title = url.searchParams.get('title');
  const artist = url.searchParams.get('artist');

  if (!(title && artist)) {
    return json({ success: false, error: 'Missing argument' }, { status: 404 });
  }

  let fn: (title: string, artist: string) => Promise<string | null>;

  if (resolver === 'youtube') {
    fn = ytFirstVideoId;
  } else if (resolver == 'spotify') {
    fn = spotifyTrackId;
  } else {
    return json({ success: false, error: 'Unknown resolver type' }, { status: 400 });
  }

  let result = await fn(title, artist);

  if (result) {
    return json({ success: true, id: result });
  } else {
    return json({ success: false, error: 'Unable to find match' }, { status: 404 });
  }
}
