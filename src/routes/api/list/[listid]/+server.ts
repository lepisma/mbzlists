import db from '$lib/server/db';
import type { List } from '$lib/types';
import { json } from '@sveltejs/kit';
import nodeCanvas from 'canvas';
import { JSDOM } from 'jsdom';
import { create as createXML } from 'xmlbuilder2';

import QRCodeStyling from 'qr-code-styling';

async function generateQrCode(viewId: string) {
  let qrCode = new QRCodeStyling({
    jsdom: JSDOM,
    nodeCanvas: nodeCanvas,
    width: 300,
    height: 300,
    data: `https://mbzlists.com/list/${viewId}`,
    // TODO: This needs fixing
    image: './static/mb-logo.png',
    dotsOptions: {
      color: '#bb4590',
      type: 'rounded'
    },
    cornersDotOptions: {
      color: '#ec7538'
    },
    cornersSquareOptions: {
      color: '#ec7538'
    },
    backgroundOptions: {
      color: 'transparent'
    },
  });

  return await qrCode.getRawData('png');
}

async function generateXSPF(list: List) {
  const root = createXML({ version: '1.0', encoding: 'UTF-8' })
    .ele('playlist', { version: '1', xmlns: 'http://xspf.org/ns/0' })
    .ele('title').txt(list.name).up()
    .ele('creator').txt('mbzlists').up()
    .ele('info').txt(`https://mbzlists.com/list/${list.viewId}`).up()
    .ele('tracklist');

  for (const item of list.items) {
    root.ele('track')
      .ele('title').txt(item.title).up()
      .ele('creator').txt(item.artist).up()
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

  if (type === 'qr') {
    return new Response(await generateQrCode(params.listid), {
      headers: {
        'Content-Type': 'image/png'
      }
    });
  } else if (type === 'xspf') {
    const list = db.prepare('SELECT id, name, items FROM lists WHERE id = ?').get(params.listid);
    return new Response(await generateXSPF({...list, viewId: list.id, items: JSON.parse(list.items)}), {
      headers: {
        'Content-Type': 'application/xspf+xml',
        'Content-Disposition': `attachment; filename="${list.name}-${params.listid}.xspf"`
      }
    })
  }

  const list = db.prepare('SELECT name, items FROM lists WHERE id = ?').get(params.listid);
  return json(list ? {...list, items: JSON.parse(list.items)} : {});
}
