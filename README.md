link to challenge -> https://apply.selectcode.de/challenges/fullstack

- technology: Typeorm, NestJS, PostgreSQL, SvelteKit, tRPC
- encountered challenge to transfer data back to the frontend: trpc doesnt regonize the entity class for the database -> return or procedure was always 'any' so DTOs were needed as type declarations
- couldnt call the trpc backend server on the server side of svelte kit -> I know it is not recommended but for the sake of the project its acceptable
- decided to store user id in a store -> many decisions are made behind the knowledge that this project is for showcassing goals + new usage of trpc
- can't get to call the trpc client in on any svelte-server-side file -> need to do anything on the client
- you need atleast 1 GB of memory on your hard drive
