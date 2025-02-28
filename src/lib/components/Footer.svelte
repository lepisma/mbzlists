<script>
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

<footer class="p-6 rounded-b-lg">
  <blockquote class="blockquote mb-4">
    {pickRandomQuote()}
  </blockquote>
  <p class="text-italic">
    <em>mbzlists</em> is an <a class="anchor" href="https://github.com/lepisma/mbzlists">Open Source Software</a> designed and made in Bengaluru by <a class="anchor" href="https://unnu.so">unnu</a> and <a class="anchor" href="https://lepisma.xyz">lepisma</a>
  </p>
</footer>
