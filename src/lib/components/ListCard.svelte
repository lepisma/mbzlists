<script lang='ts'>
  import IconTrash from 'virtual:icons/la/trash';
  import IconLock from 'virtual:icons/la/lock';
  import IconGlobe from 'virtual:icons/la/globe';
  import { formatDistanceToNow } from 'date-fns';

  let { list, deleteCallback = null } = $props();
</script>

<div class="flex items-center justify-between p-3 rounded-lg border">
  <div>
    <div class="font-medium">
      <a class="flex items-center" href={list.editId ? `/edit/${list.editId}` : `/list/${list.viewId}`}>
        {#if list.isPublic }
          <IconGlobe class="mr-1"/>
        {:else}
          <IconLock class="mr-1"/>
        {/if}
        {list.name}
      </a>
    </div>
    <span class="text-sm text-gray-400" title={list.createdOn}>Created: {formatDistanceToNow(list.createdOn, { addSuffix: true })}, </span>
    <span class="text-sm text-gray-400" title={list.lastModifiedOn}>Modified: {formatDistanceToNow(list.lastModifiedOn, { addSuffix: true })}</span>
  </div>
  {#if deleteCallback}
    <button type="button" onclick={deleteCallback} class="btn preset-filled-error-500">
      <IconTrash />
    </button>
  {/if}
</div>
