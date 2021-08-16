import {writable} from "svelte/store";

const meetups = writable([]);

    const meetupStore = {
        subscribe: meetups.subscribe,
        setMeetups: (loadedMeetups) => {
            meetups.set(loadedMeetups);
        },
        addMeetup: (meetupData) => {
            const newMeetup = {
                ...meetupData
            };
            meetups.update(meetupItems  => {
                return [newMeetup, ...meetupItems];
            });
        },
        updateMeetup: (id, updatedMeetupData) => {
            meetups.update(meetupItems => {
                const meetupIndex = meetupItems.findIndex(x => x.id === id);
                const updatedMeetups = [...meetupItems];
                const updatedMeetup = { ...updatedMeetups[meetupIndex], ...updatedMeetupData}
                updatedMeetups[meetupIndex] = updatedMeetup;
                return updatedMeetups;
            });
        },
        deleteMeetup: (id) => {
            meetups.update(meetupItems => {
                return meetupItems.filter(x => x.id !== id);
            });
        },
        toggleFavorite: (id) => {
            meetups.update(meetupItems => {
                const meetupToUpdate = { ...meetupItems.find(x => x.id === id) };
                meetupToUpdate.isFavorite = !meetupToUpdate.isFavorite;
                const meetupIndex = meetupItems.findIndex(x => x.id === id);
                const updatedMeetups = [...meetupItems];
                updatedMeetups[meetupIndex] = meetupToUpdate;
                return updatedMeetups;
            });
        }
    };

 export default meetupStore;