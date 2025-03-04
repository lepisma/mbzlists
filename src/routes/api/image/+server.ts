import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import db from '$lib/server/db';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return json({ success: 0, error: 'No image uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageId = uuidv4();
    const mimeType = file.type || 'application/octet-stream';

    db.prepare('INSERT INTO images (id, data, mime_type) VALUES (?, ?, ?)').run(imageId, buffer, mimeType);

    return json({
      success: 1,
      file: {
        url: `/api/image/${imageId}/`
      }
    });
  } catch (error) {
    return json({ success: 0, error: error.message }, { status: 500 });
  }
}
