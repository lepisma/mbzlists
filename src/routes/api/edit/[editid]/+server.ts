import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, items FROM lists WHERE edit_id = ?').get(params.editid);
  const list: any = {
    editId: params.editid,
    viewId: res.id,
    name: res.name,
    items: JSON.parse(res.items),
    createdOn: res.created_on,
    lastModifiedOn: res.last_modified_on,
  };

  return json(res ? list : {});
}

export async function POST({ params, request }) {
  const { listid, items, name, lastModifiedOn, createdOn } = await request.json();
  let itemsString = JSON.stringify(items);

  db.prepare('INSERT INTO lists (id, edit_id, name, items, created_on, last_modified_on) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = ?, items = ?, last_modified_on = ?')
    .run(
      listid,
      params.editid,
      name,
      itemsString,
      createdOn,
      lastModifiedOn,
      name,
      itemsString,
      lastModifiedOn
    );
  return json({ success: true });
}

export async function DELETE({ params }) {
  try {
    db.prepare('DELETE FROM lists WHERE edit_id = ?').run(params.editid);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
