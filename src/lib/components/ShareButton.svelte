<script lang='ts'>
  import { getContext } from 'svelte';
  import IconDownload from 'virtual:icons/la/download';
  import IconCopy from 'virtual:icons/la/copy';
  import IconShare from 'virtual:icons/la/share';
  import IconLock from 'virtual:icons/la/lock';
  import IconGlobe from 'virtual:icons/la/globe';
  import { Modal, Switch } from '@skeletonlabs/skeleton-svelte';
  import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
  import QrCode from './QrCode.svelte';
  import { saveList } from '$lib/ops';

  let toast: ToastContext = $state(getContext('toast'));
  let openState = $state(false);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    toast.create({
      title: 'Copied',
      description: 'The link was copied to the clipboard!',
      type: 'success',
    });
  }

  let { list, isEdit = false } = $props();

  async function handlePublicToggle(e) {
    list = {...list, isPublic: e.checked, lastModifiedOn: new Date()};
    await saveList(list);
  }

</script>

<Modal bind:open={openState}
  triggerBase="btn btn-sm preset-filled-primary-500 inline-flex w-full justify-center gap-x-1.5 px-3 py-2"
  contentBase="card w-full bg-surface-100 p-6 space-y-4 shadow-2xl max-w-screen-sm rounded-lg">

  {#snippet trigger()}<IconShare /> Share{/snippet}
  {#snippet content()}
    <header class="flex justify-between items-center pb-2">
      <h5 class="h5">Share Playlist</h5>
    </header>

    <article class="space-y-4">
      <div class="grid grid-cols-3">
        <p class="text-gray-600 text-lg col-span-full">View-only Link</p>
        <div class="col-span-2">
          <div class="mt-2 mb-2">This allows people to only see and play the list. You can also share this link via the QR Code.</div>
          <div class="flex items-center gap-2 mt-4 mb-4">
            <input class="input w-full p-2" readonly value={`${(new URL(document.URL)).origin}/list/${list.viewId}`} />
            <button class="btn p-2 preset-tonal" onclick={() => copyToClipboard(`${(new URL(document.URL)).origin}/list/${list.viewId}`)}>
              <IconCopy />
            </button>
          </div>
          {#if isEdit}
            <div class="flex items-center mt-4 mb-4">
              <Switch name="public" bind:checked={list.isPublic} onCheckedChange={handlePublicToggle}>
                {#snippet inactiveChild()}<IconLock />{/snippet}
                {#snippet activeChild()}<IconGlobe />{/snippet}
              </Switch>
              <span class="pl-2">Make {#if list.isPublic} Private {:else} Public {/if} </span>
            </div>
          {/if}
          {#if list.isPublic}
            <div class="text-primary-800">This playlist is publicly listed on this server and can be <i>viewed</i> by anyone.</div>
          {:else}
            <div class="text-primary-800">This list has not been publicly listed by the author(s). Only people with view or edit links can access this playlist.</div>
          {/if}
        </div>
        <div class="col-span-1 flex justify-end">
          <QrCode viewId={list.viewId} />
        </div>
      </div>

      {#if isEdit}
        <div class="col-span-full">
          <p class="text-gray-600 text-lg mt-7">Edit Link</p>
          <div class="mt-2 mb-2">This allows editing everything about the playlist. Share with caution.</div>
          <div class="flex items-center gap-2 mt-4 mb-2">
            <input class="input w-full p-2" readonly value={`${(new URL(document.URL)).origin}/edit/${list.editId}`} />
            <button class="btn p-2 preset-tonal" onclick={() => copyToClipboard(`${(new URL(document.URL)).origin}/edit/${list.editId}`)}>
              <IconCopy />
            </button>
          </div>
        </div>
      {/if}
    </article>

    <footer class="flex justify-end gap-4 pt-2">
      <a href={`/api/list/${list.viewId}?type=xspf`} class="btn preset-tonal">
        <IconDownload class="mr-2" /> Download list as XSPF
      </a>
      <button type="button" class="btn preset-tonal" onclick={() => openState = false}>Done</button>
    </footer>
  {/snippet}
</Modal>
