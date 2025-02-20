<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { v4 as uuidv4 } from 'uuid';

  async function createList(name) {
    const listItem = {
      name: name,
      editId: uuidv4(),
      viewId: uuidv4(),
    };

    let lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists.push(listItem);
    localStorage.setItem('lists', JSON.stringify(lists));

    await fetch(`/api/edit/${listItem.editId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listid: listItem.viewId, name: listItem.name, items: [] }),
    });

    goto(`/edit/${listItem.editId}`);
  }
  let lists = browser ? JSON.parse(localStorage.getItem('lists') || '[]') : [];
  let listName = '';
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
  <div class="col-span-2">
    <h1 class="text-3xl font-bold text-gray-400 mb-4">
      <a href="/">mbzcodes</a>
    </h1>

    <h3 class="text-l font-italic mb-4">
      Total {lists.length} playlists remembered on this machine.
    </h3>

    <div class="flex space-x-4 mb-4">
      <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
	<input type="search" bind:value={listName} placeholder="List Name" />
        <button on:click={() => createList(listName)} class="btn variant-filled-primary">
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
        <div class="flex items-center justify-between p-3 rounded-lg border shadow-md">
          <div>
            <div class="font-medium"><a href={`/edit/${list.editId}`}>{list.name}</a></div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
