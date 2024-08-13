<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { User } from '$lib/types/user';
	import { getAll, get, _delete, update, getSignedInUser } from '$lib/helper/userHelper';
	import { onMount } from 'svelte';
	import { ChevronDoubleRightOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { userLogin } from '$lib/stores/signedInUserId';
	import { canUserUpdateInfo, isUserAnInternOrExpert } from '$lib/permissions/restrictedActions';

	// Loading all data to display user content
	onMount(async () => {
		// get all users for the dashboard
		users = await getAll();
		if (users.length === 0) {
			userLogin.logout();
			goto('/');
		}
		// get signed in user
		const userFetchResult = await getSignedInUser();
		loggedInUser = userFetchResult;
	});

	// permission execution
	/**
	 * Represents the current logged in user
	 */
	let loggedInUser: User;

	// ____________________

	// get all users
	/**
	 * All users that have been registered yet
	 */
	let users: User[] = [];

	/**
	 * Search input for the user to filte after some traits of the user
	 */
	let search_string: string = '';

	/**
	 *	Filtered list of all users
	 */
	$: userList = users.filter((user: User) => {
		if (
			user.email.includes(search_string) ||
			user.name.includes(search_string) ||
			user.role.includes(search_string)
		) {
			return user;
		}
	});

	// delete & update popover

	type Role = 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin';

	// representing variables
	// name, email, role and  password can be changed
	let userName: string = '';
	let userEmail: string = '';
	let userRole: Role = 'Intern';
	let userPassword: string = '';
	let userID: string = '';

	/**
	 * For permission checking
	 *
	 * Stores the role of the user that is open for a mutation
	 *
	 * Can't be changed by the user
	 */
	let userRoleBeforeMutation: Role = 'Intern';

	/**
	 * Determines whether user details are shown or closed
	 */
	let showModifyPopover: boolean = false;

	/**
	 * Just prepares popover for the next request
	 */
	function resetModifyPopover() {
		// reset variables
		userName = '';
		userEmail = '';
		userPassword = '';
		userID = '';
		userRole = 'Intern';
		userRoleBeforeMutation = 'Intern';
		// close popover
		showModifyPopover = false;
	}

	/**
	 * Opens the popover and loads all necessary information.
	 *
	 * @param userID - ID of the user which was seleted
	 */
	async function openUserDetails(userId: string): Promise<void> {
		// load data
		const user: User = await get(userId);
		userName = user.name;
		userEmail = user.email;
		userID = user.id;
		userRole = user.role;
		userRoleBeforeMutation = user.role;
		// open popover
		showModifyPopover = true;
	}

	/**
	 * Uses local variables to update a user.
	 *
	 * Fulfills certain requirements for updating a user.
	 *
	 * Checks which permissions the logged in user has.
	 */
	async function updateUser() {
		// Do variable checking and permission enforcement
		if (
			userID === '' ||
			!canUserUpdateInfo(loggedInUser.role, userID, userRoleBeforeMutation, loggedInUser.id)
		) {
			return;
		}
		// call update endpoint
		// when user is intern / expert but modifys himself he must not can change his role
		if (userID === loggedInUser.id && isUserAnInternOrExpert(loggedInUser.role)) {
			await update(userID, {
				name: userName,
				email: userEmail,
				password: userPassword
			});
			// don't let a admin become a superadmin on his / her own
		} else if (loggedInUser.role === 'Admin' && userRole === 'SuperAdmin') {
			await update(userID, {
				name: userName,
				email: userEmail,
				password: userPassword
			});
		} else {
			await update(userID, {
				name: userName,
				email: userEmail,
				password: userPassword,
				role: userRole
			});
		}
		resetModifyPopover();
		window.location.reload();
	}

	/**
	 * Deletes a user with its associated id
	 */
	async function deleteUser() {
		if (userID === '' || isUserAnInternOrExpert(loggedInUser.role)) {
			return;
		}
		await _delete(userID);
		resetModifyPopover();
		window.location.reload();
	}
</script>

<svelte:head>
	<title>User</title>
</svelte:head>

{#if showModifyPopover}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_hxl:min-h-screen hxl:h-screen z-10 flex items-center justify-center bg-slate-900"
		on:click={resetModifyPopover}
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-3/5 max-w-[600px] relative grid grid-cols-1 grid-rows-6 p-4 transition-all duration-700 my-10"
			on:click|stopPropagation
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				on:click={resetModifyPopover}
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
					Dashboard
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
					bind:value={userName}
					type="text"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					minlength="5"
					required
					name="name"
					id="name"
					placeholder="Paul"
				/>
			</div>
			<!-- email -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="email"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Email</label
				>
				<input
					bind:value={userEmail}
					type="email"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					name="email"
					id="email"
					placeholder="newUser@example.com"
				/>
			</div>
			<!-- password -->
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="password"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Password</label
				>
				<input
					bind:value={userPassword}
					type="password"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					minlength="5"
					name="password"
					id="password"
					placeholder="atarashii12#&"
				/>
			</div>
			<div class="row-span-1 w-full h-full flex flex-col items-start justify-center">
				<label
					for="role"
					class="text-left text-black w-full font-medium text-lg hover:translate-x-1 transition-all duration-500 mb-1"
					>Role</label
				>
				<select
					id="role"
					name="role"
					bind:value={userRole}
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
				>
					{#each ['Intern', 'Expert', 'Admin', 'SuperAdmin'] as role}
						<option value={role}>
							{role}
						</option>
					{/each}
				</select>
			</div>
			<!-- buttons -->
			<div class="row-span-1 w-full h-full flex items-center justify-around">
				<!-- update button -->
				<button
					on:click={() => updateUser()}
					type="button"
					disabled={!canUserUpdateInfo(
						loggedInUser.role,
						userID,
						userRoleBeforeMutation,
						loggedInUser.id
					)}
					class="{canUserUpdateInfo(
						loggedInUser.role,
						userID,
						userRoleBeforeMutation,
						loggedInUser.id
					)
						? 'text-2xl hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3'
						: 'text-xl py-1 px-2 cursor-not-allowed opacity-50'}  text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Update</button
				>
				<!-- delete button -->
				<button
					on:click={() => deleteUser()}
					disabled={isUserAnInternOrExpert(loggedInUser.role)}
					type="button"
					class="{isUserAnInternOrExpert(loggedInUser.role)
						? 'py-1 px-2 text-xl cursor-not-allowed opacity-50'
						: 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl '} text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Delete</button
				>
			</div>
		</div>
	</div>
{/if}

<main class="w-screen min-h-[500px] flex items-center justify-center">
	<div class="w-4/5 p-4 flex flex-col items-center justify-around gap-5">
		<!-- controller container -->
		<div class="w-full h-fit flex items-center justify-center">
			<!-- search element -->
			<input
				type="text"
				class="rounded-xl p-2 placeholder-slate-200 font-sans text-base transition-all duration-500 focus:bg-black focus:text-white"
				bind:value={search_string}
				placeholder="Search ..."
			/>
		</div>
		{#each userList as user}
			<div
				transition:fade={{ duration: 400 }}
				class="w-full p-2 grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1 ring-1 ring-slate-300 rounded-xl"
			>
				<!-- name -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class=" text-xl font-medium">
						<span class="font-semibold">Name: </span>{user.name}
					</p>
				</div>
				<!-- email -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class="text-xl font-medium">
						<span class="font-semibold">Email: </span>{user.email}
					</p>
				</div>
				<!-- role -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<p class="text-xl font-medium">
						<span class="font-semibold">Role: </span>{user.role}
					</p>
				</div>
				<!-- link -> opens popup -->
				<div class="col-span-1 w-full h-full flex items-center justify-center">
					<button
						class="p-2 bg-black text-white rounded-lg transition-all duration-500 hover:ring-2 hover:ring-black hover:bg-white hover:text-black"
						type="button"
						on:click={() => {
							openUserDetails(user.id);
						}}
					>
						<ChevronDoubleRightOutline class="size-8" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</main>
