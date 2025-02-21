<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import QrCode from '$lib/components/QrCode.svelte';
  import { loadEditableList, createList, saveList } from '$lib/ops';
  import { getCoverArt, queryMB } from '$lib/mb';
  import type { EditableList } from '$lib/types';
  import { formatDistanceToNow } from 'date-fns';

  let list: EditableList = {
     viewId: '',
     editId: $page.params.editid,
     name: '',
     items: [],
     createdOn: new Date(),
     lastModifiedOn: new Date(),
  };

  let searchQuery = '';
  let searchResults = [];
  let showDropdown = false;

  async function addItem(item) {
    list.items = [...list.items, item];
    list = {...list, lastModifiedOn: new Date()};
    await saveList(list);
    showDropdown = false;
    searchQuery = '';
  }

  async function removeItem(index) {
    list.items = list.items.filter((_, i) => i !== index);
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

  function playAll() {
    list.items.forEach(song => {
      window.open(`https://musicbrainz.org/recording/${song.mbid}`, '_blank');
    });
  }

  onMount(async () => {
    list = await loadEditableList(list.editId);
  });
</script>

<svelte:head>
  <title>{list.name} [editing] | mbzlists</title>
</svelte:head>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzlists</a>
    </h1>

    <input
      type="text"
      class="text-4xl font-semibold mb-2 bg-transparent border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-primary-500 transition-colors pl-0"
      bind:value={list.name}
      on:input={handleNameEdits}
      />
    <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
    <h3 class="text-l mt-2 font-italic mb-4">Total {list.items.length} songs</h3>

    <div class="flex space-x-4 mb-4">
      <button on:click={playAll} class="btn btn-sm preset-filled-primary-500" disabled>Play All</button>
      <button on:click={cloneList} class="btn btn-sm preset-filled-primary-500">Clone List</button>
      <a href={`/api/list/${list.viewId}?type=xspf`} class="btn btn-sm preset-filled-primary-500">Download XSPF</a>
      <a href={`/list/${list.viewId}`} class="btn btn-sm preset-filled-primary-500">View Only Link</a>
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
      {#each list.items as item, index}
        <div class="flex items-center justify-between p-3 rounded-blg border shadow-md">
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
              <div class="font-medium"><a class="anchor" href={`https://musicbrainz.org/recording/${item.mbid}`}>{item.title}</a></div>
              <div class="text-sm"><a class="anchor" href={`https://musicbrainz.org/artist/${item.artist.mbid}`}>{item.artist.title}</a></div>
              <div class="text-sm text-gray-500"><a class="anchor" href={`https://musicbrainz.org/release/${item.release.mbid}`}>{item.release.title} ({item.release.date})</a></div>
            </div>
          </div>
          <button
            type="button"
              on:click={async () => await removeItem(index)}
              class="btn btn-sm preset-filled-error-500"
            >
            Remove
          </button>
        </div>
      {/each}
    {/if}
  </div>

  <div class="relative mb-6 col-span-full">
      <input
        type="text"
        on:input={handleInput}
        on:focus={() => showDropdown = true}
      placeholder="Add songs..."
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
      >
      {#if showDropdown && searchResults.length > 0}
          <div class="absolute w-full bg-white mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto z-10">
              {#each searchResults as song}
                  <div
                      class="p-3 hover:bg-gray-100 cursor-pointer"
                      on:click={async () => await addItem(song)}
                      >
                      <div class="font-medium">{song.title}</div>
                      <div class="text-sm text-gray-600">{song.artist.title}</div>
                      <div class="text-sm text-gray-500">{song.release.title} ({song.release.date})</div>
                  </div>
              {/each}
          </div>
      {/if}
  </div>
</div>
