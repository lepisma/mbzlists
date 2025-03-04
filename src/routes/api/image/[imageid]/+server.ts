import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  try {
    const { imageid } = params;
    const row = db.prepare('SELECT data, mime_type FROM images WHERE id = ?').get(imageid);

    if (!row) {
      return json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    return new Response(row.data, {
      headers: {
        'Content-Type': row.mime_type
      }
    });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
