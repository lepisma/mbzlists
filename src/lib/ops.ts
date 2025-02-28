import { browser } from '$app/environment';
import type { EditableList, EditableListMetadata, List, ListMetadata, Song } from './types';
import { v4 as uuidv4 } from 'uuid';
import { recallItems, rememberItem, forgetItem } from '$lib/utils';

export async function loadList(viewId: string): Promise<List> {
  let res = await fetch(`/api/list/${viewId}`);
  let data = await res.json();

  return {
    ...data,
    createdOn: new Date(data.createdOn),
    lastModifiedOn: new Date(data.lastModifiedOn),
  };
}

export async function loadEditableList(editId: string): Promise<EditableList> {
  let res = await fetch(`/api/edit/${editId}`);
  let data = await res.json();

  return {
    ...data,
    createdOn: new Date(data.createdOn),
    lastModifiedOn: new Date(data.lastModifiedOn),
  };
}

export async function loadPublicLists(): Promise<List[]> {
  let res = await fetch(`/api/list/`);
  let data = await res.json();

  return data.map(it => {
    return {
      ...it,
      createdOn: new Date(it.createdOn),
      lastModifiedOn: new Date(it.lastModifiedOn),
    }
  });
}

async function loadMetadata(id: string, isEdit: boolean): Promise<ListMetadata | EditableListMetadata> {
  let res = await fetch(`/api/metadata/${isEdit ? 'edit' : 'list'}/${id}`);

  if (res.ok) {
    let data = await res.json();
    return {
      ...data,
      createdOn: new Date(data.createdOn),
      lastModifiedOn: new Date(data.lastModifiedOn),
    };
  } else {
    return Promise.reject(new Error(`API error: ${res}`));
  }
}

export async function recallLists(isEdit: boolean): Promise<EditableListMetadata[] | ListMetadata[]> {
  if (browser) {
    let ids: string[] = [];

    if (isEdit) {
      ids = recallItems('editableItems').map(it => it.editId);
    } else {
      ids = recallItems('viewableItems');
      let viewIdsFromEdits = recallItems('editableItems').map(it => it.viewId);
      ids = ids.filter(id => !viewIdsFromEdits.includes(id));
    }

    let results = await Promise.allSettled(ids.map(id => loadMetadata(id, isEdit)));
    return results.filter(res => res.status === 'fulfilled').map(it => it.value);
  }

  return Promise.resolve([]);
}

// Create a new list and save it in localstorage
export async function createList(name: string, items: Song[]): Promise<EditableList> {
  const list: EditableList = {
    name: name,
    editId: uuidv4(),
    viewId: uuidv4(),
    items: items,
    createdOn: new Date(),
    lastModifiedOn: new Date(),
    isPublic: false,
  };

  await fetch(`/api/edit/${list.editId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...list,
      createdOn: list.createdOn.toISOString(),
      lastModifiedOn: list.lastModifiedOn.toISOString(),
    }),
  });

  rememberItem('editableItems', { editId: list.editId, viewId: list.viewId }, ids => ids.editId);
  return list;
}

export async function saveList(list: EditableList) {
  // TODO: Break this function down for partial updates
  await fetch(`/api/edit/${list.editId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: list.name,
      items: list.items,
      lastModifiedOn: list.lastModifiedOn.toISOString(),
      description: list.description,
      isPublic: list.isPublic,
      coverArt: list.coverArt,
    }),
  });
}

export async function deleteList(list: EditableList) {
  await fetch(`/api/edit/${list.editId}`, {
    method: 'DELETE'
  });

  forgetItem('editableItems', { editId: list.editId, viewId: list.viewId }, ids => ids.editId);
}
