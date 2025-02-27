<script lang='ts'>
  import { playListOnYt } from '$lib/playback';
  import IconDownload from 'virtual:icons/la/download';
  import IconPlay from 'virtual:icons/la/play';
  import IconYoutubeIcon from 'virtual:icons/logos/youtube-icon';

  let { list } = $props();
  let dropdownState: boolean = $state(false);
</script>

<div class="relative inline-block text-left">
  <div>
    <button type="button" onclick={() => {dropdownState = !dropdownState}} class="btn btn-sm preset-filled-primary-500 inline-flex w-full justify-center gap-x-1.5 px-3 py-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
      <IconPlay/>
      Play List
      <svg class="-mr-1 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  {#if dropdownState }
    <div class="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="py-1" role="none">
        <a href="#" onclick={async () => await playListOnYt(list)} class="flex hover:bg-gray-100 items-center px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0"><IconYoutubeIcon class="mr-2" /> Play on Youtube</a>
      </div>
      <div class="py-1" role="none">
        <a href={`/api/list/${list.viewId}?type=xspf`} class="flex hover:bg-gray-100 items-center px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2"><IconDownload class="mr-2" /> Download as XSPF</a>
      </div>
    </div>
  {/if}
</div>
