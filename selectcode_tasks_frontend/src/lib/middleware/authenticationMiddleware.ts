// imports
import { goto } from '$app/navigation';
import { get } from '../helper/userHelper';

/**
 *  Protects all routes where the user has to be logged in.
 *
 * Looks which user is logged in and gives access to protected routes.
 *
 * @param userID - user session ID stored in the 'signedInUserId' store
 */
export async function routesProtected(userID: string): Promise<void> {
	if (userID === '' || !userID || userID === null) {
		goto('/');
	}

	const user = await get(userID);
	//when the amdin session doesn't exist then redirect to main page

	if (!user) {
		goto('/');
	}

	if (
		user.password === '' ||
		user.id === '' ||
		typeof user.password === 'undefined' ||
		typeof user.id === 'undefined'
	) {
		goto('/');
	}
}
