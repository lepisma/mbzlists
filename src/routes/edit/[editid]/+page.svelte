<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import PlayListPlayButton from '$lib/components/PlayListPlayButton.svelte';
  import PlayListMenuButton from '$lib/components/PlayListMenuButton.svelte';
  import PlayListEditor from '$lib/components/PlayListEditor.svelte';
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { loadEditableList, saveList } from '$lib/ops';
  import { queryMB } from '$lib/mb';
  import type { EditableList } from '$lib/types';
  import { rememberItem } from '$lib/utils';
  import { formatDistanceToNow } from 'date-fns';
  import { OutClick } from 'svelte-outclick';

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
    <PlayListEditor list={list} editCallback={async (newList) => {
      list = {...newList, lastModifiedOn: new Date()};
      await saveList(list);
    }}/>
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
