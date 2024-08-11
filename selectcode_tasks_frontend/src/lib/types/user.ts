import type { Project } from './project';

/**
 * User type corresponds to the user type of the backend.
 */
export type User = {
	id: string;
	name: string;
	password: string;
	email: string;
	role: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin';
	lto: Date;
	projects: Project[];
};
