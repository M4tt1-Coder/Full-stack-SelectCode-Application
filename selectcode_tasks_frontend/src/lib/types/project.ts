import type { Task } from './task';
import type { User } from './user';

export type Project = {
	id: string;
	name: string;
	description: string;
	status: 'Preparing' | 'Development' | 'Finished';
	creator: User;
	tasks: Task[];
};
