<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAll, create, update, _delete, get } from '$lib/helper/projectHelper';
	import { create as task_create, update as updateTask } from '$lib/helper/taskHelper';
	import { getAll as allUsers, getSignedInUser } from '$lib/helper/userHelper';
	import type { Project } from '$lib/types/project';
	import type { Task } from '$lib/types/task';
	import type { User } from '$lib/types/user';
	import { ChevronDoubleRightOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// Loading all data before getting to mount all page elements
	onMount(async () => {
		// get logged in user
		const userFetchResult = await getSignedInUser();
		loggedInUser = userFetchResult;
		// get all projects -> return to the index page if something happened
		projects = await getAll();
		if (projects.length === 0) {
			goto('/');
		}
	});

	// get all projects
	let projects: Project[] = [];

	// permissions for the logged in user to do
	let loggedInUser: User;

	/**
	 *	User entered a string like `Matthis` to search for names, email, ...
	 */
	let search_string: string = '';

	/**
	 *	Updates the shown projects with filtering over all projects & searching for subStrings in properties
	 *	of the project.
	 *
	 * 	Searches in `description`, `name`, `status` and `creator.id`
	 */
	$: projectList = projects.filter((project: Project) => {
		if (
			project.description.includes(search_string) ||
			project.name.includes(search_string) ||
			project.creator!.name.includes(search_string) ||
			project.status.includes(search_string)
		) {
			return project;
		}
	});

	// create a new project
	/**
	 * Determines whether the popup for creating a new project is openen or not
	 */
	let showCreateProjectPopover: boolean = false;

	/**
	 * Opens the project creation popup
	 */
	function OpenProjectCreateWindow() {
		showCreateProjectPopover = true;
	}

	/**
	 * Uses the local variables to create the project.
	 *
	 * Calls the trpc endpoint.
	 */
	async function createProject(): Promise<void> {
		// right enforcement
		if (loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert') {
			console.log('You can not create a project');
			return;
		}
		// var checking
		if (create_projectName === '' || create_projectDescription === '') {
			return;
		}
		// create new project instance -> call the trpc endpoint
		await create({
			id: '',
			name: create_projectName,
			description: create_projectDescription,
			status: 'Preparing',
			tasks: [],
			creator: {
				id: loggedInUser.id,
				name: '',
				password: '',
				email: '',
				role: 'Intern',
				lto: new Date(),
				projects: []
			}
		});
		// reset create popover
		ResetCreateProjectPopover();
		window.location.reload();
	}

	/**
	 * Resets all variables to their default and closes the create window
	 */
	function ResetCreateProjectPopover() {
		create_projectDescription = '';
		create_projectName = '';
		showCreateProjectPopover = false;
	}

	// creation variables
	let create_projectName: string = '';
	let create_projectDescription: string = '';

	/**
	 * Indicates whether the project modify popup is enabled or not
	 */
	let showModifyProjectPopover: boolean = false;

	/**
	 *  Empties the modify variables
	 */
	function resetProjectModifyPopover() {
		// reset vars
		modify_projectDescription = '';
		modify_projectName = '';
		modify_projectStatus = 'Preparing';
		modify_projectID = '';
		modify_projectTasks = [];
		// close popover
		showModifyProjectPopover = false;
	}

	/**
	 *  Deletes the project by calling trpc delete endpoint
	 *
	 * @param projectId - The project id to be deleted
	 */
	async function deleteProject(projectId: string): Promise<void> {
		// check if the project not null
		if (
			!projectId ||
			projectId === '' ||
			loggedInUser.role === 'Intern' ||
			loggedInUser.role === 'Expert'
		) {
			return;
		}
		// delete the project
		await _delete(projectId);
		// reset popover
		resetProjectModifyPopover();
		// reload page to update UI
		window.location.reload();
	}

	/**
	 *  Utilizes the variables the build a new project object and passes that to the
	 *  trpc client server trpc endpoint.
	 */
	async function modifyProject(): Promise<void> {
		// has the user the right to change the project
		if (loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert') {
			console.log('User did not have the right to change the project');
			return;
		}

		// check variables
		if (!modify_projectID) {
			console.log('No project id specified');
			return;
		}
		// update project
		await update(modify_projectID, {
			name: modify_projectName,
			description: modify_projectDescription,
			status: modify_projectStatus
		});
		// reset popover
		resetProjectModifyPopover();
	}

	/**
	 * Takes in a project id and loads its data.
	 *
	 * Assigns 'true' to the project modify popover variable
	 *
	 * @param projectId
	 */
	async function openProjectDetails(projectId: string): Promise<void> {
		// check id
		if (projectId === '' || !projectId) {
			return;
		}
		// load data
		const project = await get(projectId);

		modify_projectName = project.name;
		modify_projectStatus = project.status;
		modify_projectDescription = project.description;
		modify_projectID = project.id;
		modify_projectTasks = project.tasks;
		// open popup

		showModifyProjectPopover = true;
	}

	type Status = 'Preparing' | 'Development' | 'Finished';

	// updating variables
	let modify_projectName: string = '';
	let modify_projectDescription: string = '';
	let modify_projectStatus: Status = 'Preparing';
	let modify_projectID: string = '';
	let modify_projectTasks: Task[] = [];
	$: reactive_modify_projectTasks = modify_projectTasks;
	/**
	 * Defines if the task-creation popup should be shown or not
	 */
	let showTaskCreationPopover: boolean = false;

	/**
	 * Simply sets the value of 'showTaskCreationPopover' to true and shows the create task popup.
	 *
	 * Loads all current admins into a local variable
	 */
	async function OpenCreateTaskPopover() {
		// execute data fetching
		create_taskPossibleAssignees = await allUsers();

		showTaskCreationPopover = true;
	}

	/**
	 * As all other methods to close a popup, it resets all variables that were needed.
	 *
	 * Closes the popup again.
	 */
	function CloseCreateTaskPopover() {
		// reset vars
		create_taskName = '';
		create_taskDescription = '';
		create_taskAssignees = [];
		create_taskPossibleAssignees = [];
		// close the create task popup
		showTaskCreationPopover = false;
	}

	/**
	 * Takes usage of the local variables and creates the task.
	 */
	async function createTask(): Promise<void> {
		// permission check
		if (loggedInUser.role === 'Expert' || loggedInUser.role === 'Intern') {
			console.log('Your are not allowed to create a task on a project');
			return;
		}
		// vars checking
		if (!create_taskName || !create_taskDescription || !create_taskAssignees) {
			throw new Error(
				'Task creation failed due to invalid or missing name or description or assignment of users in data input.'
			);
		}
		// create task
		const task = await task_create({
			name: create_taskName,
			description: create_taskDescription,
			assignees: create_taskAssignees,
			id: '',
			project: {
				name: '',
				id: modify_projectID,
				description: '',
				status: 'Preparing',
				tasks: [],
				creator: {
					name: '',
					id: '',
					email: '',
					password: '',
					role: 'Intern',
					lto: new Date(),
					projects: []
				}
			},
			status: 'Preparing'
		});

		// need to update the task for storing new assignees
		await updateTask(task.id, {
			assignees: create_taskAssignees
		});
		// reset popup
		CloseCreateTaskPopover();

		// update the modify popover
		openProjectDetails(modify_projectID);
	}

	// vars for tasks creation
	let create_taskName: string = '';
	let create_taskDescription: string = '';
	let create_taskAssignees: User[] = [];

	// add / remove assignees to list before storing it
	let create_taskPossibleAssignees: User[] = [];
	$: reactive_create_taskPossibleAssignees = create_taskPossibleAssignees;

	/**
	 * Compares a given parameter ID with all other ids of the users.
	 *
	 * When they match the user will be added to the assignees list.
	 *
	 * Deletes the user from the available-assignees list.
	 *
	 * @param userId - Id of the user to be added to the assignees list
	 */
	function addUserToAssignees(userId: string) {
		if (create_taskPossibleAssignees.length === 0 || userId === '') {
			return;
		}

		// add to list
		create_taskPossibleAssignees.forEach((user) => {
			if (user.id === userId) {
				create_taskAssignees.push(user);
			}
		});

		create_taskPossibleAssignees = create_taskPossibleAssignees.filter((user) => {
			// add all user where the id is different from the user that should be deleted
			if (user.id !== userId) {
				return user;
			}
		});
	}
</script>

<svelte:head>
	<title>Project</title>
</svelte:head>

<!-- project creation popver -->
{#if showCreateProjectPopover}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_hxl:min-h-screen hxl:h-screen z-10 flex items-center justify-center bg-slate-900"
		on:click={ResetCreateProjectPopover}
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-3/5 max-w-[600px] relative grid grid-cols-1 grid-rows-5 p-4 transition-all duration-700 my-10"
			on:click|stopPropagation
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				on:click={ResetCreateProjectPopover}
			>
				<CloseCircleSolid class="w-full h-full text-black" />
			</button>
			<!-- headline -->
			<div
				class="row-span-1 w-full h-full flex items-center justify-center border-b-4 border-double border-black"
			>
				<p
					class="text-2xl font-semibold transition-all duration-500 hover:-translate-y-1 hover:scale-105"
				>
					Create Project
				</p>
			</div>
			<!-- name -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="name"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Name</label
				>
				<input
					bind:value={create_projectName}
					type="text"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					minlength="5"
					required
					name="name"
					id="name"
					placeholder="Wordpress Page"
				/>
			</div>
			<!-- description -->
			<div class="row-span-2 w-full h-full flex flex-col items-start justify-center">
				<label
					for="description"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Description</label
				>
				<textarea
					bind:value={create_projectDescription}
					class="resize-none w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					name="description"
					id="description"
					placeholder="Handling all your request at once ..."
					rows="8"
					minlength="20"
				/>
			</div>

			<!-- buttons -->
			<div class="row-span-1 w-full h-full flex items-center justify-around">
				<!-- create project button -->
				<button
					disabled={loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'}
					on:click={() => createProject()}
					type="button"
					class="{loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'
						? 'opacity-50 text-xl cursor-not-allowed py-1 px-2'
						: 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl'}  text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Create</button
				>
			</div>
		</div>
	</div>
{/if}

<!-- project modify popover -->
{#if showModifyProjectPopover}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_h2xl:min-h-screen h2xl:h-screen z-10 flex items-center justify-center bg-slate-900"
		on:click={resetProjectModifyPopover}
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-[90%] max-w-[600px] relative grid grid-cols-1 grid-rows-8 p-4 transition-all duration-700 my-10 gap-3"
			on:click|stopPropagation
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				on:click={resetProjectModifyPopover}
			>
				<CloseCircleSolid class="w-full h-full text-black" />
			</button>
			<!-- headline -->
			<div
				class="row-span-1 w-full h-full flex items-center justify-center border-b-4 border-double border-black"
			>
				<p
					class="text-2xl font-semibold transition-all duration-500 hover:-translate-y-1 hover:scale-105"
				>
					Modify Project
				</p>
			</div>
			<!-- name -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="name"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Name</label
				>
				<input
					bind:value={modify_projectName}
					type="text"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					minlength="5"
					required
					name="name"
					id="name"
					placeholder="Paul"
				/>
			</div>
			<!-- description -->
			<div class="row-span-2 w-full h-full flex flex-col items-start justify-center">
				<label
					for="_description"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Description</label
				>
				<textarea
					bind:value={modify_projectDescription}
					class="resize-none w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					name="_description"
					id="_description"
					placeholder="Give me some intel ..."
					rows="8"
					minlength="20"
				/>
			</div>
			<!-- status -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="status"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Status</label
				>
				<select
					id="status"
					name="status"
					bind:value={modify_projectStatus}
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
				>
					{#each ['Preparing', 'Development', 'Finished'] as s}
						<option value={s}>
							{s}
						</option>
					{/each}
				</select>
			</div>
			<!-- tasks -->
			<div class="row-span-2 w-full h-full flex flex-col items-start justify-center">
				<p
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
				>
					Tasks
				</p>
				{#if modify_projectTasks.length > 0}
					<div
						class="w-full h-fit max-h-[300px] flex flex-col items-center justify-center p-3 ring-1 ring-black rounded-lg overflow-scroll"
					>
						{#each reactive_modify_projectTasks as task}
							<div class="w-full flex items-center justify-around">
								<!-- task name -->
								<p class=" text-xl font-medium">
									<span class="font-semibold">Name: </span>{task.name}
								</p>
								<!-- status of the task -->
								<p class=" text-xl font-medium">
									<span class="font-semibold">Status: </span>{task.status}
								</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-center font-medium w-full">- No tasks created -</p>
				{/if}
				<div class="w-full p-3 flex flex-col items-center justify-center gap-3">
					<div class="w-full flex items-center justify-center">
						<button
							disabled={loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'}
							type="button"
							class="{loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'
								? 'opacity-50 cursor-not-allowed'
								: 'hover:text-white hover:bg-black'} rounded-xl ring-2 ring-black px-2 py-1 font-medium text-lg transition-all duration-500"
							on:click={OpenCreateTaskPopover}>Create Task</button
						>
					</div>
					<p class="text-center text-sm text-black font-medium">
						! You can modify Tasks on the <a
							class="transition-all duration-500 hover:text-red-500"
							href="/workspace/task">Task-Page</a
						> !
					</p>
				</div>
			</div>
			<!-- buttons -->
			<div class="row-span-1 w-full h-full flex items-center justify-around">
				<!-- update button -->
				<button
					disabled={loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'}
					on:click={modifyProject}
					type="button"
					class="{loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'
						? 'text-xl cursor-not-allowed py-1 px-2 opacity-50'
						: 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl'} text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Update</button
				>
				<!-- delete button -->
				<button
					disabled={loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'}
					on:click={() => deleteProject(modify_projectID)}
					type="button"
					class="{loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'
						? 'text-xl cursor-not-allowed py-1 px-2 opacity-50'
						: 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl'} text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Delete</button
				>
			</div>
		</div>
	</div>
{/if}

<!-- task creation popover -->
{#if showTaskCreationPopover}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_h2xl:min-h-screen h2xl:h-screen z-10 flex items-center justify-center bg-slate-900"
		on:click={CloseCreateTaskPopover}
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-[70%] max-w-[600px] relative grid grid-cols-1 grid-rows-6 p-4 transition-all duration-700 my-10"
			on:click|stopPropagation
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				on:click={CloseCreateTaskPopover}
			>
				<CloseCircleSolid class="w-full h-full text-black" />
			</button>
			<!-- headline -->
			<div
				class="row-span-1 w-full h-full flex items-center justify-center border-b-4 border-double border-black"
			>
				<p
					class="text-2xl font-semibold transition-all duration-500 hover:-translate-y-1 hover:scale-105"
				>
					Create Task
				</p>
			</div>
			<!-- name -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="name"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Name</label
				>
				<input
					bind:value={create_taskName}
					type="text"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					minlength="5"
					required
					name="name"
					id="name"
					placeholder="Header Component"
				/>
			</div>
			<!-- description -->
			<div class="row-span-2 w-full h-full flex flex-col items-start justify-center">
				<label
					for="description"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Description</label
				>
				<textarea
					bind:value={create_taskDescription}
					class="resize-none w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					name="description"
					id="description"
					placeholder="Build and test using NodeJS and Docker ..."
					rows="8"
					minlength="20"
				/>
			</div>
			<!-- assignees -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<p
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
				>
					Assignees
				</p>
				{#if reactive_create_taskPossibleAssignees.length > 0}
					<div
						class="w-full p-3 ring-1 ring-black flex flex-col items-center justify-center rounded-lg overflow-scroll"
					>
						{#each reactive_create_taskPossibleAssignees as assignee}
							<div
								transition:fade={{ duration: 700 }}
								class="w-full flex items-center justify-between"
							>
								<!-- name of the user -->
								<p class="text-lg font-medium text-left">{assignee.name}</p>
								<!-- added / not added -->
								<button
									type="button"
									class="text-base font-medium text-green-700 rounded-lg p-1 transition-all duration-500 hover:text-white hover:bg-green-700"
									on:click={() => addUserToAssignees(assignee.id)}>Add</button
								>
							</div>
						{/each}
					</div>
				{:else}
					<p transition:fade={{ duration: 700 }} class="w-full text-center font-medium text-base">
						- You have assigned all users -
					</p>
				{/if}
			</div>
			<!-- buttons -->
			<div class="row-span-1 w-full h-full flex items-center justify-around">
				<!-- create project button -->
				<button
					on:click={() => createTask()}
					disabled={loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'}
					type="button"
					class="{loggedInUser.role === 'Intern' || loggedInUser.role === 'Expert'
						? 'text-xl cursor-not-allowed py-1 px-2 opacity-50'
						: 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl'} text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Create</button
				>
			</div>
		</div>
	</div>{/if}

<main class="w-screen min-h-[500px] flex items-center justify-center">
	<div class="w-4/5 p-4 flex flex-col items-center justify-around gap-5">
		<!-- controller container -->
		<div class="w-full h-fit flex items-center justify-around">
			<!-- create button -->
			<button
				type="button"
				class="rounded-xl ring-2 ring-black p-2 font-medium text-xl transition-all duration-500 hover:text-white hover:bg-black hover:-translate-y-1"
				on:click={OpenProjectCreateWindow}>Create Project</button
			>
			<!-- search element -->
			<input
				type="text"
				class="rounded-xl p-2 placeholder-slate-200 font-sans text-base transition-all duration-500 focus:bg-black focus:text-white"
				bind:value={search_string}
				placeholder="Search ..."
			/>
		</div>
		<!-- list all projects filtered by the search -->
		{#each projectList as project}
			<div
				transition:fade={{ duration: 400 }}
				class="w-full p-2 grid grid-cols-2 lg:grid-cols-3 grid-rows-2 lg:grid-rows-1 ring-1 ring-slate-300 rounded-xl"
			>
				<!-- name -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class=" text-xl font-medium">
						<span class="font-semibold">Name: </span>{project.name}
					</p>
				</div>
				<!--status -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class="text-xl font-medium">
						<span class="font-semibold">Status: </span>{project.status}
					</p>
				</div>
				<!-- link -> opens popup -->
				<div class="col-span-2 lg:col-span-1 w-full h-full flex items-center justify-center">
					<button
						class="p-2 bg-black text-white rounded-lg transition-all duration-500 hover:ring-2 hover:ring-black hover:bg-white hover:text-black"
						type="button"
						on:click={() => {
							openProjectDetails(project.id);
						}}
					>
						<ChevronDoubleRightOutline class="size-8" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</main>
