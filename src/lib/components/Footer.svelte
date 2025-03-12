<script>
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import { env } from '$env/dynamic/public';
  import IconDoc from 'virtual:icons/solar/document-add-linear';
  import IconDB from 'virtual:icons/solar/database-outline';
  import IconBug from 'virtual:icons/solar/bug-linear';
  import IconContact from 'virtual:icons/solar/chat-square-call-linear';

  let dataModalState = $state(false);
  let showDataPolicySection = env.PUBLIC_BASE_URL ? env.PUBLIC_BASE_URL === 'https://mbzlists.com/' : false;

  function modalClose() {
    dataModalState = false;
  }

  function pickRandomQuote() {
    let quotes = [
      '"Hello" - Adele',
      '"I can see you laughing through dreams of perfect sleep" - Slowdive',
      '"All secrets sleep in winter clothes" - Neutral Milk Hotel',
      '"You got a face not spoiled by beauty" - U2',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
</script>

<footer class="p-6 rounded-b-lg grid grid-cols-2">
  <div>
    <ul>
      <li><a href="#" class="anchor flex items-center disabled"><IconDoc class="mr-2" /> Documentation</a></li>
      {#if showDataPolicySection}
        <Modal
          bind:open={dataModalState}
          triggerBase="anchor flex items-center"
          contentBase="card p-4 bg-surface-100 dark:bg-surface-900 space-y-4 shadow-xl max-w-screen-sm rounded-lg"
          backdropClasses="backdrop-blur-sm"
          >
          {#snippet trigger()}<IconDB class="mr-2" /> Privacy & Data Policy{/snippet}
          {#snippet content()}
          <header class="flex justify-between">
            <h4 class="h4">Privacy & Data Policy</h4>
          </header>
          <article class="space-y-3">
            <p>
              There are no personally identifiable information stored in
              mbzlists other than what you store in the list itself. As you
              create or view lists, your device <i>remembers</i> them by storing
              their IDs in local storage. If you change devices or don't have
              any other way of getting edit or view link of a list, you will
              loose them.
            </p>
            <p>
              On mbzlists.com, public lists will be downloadable under a
              non-commercial license. Your own private lists can be downloaded
              in a dump. The export feature is yet to be added.
            </p>
            <p>
              You can self-host <i>mbzlists</i> to get even more control on your
              data. Check out <a class="anchor" href="https://github.com/lepisma/mbzlists">the source</a> for that.
            </p>
          </article>
          {/snippet}
        </Modal>
      {/if}
      <li><a href="https://github.com/lepisma/mbzlists/issues" target="_blank" class="anchor flex items-center"><IconBug class="mr-2" /> Issues & Feature Requests</a></li>
      <li><a href="#" class="anchor flex items-center disabled"><IconContact class="mr-2" /> Support & Contact</a></li>
    </ul>
  </div>
  <div>
    <blockquote class="blockquote">
      {pickRandomQuote()}
    </blockquote>

    <div class="mt-4">
      <em>mbzlists</em> is an <a class="anchor" href="https://github.com/lepisma/mbzlists">Open Source Software</a> designed and made in Bengaluru by <a class="anchor" href="https://unnu.so">unnu</a> and <a class="anchor" href="https://lepisma.xyz">lepisma</a>.
    </div>
  </div>
</footer>
