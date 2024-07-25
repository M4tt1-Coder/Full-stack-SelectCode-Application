<script lang="ts">
	import { onMount } from 'svelte';
	import { trpc } from '$lib/trpc/trpc';
	onMount(() => {
		callMe();
	});
	const callMe = async function () {
		const { greeting } = await trpc.test.query({ data: 'Wampe' });
		text = greeting;
	};
	$: text = '';
</script>

<p class="">{text}</p>
