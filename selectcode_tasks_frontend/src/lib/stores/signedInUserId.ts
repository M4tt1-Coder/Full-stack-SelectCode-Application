import { writable } from 'svelte/store';
import { browser } from '$app/environment';
// import { get } from 'svelte/store';

/**
 *
 * @returns Custom store functions
 */
const LoggedInUserId = () => {
	const { set, subscribe, update } = writable('');

	return {
		subscribe,
		update,
		// value: () => get(),
		logout: () => {
			if (!browser) return;
			window.sessionStorage.clear();
			set('');
		},
		login: (userId: string) => {
			if (!browser) return;
			if (!userId || userId === '') {
				console.log('Did not set the session user id');
				return '';
			}
			set(userId);
			sessionStorage.setItem('session_user_id', userId);
		}
	};
};

/**
 * Uses the session storage of the localhost.
 *
 * Store for logging in.
 */
export const userLogin = LoggedInUserId();

// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
