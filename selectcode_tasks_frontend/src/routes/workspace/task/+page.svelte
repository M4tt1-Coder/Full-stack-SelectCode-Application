<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAll, update, _delete, get } from '$lib/helper/taskHelper';
	import { getAll as allUsers } from '$lib/helper/userHelper';
	import type { Task } from '$lib/types/task';
	import type { User } from '$lib/types/user';
	import { ChevronDoubleRightOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	onMount(async () => {
		tasks = await getAll();
		if (tasks.length === 0) {
			goto('/workspace/project');
		}
	});

	// Search functionality
	let tasks: Task[] = [];

	let search_string: string = '';

	$: taskList = tasks.filter((task: Task) => {
		if (task.assignees.length > 0) {
			task.assignees.forEach((assignee: User) => {
				if (assignee.name.includes(search_string) || assignee.role.includes(search_string)) {
					return task;
				}
			});
		}

		if (
			task.name.includes(search_string) ||
			task.description.includes(search_string) ||
			task.status.includes(search_string) ||
			task.project.name.includes(search_string)
		) {
			return task;
		}
	});
	// ________

	// modify task

	/**
	 * Lets the popover be shown.
	 */
	let showTaskModifyPopup: boolean = false;

	/**
	 * Sets all variables to their default values.
	 *
	 * Closes the popover.
	 */
	function resetTaskModifyPopup() {
		// var reset
		modify_taskName = '';
		modify_taskDescription = '';
		modify_taskStatus = 'Preparing';
		modify_taskAddedAssignees = [];
		modify_taskOpenAssignees = [];
		modify_taskID = '';
		// closing the popup
		showTaskModifyPopup = false;
	}

	/**
	 *
	 * @param taskId
	 */
	async function openTaskDetails(taskId: string): Promise<void> {
		// check id
		if (taskId === '') {
			console.log('Could not fetch task due to missing task id');
			return;
		}
		// load general data
		const task = await get(taskId);
		modify_taskName = task.name;
		modify_taskDescription = task.description;
		modify_taskStatus = task.status;
		modify_taskID = task.id;

		// load users to assign them to the lists
		modify_taskAddedAssignees = task.assignees;

		const users = await allUsers();

		// split the list of all users in a list of users who work on this task
		// and users who are not
		modify_taskOpenAssignees = users.filter((user) => {
			let userIsNotInAddedList: boolean = true;

			modify_taskAddedAssignees.forEach((_user) => {
				if (_user.id === user.id) {
					userIsNotInAddedList = false;
				}
			});

			if (userIsNotInAddedList) {
				return user;
			}
		});
		// open popover
		showTaskModifyPopup = true;
	}

	// representative variables for properties to be updated
	let modify_taskName: string = '';
	let modify_taskDescription: string = '';
	let modify_taskStatus: Status = 'Preparing';
	let modify_taskID: string = '';
	let modify_taskAddedAssignees: User[] = [];
	$: reactive_addedAssignees = modify_taskAddedAssignees;

	// users that can be added to one task
	let modify_taskOpenAssignees: User[] = [];
	$: reactive_openAssignees = modify_taskOpenAssignees;

	type Status = 'Preparing' | 'Development' | 'Finished';

	/**
	 *	By using the id of a task it removes it from the list of tasks.
	 *
	 * ! Fails when there still relations whit other object in the database.
	 */
	async function deleteTask(): Promise<void> {
		// check the id
		if (modify_taskID === '') {
			console.log('Could not find a task id');
			return;
		}
		// delete the task
		await _delete(modify_taskID);
		// close popover
		resetTaskModifyPopup();
		// reload window
		window.location.reload();
	}

	/**
	 *	Makes sure the task id is valid.
	 *
	 *	Passes all optional parameters to the update function.
	 */
	async function updateTask(): Promise<void> {
		// id is required -> check
		if (modify_taskID === '') {
			console.log('Could not find a task id');
			return;
		}
		// update task
		await update(modify_taskID, {
			name: modify_taskName,
			description: modify_taskDescription,
			status: modify_taskStatus,
			assignees: modify_taskAddedAssignees
		});
		// close popup
		resetTaskModifyPopup();
	}

	// adding and removing users from lists for assigning them to a task
	/**
	 *	Adds one user to the assignees list of the task.
	 *
	 * Additionally
	 *
	 * @param userId - ID of the user
	 */
	function addUserToTask(userId: string) {
		// add to added list
		// remove from open list
		modify_taskOpenAssignees = modify_taskOpenAssignees.filter((user) => {
			if (user.id !== userId) {
				return user;
			} else {
				modify_taskAddedAssignees.push(user);
			}
		});
		// reassign for reactivity
		reactive_addedAssignees = modify_taskAddedAssignees;
	}

	/**
	 *	Simply reverts what the 'addUserToTask' method did.
	 *
	 * @param userId - User to be removed from the assignees list of the task
	 */
	function removeUserfromTask(userId: string) {
		modify_taskAddedAssignees = modify_taskAddedAssignees.filter((user) => {
			if (user.id !== userId) {
				return user;
			} else {
				modify_taskOpenAssignees.push(user);
			}
		});
		reactive_openAssignees = modify_taskOpenAssignees;
	}
</script>

<!-- modify popover for a task -->
{#if showTaskModifyPopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_h2xl:min-h-screen h2xl:h-screen z-10 flex items-center justify-center bg-slate-900"
		on:click={resetTaskModifyPopup}
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-[90%] max-w-[800px] relative grid grid-cols-1 grid-rows-8 p-4 transition-all duration-700 my-10 gap-2"
			on:click|stopPropagation
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				on:click={resetTaskModifyPopup}
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
					Modify Task
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
					bind:value={modify_taskName}
					type="text"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					minlength="5"
					required
					name="name"
					id="name"
					placeholder="Activate feature ... "
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
					bind:value={modify_taskDescription}
					class="resize-none w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					name="_description"
					id="_description"
					placeholder="Give me some intel ..."
					rows="6"
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
					bind:value={modify_taskStatus}
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
				>
					{#each ['Preparing', 'Development', 'Finished'] as s}
						<option value={s}>
							{s}
						</option>
					{/each}
				</select>
			</div>
			<!-- assignees -->
			<div class="row-span-2 w-full h-full flex flex-col items-start justify-center">
				<p
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
				>
					Assignees
				</p>
				<div class="w-full grid grid-cols-2 grid-rows-1 gap-4">
					<!-- added assignees -->
					<div class="col-span-1 w-full h-full item-center justify-center overflow-scroll">
						{#each reactive_addedAssignees as assignee}
							<div
								transition:slide={{ duration: 400, axis: 'x' }}
								class="w-full flex items-center justify-between"
							>
								<!-- name -->
								<p class="text-left font-medium text-lg">{assignee.name}</p>
								<!-- button -->
								<button
									type="button"
									class="text-base font-medium text-red-700 rounded-lg p-1 transition-all duration-500 hover:text-white hover:bg-red-700"
									on:click={() => removeUserfromTask(assignee.id)}>Remove</button
								>
							</div>
						{/each}
					</div>
					<!-- assignees which can be added -->
					<div class="col-span-1 w-full h-full">
						{#each reactive_openAssignees as assignee}
							<div
								transition:slide={{ duration: 400, axis: 'x' }}
								class="w-full flex items-center justify-between"
							>
								<!-- name -->
								<p class="text-left font-medium text-lg">{assignee.name}</p>
								<!-- button -->
								<button
									type="button"
									class="text-base font-medium text-green-700 rounded-lg p-1 transition-all duration-500 hover:text-white hover:bg-green-700"
									on:click={() => addUserToTask(assignee.id)}>Add</button
								>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<!-- buttons -->
			<div class="row-span-1 w-full h-full flex items-center justify-around">
				<!-- update button -->
				<button
					on:click={updateTask}
					type="button"
					class="hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Update</button
				>
				<!-- delete button -->
				<button
					on:click={deleteTask}
					type="button"
					class="hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Delete</button
				>
			</div>
		</div>
	</div>
{/if}

<!-- The general dashboard to watch all tasks -->
<main class="w-screen min-h-[500px] flex items-center justify-center">
	<div class="w-4/5 p-4 flex flex-col items-center justify-around gap-5">
		<!-- controller container -->
		<div class="w-full h-fit flex items-center justify-around">
			<!-- search element -->
			<input
				type="text"
				class="rounded-xl p-2 placeholder-slate-200 font-sans text-base transition-all duration-500 focus:bg-black focus:text-white"
				bind:value={search_string}
				placeholder="Search ..."
			/>
		</div>
		<!-- list all projects filtered by the search -->
		{#each taskList as task}
			<div
				transition:fade={{ duration: 400 }}
				class="w-full p-2 grid grid-cols-2 lg:grid-cols-3 grid-rows-2 lg:grid-rows-1 ring-1 ring-slate-300 rounded-xl"
			>
				<!-- name -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class=" text-xl font-medium">
						<span class="font-semibold">Name: </span>{task.name}
					</p>
				</div>
				<!--status -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class="text-xl font-medium">
						<span class="font-semibold">Status: </span>{task.status}
					</p>
				</div>
				<!-- link -> opens popup -->
				<div class="col-span-2 lg:col-span-1 w-full h-full flex items-center justify-center">
					<button
						class="p-2 bg-black text-white rounded-lg transition-all duration-500 hover:ring-2 hover:ring-black hover:bg-white hover:text-black"
						type="button"
						on:click={() => {
							openTaskDetails(task.id);
						}}
					>
						<ChevronDoubleRightOutline class="size-8" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</main>
