<script lang='ts'>
  let { song } = $props();

  function calculateDuration() {
    if (song.length) {
      let totalSeconds = Math.floor(song.length / 1000);
      let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      let seconds = String(totalSeconds % 60).padStart(2, '0');

      return `${minutes}:${seconds}`;
    } else {
      return '';
    }
  }
</script>

<span>{calculateDuration()}</span>
