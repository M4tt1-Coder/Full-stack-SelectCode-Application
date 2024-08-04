import { trpc } from '$lib/trpc/trpc';
import type { User } from '$lib/types/user';

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
