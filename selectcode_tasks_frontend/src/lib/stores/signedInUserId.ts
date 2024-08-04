import { writable } from 'svelte/store';

/**
 *  Stores the current logged in user id to make available to trough the whole application
 *
 *  !It is just for testing purposes usually you should use cookies / sessions or JWT credentials.
 *
 * Needs to be set to '' again when logging out;
 */
export const signedUserID = writable('');
