import type { EditableList, List } from './types';

export async function loadList(viewId: string): Promise<List> {
  let res = await fetch(`/api/list/${viewId}`);
  return {...await res.json(), viewId: viewId};
}
