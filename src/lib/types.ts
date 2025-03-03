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

interface Block {
  type: string;
  data: Song | any;
}

export interface List {
  readonly viewId: string;
  readonly name: string;
  readonly blocks: readonly Block[];
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
  readonly isPublic: boolean;
}

export interface ListMetadata {
  readonly viewId: string;
  readonly name: string;
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
  readonly isPublic: boolean;
}

export interface EditableList {
  readonly viewId: string;
  readonly editId: string,
  readonly createdOn: Date;
  lastModifiedOn: Date;
  name: string;
  blocks: Block[];
  isPublic: boolean;
}

export interface EditableListMetadata {
  readonly viewId: string;
  readonly editId: string,
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
  readonly name: string;
  readonly isPublic: boolean;
}
