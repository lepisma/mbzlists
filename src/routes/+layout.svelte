<script lang='ts'>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  let { children } = $props();
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg">
  <Header />
  <div class="p-6 bg-white dark:bg-gray-700">
    {@render children()}
  </div>
  <Footer />
</div>
