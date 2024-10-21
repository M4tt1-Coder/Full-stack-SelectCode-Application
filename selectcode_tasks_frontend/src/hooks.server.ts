import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Doc about tRPC usage in svelte kit: https://icflorescu.github.io/trpc-sveltekit/getting-started
// I don't know how to implement it well actually, with my setup

//those paths aren't protected by the middleware
const allowedRoutes = [
	'/',
	'/workspace',
	'/workspace/user',
	'/workspace/task',
	'/workspace/project'
];

// a user just can visit routes the are registered
export const handle: Handle = async ({ resolve, event }) => {
	if (!allowedRoutes.includes(event.url.pathname)) {
		redirect(307, '/');
	}

	return resolve(event);
};
