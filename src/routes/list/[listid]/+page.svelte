<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import PlayListDuration from '$lib/components/PlayListDuration.svelte';
  import PlayListPlayButton from '$lib/components/PlayListPlayButton.svelte';
  import PlayListMenuButton from '$lib/components/PlayListMenuButton.svelte';
  import PlayListEditor from '$lib/components/PlayListEditor.svelte';
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { loadList  } from '$lib/ops';
  import { rememberItem } from '$lib/utils';
  import type { List } from '$lib/types';
  import { formatDistanceToNow } from 'date-fns';

  let list: List = $state({
    viewId: $page.params.listid,
    name: '',
    items: [],
    createdOn: new Date(),
    lastModifiedOn: new Date(),
    isPublic: false,
    description: '',
  });

  onMount(async () => {
    list = await loadList(list.viewId);
    // Every list that we view is remembered
    rememberItem('viewableItems', list.viewId, id => id);
  });
</script>

<svelte:head>
  <title>{list.name} | mbzlists</title>
</svelte:head>

<div class="mb-3">
  <h2 class="text-4xl font-semibold mb-2">{list.name}</h2>
  <div class="text-sm text-gray-400">
    <span title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span title={list.lastModifiedOn}>modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
  </div>

  <div class="mt-2 italic mb-4">Total {list.items.length} songs, duration <PlayListDuration list={list} /></div>

  <div class="flex space-x-2">
    <PlayListPlayButton list={list} />
    <ShareButton list={list} />
    <PlayListMenuButton list={list} />
  </div>
</div>

<div>
  {#if list.items.length === 0}
    <p class="italic">This list is empty</p>
  {:else}
    <PlayListEditor list={list} isEdit={false} />
  {/if}
</div>
