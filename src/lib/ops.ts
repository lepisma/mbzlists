import type { EditableList, List } from './types';

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
