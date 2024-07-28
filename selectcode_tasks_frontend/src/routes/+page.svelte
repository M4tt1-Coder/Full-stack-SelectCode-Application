<!-- TODO - Create index homepage of the app -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/trpc';

	// import type { PageData } from './$types';
	// export let data: PageData;

	onMount(() => test2());

	async function test2() {
		const user = await trpc.user.create.mutate({
			name: 'Max',
			password: 'password',
			email: 'testing@examples.com'
		});
		console.log(user);
	}
</script>

<button on:click={test2}>Click</button>
