import type { EditableList, List, Song } from './types';
import { v4 as uuidv4 } from 'uuid';

export async function loadList(viewId: string): Promise<List> {
  let res = await fetch(`/api/list/${viewId}`);
  return {...await res.json(), viewId: viewId};
}

export async function loadEditableList(editId: string): Promise<EditableList> {
  let res = await fetch(`/api/edit/${editId}`);
  let data = await res.json();

  return {
    items: data.items,
    viewId: data.id,
    editId: editId,
    name: data.name
  };
}

// Create a new list and save it in localstorage
export async function createList(name: string, items: Song[]): Promise<EditableList> {
  const list = {
    name: name,
    editId: uuidv4(),
    viewId: uuidv4(),
    items: items
  };

  await fetch(`/api/edit/${list.editId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listid: list.viewId, name: list.name, items: list.items }),
  });

  let lists = JSON.parse(localStorage.getItem('lists') || '[]');
  lists.push(list);
  localStorage.setItem('lists', JSON.stringify(lists));

  return list;
}
