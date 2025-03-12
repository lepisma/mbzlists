<script>
  import IconUnlock from 'virtual:icons/solar/heart-unlock-bold-duotone';
  import IconSafe from 'virtual:icons/solar/safe-square-bold-duotone';
  import IconDB from 'virtual:icons/solar/database-bold-duotone';
  import IconCode from 'virtual:icons/solar/sidebar-code-bold-duotone';
  import IconNotebook from 'virtual:icons/solar/notebook-bookmark-bold-duotone';
  import IconNoUser from 'virtual:icons/solar/user-minus-bold-duotone';
  import IconSpeaker from 'virtual:icons/solar/speaker-minimalistic-bold-duotone';
  import IconShare from 'virtual:icons/solar/share-circle-bold-duotone';
</script>

<div class="min-h-screen flex flex-col items-center justify-center text-gray-900">
  <div class="p-8">
    <p class="text-4xl font-bold text-gray-500 dark:text-gray-400">mbzlists</p>
    <h2 class="h2">Music Curation<br> <i>by <b>Humans</b>, for <b>Humans</b></i></h2>
    <p class="text-2xl mt-2 dark:text-gray-100">Share <i>stories</i> & <i>handpicked</i> songs, not an algorithm generated list</p>
    <a href="/app" class="btn preset-filled-primary-500 mt-7 mr-2">Open App</a>
    <button class="btn preset-outlined-surface-800-200 hover:preset-tonal mt-7 dark:text-gray-100 disabled">Why?</button>
  </div>

  <section class="max-w-4xl p-8 space-y-10">
    <div class="grid grid-cols-1">
      <div>
        <IconNotebook style="font-size: 3em;" class="dark:text-gray-300" />
        <h4 class="h4">More than Songs</h4>
        <div class="text-gray-600 dark:text-gray-200">
          When we share songs with <i>heart</i> we share stories
          too. <i>mbzlists</i> allows you to create your stories with annotated
          playlists full of rich text and images.
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <div>
        <IconNoUser style="font-size: 3em;" class="dark:text-gray-300" />
        <h4 class="h4">No Account needed</h4>
        <div class="text-gray-600 dark:text-gray-200">
          <i>mbzlists</i> works with shareable view and edit links and doesn't
          need to know anything about you.
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <div>
        <IconSpeaker style="font-size: 3em;" class="dark:text-gray-300" />
        <h4 class="h4">Play Anywhere</h4>
        <div class="text-gray-600 dark:text-gray-200">
          Play songs on YouTube or Spotify (other services to be added). Or just download the XSPF playlist and use content resolvers to play on your player of choice.
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <div>
        <IconDB style="font-size: 3em;" class="dark:text-gray-300" />
        <h4 class="h4">High Quality Metadata</h4>
        <div class="text-gray-600 dark:text-gray-200">
          We rely on the community-backed <a class="anchor" href="https://musicbrainz.org/" target="_blank">MusicBrainz</a> project which provides free and reliable source of metadata.
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <div>
        <IconShare style="font-size: 3em;" class="dark:text-gray-300" />
        <h4 class="h4">Public Lists and Shares</h4>
        <div class="text-gray-600 dark:text-gray-200">
          Keep lists private, share with people you want to, or make them
          public. The choice is yours.
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-4xl p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      <div class="p-4 shadow-lg rounded-lg">
        <IconUnlock style="font-size: 2em;" class="dark:text-gray-300" />
        <h5 class="h5">No Platform lock-ins</h5>
        <div class="text-sm text-gray-600 dark:text-gray-200">
          Take your data with globally identifiable MusicBrainz IDs and use them
          anywhere.
        </div>
      </div>
      <div class="p-4 shadow-lg rounded-lg">
        <IconCode style="font-size: 2em;" class="dark:text-gray-300" />
        <h5 class="h5">Self-hosted & FOSS</h5>
        <div class="text-sm text-gray-600 dark:text-gray-200">
          <i>mbzlists</i> is a Free and Open-Source Software that you can easily
          self host if you want more control over your data.
        </div>
      </div>
      <div class="p-4 shadow-lg rounded-lg disabled">
        <IconSafe style="font-size: 2em;" class="dark:text-gray-300" />
        <h5 class="h5">E2E encryption</h5>
        <div class="text-sm text-gray-600 dark:text-gray-200">
          [Coming Soon] All list data is by default end to end encrypted. Only
          you know what's in your list.
        </div>
      </div>
      <div class="p-4 shadow-lg rounded-lg">
        <IconDB style="font-size: 2em;" class="dark:text-gray-300" />
        <h5 class="h5">Data NOT for Sale</h5>
        <div class="text-sm text-gray-600 dark:text-gray-200">
          On <i>mbzlists.com</i>, only data from public playlists are accessible
          widely, that too under a non-commercial license.
        </div>
      </div>
    </div>
  </section>
</div>
