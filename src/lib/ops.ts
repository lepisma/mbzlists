import { browser } from '$app/environment';
import type { EditableList, List, Song } from './types';
import { v4 as uuidv4 } from 'uuid';

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

function saveToLocalStorage(list: EditableList) {
  let lists = JSON.parse(localStorage.getItem('lists') || '[]');
  lists.push(list);
  localStorage.setItem('lists', JSON.stringify(lists));
}

function updateLocalStorage(list: EditableList) {
  let lists = JSON.parse(localStorage.getItem('lists') || '[]');
  localStorage.setItem('lists', JSON.stringify(lists.map((item: EditableList) =>
    item.editId === list.editId ? list : item
  )));
}

function deleteFromLocalStorage(list: EditableList) {
  let lists = JSON.parse(localStorage.getItem('lists') || '[]');
  localStorage.setItem('lists', JSON.stringify(lists.filter((item: EditableList) =>
    item.editId !== list.editId
  )));
}

export function loadFromLocalStorage(): EditableList[] {
  if (browser) {
    let savedData = localStorage.getItem('lists');
    if (savedData) {

      return JSON.parse(savedData).map((it: any) => {
        return {
          ...it,
          createdOn: new Date(it.createdOn),
          lastModifiedOn: new Date(it.lastModifiedOn)
        };
      })
    }
  }

  return [];
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

  saveToLocalStorage(list);
  return list;
}

export async function saveList(list: EditableList) {
  // TODO: Breakdown this function for partial updates
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

  // Also update properties in local storage, in case it was changed
  updateLocalStorage(list);
}

export async function deleteList(list: EditableList) {
  await fetch(`/api/edit/${list.editId}`, {
    method: 'DELETE'
  });

  deleteFromLocalStorage(list);
}
