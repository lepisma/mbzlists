<script lang='ts'>
  import { onMount, getContext } from 'svelte';
  import { browser } from '$app/environment';
  import type { Song, List } from '$lib/types';
  import { getCoverArt } from '$lib/mb';
  import { lengthToDuration } from '$lib/utils';
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

  let toast: ToastContext = $state(getContext('toast'));
  let { list, isEdit = false } = $props();

  if (browser) {
    window.test = function test() { toast.create({ description: 'Started Spotify search!' }); }
  }

  const styleText = `
    a.anchor {
      text-decoration: none;
      color: reset;
    }

    a.anchor:hover {
      text-decoration: underline;
    }
  `;

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
    let style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(styleText));

    const container = document.createElement('div');
    container.className = 'flex mt-2 mb-2 p-2 pl-1 rounded-lg border shadow-md';

    const detailsWrapper = document.createElement('div');
    detailsWrapper.className = 'flex items-center';

    const textContainer = document.createElement('div');
    textContainer.innerHTML = `
        <div class='font-medium'>
          <a class='anchor' href='https://musicbrainz.org/recording/${song.mbid}'>${song.title}</a>
          <span class='text-sm text-gray-500'>${lengthToDuration(song.length)}</span>
        </div>
        <div class='text-sm'>
          <a class='anchor' href='https://musicbrainz.org/artist/${song.artist.mbid}'>${song.artist.title}</a>
        </div>
        <div class='text-sm text-gray-500'>
          <a class='anchor' href='https://musicbrainz.org/release/${song.release.mbid}'>${song.release.title} (${song.release.date})</a>
        </div>
        <div class='mt-1 flex space-x-2'>
          <button title='Play on Youtube' onclick='test()'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 180"><path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg></button>
          <button title='Play on Spotify' onclick='test()'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"><path fill="#1ed760" d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/></svg></button>
        </div>
    `;

    detailsWrapper.append(renderCoverArt(song.release.mbid), textContainer);
    container.appendChild(detailsWrapper);

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
      if (this.data.title) {
        return renderSong(this.data);
      } else {
        return document.createElement('input');
      }
    }

    save(blockContent): Song {
      return {
        mbid: blockContent.value,
        title: '',
        artist: {
        },
        release: {
        },
        length: ''
      }
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

      editor = new EditorJS({
        autofocus: true,
        readOnly: !isEdit,
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
        onChange: (api, event) => {
          console.log('Content changed', event)
        },
        data: {
          time: Date.now(),
          blocks: list.items.map((it: Song) => {
            return {
              type: 'mbrecording',
              data: it
            }
          })
        }
      });
    } catch (error) {
      console.error("Failed to load EditorJS:", error);
    }
  });
</script>

<div bind:this={editorEl}></div>
