import db from '$lib/server/db';
import { json } from '@sveltejs/kit';

export function GET({ params }) {
  const res: any = db.prepare('SELECT id, name, created_on, last_modified_on, description, cover_art, is_public, items FROM lists WHERE edit_id = ?').get(params.editid);

  if (res) {
    return json({
      editId: params.editid,
      viewId: res.id,
      name: res.name,
      items: JSON.parse(res.items),
      createdOn: res.created_on,
      lastModifiedOn: res.last_modified_on,
      description: res.description,
      coverArt: res.cover_art,
      isPublic: res.is_public === 1,
    });
  } else {
    return json({ success: false }, { status: 500 });
  }
}

export async function POST({ params, request }) {
  const { viewId, items, name, lastModifiedOn, createdOn, description, isPublic, coverArt } = await request.json();

  let fields = 'id, edit_id, name, items, created_on, last_modified_on, is_public';
  let valuesString = '?, ?, ?, ?, ?, ?, ?';
  let values = [viewId, params.editid, name, JSON.stringify(items), createdOn, lastModifiedOn, isPublic ? 1 : 0];

  if (description !== undefined) {
    fields += ', description';
    valuesString += ', ?';
    values.push(description);
  }

  if (coverArt !== undefined) {
    fields += ', cover_art';
    valuesString += ', ?';
    values.push(coverArt);
  }

  try {
    db.prepare(`INSERT INTO lists (${fields}) VALUES (${valuesString})`).run(values);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH({ params, request }) {
  const { items, name, lastModifiedOn, description, isPublic, coverArt }  = await request.json();

  let updates: string[] = [];
  let values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }

  if (items !== undefined) {
    updates.push('items = ?');
    values.push(JSON.stringify(items));
  }

  if (lastModifiedOn !== undefined) {
    updates.push('last_modified_on = ?');
    values.push(lastModifiedOn);
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }

  if (isPublic !== undefined) {
    updates.push('is_public = ?');
    values.push(isPublic ? 1 : 0);
  }

  if (coverArt !== undefined) {
    updates.push('cover_art = ?');
    values.push(coverArt);
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
