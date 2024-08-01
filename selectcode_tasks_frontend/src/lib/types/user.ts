import type { Project } from './project';

export type User = {
	id: string;
	name: string;
	password: string;
	email: string;
	role: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin';
	lto: Date;
	projects: Project[];
};
