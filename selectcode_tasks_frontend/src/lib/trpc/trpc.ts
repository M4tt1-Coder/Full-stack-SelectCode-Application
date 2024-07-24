import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../../selectcode_tasks_backend/src//trpc/trpc.router';

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'http://localhost:4000/trpc' // you should update this to use env variables
		})
	]
});
