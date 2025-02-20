import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const list = db.prepare('SELECT id, name, items FROM lists WHERE edit_id = ?').get(params.editid);
  return json(list ? { ...list, items: JSON.parse(list.items) } : {});
}

export async function POST({ params, request }) {
  const { listid, items, name } = await request.json();
  db.prepare('INSERT INTO lists (id, edit_id, name, items) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = ?, items = ?')
    .run(listid, params.editid, name, JSON.stringify(items), name, JSON.stringify(items));
  return json({ success: true });
}

export async function DELETE({ params }) {
  return json({ success: false });
}
