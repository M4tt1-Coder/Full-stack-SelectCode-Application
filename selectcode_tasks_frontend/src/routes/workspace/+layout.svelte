<script lang="ts">
	import { signedUserID } from '$lib/stores/signedInUserId';
	import { onMount, beforeUpdate } from 'svelte';
	import { routesProtected } from '$lib/middleware/authenticationMiddleware';

	onMount(() => {
		routesProtected($signedUserID);
	});

	beforeUpdate(() => {
		routesProtected($signedUserID);
	});
</script>

<slot />
