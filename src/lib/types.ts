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
  length?: number;
}

export interface List {
  readonly viewId: string;
  readonly name: string;
  readonly items: readonly Song[];
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
}

export interface EditableList {
  readonly viewId: string;
  readonly editId: string,
  readonly createdOn: Date;
  lastModifiedOn: Date;
  name: string;
  items: Song[];
}
