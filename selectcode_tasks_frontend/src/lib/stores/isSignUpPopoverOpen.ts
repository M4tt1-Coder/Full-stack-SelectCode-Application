import { writable } from 'svelte/store';

/**
 * Indicates if the user opened or closed the sign up popover
 */
export const isSignUpPopupOpen = writable(false);
