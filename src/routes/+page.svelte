<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { createList, deleteList } from '$lib/ops';

  let lists = browser ? JSON.parse(localStorage.getItem('lists') || '[]') : [];
  let listName = '';
</script>

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
          Create
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
          </div>
          <button
            type="button"
            on:click={async () => {
              await deleteList(list);
              if (browser) {
                lists = JSON.parse(localStorage.getItem('lists') || '[]');
              }
            }}
            class="btn btn-sm preset-filled-error-500"
            >
            Delete
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>
