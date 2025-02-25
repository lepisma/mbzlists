import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({ params, request }) {
  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, description, cover_art, is_public FROM lists WHERE is_public = TRUE').all();

  if (res) {
    return json(res.map((row) => {
      return {
        viewId: row.id,
        name: row.name,
        createdOn: row.created_on,
        lastModifiedOn: row.last_modified_on,
        description: row.description,
        coverArt: row.cover_art,
        isPublic: row.is_public === 1,
      }
    }));
  } else {
    return json([]);
  }
}
