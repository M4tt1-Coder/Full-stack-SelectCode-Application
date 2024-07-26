<script lang="ts">
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/trpc';
	onMount(() => {
		callMe();
	});
	const callMe = async function () {
		const { msg } = await trpc.get.query({ name: 'Paul' });
		text = msg;
	};
	$: text = '';
</script>

<p class="">{text}</p>
