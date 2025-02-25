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
  readonly coverArt?: Blob;
  readonly description?: string;
  readonly isPublic: boolean;
}

export interface ListMetadata {
  readonly viewId: string;
  readonly name: string;
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
  readonly coverArt?: Blob;
  readonly description?: string;
  readonly isPublic: boolean;
}

export interface EditableList {
  readonly viewId: string;
  readonly editId: string,
  readonly createdOn: Date;
  lastModifiedOn: Date;
  name: string;
  items: Song[];
  coverArt?: Blob;
  description?: string;
  isPublic: boolean;
}

export interface EditableListMetadata {
  readonly viewId: string;
  readonly editId: string,
  readonly createdOn: Date;
  readonly lastModifiedOn: Date;
  readonly name: string;
  readonly coverArt?: Blob;
  readonly description?: string;
  readonly isPublic: boolean;
}
