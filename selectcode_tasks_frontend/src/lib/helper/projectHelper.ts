import { trpc } from '$lib/trpc/trpc';
import type { Project } from '$lib/types/project';
import { getAll as getSuperAdmin } from './userHelper';

// get
/**
 *	Gets the project from the tRPC server by passing the project id as parameter.
 *
 * 	Destructures the response object into a project type.
 *
 * @param id ID of the project
 * @returns Fetched project from the server
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
 *	Loads all projects from the backend.
 *
 * 	Potentially filters the result by their current status.
 *
 * @param status Depending on what the user wants to filter.
 * @returns list of projects -> all or with one status
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
 *	Takes in data that can be passed freely by the user.
 *
 * 	Does some basic default data validation and generation.
 *
 * 	First creates and then returns the created project.
 *
 * @param project Project object with all necessary infos
 * @returns Created project
 */
export async function create(project: Project): Promise<Project> {
	// when unintentionally the creator id was not passed choose the id from the super admin
	// a safety check that the apps continues running
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
 *	Like the 'get' function, it uses the project id to manipulate a project.
 *
 * 	In the end it returns the data of the removed project for possible deletion evidence.
 *
 * @param id The project id
 * @returns Data of the removed project
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
 * Takes in the project id and a optional project object.
 *
 * Fails if the project id is null or belongs to no project.
 *
 * Updates the project.
 *
 * @param id The project id
 * @param project Partial project object
 * @returns The updated project
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
