<script lang='ts'>
  import type { List } from '$lib/types';
  let props = $props<{ list: List }>();

  function calculateDuration() {
    const songs = props.list.items;
    const isLowerBound = songs.some((song) => !song.length);
    let totalSeconds = Math.floor(songs.reduce((acc, song) => song.length ? acc + song.length : acc, 0) / 1000);

    let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    totalSeconds %= 3600;
    let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}${isLowerBound ? '+' : ''}`;
  }
</script>

<span>{calculateDuration()}</span>
