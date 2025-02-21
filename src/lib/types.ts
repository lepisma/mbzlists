export interface Release {
  mbid: string;
  title: string;
  date: string;
}

export interface Artist {
  mbid: string;
  title: string;
}

export interface Song {
  mbid: string;  // This is musicbrainz `recording` id
  title: string;
  artist: Artist;
  release: Release;
}

export interface List {
  readonly viewId: string;
  readonly name: string;
  readonly items: readonly Song[];
}

export interface EditableList {
  readonly viewId: string;
  readonly editId: string,
  name: string;
  items: Song[];
}
