<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import QrCode from '$lib/components/QrCode.svelte';
  import { loadEditableList, createList, saveList } from '$lib/ops';

  let list = {
     viewId: '',
     editId: $page.params.editid,
     name: '',
     items: []
  };

  let searchQuery = '';
  let searchResults = [];
  let showDropdown = false;

  function addItem(item) {
    list.items = [...list.items, item];
    saveList();
    showDropdown = false;
    searchQuery = '';
  }

  function removeItem(index) {
    list.items = list.items.filter((_, i) => i !== index);
    saveList();
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

    const url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(query)}&fmt=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      searchResults = data.recordings?.map(rec => ({
        title: rec.title,
        artist: rec['artist-credit']?.[0]?.name || 'Unknown Artist',
        mbid: rec.id
      })) || [];

      showDropdown = searchResults.length > 0;
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }

  const handleInput = debounce((e) => {
      searchQuery = e.target.value;
      searchSongs(searchQuery);
  }, 300);

  const handleNameEdits = debounce(async () => {
    await saveList(list);
  }, 500);

  function playAll() {
    list.items.forEach(song => {
      window.open(`https://musicbrainz.org/recording/${song.mbid}`, '_blank');
    });
  }

  function openReadOnly() {
    window.open(`/list/${list.viewId}`);
  }

  function exportJSPF() {
    const jspf = {
      playlist: {
        title: list.name,
        track: list.items.map(song => ({
          title: song.title,
          creator: song.artist,
          identifier: `https://musicbrainz.org/recording/${song.mbid}`
        }))
      }
    };

    const blob = new Blob([JSON.stringify(jspf, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${listTitle.replace(/\s+/g, "_")}.jspf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  onMount(async () => {
    list = await loadEditableList(list.editId);
  });
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzcodes</a>
    </h1>

    <input
      type="text"
      class="text-4xl font-semibold mb-2 bg-transparent border-b-2
    border-gray-400 focus:border-blue-500 transition-colors outline-none"
      bind:value={list.name}
      on:input={handleNameEdits}
      />

    <h3 class="text-l font-italic mb-4">Total {list.items.length} songs</h3>

    <div class="flex space-x-4 mb-4">
      <button on:click={playAll} class="btn btn-sm preset-filled-primary-500" disabled>Play</button>
      <button on:click={cloneList} class="btn btn-sm preset-filled-primary-500">Clone List</button>
      <button on:click={exportJSPF} class="btn btn-sm
      preset-filled-primary-500">Download JSPF</button>
      <button on:click={openReadOnly} class="btn btn-sm
      preset-filled-primary-500">Read Only Mode</button>
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
        <div class="flex items-center justify-between p-3 rounded-lg border shadow-md">
          <div>
            <div class="font-medium">{item.title}</div>
            <div class="text-sm">{item.artist}</div>
          </div>
          <button
              on:click={() => removeItem(index)}
              class="text-red-500 hover:text-red-700 font-medium"
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
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      >
      {#if showDropdown && searchResults.length > 0}
          <div class="absolute w-full bg-white mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto z-10">
              {#each searchResults as song}
                  <div
                      class="p-3 hover:bg-gray-100 cursor-pointer"
                      on:click={() => addItem(song)}
                      >
                      <div class="font-medium">{song.title}</div>
                      <div class="text-sm text-gray-600">{song.artist}</div>
                  </div>
              {/each}
          </div>
      {/if}
  </div>
</div>
