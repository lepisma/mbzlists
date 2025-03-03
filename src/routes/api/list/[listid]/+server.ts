import db from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { create as createXML } from 'xmlbuilder2';
import { env } from '$env/dynamic/public';

async function generateXSPF(list) {
  let listURL = new URL(`/list/${list.viewId}`, env.PUBLIC_BASE_URL ?? 'https://mbzlists.com/');

  const root = createXML({ version: '1.0', encoding: 'UTF-8' })
    .ele('playlist', { version: '1', xmlns: 'http://xspf.org/ns/0' })
    .ele('title').txt(list.name).up()
    .ele('creator').txt('mbzlists').up()
    .ele('info').txt(listURL.href).up()
    .ele('date').txt(list.createdOn.toISOString()).up()
    .ele('tracklist');

  for (const block of list.blocks) {
    if (block.type === 'mbrecording') {
      root.ele('track')
        .ele('title').txt(block.data.title).up()
        .ele('creator').txt(block.data.artist.title).up()
        .ele('album').txt(block.data.release.title).up()
        .ele('info').txt(`https://musicbrainz.org/recording/${block.data.mbid}`).up()
        .ele('location').txt(`https://musicbrainz.org/recording/${block.data.mbid}`).up()
        .up();
    }
  }

  return root.up().up().end({ prettyPrint: true });
}

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'xspf') {
    const res: any = db.prepare('SELECT id, name, created_on, blocks FROM lists WHERE id = ?').get(params.listid);

    return new Response(await generateXSPF({
      ...res,
      viewId: res.id,
      blocks: JSON.parse(res.blocks),
      createdOn: new Date(res.created_on)
    }), {
      headers: {
        'Content-Type': 'application/xspf+xml',
        'Content-Disposition': `attachment; filename="${res.name}-${params.listid}.xspf"`
      }
    })
  }

  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, is_public, blocks FROM lists WHERE id = ?').get(params.listid);

  const list: any = {
    viewId: res.id,
    name: res.name,
    blocks: JSON.parse(res.blocks),
    createdOn: res.created_on,
    lastModifiedOn: res.last_modified_on,
    isPublic: res.is_public === 1,
  };

  return json(res ? list : {});
}
