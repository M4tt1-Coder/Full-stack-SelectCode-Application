<script lang="ts">
	import { onMount } from 'svelte';
	import { routesProtected } from '$lib/middleware/authenticationMiddleware';
	import { goto } from '$app/navigation';

	// Middleware measure
	// using session storage -> better approach is with cookies and hooks as middlware BUT
	// I honestly don't know how to setup trpc to work on the server side since I am new to it.
	// session storage also doesnt work there because its needs to run on the browser
	onMount(() => {
		const userID = window.sessionStorage.getItem('session_user_id');
		if (userID === null) {
			goto('/');
		}
		routesProtected(userID!);
	});
</script>

<slot />
