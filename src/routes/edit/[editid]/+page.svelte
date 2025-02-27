<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import QrCode from '$lib/components/QrCode.svelte';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import { loadEditableList, createList, saveList } from '$lib/ops';
  import { getCoverArt, queryMB } from '$lib/mb';
  import type { EditableList, Song } from '$lib/types';
  import { resolveYt, resolveSpotify } from '$lib/resolution';
  import { rememberItem } from '$lib/utils';
  import { formatDistanceToNow } from 'date-fns';
  import IconTrash from 'virtual:icons/la/trash';
  import IconDownload from 'virtual:icons/la/download';
  import IconEye from 'virtual:icons/la/eye';
  import IconPlay from 'virtual:icons/la/play';
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

  let playDropdownState: boolean = $state(false);

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

  async function playTrackOnYt(song: Song) {
    let ytURL = await resolveYt(song);
    if (ytURL) {
      window.open(ytURL, '_blank');
    } else {
      window.alert(`Not able to find the song ${song.title} on Youtube`);
    }
  }

  async function playTrackOnSpotify(song: Song) {
    let spURL = await resolveSpotify(song);
    if (spURL) {
      window.open(spURL, '_blank');
    } else {
      window.alert(`Not able to find the song ${song.title} on Spotify`);
    }
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
      <div class="relative inline-block text-left">
        <div>
          <button type="button" onclick={() => {playDropdownState = !playDropdownState}} class="btn btn-sm preset-filled-primary-500 inline-flex w-full justify-center gap-x-1.5 px-3 py-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
            <IconPlay/>
            Play List
            <svg class="-mr-1 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        {#if playDropdownState }
          <div class="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
              <!-- Active: "bg-gray-100 text-gray-900 outline-hidden", Not Active: "text-gray-700" -->
              <a href="#" class="flex hover:bg-gray-100 items-center px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0"><IconYoutubeIcon class="mr-2" /> Play on Youtube</a>
            </div>
            <div class="py-1" role="none">
              <a href={`/api/list/${list.viewId}?type=xspf`} class="flex hover:bg-gray-100 items-center px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2"><IconDownload class="mr-2" /> Download as XSPF</a>
            </div>
          </div>
        {/if}
      </div>
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
