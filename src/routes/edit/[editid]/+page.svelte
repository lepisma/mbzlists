<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount, getContext } from 'svelte';
  import debounce from 'lodash/debounce';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import PlayListPlayButton from '$lib/components/PlayListPlayButton.svelte';
  import PlayListMenuButton from '$lib/components/PlayListMenuButton.svelte';
  import PlayListEditor from '$lib/components/PlayListEditor.svelte';
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { loadEditableList, saveList } from '$lib/ops';
  import { getCoverArt, queryMB } from '$lib/mb';
  import type { EditableList } from '$lib/types';
  import { playTrackOnSpotify, playTrackOnYt } from '$lib/playback';
  import { rememberItem } from '$lib/utils';
  import { formatDistanceToNow } from 'date-fns';
  import IconTrash from 'virtual:icons/la/trash';
  import IconYoutubeIcon from 'virtual:icons/logos/youtube-icon';
  import IconSpotify from 'virtual:icons/logos/spotify';
  import IconDrag from 'virtual:icons/clarity/drag-handle-line';
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { OutClick } from 'svelte-outclick';
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

  overrideItemIdKeyNameBeforeInitialisingDndZones('mbid');

  let list: EditableList = $state({
     viewId: '',
     editId: $page.params.editid,
     name: '',
     items: [],
     createdOn: new Date(),
     lastModifiedOn: new Date(),
     isPublic: false,
     description: '',
  });

  let toast: ToastContext = $state(getContext('toast'));
  let searchQuery = $state('');
  let searchResults = $state([]);
  let showDropdown = $state(false);

  async function addItem(item) {
    list.items = [...list.items, item];
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
    showDropdown = false;
    searchQuery = '';
  }

  async function removeItem(mbid) {
    list.items = list.items.filter(it => it.mbid !== mbid);
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
  }

  async function searchSongs(query) {
    if (!query.trim()) {
      searchResults = [];
      showDropdown = false;
      return;
    }

    searchResults = await queryMB(query);
    showDropdown = searchResults.length > 0;
  }

  const handleInput = debounce((e) => {
    searchQuery = e.target.value;
    searchSongs(searchQuery);
  }, 300);

  const handleNameEdits = debounce(async () => {
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
  }, 500);

  const handleDescriptionEdits = debounce(async () => {
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
  }, 500);

  async function handleSort(e) {
    list.items = e.detail.items;
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
  }

  onMount(async () => {
    list = await loadEditableList(list.editId);

    // Every list that we view is remembered
    rememberItem('editableItems', { editId: list.editId, viewId: list.viewId }, ids => ids.editId);
  });
</script>

<svelte:head>
  <title>{list.name} [editing] | mbzlists</title>
</svelte:head>

<div class="mb-3">
  <div>
    <input
      type="text"
      class="text-4xl font-semibold mb-2 bg-transparent border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-primary-500 transition-colors pl-0"
      bind:value={list.name}
      oninput={handleNameEdits}
      />
  </div>
  <div class="text-sm text-gray-400">
    <span title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span title={list.lastModifiedOn}>modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
  </div>

  <div class="mt-2 italic mb-4">Total {list.items.length} songs, duration: <PlayListDuration list={list} /></div>

  <div class="flex space-x-2">
    <PlayListPlayButton list={list} />
    <ShareButton list={list} isEdit={true} />
    <PlayListMenuButton list={list} isEdit={true} />
  </div>
</div>


<div>
  {#if list.items.length === 0}
    <p class="italic">Your list is empty. Search for songs to add!</p>
  {:else}
    <PlayListEditor list={list} isEdit={true}/>
    <section use:dndzone={{ items: list.items, flipDurationMs: 200 }} onconsider={handleSort} onfinalize={handleSort}>
      {#each list.items as item(item.mbid)}
        <div class="flex items-center justify-between mt-2 p-3 pl-1 rounded-lg border shadow-md" animate:flip={{duration: 200}}>
          <div class="flex items-center">
            <div class="mr-1"><IconDrag width="36" height="36" style="color: gray" /></div>
            <div class="flex">
              <div>
                {#await getCoverArt(item.release.mbid)}
                  <img src="" alt="" class="w-16 h-16 mr-2 object-cover placeholder animate-pulse rounded-md" />
                {:then value}
                  <img src={value || "https://placehold.co/100?text=NA"} alt="" class="w-16 h-16 mr-2 object-cover rounded-md" />
                {:catch error}
                  <img src="https://placehold.co/100?text=NA" alt="" class="w-16 h-16 mr-2 object-cover placeholder rounded-md" />
                {/await}
              </div>
              <div>
                <div class="font-medium"><a class="anchor" href={`https://musicbrainz.org/recording/${item.mbid}`}>{item.title}</a>
                  <span class="text-sm text-gray-500"><SongDuration song={item} /></span>
                </div>
                <div class="text-sm"><a class="anchor" href={`https://musicbrainz.org/artist/${item.artist.mbid}`}>{item.artist.title}</a></div>
                <div class="text-sm text-gray-500"><a class="anchor" href={`https://musicbrainz.org/release/${item.release.mbid}`}>{item.release.title} ({item.release.date})</a></div>
                <div class="mt-2 flex space-x-2">
                  <button title="Play on Youtube" onclick={async () => await playTrackOnYt(item, toast) }><IconYoutubeIcon /></button>
                  <button title="Play on Spotify" onclick={async () => await playTrackOnSpotify(item, toast)}><IconSpotify /></button>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onclick={async () => await removeItem(item.mbid)}
            class="btn preset-filled-error-500"
            >
            <IconTrash />
          </button>
        </div>
      {/each}
    </section>
  {/if}
</div>

<div class="mt-7 relative">
  <input
    type="text"
    oninput={handleInput}
    onfocus={() => showDropdown = true}
    placeholder="Search and add songs using MusicBrainz Lucene syntax..."
    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
  >
  {#if showDropdown && searchResults.length > 0}
    <OutClick onOutClick={() => showDropdown = false}>
      <div class="absolute w-full bg-white dark:bg-gray-800 mt-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-10">
        {#each searchResults as song}
          <div
            class="p-3 hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer transition-colors duration-150"
            onclick={async () => await addItem(song)}
            >
            <div class="font-medium text-gray-900 dark:text-gray-100">{song.title} <span class="text-sm text-gray-500"><SongDuration song={song} /></span></div>
            <div class="text-sm text-gray-500 dark:text-gray-200">{song.artist.title}</div>
            <div class="text-sm text-gray-500 dark:text-gray-200">{song.release.title} ({song.release.date})</div>
          </div>
        {/each}
      </div>
    </OutClick>
  {/if}
</div>
