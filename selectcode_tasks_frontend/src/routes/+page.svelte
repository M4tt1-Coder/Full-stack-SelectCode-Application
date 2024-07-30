<!-- TODO - Create index homepage of the app -->

<script lang="ts">
	import { trpc } from '$lib/trpc/trpc';
	import type { User } from '$lib/types/user';
	async function test() {
		const res: User = await trpc.user.update.mutate({
			id: 'e5c3af43-7075-4802-989f-55bf15bc4dbe',
			name: 'John',
			role: 'Admin',
			password: 'password'
		});
		console.log(res);
	}
</script>

<button on:click={test}></button>
