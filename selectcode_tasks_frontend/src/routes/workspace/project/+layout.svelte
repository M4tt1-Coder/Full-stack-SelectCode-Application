<script lang="ts">
	import Header from '$lib/components/navigationHeader.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- Header component -->
<Header page="Project" />

{@render children?.()}
