import db from '$lib/server/db';
import { json } from '@sveltejs/kit';
import nodeCanvas from 'canvas';
import { JSDOM } from 'jsdom';
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

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'qr') {
    return new Response(await generateQrCode(params.listid), {
      headers: {
        'Content-Type': 'image/png'
      }
    });
  }

  const list = db.prepare('SELECT name, items FROM lists WHERE id = ?').get(params.listid);
  return json(list ? {...list, items: JSON.parse(list.items)} : {});
}
