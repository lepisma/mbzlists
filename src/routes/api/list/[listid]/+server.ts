import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const list = db.prepare('SELECT items FROM lists WHERE id = ?').get(params.listid);
  return json(list ? JSON.parse(list.items) : []);
}

export async function POST({ params, request }) {
  const { items } = await request.json();
  db.prepare('INSERT INTO lists (id, items) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET items = ?')
    .run(params.listid, JSON.stringify(items), JSON.stringify(items));
  return json({ success: true });
}
