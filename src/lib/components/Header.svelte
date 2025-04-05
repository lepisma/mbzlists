<script>
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  let aboutModalState = $state(false);

  function modalClose() {
    aboutModalState = false;
  }
</script>

<header class="flex items-center justify-between p-6 rounded-t-lg">
  <h1 class="text-3xl font-bold text-gray-400">
    <a href="/app" title="Go to App"><i>mbzlists</i></a>
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
        <p>
          Go to <a href="/" class="anchor" onclick={modalClose}>the home page</a> to know more.
        </p>
      </article>
      {/snippet}
    </Modal>
  </nav>
</header>
