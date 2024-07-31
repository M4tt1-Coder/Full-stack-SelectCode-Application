<!-- TODO - Create index homepage of the app -->

<script lang="ts">
	import { trpc } from '$lib/trpc/trpc';
	import type { User } from '$lib/types/user';
	async function createUser() {
		const user: User = await trpc.user.create.mutate({
			name: 'John',
			email: 'test@example.com',
			password: 'password'
		});

		console.log(user);
	}

	async function createProject() {
		const project = await trpc.project.create.mutate({
			name: 'Testing',
			description: 'We are here to test the endpoints',
			creatorID: '7f59cc42-98a6-40c5-9666-5e9968a60b94'
		});
		console.log(project);
	}

	async function createTask() {
		const task = await trpc.task.create.mutate({
			name: 'Do tests',
			description: 'Just do the fucking tests',
			projectID: '4e13b065-9d91-4d66-855a-2a312698ac91'
		});
		console.log(task);
	}

	async function updateTask() {
		const task = await trpc.task.update.mutate({
			id: 'ddcf04e3-d03b-4b83-b557-ae4e2f6f2f16',
			status: 'Finished',
			assigneesIDs: [
				'7f59cc42-98a6-40c5-9666-5e9968a60b94',
				'23c77cb0-bf72-4650-a279-e90ab6b46db7'
			],
			description: 'This should not be so long!'
		});
		console.log(task);
	}

	async function tasksOfUser() {
		const tasks = await trpc.task.getTaskOfUser.query({
			userID: '7f59cc42-98a6-40c5-9666-5e9968a60b94'
		});
		console.log(tasks);
	}
</script>

<button on:click={createUser}>Create User</button>
<button on:click={createTask}>Create Task</button>
<button on:click={createProject}>Create Project</button>
<button on:click={updateTask}>Update task</button>
<button on:click={tasksOfUser}>Task of user</button>
