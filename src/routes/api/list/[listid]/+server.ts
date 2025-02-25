import db from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { create as createXML } from 'xmlbuilder2';


async function generateXSPF(list) {
  const root = createXML({ version: '1.0', encoding: 'UTF-8' })
    .ele('playlist', { version: '1', xmlns: 'http://xspf.org/ns/0' })
    .ele('title').txt(list.name).up()
    .ele('creator').txt('mbzlists').up()
    .ele('info').txt(`https://mbzlists.com/list/${list.viewId}`).up()
    .ele('date').txt(list.createdOn.toISOString()).up()
    .ele('tracklist');

  for (const item of list.items) {
    root.ele('track')
      .ele('title').txt(item.title).up()
      .ele('creator').txt(item.artist.title).up()
      .ele('album').txt(item.release.title).up()
      .ele('info').txt(`https://musicbrainz.org/recording/${item.mbid}`).up()
      .ele('location').txt(`https://musicbrainz.org/recording/${item.mbid}`).up()
      .up();
  }

  return root.up().up().end({ prettyPrint: true });
}

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'xspf') {
    const res: any = db.prepare('SELECT id, name, created_on, items FROM lists WHERE id = ?').get(params.listid);

    return new Response(await generateXSPF({
      ...res,
      viewId: res.id,
      items: JSON.parse(res.items),
      createdOn: new Date(res.created_on)
    }), {
      headers: {
        'Content-Type': 'application/xspf+xml',
        'Content-Disposition': `attachment; filename="${res.name}-${params.listid}.xspf"`
      }
    })
  }

  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, description, cover_art, is_public, items FROM lists WHERE id = ?').get(params.listid);

  const list: any = {
    viewId: res.id,
    name: res.name,
    items: JSON.parse(res.items),
    createdOn: res.created_on,
    lastModifiedOn: res.last_modified_on,
    description: res.description,
    coverArt: res.cover_art,
    isPublic: res.is_public,
  };

  return json(res ? list : {});
}
