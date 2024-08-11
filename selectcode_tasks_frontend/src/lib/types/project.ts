import type { Task } from './task';
import type { User } from './user';

/**
 * Project type to ensure type safety.
 *
 * Used for destructuring the response object of the trpc server.
 */
export type Project = {
	id: string;
	name: string;
	description: string;
	status: 'Preparing' | 'Development' | 'Finished';
	creator: User;
	tasks: Task[];
};
