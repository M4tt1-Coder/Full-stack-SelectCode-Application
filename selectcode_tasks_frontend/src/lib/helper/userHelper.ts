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
 *	Takes in the user id and fetches the corresponding user.
 *
 *	Fails if the user id does not exist or leads to no user.
 *
 * @param id The user id
 * @returns	Fetched user
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
 *	Tasks and projects are filtered by their status but the user is by their role.
 *
 *	Potentially gets an empty list of users.
 *
 * @param role Optional filter parameter
 * @returns List of ( filtered ) users
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
 *	Uses the user id to delete the user.
 *
 *	Fails when the user id is invalid.
 *
 * @param id The user id
 * @returns Last time the user that was deleted
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
 *	The passed user instance is provided to the create procedure on the backend.
 *
 *	The new user is returned from the backend.
 *
 * @param user the user instance with new data
 * @returns the created user instance
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
 *	Modifies a user in the database.
 *
 * 	Gets the user with its given ID.
 *
 *	Applies the optional parameters to the user.
 *
 * @param id Identifier of the user
 * @param user Dataset of possible optional user parameters
 * @returns Updated user
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
