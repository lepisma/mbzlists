<script>
    import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { v4 as uuidv4 } from 'uuid';

  function createList() {
    const id = uuidv4();
    let lists = JSON.parse(localStorage.getItem("lists") || "[]");
    lists.push(id);
    localStorage.setItem("lists", JSON.stringify(lists));
    goto(`/list/${id}`);
  }
  let lists = browser ? JSON.parse(localStorage.getItem("lists") || "[]") : [];
</script>

<button on:click={createList}>Create New List</button>

<ul>
  {#each lists as id}
    <li><a href={`/list/${id}`}>List {id}</a></li>
  {/each}
</ul>
