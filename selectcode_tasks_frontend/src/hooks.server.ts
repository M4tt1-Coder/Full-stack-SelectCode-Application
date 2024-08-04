import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
// import { building } from '$app/environment';

//those paths aren't protected by the middleware
const allowedRoutes = ['/', '/workspace'];

export const handle: Handle = async ({ resolve, event }) => {
	//build error -> https://github.com/sveltejs/kit/issues/9386
	//building environment variable securing that the build is alright
	if (!allowedRoutes.includes(event.url.pathname)) {
		redirect(307, '/');
	}
	return resolve(event);
};
