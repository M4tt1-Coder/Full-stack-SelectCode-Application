import { Project } from './project';
import { User } from './user';

export type Task = {
	id: string;
	name: string;
	description: string;
	status: 'Preparing' | 'Development' | 'Finished';
	assignees: User[];
	project: Project;
};
