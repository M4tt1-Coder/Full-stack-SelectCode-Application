import { trpc } from '$lib/trpc/trpc';
import type { Task } from '$lib/types/task';
import type { User } from '$lib/types/user';

// get
/**
 *
 * @param id
 * @returns
 */
export async function get(id: string): Promise<Task> {
	// fetch the task from the backend
	const res = await trpc.task.get.query({ id });
	// handle the error
	if (!res) {
		throw new Error(`Task ${id} not found`);
	}

	// destructure the task from the response
	const task: Task = res;

	// return the task
	return task;
}

// getAll
/**
 *
 * @param status
 * @returns
 */
export async function getAll(status?: 'Preparing' | 'Development' | 'Finished'): Promise<Task[]> {
	const res = await trpc.task.getAll.query({ status: status });

	if (!res) {
		throw new Error('Tasks not retrieved from the backend');
	}

	const tasks: Task[] = res;

	return tasks;
}

// create
/**
 *
 * @param task
 * @returns
 */
export async function create(task: Task): Promise<Task> {
	const res = await trpc.task.create.mutate({
		name: task.name,
		description: task.description,
		projectID: task.project.id
	});

	if (!res) {
		throw new Error('Task not created');
	}

	const _task: Task = res;

	return _task;
}

// delete
/**
 *
 * @param id
 * @returns
 */
export async function _delete(id: string): Promise<Task> {
	const res = await trpc.task.delete.mutate({
		id
	});

	if (!res) {
		throw new Error('Could not delete task');
	}

	const task: Task = res;

	return task;
}

// update
/**
 *
 * @param id
 * @param task
 * @returns
 */
export async function update(id: string, task: Partial<Task>): Promise<Task> {
	const res = await trpc.task.update.mutate({
		id,
		status: task.status,
		name: task.name,
		description: task.description,
		assigneesIDs: getListOfUserIDs(task.assignees)
	});

	if (!res) {
		throw new Error('Task not found and updated');
	}

	const _task: Task = res;

	return _task;
}

// getTaskOfUser
/**
 *
 * @param userID
 * @returns
 */
export async function getTaskOfUser(userID: string): Promise<Task[]> {
	const res = await trpc.task.getTaskOfUser.query({ userID });

	if (!res) {
		throw new Error(`Tasks of the user ${userID} not found`);
	}

	const tasks: Task[] = res;

	return tasks;
}

// --------------------
// utility functions
// --------------------

/**
 *
 * @param users
 * @returns
 */
function getListOfUserIDs(users: User[] | undefined): string[] {
	if (!users || users.length === 0) return [];

	const output: string[] = [];

	users.forEach((user) => {
		output.push(user.id);
	});

	return output;
}
