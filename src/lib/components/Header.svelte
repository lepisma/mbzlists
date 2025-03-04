<script>
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import { env } from '$env/dynamic/public';

  let aboutModalState = $state(false);
  let dataModalState = $state(false);
  let showDataPolicySection = env.PUBLIC_BASE_URL ? env.PUBLIC_BASE_URL === 'https://mbzlists.com/' : false;

  function modalClose() {
    aboutModalState = false;
    dataModalState = false;
  }
</script>

<header class="flex items-center justify-between p-6 rounded-t-lg">
  <h1 class="text-3xl font-bold text-gray-400">
    <a href="/"><i>mbzlists</i></a>
  </h1>
  <nav class="flex justify-end p-4 space-x-5">
    <Modal
      bind:open={aboutModalState}
      triggerBase="anchor"
      contentBase="card p-4 bg-surface-100 dark:bg-surface-900 space-y-4 shadow-xl max-w-screen-sm rounded-lg"
      backdropClasses="backdrop-blur-sm"
      >
      {#snippet trigger()}About{/snippet}
      {#snippet content()}
      <header class="flex justify-between">
        <h4 class="h4">About</h4>
      </header>
      <article class="space-y-3">
        <p>
          <i>mbzlists</i> is a login-free annotated playlist manager based on
          <a href="https://musicbrainz.org/" class="anchor">MusicBrainz's</a>
          global IDs. Its goal is to allow high context music curation without
          locking you up in platform silos.
        </p>
      </article>
      {/snippet}
    </Modal>

    {#if showDataPolicySection}
      <Modal
        bind:open={dataModalState}
        triggerBase="anchor"
        contentBase="card p-4 bg-surface-100 dark:bg-surface-900 space-y-4 shadow-xl max-w-screen-sm rounded-lg"
        backdropClasses="backdrop-blur-sm"
        >
        {#snippet trigger()}Data Policy{/snippet}
        {#snippet content()}
        <header class="flex justify-between">
          <h4 class="h4">Data Policy</h4>
        </header>
        <article class="space-y-3">
          <p>
            There are no personally identified information stored here. As you
            create lists, your device <i>remembers</i> them by storing in its
            local storage. If you change devices or don't remember edit or view
            link of a list, you will loose them.
          </p>
          <p>
            On mbzlists.com, public lists will be downloadable under a
            non-commercial license. Your own private lists can be downloaded in
            a dump. These export features are yet to be added.
          </p>
          <p>
            You can self-host <i>mbzlists</i> to get even more control on your
            data. Check out <a class="anchor"
            href="https://github.com/lepisma/mbzlists">the source</a> for that.
          </p>
        </article>
        {/snippet}
      </Modal>
    {/if}
  </nav>
</header>
