import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, is_public, blocks FROM lists WHERE edit_id = ?').get(params.editid);

  if (res) {
    return json({
      editId: params.editid,
      viewId: res.id,
      name: res.name,
      blocks: JSON.parse(res.blocks),
      createdOn: res.created_on,
      lastModifiedOn: res.last_modified_on,
      isPublic: res.is_public === 1,
    });
  } else {
    return json({ success: false }, { status: 500 });
  }
}

export async function POST({ params, request }) {
  const { viewId, blocks, name, lastModifiedOn, createdOn, isPublic } = await request.json();

  let fields = 'id, edit_id, name, blocks, created_on, last_modified_on, is_public';
  let valuesString = '?, ?, ?, ?, ?, ?, ?';
  let values = [viewId, params.editid, name, JSON.stringify(blocks), createdOn, lastModifiedOn, isPublic ? 1 : 0];

  try {
    db.prepare(`INSERT INTO lists (${fields}) VALUES (${valuesString})`).run(values);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH({ params, request }) {
  const { blocks, name, lastModifiedOn, isPublic }  = await request.json();

  let updates: string[] = [];
  let values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }

  if (blocks !== undefined) {
    updates.push('blocks = ?');
    values.push(JSON.stringify(blocks));
  }

  if (lastModifiedOn !== undefined) {
    updates.push('last_modified_on = ?');
    values.push(lastModifiedOn);
  }

  if (isPublic !== undefined) {
    updates.push('is_public = ?');
    values.push(isPublic ? 1 : 0);
  }

  if (updates.length === 0) {
    return json({ success: false, error: 'No valid fields to update' }, { status: 400 });
  }

  values.push(params.editid);

  try {
    db.prepare(`UPDATE lists SET ${updates.join(', ')} WHERE edit_id = ?`).run(...values);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    db.prepare('DELETE FROM lists WHERE edit_id = ?').run(params.editid);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
