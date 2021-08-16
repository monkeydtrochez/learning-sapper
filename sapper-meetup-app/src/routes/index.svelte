<script context="module">
	export function preload(page) {
		console.log("preloading: ", page);	
		return this.fetch("https://monkey-svelte-course-default-rtdb.europe-west1.firebasedatabase.app/meetups.json")
		.then(res => {
			if(!res.ok) {
				throw new Error("Something went wrong try again later!");
			}
			return res.json();
		})
		.then(data => {
			const meetups = [];
			for (const key in data) {
				meetups.push({
					...data[key],
					id: key
				});
			}
			return {fetchedMeetups: meetups.reverse()};
		})
		.catch(err => {
			console.log(err)
			this.error(500, `Could not fetch meetups! - ${err}`)
		});
	}
</script>

<script>
	import {onMount, onDestroy} from 'svelte';
	import MeetupItem from "../components/Meetups/MeetupItem.svelte";
	import EditMeetup from "../components/Meetups/EditMeetup.svelte";
	import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";
	import MeetupFilter from "../components/Meetups/MeetupFilter.svelte"
	import Button from "../components/UI/Button.svelte";
	import meetupsStore from "../Stores/meetups-store.js";
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	
	export let fetchedMeetups;
	let unsubscribe;
	let editMode = null;
	let editId;
	let isLoading;
	let showOnlyFavorites = false;
	
	onMount(() => {
		meetupsStore.setMeetups(fetchedMeetups);
		unsubscribe =meetupsStore.subscribe(items => {
			fetchedMeetups = items;
		});
	});
	
	$: filteredMeetups = showOnlyFavorites ? fetchedMeetups.filter(x => x.isFavorite) : fetchedMeetups;
	
	onDestroy(() => {
		if(unsubscribe) {
			unsubscribe();
		}
	});
	
	function filterGrid(event) {
		showOnlyFavorites = event.detail === 1;
	}
	
	function saveMeetup() {
		editMode = null;
		editId = null;
	}
	
	function cancelEdit(){
		editMode = null;
		editId = null;
	}
	
	function editMeetup(event) {
		editMode = "edit"
		editId = event.detail;
	}
	
	function addNewMeetup() {
		editMode = "edit";
	}
</script>

<style>
	#meetups {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
	}
	
	#no-meetups {
		margin: 1rem;
	}
	
	#meetups-control {
		margin: 1rem;
		display: flex;
		justify-content: space-between;
	}
	
	@media (min-width: 768px) {
		#meetups {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>

<svelte:head>
<title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
<EditMeetup id={editId} on:save={saveMeetup} on:cancel={cancelEdit}/>
{/if}
{#if isLoading}
<LoadingSpinner />
{:else}
<section id="meetups-control">
	<MeetupFilter on:select={filterGrid}/>
	<Button on:click={addNewMeetup} >New meetup</Button>
</section>

{#if filteredMeetups.length === 0}
<p id="no-meetups">There is now meetups, go ahead and add meetups.</p>
{/if}
<section id="meetups">
	{#each filteredMeetups as item (item.id)}
	<div transition:scale animate:flip={{duration: 300}}>
		<MeetupItem
		id={item.id}
		title={item.title}
		subtitle={item.subtitle}
		description={item.description}
		image={item.imageUrl}
		address={item.address}
		isFavorite={item.isFavorite}
		on:edit={editMeetup}
		/>
	</div>
	{/each}
</section>
{/if}

