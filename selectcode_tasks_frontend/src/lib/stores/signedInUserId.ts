import { writable } from 'svelte/store';

// TODO - Try out new session storage of the DOM to store the logged in user id somehow

/**
 *  Stores the current logged in user id to make available to trough the whole application
 *
 *  !It is just for testing purposes usually you should use cookies / sessions or JWT credentials.
 *
 * Needs to be set to '' again when logging out;
 */
export const signedUserID = writable('');

// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
