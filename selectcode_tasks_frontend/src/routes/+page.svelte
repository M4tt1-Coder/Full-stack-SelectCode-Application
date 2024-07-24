<script lang="ts">
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/trpc';
	onMount(() => {
		callMe();
	});
	const callMe = async function () {
		const { greeting } = await trpc.hello.query({ name: 'Yes' });
		text = greeting;
	};
	$: text = '';
</script>

<p class="">{text}</p>
