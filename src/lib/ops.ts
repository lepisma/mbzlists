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

async function loadListMetadata(viewId: string): Promise<ListMetadata> {
  let res = await fetch(`/api/metadata/list/${viewId}`);
  let data = await res.json();

  return {
    ...data,
    createdOn: new Date(data.createdOn),
    lastModifiedOn: new Date(data.lastModifiedOn),
  };
}

async function loadEditableListMetadata(editId: string): Promise<EditableListMetadata> {
  let res = await fetch(`/api/metadata/edit/${editId}`);
  let data = await res.json();

  return {
    ...data,
    createdOn: new Date(data.createdOn),
    lastModifiedOn: new Date(data.lastModifiedOn),
  };
}

// Load list with edit-ids saved locally and fetch metadata to show
export async function recallEditableLists(): Promise<EditableListMetadata[]> {
  if (browser) {
    let editIds = recallItems('editableItems').map(ids => ids.editId);
    return Promise.all(editIds.map(editId => loadEditableListMetadata(editId)));
  }

  return Promise.resolve([]);
}

// Load list with view-ids saved locally (removing items already saved as editable) and fetch metadata to show
export async function recallViewableLists(): Promise<ListMetadata[]> {
  if (browser) {
    let viewIds = recallItems('viewableItems');
    let viewIdsFromEdits = recallItems('editableItems').map(ids => ids.viewId);
    viewIds = viewIds.filter(id => !viewIdsFromEdits.includes(id));

    return Promise.all(viewIds.map(viewId => loadListMetadata(viewId)));
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
