<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce';
  import QRCodeStyling from "qr-code-styling";
  import { dndzone } from 'svelte-dnd-action';
  import {overrideItemIdKeyNameBeforeInitialisingDndZones} from "svelte-dnd-action";
  overrideItemIdKeyNameBeforeInitialisingDndZones("mbid");

  interface Song {
    mbid: string;
    title: string;
    artist: string;
  }

  let items: Song[] = [];
  let id = $page.params.listid;
  let listTitle = 'Test List';
  let searchQuery = '';
  let searchResults = [];
  let showDropdown = false;

  async function loadList() {
    let res = await fetch(`/api/list/${id}`);
    items = await res.json();
  }

  async function saveList() {
    await fetch(`/api/list/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  }

  function addItem(item) {
    items = [...items, item];
    saveList();
    showDropdown = false;
    searchQuery = '';
  }

  function removeItem(index) {
    items = items.filter((_, i) => i !== index);
    saveList();
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

  function handleDrag(event) {
    items = event.detail.items;
    saveList();
  }

    function cloneList() {
    const newId = crypto.randomUUID();
    fetch(`/api/list/${newId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).then(() => {
      window.location.href = `/list/${newId}`;
    });
  }

  function playAll() {
    items.forEach(song => {
      window.open(`https://musicbrainz.org/recording/${song.mbid}`, '_blank');
    });
  }

  function exportJSPF() {
    const jspf = {
      playlist: {
        title: listTitle,
        track: items.map(song => ({
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

  let qrCode;
  onMount(loadList);
  onMount(() => {
    qrCode = new QRCodeStyling({
        width: 150,
        height: 150,
  data: `https://mbzcodes/list/${id}`,
  image: '/mb-logo.png',
          dotsOptions: {
            color: "#bb4590",
            type: "rounded"
  },
          cornersDotOptions: {
            color: "#ec7538"
  },
  cornersSquareOptions: {
            color: "#ec7538"
  },
  backgroundOptions: {
  color: 'transparent'
  }
    });
    qrCode.append(document.getElementById("qr-code"));
});
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzcodes</a>
    </h1>

    <h2 class="text-4xl font-semibold mb-2">{listTitle}</h2>
    <h3 class="text-l font-italic mb-4">Total {items.length} songs</h3>

    <div class="flex space-x-4 mb-4">
      <button on:click={playAll} class="btn btn-sm preset-filled-primary-500" disabled>Play All</button>
      <button on:click={cloneList} class="btn btn-sm preset-filled-primary-500">Clone List</button>
      <button on:click={exportJSPF} class="btn btn-sm preset-filled-primary-500">Download JSPF</button>
    </div>
  </div>

  <div class="flex justify-center items-center">
    <div id="qr-code"></div>
  </div>

  <div class="space-y-2 col-span-full" use:dndzone={{ items }} on:consider={handleDrag} on:finalize={handleDrag}>
    {#if items.length === 0}
      <p class="italic">Your list is empty. Search for songs to add!</p>
    {:else}
      {#each items as item, index}
        <div class="flex items-center justify-between p-3 rounded-lg border
    cursor-grab shadow-md">
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
