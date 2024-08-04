// import { redirect, fail } from '@sveltejs/kit';
// import pkg from 'crypto-js';
// import type { User } from '$lib/types/user.js';
// import { getAll } from '$lib/helper/userHelper';
// import { trpc } from '$lib/trpc/trpc';

// export const actions = {
// 	signup: async ({ request }) => {
// 		console.log('I try to sign up');

// 		const data = await request.formData();

// 		// get data
// 		const name = data.get('name');
// 		const email = data.get('email');
// 		const password = data.get('password');

// 		if (
// 			!name ||
// 			!email ||
// 			!password ||
// 			typeof email !== 'string' ||
// 			typeof password !== 'string' ||
// 			typeof name !== 'string'
// 		) {
// 			return fail(400, {
// 				invalidDataInput: true,
// 				message: 'Invalid email, password or name were in wrong format / empty!'
// 			});
// 		}

// 		const createdUser: User = await trpc.user.create.mutate({
// 			name,
// 			password,
// 			email
// 		});

// 		if (!createdUser) {
// 			return fail(400, { userNotCreated: true, message: 'User not created' });
// 		}

// 		return redirect(302, '/');
// 	},
// 	signin: async ({ request, cookies }) => {
// 		console.log('signing in');

// 		const data = await request.formData();
// 		// destructure the crypto-js package to use it properly
// 		const { SHA256 } = pkg;

// 		// get the email and password
// 		const email = data.get('email');
// 		const password = data.get('password');

// 		if (typeof email !== 'string' || typeof password !== 'string' || !!email || !password) {
// 			return fail(406, { invalidData: true });
// 		}

// 		const users: User[] = await getAll();

// 		// create session cookie with user id as value
// 		if (users.length === 0) {
// 			return fail(404, { NoUsersFound: true, message: 'No users found. Please register first!' });
// 		}

// 		users.forEach((user) => {
// 			// hash the inserted password again to check if the it matches with the users password
// 			if (user.email === email && user.password === SHA256(password).toString()) {
// 				// set https cookie for user authentication -> access to protected routes
// 				cookies.set('user_login_session_id', user.id, {
// 					httpOnly: false,
// 					maxAge: 60 * 10,
// 					sameSite: 'strict',
// 					path: '/',
// 					secure: true
// 				});

// 				redirect(302, '/workspace/user');
// 			}
// 		});
// 		return fail(400, { message: 'Could not login!' });
// 	}
// };
