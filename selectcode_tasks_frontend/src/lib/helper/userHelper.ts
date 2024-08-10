import { trpc } from '$lib/trpc/trpc';
import type { User } from '$lib/types/user';
import { goto } from '$app/navigation';

/**
 *	Fetches user that is currently logged in for the pages to handle
 *	permissions for what he is allowed to access.
 *
 * 	Fails when the user is not logged in, no user session id has been set or
 *	no user has been found.
 *
 * @returns - User object of the user
 */
export async function getSignedInUser(): Promise<User> {
	// get session id from sessionStorage
	const userId = window.sessionStorage.getItem('session_user_id');
	// check if id is valid
	if (userId === null || userId === '') {
		goto('/');
		throw new Error('User session Id is invalid!');
	}
	// try to get the user of the id
	const user: User = await trpc.user.get.query({ id: userId });
	// check user
	if (!user || !user.id) {
		goto('/');
		throw new Error(`Could not fetch a user with id: ${userId}`);
	}
	// return user
	return user;
}

// get
/**
 *
 * @param id
 * @returns
 */
export async function get(id: string): Promise<User> {
	const res = await trpc.user.get.query({ id });

	if (!res) {
		throw new Error(`User ${id} not found`);
	}

	const user: User = res;

	return user;
}

// getAll
/**
 *
 * @param role
 * @returns
 */
export async function getAll(role?: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin'): Promise<User[]> {
	const res = await trpc.user.getAll.query({ role });

	if (!res) {
		throw new Error('Could not fetch users');
	}

	const users: User[] = res;

	return users;
}

// delete
/**
 *
 * @param id
 * @returns
 */
export async function _delete(id: string): Promise<User> {
	const res = await trpc.user.delete.mutate({ id });

	if (!res) {
		throw new Error(`User ${id} does not exist and cannot be deleted`);
	}

	const user: User = res;

	return user;
}

// create
/**
 *
 * @param user
 * @returns
 */
export async function create(user: User): Promise<User> {
	const res = await trpc.user.create.mutate({
		name: user.name,
		password: user.password,
		email: user.email
	});

	if (!res) {
		throw new Error('Could not create user');
	}

	const _user: User = res;

	return _user;
}

// update
/**
 *
 * @param id
 * @param user
 * @returns
 */
export async function update(id: string, user: Partial<User>): Promise<User> {
	const res = await trpc.user.update.mutate({
		id,
		name: user.name,
		password: user.password,
		email: user.email,
		role: user.role
	});

	if (!res) {
		throw new Error(`User ${id} could not be updated`);
	}

	const _user: User = res;

	return _user;
}
