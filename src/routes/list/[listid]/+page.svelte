<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount, getContext } from 'svelte';
  import SongDuration from '$lib/components/SongDuration.svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import PlayListPlayButton from '$lib/components/PlayListPlayButton.svelte';
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { loadList, createList,  } from '$lib/ops';
  import { getCoverArt } from '$lib/mb';
  import { rememberItem } from '$lib/utils';
  import type { List } from '$lib/types';
  import { playTrackOnSpotify, playTrackOnYt } from '$lib/playback';
  import { goto } from '$app/navigation';
  import { formatDistanceToNow } from 'date-fns';
  import IconCopy from 'virtual:icons/la/copy';
  import IconYoutubeIcon from 'virtual:icons/logos/youtube-icon';
  import IconSpotify from 'virtual:icons/logos/spotify';
  import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

  let list: List = $state({
    viewId: $page.params.listid,
    name: '',
    items: [],
    createdOn: new Date(),
    lastModifiedOn: new Date(),
    isPublic: false,
    description: '',
  });

  let toast: ToastContext = $state(getContext('toast'));

  async function cloneList() {
    let clonedList = await createList(`Copy of ${list.name}`, list.items);
    goto(`/edit/${clonedList.editId}`);
  }

  onMount(async () => {
    list = await loadList(list.viewId);
    // Every list that we view is remembered
    rememberItem('viewableItems', list.viewId, id => id);
  });
</script>

<svelte:head>
  <title>{list.name} | mbzlists</title>
</svelte:head>

<div class="mb-7">
  <h2 class="text-4xl font-semibold mb-2">{list.name}</h2>
  <div class="text-sm text-gray-400">
    <span title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span title={list.lastModifiedOn}>modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
  </div>

  <div class="max-w-sm mt-2">
    <p>{list.description}</p>
  </div>

  <div class="mt-2 italic mb-4">Total {list.items.length} songs, duration <PlayListDuration list={list} /></div>

  <div class="flex space-x-2">
    <PlayListPlayButton list={list} />
    <ShareButton list={list} />
    <button onclick={cloneList} class="btn btn-sm preset-filled-primary-500"><IconCopy />Make a Copy</button>
  </div>
</div>

<div>
  {#if list.items.length === 0}
    <p class="italic">This list is empty</p>
  {:else}
    {#each list.items as item}
      <div class="flex items-left mt-2 p-3 rounded-lg border shadow-sm">
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
            <button title="Play on Youtube" onclick={async () => await playTrackOnYt(item, toast) }><IconYoutubeIcon /></button>
            <button title="Play on Spotify" onclick={async () => await playTrackOnSpotify(item, toast)}><IconSpotify /></button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
