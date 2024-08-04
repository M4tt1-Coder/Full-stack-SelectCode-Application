<!-- TODO - Add user page -->
<!-- TODO - Design + Responsibility -->
<!-- TODO - Logic -->
<script lang="ts">
	import type { User } from '$lib/types/user';
	import { signedUserID } from '$lib/stores/signedInUserId';

	$: loggedInUserID = $signedUserID;
	let seatch_string: string = '';

	// $: userList = data.users!.filter((user: User) => {
	// 	if (
	// 		user.email.includes(seatch_string) ||
	// 		user.name.includes(seatch_string) ||
	// 		user.role.includes(seatch_string)
	// 	) {
	// 		return user;
	// 	}
	// });
</script>

<main class="w-screen min-h-[500px] flex items-center justify-center">
	<div class="w-4/5 p-4 flex"></div>
</main>
