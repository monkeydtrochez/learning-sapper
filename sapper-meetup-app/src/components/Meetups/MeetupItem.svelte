<script>
  import {createEventDispatcher} from 'svelte';
  import meetups from '../../Stores/meetups-store.js';
  import Button from "../../components/UI/Button.svelte";
  import Badge from "../../components/UI/Badge.svelte";
  
  export let id;
  export let title;
  export let subtitle;
  export let description;
  export let image;
  export let address;
  export let isFavorite;
  
  const dispatch = createEventDispatcher();
  
  function toggleFavorite (){
    fetch(`https://monkey-svelte-course-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({"isFavorite": !isFavorite}),
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      if(!res.ok) {
        throw new Error("Something went wrong!");
      }
      meetups.toggleFavorite(id);
    }).catch(err => {
      console.log(err);
    });
  }
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }
  
  header,
  .content,
  footer {
    padding: 1rem;
  }
  
  .image {
    width: 100%;
    height: 14rem;
  }
  
  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }
  
  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }
  
  p {
    font-size: 1.25rem;
    margin: 0;
  }
  
  div {
    text-align: right;
  }
  
  .content {
    height: 4rem;
  }
</style>

<article id="{id}">
  <header>
    <h1 class="is-favorite">
      {title}
      {#if isFavorite}
      <Badge>FAVORITE</Badge>
      {/if}
    </h1>
    <h2>{subtitle}</h2>
    <p>{address}</p>
  </header>
  <div class="image">
    <img src="{image}" alt="meetup-img"/>
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button type="button" on:click={() => dispatch('edit', id)} >Edit</Button>
    <Button 
    mode="outline" 
    color={isFavorite ? null : 'success'}
    type="button" 
    on:click={toggleFavorite}>
    {isFavorite ? 'Unfavorite' : 'Favorite'}
  </Button>
  <Button type="Button" href="/{id}" >Show details</Button>
</footer>
</article>