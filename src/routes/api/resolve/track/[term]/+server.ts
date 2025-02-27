import { json } from '@sveltejs/kit';
import { ytFirstVideoId } from '$lib/server/resolution';

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('resolver');

  if (type === 'yt') {
    let result = await ytFirstVideoId(params.term);
    if (result) {
      return json({ success: true, ytid: result });
    } else {
      return json({ success: false, error: 'Unable to find match' }, { status: 404 });
    }
  }

  return json({ success: false, error: 'Unknown resolver type' }, { status: 400 });
}
