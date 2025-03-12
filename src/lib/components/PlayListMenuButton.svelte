<script lang='ts'>
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import IconBars from 'virtual:icons/la/bars';
  import IconCopy from 'virtual:icons/la/copy';
  import IconTrash from 'virtual:icons/la/trash';
  import { OutClick } from 'svelte-outclick';
  import { createList, deleteList } from '$lib/ops';

  let { list, isEdit = false } = $props();
  let dropdownState: boolean = $state(false);

  async function cloneList() {
    let clonedList = await createList(`Copy of ${list.name}`, list.blocks);
    window.open(`/edit/${clonedList.editId}`, '_blank');
  }
</script>

<div class="relative inline-block text-left">
  <div>
    <button type="button" onclick={() => {dropdownState = !dropdownState}} class="btn btn-sm preset-filled-primary-500 inline-flex w-full justify-center gap-x-1.5 px-3 py-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
      <IconBars />
    </button>
  </div>

  {#if dropdownState }
    <OutClick onOutClick={() => dropdownState = false}>
      <div class="absolute z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white ring-1 shadow-lg ring-black/5 dark:ring-white/10 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
        <div class="py-1" role="none">
          <a href="#" onclick={cloneList} class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconCopy class="mr-2" />Make a Copy</a>
          {#if isEdit}
            <a href="#" onclick={
               async () => {
                 await deleteList(list);
                 goto('/app');
              }} class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconTrash class="mr-2" />Delete List</a>
          {/if}
        </div>
      </div>
    </OutClick>
  {/if}
</div>
