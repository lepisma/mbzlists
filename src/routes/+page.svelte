<script lang='ts'>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { createList, deleteList, recallEditableLists, recallViewableLists, loadPublicLists } from '$lib/ops';
  import { formatDistanceToNow } from 'date-fns';
  import IconPlusCircle from 'virtual:icons/la/plus-circle';
  import IconTrash from 'virtual:icons/la/trash';
  import IconGlobe from 'virtual:icons/la/globe';
  import IconEye from 'virtual:icons/la/eye';
  import IconPencil from 'virtual:icons/la/pencil-alt';
  import { Tabs } from '@skeletonlabs/skeleton-svelte';

  let editableLists = $state([]);
  let viewableLists = $state([]);
  let publicLists = $state([]);

  let listName = $state('');
  let group = $state('mylists');

  onMount(async () => {
    editableLists = await recallEditableLists();
    viewableLists = await recallViewableLists();
    publicLists = await loadPublicLists();
  });
</script>

<svelte:head>
  <title>mbzlists</title>
</svelte:head>

<Tabs bind:value={group}>
  {#snippet list()}
  <Tabs.Control value="mylists">
    {#snippet lead()}<IconPencil />{/snippet}
    My Lists
  </Tabs.Control>
  <Tabs.Control value="shared">
    {#snippet lead()}<IconEye />{/snippet}
    Shared with me
  </Tabs.Control>
  <Tabs.Control value="public">
    {#snippet lead()}<IconGlobe />{/snippet}
    Public Lists
  </Tabs.Control>
  {/snippet}

  {#snippet content()}
  <Tabs.Panel value="mylists">
    <h3 class="mb-4 italic">
      Total {editableLists.length} playlists remembered on this device. These are lists that you can edit.
    </h3>

    <div class="mb-5">
      <div class="flex items-center ml-1">
	<input type="search" class="w-full border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 input" bind:value={listName} placeholder="List Name" />
        <button onclick={async () => {
          let list = await createList(listName, []);
          goto(`/edit/${list.editId}`);
          }} class="btn preset-filled-primary-500 ml-2">
          Add <IconPlusCircle />
        </button>
      </div>
    </div>

    <div class="space-y-2 col-span-full">
      {#if editableLists.length > 0}
        {#each editableLists as list}
          <div class="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div class="font-medium"><a href={`/edit/${list.editId}`}>{list.name}</a></div>
              <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
              <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
            </div>
            <button
              type="button"
              onclick={async () => {
              await deleteList(list);
              editableLists = await recallEditableLists();
              }}
              class="btn preset-filled-error-500">
              <IconTrash />
            </button>
          </div>
        {/each}
      {/if}
    </div>
  </Tabs.Panel>
  <Tabs.Panel value="shared">
    <h3 class="mb-4 italic">
      Total {viewableLists.length} view-only playlists remembered on this device.
    </h3>

    <div class="space-y-2 col-span-full">
      {#if viewableLists.length > 0}
        {#each viewableLists as list}
          <div class="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div class="font-medium"><a href={`/list/${list.viewId}`}>{list.name}</a></div>
              <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
              <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </Tabs.Panel>
  <Tabs.Panel value="public">
    <h3 class="mb-4 italic">
      Total {publicLists.length} public playlists. These are lists that people have listed on this server.
    </h3>

    <div class="space-y-2 col-span-full">
      {#if publicLists.length > 0}
        {#each publicLists as list}
          <div class="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div class="font-medium"><a href={`/list/${list.viewId}`}>{list.name}</a></div>
              <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
              <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </Tabs.Panel>
  {/snippet}
</Tabs>
