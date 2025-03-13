<script lang='ts'>
  import { onMount, getContext } from 'svelte';
  import debounce from 'lodash/debounce';
  import type { Song } from '$lib/types';
  import { queryMB } from '$lib/mb';
  import { lengthToDuration } from '$lib/utils';
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
  import { playTrackOnYt, playTrackOnSpotify } from '$lib/playback';

  let toast: ToastContext = $state(getContext('toast'));
  let { list, editCallback = null } = $props();

  let searchQuery = $state('');
  let searchResults = $state([]);

  function showDropdown() {
    let dropdownEl = document.getElementById('search-dropdown');
    dropdownEl.style.display = null;
  }

  function hideDropdown() {
    let dropdownEl = document.getElementById('search-dropdown');
    dropdownEl.style.display = 'none';
  }

  async function searchSongs(query, selectionCallback) {
    if (!query.trim()) {
      searchResults = [];
      return;
    }

    let dropdownEl = document.getElementById('search-dropdown');

    searchResults = await queryMB(query);
    dropdownEl.innerHTML = '';
    if (searchResults.length > 0) {
      for (let song of searchResults) {
        let songContainer = document.createElement('div');
        songContainer.className = 'p-3 hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer transition-colors duration-150';
        songContainer.onclick = () => selectionCallback(song);

        let titleLine = document.createElement('div');
        let artistLine = document.createElement('div');
        let releaseLine = document.createElement('div');

        titleLine.innerHTML = `<div class='font-medium text-gray-900 dark:text-gray-100'>${song.title} <span class='text-sm text-gray-500 dark:text-gray-400'>${lengthToDuration(song.length)}</span></div>`;
        artistLine.innerHTML = `<div class='text-sm text-gray-500 dark:text-gray-200'>${song.artist.title}</div>`;
        releaseLine.innerHTML = `<div class='text-sm text-gray-500 dark:text-gray-200'>${song.release.title} (${song.release.date})</div>`;

        songContainer.append(titleLine, artistLine, releaseLine);
        dropdownEl.append(songContainer);
        showDropdown();
      }
    } else {
      hideDropdown();
    }
  }

  const handleInput = debounce((e, callback) => {
    searchQuery = e.target.value;
    if (searchQuery) {
      searchSongs(searchQuery, callback);
    } else {
      hideDropdown();
    }
  }, 300);

  function renderCoverArt(releaseId: string): HTMLDivElement {
    const coverArt = document.createElement('div');
    coverArt.className = 'ml-2 mr-2';
    const img = document.createElement('img');
    img.className = 'w-16 h-16 mr-2 object-cover rounded-md';
    img.style = 'margin-top: 0; margin-bottom: 0';
    img.src = `https://coverartarchive.org/release/${releaseId}/front-250`;
    img.onerror = function () { this.src = 'https://placehold.co/100?text=NA' };
    coverArt.appendChild(img);

    return coverArt;
  }

  function renderSong(song: Song): HTMLDivElement {
    let head = document.head || document.getElementsByTagName('head')[0];

    const container = document.createElement('div');
    container.className = 'flex mt-2 mb-2 p-2 pl-1 rounded-lg border shadow-md';

    const detailsWrapper = document.createElement('div');
    detailsWrapper.className = 'flex items-center';

    const textContainer = document.createElement('div');
    const titleLine = document.createElement('div');
    const artistLine = document.createElement('div');
    const releaseLine = document.createElement('div');
    const buttonsLine = document.createElement('div');

    titleLine.className = 'font-medium';
    titleLine.innerHTML = `<a class='anchor' href='https://musicbrainz.org/recording/${song.mbid}'>${song.title}</a> <span class='text-sm text-gray-500 dark:text-gray-400'>${lengthToDuration(song.length)}</span>`;

    artistLine.className = 'text-sm';
    artistLine.innerHTML = `<a class='anchor' href='https://musicbrainz.org/artist/${song.artist.mbid}'>${song.artist.title}</a>`

    releaseLine.className = 'text-sm text-gray-500';
    releaseLine.innerHTML = `<a class='anchor' href='https://musicbrainz.org/release/${song.release.mbid}'>${song.release.title} (${song.release.date})</a>`;

    buttonsLine.className = 'mt-1 flex space-x-2';

    const ytBtn = document.createElement('button');
    ytBtn.title = 'Play on Youtube';
    ytBtn.onclick = () => playTrackOnYt(song, toast);
    ytBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 180"><path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg>`;

    const spotifyBtn = document.createElement('button');
    spotifyBtn.title = 'Play on Spotify';
    spotifyBtn.onclick = () => playTrackOnSpotify(song, toast);
    spotifyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"><path fill="#1ed760" d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/></svg>`;

    buttonsLine.append(ytBtn, spotifyBtn);
    textContainer.append(titleLine, artistLine, releaseLine, buttonsLine);

    detailsWrapper.append(renderCoverArt(song.release.mbid), textContainer);
    container.appendChild(detailsWrapper);

    return container;
  }

  function renderSearch(searchCallback): HTMLDivElement {
    let container = document.createElement('div');
    container.className = 'mt-4 mb-4 relative';

    let inputGroup = document.createElement('div');
    inputGroup.className = 'input-group flex rounded-lg';

    let input = document.createElement('input');
    input.className = 'ig-input w-full p-3 pl-5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-400 focus:border-transparent';
    input.placeholder = 'Search and add songs ...';
    input.oninput = (e) => handleInput(e, searchCallback);

    let helpIcon = document.createElement('a');
    helpIcon.className = 'ig-cell p-3 text-xl dark:text-gray-200';
    helpIcon.innerHTML = '🛈';
    helpIcon.style = 'text-decoration: none';
    helpIcon.href = 'https://docs.mbzlists.com/essentials/search';
    helpIcon.target = '_blank';

    inputGroup.append(input, helpIcon);

    let dropdown = document.createElement('div');
    dropdown.className = 'absolute w-full bg-white dark:bg-gray-800 mt-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-10';
    dropdown.id = 'search-dropdown';
    dropdown.style.display = 'none';

    container.append(inputGroup, dropdown);

    return container;
  }

  class MBRecording {
    static get isReadOnlySupported() {
      return true;
    }

    static get toolbox() {
      return {
        title: 'Song',
        icon: '<svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>'
      }
    }

    constructor({ data, readOnly }) {
      this.readOnly = readOnly;
      this.data = data;
    }

    render() {
      this.parentContainer = this.parentContainer || document.createElement('div');

      if (this.data.title) {
        let songContainer = renderSong(this.data);
        this.parentContainer.appendChild(songContainer);

        return this.parentContainer;
      } else {
        let searchContainer = renderSearch(searchedData => {
          this.data = searchedData;
          this.parentContainer.innerHTML = '';
          this.parentContainer.append(renderSong(this.data));
        });
        this.parentContainer.appendChild(searchContainer);
      }
      return this.parentContainer;
    }

    save(blockContent) {
      return this.data;
    }
  }

  let editor = $state(null);
  let editorEl = null;

  onMount(async () => {
    try {
      const { default: EditorJS } = await import('@editorjs/editorjs');
      const { default: Header } = await import('@editorjs/header');
      const { default: List } = await import('@editorjs/list');
      const { default: Quote } = await import('@editorjs/quote');
      const { default: DragDrop } = await import('editorjs-drag-drop');
      const { default: Image } = await import('@editorjs/image');

      editor = new EditorJS({
        autofocus: true,
        readOnly: editCallback === null,
        holder: editorEl,
        minHeight: 20,
        tools: {
          mbrecording: {
            class: MBRecording
          },
          header: {
            class: Header,
            inlineToolbar: ['link'],
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3
            }
          },
          image: {
            class: Image,
            config: {
              endpoints: {
                byFile: `/api/image`
              }
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
          },
          quote: Quote
        },
        onReady: () => {
          new DragDrop(editor);
        },
        onChange: (api, _) => {
          api.saver.save().then(async (outputData) => {
            let newList = {...list, blocks: outputData.blocks};
            await editCallback(newList);
          }).catch((error) => {
            toast.create({ type: 'error', description: `Error while saving: ${error}` });
          })
        },
        data: {
          time: Date.now(),
          blocks: list.blocks
        }
      });
    } catch (error) {
      console.error("Failed to load EditorJS:", error);
    }
  });
</script>

<div bind:this={editorEl}></div>
