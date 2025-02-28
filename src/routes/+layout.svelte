<script lang='ts'>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

  let { children } = $props();
</script>

<div class="max-w-2xl mx-auto rounded-lg shadow-lg">
  <Header />
  <div class="p-6 bg-white dark:bg-gray-700">
    <ToastProvider groupZIndex="!z-[1000]">
      {@render children()}
    </ToastProvider>
  </div>
  <Footer />
</div>
