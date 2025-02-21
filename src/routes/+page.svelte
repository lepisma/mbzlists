<script>
  import { goto } from '$app/navigation';
  import { createList, deleteList, loadFromLocalStorage } from '$lib/ops';
  import { formatDistanceToNow } from 'date-fns';
  import IconPlusCircle from 'virtual:icons/la/plus-circle';
  import IconTrash from 'virtual:icons/la/trash';

  let lists = loadFromLocalStorage();
  let listName = '';
</script>

<svelte:head>
  <title>mbzlists</title>
</svelte:head>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzlists</a>
    </h1>

    <h3 class="text-l font-italic mb-4">
      Total {lists.length} playlists remembered on this machine.
    </h3>

    <div>
      <div class="flex items-center ml-1">
	<input type="search" class="w-full border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 input" bind:value={listName} placeholder="List Name" />
        <button on:click={async () => {
            let list = await createList(listName, []);
            goto(`/edit/${list.editId}`);
          }} class="btn preset-filled-primary-500 ml-2">
          Add <IconPlusCircle />
        </button>
      </div>
    </div>
  </div>

  <div class="space-y-2 col-span-full">
    {#if lists.length === 0}
      <p class="italic">Your have no playlist!</p>
    {:else}
      {#each lists as list}
        <div class="flex items-center justify-between p-3 rounded-lg border">
          <div>
            <div class="font-medium"><a href={`/edit/${list.editId}`}>{list.name}</a></div>
            <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
            <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
          </div>
          <button
            type="button"
            on:click={async () => {
              await deleteList(list);
              lists = loadFromLocalStorage();
            }}
            class="btn preset-filled-error-500">
            <IconTrash />
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
