import type { Project } from './project';
import type { User } from './user';

export type Task = {
	id: string;
	name: string;
	description: string;
	status: 'Preparing' | 'Development' | 'Finished';
	assignees: User[];
	project: Project;
};
