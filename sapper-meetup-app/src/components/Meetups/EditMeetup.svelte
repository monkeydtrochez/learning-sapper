<script>
    import meetups from '../../Stores/meetups-store.js';
    import { createEventDispatcher } from 'svelte';
    import TextInput from "../../components/UI/TextInput.svelte";
    import Button from "../../components/UI/Button.svelte";
    import Modal from '../../components/UI/Modal.svelte';
    import {notEmpty, isValidEmail} from '../../helpers/validation.js'
    
    export let id = null;
    
    let title = "";
    let subTitle = "";
    let address = "";
    let imageUrl = "";
    let contactEmail = "";
    let description = "";
    
    if (id) {
        const unsubscribe = meetups.subscribe(meetupItems => {
            const selectedMeetup = meetupItems.find(item => item.id === id);
            title = selectedMeetup.title;
            subTitle = selectedMeetup.subtitle;
            address = selectedMeetup.address;
            imageUrl = selectedMeetup.imageUrl;
            contactEmail = selectedMeetup.contact;
            description = selectedMeetup.description;
        });
        unsubscribe();
    }
    
    $: titleValid = !notEmpty(title);
    $: subtitleValid = !notEmpty(subTitle);
    $: addressValid = !notEmpty(address);
    $: imageUrlValid = !notEmpty(imageUrl);
    $: contactEmailValid = !notEmpty(contactEmail) && isValidEmail(contactEmail);
    $: descriptionValid = !notEmpty(description);
    $: formIsValid = titleValid && subtitleValid && addressValid && imageUrlValid && contactEmailValid && descriptionValid;
    
    const dispatch = createEventDispatcher();
    
    function submitForm () {
        const newMeetup = {
            title: title,
            subtitle: subTitle,
            description: description,
            imageUrl: imageUrl,
            address: address,
            contact: contactEmail
        }
        
        if(id) {
            fetch(`https://monkey-svelte-course-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(newMeetup),
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if(!res.ok) {
                    throw new Error("Something went wrong!");
                }
                meetups.updateMeetup(id, newMeetup);
            }).catch(err => {
                console.log(err);
            });
        }
        else {
            fetch("https://monkey-svelte-course-default-rtdb.europe-west1.firebasedatabase.app/meetups.json", {
                method: 'POST',
                body: JSON.stringify({...newMeetup, isFavorite: false}),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error("Something went wrong!");
                }
                return res.json();
            })
            .then(data => {
                meetups.addMeetup({...newMeetup, isFavorite: false, id: data.name});
            })
            .catch(err => {
                console.log(err);
            });
        }
        
        dispatch('save');
    }
    
    function cancel() {
        dispatch('cancel');
    }
    
    function deleteMeetup() {
        fetch(`https://monkey-svelte-course-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
            method: 'DELETE',
        }).then(res => {
            if(!res.ok) {
                throw new Error("Something went wrong!");
            }
            meetups.deleteMeetup(id);
            dispatch('cancel');
        }).catch(err => {
            console.log(err);
        });
    }
</script>

<style>
    form {
        width: 100%;
    }
</style>

<Modal title="Edit meetup data" on:cancel>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
        id="title"
        label="Title"
        value={title}
        isValid={titleValid}
        errorMessage="Please enter a valid title"
        on:input={event => (title = event.target.value)} />
        <TextInput
        id="subtitle"
        label="Subtitle"
        value={subTitle}
        isValid={subtitleValid}
        errorMessage="Please enter a valid subtitle"
        on:input={event => (subTitle = event.target.value)} />
        <TextInput
        id="address"
        label="Address"
        value={address}
        isValid={addressValid}
        errorMessage="Please enter a valid address"
        on:input={event => (address = event.target.value)} />
        <TextInput
        id="imageUrl"
        label="Image URL"
        value={imageUrl}
        isValid={imageUrlValid}
        errorMessage="Please enter a valid image url"
        on:input={event => (imageUrl = event.target.value)} />
        <TextInput
        id="email"
        label="E-Mail"
        type="email"
        value={contactEmail}
        isValid={contactEmailValid}
        errorMessage="Please enter a valid email"
        on:input={event => (contactEmail = event.target.value)} />
        <TextInput
        id="description"
        label="Description"
        controlType="textarea"
        isValid={descriptionValid}
        errorMessage="Please enter a valid description"
        bind:value={description} />
    </form>
    <div slot="footer">
        <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
        <Button type="button" disabled={!formIsValid} on:click={submitForm}>Save</Button>
        {#if id}
        <Button type="button" on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>