// import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
// import type { AppRouter } from '../../../../selectcode_tasks_backend/src//trpc/trpc.router';
// type RouterInput = inferRouterInputs<AppRouter>;
// type RouterOutput = inferRouterOutputs<AppRouter>;
// type PostCreateInput = RouterInput['user']['create'];
// type PostCreateOutput = RouterOutput['user']['create'];

// TODO - Add all types in the frontend

export type User = {
	id: string;
	name: string;
	password: string;
	email: string;
	role: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin';
	lto: Date;
	//projects: Project[];
};
