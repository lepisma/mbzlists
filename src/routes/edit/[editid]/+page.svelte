<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import QrCode from '$lib/components/QrCode.svelte';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import PlayListPlayButton from '$lib/components/PlayListPlayButton.svelte';
  import { loadEditableList, createList, saveList } from '$lib/ops';
  import { getCoverArt, queryMB } from '$lib/mb';
  import type { EditableList } from '$lib/types';
  import { playTrackOnSpotify, playTrackOnYt } from '$lib/playback';
  import { rememberItem } from '$lib/utils';
  import { formatDistanceToNow } from 'date-fns';
  import IconTrash from 'virtual:icons/la/trash';
  import IconEye from 'virtual:icons/la/eye';
  import IconCopy from 'virtual:icons/la/copy';
  import IconLock from 'virtual:icons/la/lock';
  import IconGlobe from 'virtual:icons/la/globe';
  import IconYoutubeIcon from 'virtual:icons/logos/youtube-icon';
  import IconSpotify from 'virtual:icons/logos/spotify';
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { Switch } from '@skeletonlabs/skeleton-svelte';

  overrideItemIdKeyNameBeforeInitialisingDndZones('mbid');

  let list: EditableList = $state({
     viewId: '',
     editId: $page.params.editid,
     name: '',
     items: [],
     createdOn: new Date(),
     lastModifiedOn: new Date(),
     isPublic: false,
  });

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

  async function cloneList() {
    let clonedList = await createList(`Copy of ${list.name}`, list.items);
    window.open(`/edit/${clonedList.editId}`, '_blank');
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

  async function handleSort(e) {
    list.items = e.detail.items;
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
  }

  async function handlePublicToggle(e) {
    list = {...list, isPublic: e.checked, lastModifiedOn: new Date()};
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

<div class="grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <input
      type="text"
      class="text-4xl font-semibold mb-2 bg-transparent border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-primary-500 transition-colors pl-0"
      bind:value={list.name}
      oninput={handleNameEdits}
      />
    <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
    <h3 class="text-l mt-2 font-italic mb-4">Total {list.items.length} songs. Duration <PlayListDuration list={list} />.</h3>

    <div class="flex space-x-4 mb-4">
      <PlayListPlayButton list={list} />
      <button onclick={cloneList} class="btn btn-sm preset-filled-primary-500"><IconCopy />Make a Copy</button>
      <a href={`/list/${list.viewId}`} class="btn btn-sm preset-filled-primary-500"><IconEye />View Link</a>
    </div>

    <div class="flex space-x-3">
      <span>Make {#if list.isPublic } private {:else} public {/if} </span>
        <Switch name="public" bind:checked={list.isPublic} onCheckedChange={handlePublicToggle}>
          {#snippet inactiveChild()}<IconLock />{/snippet}
          {#snippet activeChild()}<IconGlobe />{/snippet}
        </Switch>
    </div>
  </div>

  <div class="flex justify-center items-center">
    {#if list.viewId }
      <QrCode viewId={list.viewId} />
    {/if}
  </div>

  <div class="space-y-2 col-span-full">
    {#if list.items.length === 0}
      <p class="italic">Your list is empty. Search for songs to add!</p>
    {:else}
      <section use:dndzone={{ items: list.items, flipDurationMs: 200 }} onconsider={handleSort} onfinalize={handleSort}>
      {#each list.items as item(item.mbid)}
        <div class="flex items-center justify-between p-3 rounded-blg border shadow-md" animate:flip={{duration: 200}}>
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
                <button title="Play on Youtube" onclick={async () => await playTrackOnYt(item) }><IconYoutubeIcon /></button>
                <button title="Play on Spotify" onclick={async () => await playTrackOnSpotify(item)}><IconSpotify /></button>
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
  <div class="relative col-span-full">
    <input
      type="text"
      oninput={handleInput}
      onfocus={() => showDropdown = true}
    placeholder="Search songs using MusicBrainz Lucene syntax..."
    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
    >
    {#if showDropdown && searchResults.length > 0}
      <div class="absolute w-full bg-white dark:bg-gray-800 mt-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-10">
        {#each searchResults as song}
          <div
            class="p-3 hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer transition-colors duration-150"
            onclick={async () => await addItem(song)}
            >
            <div class="font-medium text-gray-900 dark:text-gray-100">{song.title}</div>
            <div class="text-sm text-gray-500 dark:text-gray-200">{song.artist.title}</div>
            <div class="text-sm text-gray-500 dark:text-gray-200">{song.release.title} ({song.release.date})</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
