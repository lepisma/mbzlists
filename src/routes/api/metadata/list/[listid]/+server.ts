import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, is_public FROM lists WHERE id = ?').get(params.listid);

  if (res) {
    return json({
      viewId: res.id,
      name: res.name,
      createdOn: res.created_on,
      lastModifiedOn: res.last_modified_on,
      isPublic: res.is_public === 1,
    });
  } else {
    return json({ success: false, error: 'Not found' },  { status: 404 });
  }
}
