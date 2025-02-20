export interface Song {
  mbid: string;
  title: string;
  artist: string;
}

export interface List {
  readonly viewId: string;
  readonly name: string;
  readonly items: readonly Song[];
}

export interface EditableList {
  viewId: string;
  editId: string,
  name: string;
  items: Song[];
}
