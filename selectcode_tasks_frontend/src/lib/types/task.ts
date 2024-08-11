import type { Project } from './project';
import type { User } from './user';

/**
 * Task type for backend return.
 */
export type Task = {
	id: string;
	name: string;
	description: string;
	status: 'Preparing' | 'Development' | 'Finished';
	assignees: User[];
	project: Project;
};
