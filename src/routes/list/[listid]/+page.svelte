<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import QrCode from '$lib/components/QrCode.svelte';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import { loadList, createList } from '$lib/ops';
  import { getCoverArt, getSpotifyId } from '$lib/mb';
  import type { List, Song } from '$lib/types';
  import { goto } from '$app/navigation';
  import { formatDistanceToNow } from 'date-fns';
  import IconDownload from 'virtual:icons/la/download';
  import IconPlay from 'virtual:icons/la/play';
  import IconCopy from 'virtual:icons/la/copy';
  import IconYoutubeIcon from 'virtual:icons/logos/youtube-icon';
  import IconSpotify from 'virtual:icons/logos/spotify';

  let list: List = {
    viewId: $page.params.listid,
    name: '',
    items: [],
    createdOn: new Date(),
    lastModifiedOn: new Date(),
  };

  let searchQuery = '';
  let searchResults = [];
  let showDropdown = false;

  async function cloneList() {
    let clonedList = await createList(`Copy of ${list.name}`, list.items);
    goto(`/edit/${clonedList.editId}`);
  }

  function playAll() {
    list.items.forEach(song => {
      window.open(`https://musicbrainz.org/recording/${song.mbid}`, '_blank');
    });
  }

  async function playTrackOnSpotify(song: Song) {
    let spotifyId = await getSpotifyId(song);
    if (spotifyId) {
      window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
    } else {
      window.alert(`Not able to find the song ${song.title} on Spotify`);
    }
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

<svelte:head>
  <title>{list.name} | mbzlists</title>
</svelte:head>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzlists</a>
    </h1>

    <h2 class="text-4xl font-semibold mb-2">{list.name}</h2>
    <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
    <h3 class="text-l mt-2 font-italic mb-4">Total {list.items.length} songs. Duration <PlayListDuration list={list} />.</h3>

    <div class="flex space-x-4 mb-4">
      <button on:click={playAll} class="btn btn-sm preset-filled-primary-500" disabled><IconPlay/></button>
      <button on:click={cloneList} class="btn btn-sm preset-filled-primary-500"><IconCopy />Make a Copy</button>
      <a href={`/api/list/${list.viewId}?type=xspf`} class="btn btn-sm preset-filled-primary-500"><IconDownload />XSPF</a>
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
        <div class="flex items-left p-3 rounded-lg border shadow-md">
          {#await getCoverArt(item.release.mbid)}
            <img src="" alt="" class="w-16 h-16 mr-2 object-cover placeholder animate-pulse rounded-md" />
          {:then value}
            <img src={value || "https://placehold.co/100?text=NA"} alt="" class="w-16 h-16 mr-2 object-cover rounded-md" />
          {:catch error}
            <img src="https://placehold.co/100?text=NA" alt="" class="w-16 h-16 mr-2 object-cover rounded-md" />
          {/await}
          <div>
            <div class="font-medium"><a class="anchor" href={`https://musicbrainz.org/recording/${item.mbid}`}>{item.title}</a>
              <span class="text-sm text-gray-500"><SongDuration song={item} /></span>
            </div>
            <div class="text-sm"><a class="anchor" href={`https://musicbrainz.org/artist/${item.artist.mbid}`}>{item.artist.title}</a></div>
            <div class="text-sm text-gray-500"><a class="anchor" href={`https://musicbrainz.org/release/${item.release.mbid}`}>{item.release.title} ({item.release.date})</a></div>
            <div class="mt-2 flex space-x-2">
              <span><a class="anchor" href={`https://youtube.com/results?search_query=${encodeURIComponent(item.title + ' ' + item.artist.title)}`} target="_blank"><IconYoutubeIcon /></a></span>
              <button on:click={async () => await playTrackOnSpotify(item)}><IconSpotify /></button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
