<script lang='ts'>
  let { song } = $props();

  let duration = $derived.by(() => {
    if (song.length) {
      let totalSeconds = Math.floor(song.length / 1000);
      let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      let seconds = String(totalSeconds % 60).padStart(2, '0');

      return `${minutes}:${seconds}`;
    } else {
      return '';
    }
  });
</script>

<span>{duration}</span>
