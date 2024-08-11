import { trpc } from '$lib/trpc/trpc';
import type { Task } from '$lib/types/task';
import type { User } from '$lib/types/user';

// get
/**
 * Gets the task by its identifier.
 *
 * ID string has to be an UUID v4.
 *
 * @param id task identifier
 * @returns Single task instance
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
 *	Same as the 'get'-method but fetches all task from the database.
 *
 * 	Addtionally this method filters the tasks also by their status if a status has been passed to the function.
 *
 * 	Can also return an empty list of tasks.
 *
 * @param status - Optional status
 * @returns - List of tasks (maybe filtered)
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
 *	A task instance is created and passed to the function, then forwarded to the backend.
 *
 * 	Fails if the task has no full properties ( name, description, projectID ) .
 *
 * @param task The task instance with necessary properties
 * @returns Copy of the created task
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
 *	Uses the task id to delete the task and returning the task one last time to
 *	validate the operation.
 *
 * 	Fails if the task id is not valid.
 *
 * @param id ID of the task to delete
 * @returns Last return of the task object
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
 *	Specifies which task to update with the identifier and passes optional parameters to
 *	the tRPC procedures.
 *
 * 	Just the identifier can't be empty!
 *
 * @param id ID of the task to be updated
 * @param task data thats new in a partial task type
 * @returns updated task object
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
 *	Gets just the tasks of one user.
 *
 * 	Fails when the user id is not valid.
 *
 * @param userID - Assignee ID
 * @returns All task to which the user is assigned
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
 *	Loops through all users and stores their ids in a list.
 *
 *	Users list can not be undefined.
 *
 * @param users List of users
 * @returns array of user ids
 */
function getListOfUserIDs(users: User[] | undefined): string[] {
	if (!users || users.length === 0) return [];

	const output: string[] = [];

	users.forEach((user) => {
		output.push(user.id);
	});

	return output;
}
