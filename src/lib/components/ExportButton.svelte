<script lang='ts'>
  import { getContext } from 'svelte';
  import IconExport from 'virtual:icons/solar/export-linear';
  import IconSpotifyIcon from 'virtual:icons/hugeicons/spotify';
  import IconYouTubeIcon from 'virtual:icons/si/youtube-line';
  import IconMedia from 'virtual:icons/fluent-mdl2/media';
  import IconXML from 'virtual:icons/tabler/file-type-xml';
  import { OutClick } from 'svelte-outclick';
  import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

  let { list } = $props();
  let dropdownState: boolean = $state(false);
  let toast: ToastContext = $state(getContext('toast'));

  function resolverExportUrl (app: string) {
    let root = `https://resolvers.mbzlists.com/${app}/create`;
    let current_url = new URL(document.URL);
    let mbzlists_url =`${current_url.origin}/list/${list.viewId}`;
    return root + '?mbzlists_url=' + encodeURI(mbzlists_url);
  }
</script>

<div class="relative inline-block text-left">
  <div>
    <button type="button" onclick={() => {dropdownState = !dropdownState}} class="btn btn-sm preset-filled-primary-500 inline-flex w-full justify-center gap-x-1.5 px-3 py-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
      <IconExport />
      Export
      <svg class="-mr-1 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  {#if dropdownState }
    <OutClick onOutClick={() => dropdownState = false}>
      <div class="absolute z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white ring-1 shadow-lg ring-black/5 dark:ring-white/10 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
        <div class="py-1" role="none">
          <a href={resolverExportUrl('spotify')} target="_blank" class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconSpotifyIcon class="mr-2" /> Export to Spotify</a>
          <a href="https://resolvers.mbzlists.com" target="_blank" class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconMedia class="mr-2" /> Export to Subsonic</a>
        </div>
        <div class="py-1" role="none">
          <a href={`/api/list/${list.viewId}?type=xspf`} class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconXML class="mr-2" /> Download as XSPF</a>
          <a href={`/api/list/${list.viewId}`} class="flex hover:bg-primary-100 dark:hover:bg-primary-700 items-center px-4 py-2 text-sm transition-colors duration-150" role="menuitem" tabindex="-1" id="menu-item-0"><IconXML class="mr-2" /> Download as JSON</a>
        </div>
      </div>
    </OutClick>
  {/if}
</div>
