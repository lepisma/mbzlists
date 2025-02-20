<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import QrCode from '$lib/components/QrCode.svelte';
  import { loadList } from '$lib/ops';

  let list = {
     viewId: $page.params.listid,
     name: '',
     items: []
  };

  let searchQuery = '';
  let searchResults = [];
  let showDropdown = false;

  function cloneList() {
  }

  function playAll() {
    list.items.forEach(song => {
      window.open(`https://musicbrainz.org/recording/${song.mbid}`, '_blank');
    });
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
     list = await loadList(list.viewId);
  });
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzcodes</a>
    </h1>

    <h2 class="text-4xl font-semibold mb-2">{list.name}</h2>
    <h3 class="text-l font-italic mb-4">Total {list.items.length} songs</h3>

    <div class="flex space-x-4 mb-4">
      <button on:click={playAll} class="btn btn-sm preset-filled-primary-500" disabled>Play All</button>
      <button on:click={cloneList} class="btn btn-sm preset-filled-primary-500" disabled>Clone List</button>
      <button on:click={exportJSPF} class="btn btn-sm preset-filled-primary-500">Download JSPF</button>
    </div>
  </div>

  <div class="flex justify-center items-center">
    {#if list.viewId }
      <QrCode viewId={list.viewId} />
    {/if}
  </div>

  <div class="space-y-2 col-span-full">
    {#if list.items.length === 0}
      <p class="italic">This list is empty</p>
    {:else}
      {#each list.items as item}
        <div class="flex items-center justify-between p-3 rounded-lg border shadow-md">
          <div>
            <div class="font-medium">{item.title}</div>
            <div class="text-sm">{item.artist}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
