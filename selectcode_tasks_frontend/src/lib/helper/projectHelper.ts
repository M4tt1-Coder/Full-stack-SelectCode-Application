import { trpc } from '$lib/trpc/trpc';
import type { Project } from '$lib/types/project';
import { getAll as getSuperAdmin } from './userHelper';

// get
/**
 *
 * @param id
 * @returns
 */
export async function get(id: string): Promise<Project> {
	const res = await trpc.project.get.query({ id });

	if (!res) {
		throw new Error('Could not fetch project from the backend');
	}

	const project: Project = res;

	return project;
}

// getAll
/**
 *
 * @param status
 * @returns
 */
export async function getAll(
	status?: 'Preparing' | 'Development' | 'Finished'
): Promise<Project[]> {
	const res = await trpc.project.getAll.query({ status });

	if (!res) {
		throw new Error('Failed to get all projects');
	}

	const projects: Project[] = res;

	return projects;
}

// create
/**
 *
 * @param project
 * @returns
 */
export async function create(project: Project): Promise<Project> {
	// when unintentionally the creator id was not passed chose the it from the super admin
	// a safety check that the apps continues to run
	let creatorId: string = '';

	if (project.creator.id === '') {
		const superAdmins = await getSuperAdmin('SuperAdmin');

		creatorId = superAdmins[0].id;
		console.log(creatorId);
	} else {
		creatorId = project.creator.id;
	}

	const res = await trpc.project.create.mutate({
		name: project.name,
		description: project.description,
		creatorID: creatorId
	});

	if (!res) {
		throw new Error('Could not create project');
	}

	const _project: Project = res;

	return _project;
}

// delete
/**
 *
 * @param id
 * @returns
 */
export async function _delete(id: string): Promise<Project> {
	const res = await trpc.project.delete.mutate({ id });

	if (!res) {
		throw new Error(`Project ${id} was not deleted`);
	}

	const project: Project = res;

	return project;
}

// update
/**
 *
 * @param id
 * @param project
 * @returns
 */
export async function update(id: string, project: Partial<Project>): Promise<Project> {
	const res = await trpc.project.update.mutate({
		id,
		name: project.name,
		description: project.description,
		status: project.status
	});

	if (!res) {
		throw new Error(`Could not update project ${id}`);
	}

	const _project: Project = res;

	return _project;
}
