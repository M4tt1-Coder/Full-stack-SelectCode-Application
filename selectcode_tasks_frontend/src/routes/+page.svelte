<script lang="ts">
	import { createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { fade } from 'svelte/transition';
	import { isSignUpPopupOpen } from '$lib/stores/isSignUpPopoverOpen';
	import { userLogin } from '$lib/stores/signedInUserId';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	import { create, getAll } from '$lib/helper/userHelper';
	import type { User } from '$lib/types/user';
	import { goto } from '$app/navigation';
	import pkg from 'crypto-js';
	import ErrorAlert from '$lib/components/errorAlert.svelte';

	// sign in variables
	let email = $state('');
	let password = $state('');

	/**
	 * sign in to the app
	 */
	async function signIN() {
		// destructure the crypto-js package to use it properly
		const { SHA256 } = pkg;

		// variable validation
		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			errorHandler('invalidInput');
			return;
		}

		const users: User[] = await getAll();

		if (users.length === 0) {
			errorHandler('noUsersFound');
			return;
		}
		users.forEach((user) => {
			// hash the inserted password again to check if the it matches with the users password
			if (user.email === email && user.password === SHA256(password).toString()) {
				// set the id of the user
				userLogin.login(user.id);
				goto('/workspace/user/');
			}
		});
	}

	// sign up variables
	let signUpEmail = $state('');
	let signUpPassword = $state('');
	let signUpName = $state('');

	/**
	 * Function for sign up for the app
	 */
	async function signUp() {
		if (
			!signUpName ||
			!signUpPassword ||
			!signUpEmail ||
			typeof signUpName !== 'string' ||
			typeof signUpPassword !== 'string' ||
			typeof signUpEmail !== 'string'
		) {
			errorHandler('invalidInput');
			return;
		}

		const createdUser: User = await create({
			name: signUpName,
			password: signUpPassword,
			email: signUpEmail,
			id: '',
			lto: new Date(),
			role: 'Intern',
			projects: []
		});

		if (!createdUser) {
			errorHandler('userNotCreated');
			return;
		}

		signUpEmail = '';
		signUpPassword = '';
		signUpName = '';
		isSignUpPopupOpen.set(false);
	}

	// error control function
	/**
	 * Is called when a error occurred.
	 *
	 * After some seconds the error popover automatically vanishes.
	 *
	 * @param errorType - Error type which occured to open a popup.
	 */
	function errorHandler(errorType: 'invalidInput' | 'userNotCreated' | 'noUsersFound') {
		// depending on the error type -> display the error popup
		if (errorType == 'invalidInput') invalidInput = true;
		if (errorType == 'noUsersFound') noUsersFound = true;
		if (errorType == 'userNotCreated') userNotCreated = true;
		// with time interval -> close all the popups
		setTimeout(() => {
			invalidInput = false;
			noUsersFound = false;
			userNotCreated = false;
		}, 7000);
	}

	// error booleans
	let invalidInput = $state(false);
	let userNotCreated = $state(false);
	let noUsersFound = $state(false);

	/**
	 * A reactive function ...
	 * @returns true when all necessary input fields are full
	 */
	let areAllInputsfull = $derived(() => {
		if (email === '' || password === '') {
			return false;
		} else {
			return true;
		}
	});
</script>

<svelte:head>
	<title>Start Challenge</title>
</svelte:head>

{#if userNotCreated}
	<ErrorAlert
		errorMessage="The user could not be created! Check if all your data input is valid and if all app components are running properly!"
		errorTitle="User not created"
	/>
{/if}

{#if noUsersFound}
	<ErrorAlert
		errorMessage="Received an empty list of users from the backend! Create a user before you try to proceed or make sure created users are properly saved in the database!"
		errorTitle="No Users found"
	/>
{/if}

{#if invalidInput}
	<ErrorAlert
		errorMessage="Your data input was in the wrong format! Either the wrong data type or an empty entry. Please try again!"
		errorTitle="Invalid Input"
	/>
{/if}

{#if $isSignUpPopupOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 700 }}
		class="absolute top-0 left-0 w-screen till_hxl:min-h-screen hxl:h-screen z-10 flex items-center justify-center bg-black"
		onclick={() => isSignUpPopupOpen.set(false)}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="rounded-xl bg-white w-[70%] sm:w-3/5 md:w-1/2 h-1/2 max-w-[510px] relative grid grid-cols-1 grid-rows-5 p-4 transition-all duration-700 my-10"
			onclick={stopPropagation(bubble('click'))}
		>
			<button
				class="w-8 absolute right-2 top-2 text-4xl text-slate-600 hover:rotate-90 transition-transform duration-500 origin-center aspect-square flex items-center justify-center"
				type="button"
				onclick={() => isSignUpPopupOpen.set(false)}
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
					Sign Up
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
					bind:value={signUpName}
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
					bind:value={signUpEmail}
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
					bind:value={signUpPassword}
					type="password"
					class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
					required
					minlength="5"
					name="password"
					id="password"
					placeholder="atarashii12#&"
				/>
			</div>
			<!-- button -->
			<div class="row-span-1 w-full h-full flex flex-col items-center justify-center">
				<button
					onclick={signUp}
					type="button"
					class="hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
					>Register</button
				>
			</div>
		</div>
	</div>
{/if}

<main
	transition:fade={{ duration: 700 }}
	class="absolute top-0 left-0 w-screen till_hxl:min-h-screen hxl:h-screen flex items-center justify-center"
>
	<div
		class="flex flex-col items-center justify-center gap-7 min-h-[625px] h-3/4 w-4/5 md:w-3/5 transition-all duration-700"
	>
		<!-- headlines -->
		<div class="flex flex-col items-center justify-between w-full h-1/4">
			<a href="https://apply.selectcode.de/challenges/fullstack">
				<p
					class="font-semibold text-4xl text-black text-center transition-all duration-500 hover:scale-105 hover:text-slate-700"
				>
					<span class="font-mono">SelectCode</span> - <span class="font-serif">Challenge</span>
				</p></a
			>
			<p class="font-medium text-2xl text-black text-center">Task - Management - System</p>
			<p class="font-medium text-2xl text-black text-center">Fullstack - MonoRepo</p>
		</div>
		<!-- login form -->
		<div class="w-full h-3/4 flex items-center justify-center">
			<div
				class="w-full max-w-[650px] h-full rounded-xl ring-[5px] ring-black grid grid-rows-5 grid-cols-1"
			>
				<!-- login logo -->
				<div
					class="row-span-1 h-full w-full bg-black flex items-center justify-center border-b-slate-700 border-b-8 hover:border-b-white transition-all duration-500"
				>
					<p
						class="text-center text-white text-3xl font-semibold hover:-translate-y-2 trannsition-all duration-500"
					>
						Sign In
					</p>
				</div>
				<!-- email field -->
				<div class="row-span-1 h-full w-full flex flex-col items-center justify-center gap-1 px-8">
					<label
						class="text-left text-black w-full font-medium text-xl hover:translate-x-1 transition-all duration-500"
						for="email">Email</label
					>
					<input
						bind:value={email}
						required
						type="email"
						id="email"
						name="email"
						class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
						placeholder="task@example.com"
					/>
				</div>
				<!-- password -->
				<div class="row-span-1 h-full w-full flex flex-col items-center justify-center gap-1 px-8">
					<label
						class="text-left text-black w-full font-medium text-xl hover:translate-x-1 transition-all duration-500"
						for="name">Password</label
					>
					<input
						bind:value={password}
						required
						type="password"
						id="password"
						name="password"
						minlength="5"
						class="w-full rounded-lg ring-1 focus:ring-2 ring-black transition-all duration-500 focus:bg-black placeholder-slate-300 focus:placeholder-slate-700 focus:text-white font-medium"
						placeholder="1234Secret#?"
					/>
				</div>
				<!-- sign in / sign up section -->
				<div class="row-span-2 h-full w-full flex items-center justify-center">
					<div class="grid grid-cols-1 grid-rows-2 w-full h-full">
						<!-- sign in button -->
						<div class="row-span-1 w-full h-full flex items-center justify-center">
							<button
								onclick={signIN}
								class="{areAllInputsfull()
									? 'hover:font-semibold hover:text-white hover:bg-black hover:-translate-y-2 py-2 px-3 text-2xl'
									: 'cursor-not-allowed py-1 px-2 text-xl bg-slate-100 opacity-50'}  text-black font-medium ring-2 ring-black rounded-lg transition-all duration-500"
								type="button"
								disabled={!areAllInputsfull()}>Log In</button
							>
						</div>
						<!-- register button -> opens popover -->
						<div class="row-span-1 w-full h-full flex items-start justify-center">
							<div
								class="w-3/5 h-fit flex items-center justify-center border-t-2 border-dashed pt-2"
							>
								<p class="font-medium text-sm">
									Haven't sign up yet? -> <button
										type="button"
										class="px-1 text-black transition-all duration-700 hover:text-blue-500 underlined-link relative"
										onclick={() => isSignUpPopupOpen.set(true)}>Register</button
									>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	.underlined-link::after {
		content: '';
		width: 0%;
		height: 1.5px;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: rgb(26 86 219);
		border-radius: 1px;
		transition-duration: 700ms;
		transform: width;
	}

	.underlined-link:hover::after {
		width: 100%;
	}
</style>
