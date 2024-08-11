import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
// import { caller } from '../../selectcode_tasks_backend/src/trpc/trpc.router';
// import { get } from '$lib/helper/userHelper';
// import { browser } from '$app/environment';

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

	// const user = await caller;

	// can just pass when user id is valid
	// if (event.url.pathname.includes('/workspace')) {
	// 	if (!browser) redirect(307, '/');
	// 	const loggedInUserID: string | null = window.sessionStorage.getItem('session_user_id');

	// 	if (loggedInUserID === null) {
	// 		redirect(307, '/');
	// 	}

	// 	const user = await get(loggedInUserID);

	// 	if (!user) {
	// 		console.log('UserError: Could not find user!');
	// 		redirect(307, '/');
	// 	}

	// 	if (!user.name || !user.id) {
	// 		redirect(307, '/');
	// 	}

	// 	console.log('Authenticated');
	// }
	// ____________
	return resolve(event);
};
