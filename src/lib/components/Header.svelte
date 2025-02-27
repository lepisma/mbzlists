<script>
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  let aboutModalState = $state(false);
  let dataModalState = $state(false);

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
      contentBase="card p-4 space-y-4 shadow-xl max-w-screen-sm"
      backdropClasses="backdrop-blur-sm"
      >
      {#snippet trigger()}About{/snippet}
      {#snippet content()}
      <header class="flex justify-between">
        <h4 class="h4">About</h4>
      </header>
      <article class="space-y-3">
        <p>
          <i>mbzlists</i> is a login-less, anonymous, playlist manager based
          on
          <a href="https://musicbrainz.org/" class="anchor">MusicBrainz's</a>
          global IDs. Its goal is to allow music curation and sharing without
          locking you up in platform silos.
        </p>
      </article>
      {/snippet}
    </Modal>

    <Modal
      bind:open={dataModalState}
      triggerBase="anchor"
      contentBase="card p-4 space-y-4 shadow-xl max-w-screen-sm"
      backdropClasses="backdrop-blur-sm"
      >
      {#snippet trigger()}Data Policy{/snippet}
      {#snippet content()}
      <header class="flex justify-between">
        <h4 class="h4">Data Policy</h4>
      </header>
      <article class="space-y-3">
        <p>
          Since there is no login, there are no personally identified
          information stored in this tool. As you create lists, your
          device <i>remembers</i> them by storing in its local storage. If you
          change devices or don't remember edit or view link of a list, you will
          loose them.
        </p>
        <p>
          Since the data around which songs are grouped together in lists could
          be important for studying patterns and building recommendations,
          mbzlists.com will periodically release, name-redacted, database dump
          under a non-commercial license.
        </p>
        <p>
          Additionally, you can self-host <i>mbzlists</i>. Check out <a class="anchor" href="https://github.com/lepisma/mbzlists">the source</a> for that.
        </p>
      </article>
      {/snippet}
    </Modal>
  </nav>
</header>
