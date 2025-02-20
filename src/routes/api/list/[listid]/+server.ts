import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const list = db.prepare('SELECT name, items FROM lists WHERE id = ?').get(params.listid);
  return json(list ? {...list, items: JSON.parse(list.items)} : {});
}
