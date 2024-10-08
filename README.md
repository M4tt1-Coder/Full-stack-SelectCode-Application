# Fullstack - Monorepository - ProjectManager

Create a little overview of employees, projects, and single tasks within a company.

## What is this repo about?

In general, the whole application consists of several components:

1. Frontend : [Svelte Kit](https://kit.svelte.dev/) with TypeScript; [TailwindCSS](https://tailwindcss.com/)
2. Backend : [NestJS](https://nestjs.com/) with TypeScript; [TypeORM](https://typeorm.io/)
3. Database : [PostgreSQL](https://www.postgresql.org/)

Additionally, I used [tRPC](https://trpc.io/) for the first time for the data channel between frontend and backend. Deploying the app components is handled with [docker](https://www.docker.com/), where every component is deployed in a separate container using [`docker-compose`](https://docs.docker.com/compose/).

The [SelectCode](https://www.selectcode.de/) [Challenge](https://apply.selectcode.de/challenges/fullstack) gave some instruction, in how to build the application.

### Design & Technology Decision

As mentioned above, I had to use some things like PostgreSQL in the app, so I couldn't change that. But I also have been given some free space for my own decision on what to use. ( _More info on the challenge website_ )

- For the **frontend**, I was sure to use Svelte Kit because of SSR, and its general easy usage and nice features like [stores](https://svelte.dev/docs/svelte-store) or [component](https://svelte.dev/docs/svelte-components) based development. ( _Even though I couldn't make much use of it, explanation below!_ )
- Coming to the **backend**, I tried [Prisma](https://www.prisma.io/) at first but because that is also my first time using it, I couldn't establish a good connection to the PostgreSQL database. So in the end I chose TypeORM for its good integration into NestJS and great documentation.

The main challenge for me in this app was _tRPC_. It is a new way of dealing with the data flow between frontend & backend, but it also comes with some difficulties in the right implementation for specific frameworks and environments.

### Main Problem

Simply put, it was the client side implementation and usage of tRPC. I wanted to use the server side of Svelte Kit with files like [`+page.server.ts`](https://kit.svelte.dev/docs/load#page-data) but the tRPC-client could not connect to the backend when it was called on the server in any way. The error message always was:

> ECONNREFUSED

I wanted to use tRPC because the challenge meant it is used in [meinGPT](https://meingpt.com/academy) and to get a better understanding of it.

So to solve the problem and use tRPC at the same time, **_I simply called my endpoints on the browser side._**

```typescript
const res = await trpc.user.get.query({ id });
```

Consequences were:

- less SSR usage
- no cookie-authentication -> I used the [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) to store the user session id instead:
  ```typescript
  sessionStorage.setItem("session_user_id", userId);
  ```

So I have to admit the two conditions **production code** & **security / data privacy** lack a bit. In the case of the exemplary usage of this project, it is acceptable **BUT** in the real world, I would never do that. Just to let you guys know why I chose to do this!

More tinnier issues I encountered are explained in the specific file comments!

### Implemented Features

... those are:

1. A User interface to manage ( modify, delete ) all users, the user can register, log in, and log out.
2. A logged-in user can create, modify, and delete a project. The projects are visible in their own dashboard. Furthermore, you are able to create tasks for the project.
3. The mentioned tasks also have their own dashboard. You can assign users to the task and change their current status.
4. A search function, a user can enter a search term, and a filtered result will be shown in the dashboard.
5. User authentication has login functionality and restricted permissions based on the role of an user. For example, an intern can't delete a project or change its status.

Possible features to add include a _notification system_, when a status of a project, a user created, changes or a _comment section_, where users could add their opinions and attach some files.

## Installation: How do I get to run it?

### Hardware Requirements

To properly run all [docker containers](https://www.docker.com/resources/what-container/) you need to have some conditions fulfilled:

- 1 GB of storage free on your SSD or hard drive
- 500 MB of free memory on your RAM
- internet connection -> docker will need to pull the [PostgreSQL database image](https://hub.docker.com/_/postgres) from [Docker Hub](https://hub.docker.com/)

### Environment Setup

After making sure you have all the required things, you need to have some software installed on your machine.

#### NodeJS

The basement of everything is [NodeJS](https://nodejs.org/en), please download it [here](https://nodejs.org/en/download/prebuilt-installer/current) if you haven't already!

Enter this command in your terminal to make sure you have it installed:

```bash
  node -v
```

... an output could be:

> v22.5.1

#### Docker

Now that you have NodeJS, you need Docker to run the backend, frontend, and database on separate containers. You can install Docker [here](https://www.docker.com/get-started/)!

Again, you can check if it is installed:

```bash
docker -v
```

... output:

> Docker version 27.1.1, build 6312585

### Pull Repository from GitHub

#### Git

You also need to have Git, a version control system, installed. Follow [this](https://git-scm.com/downloads) guide to get started.

Installation check:

```bash
  git -v
```

#### Setting up the repository

The full repository is on my public [GitHub profile](https://github.com/M4tt1-Coder/Full-stack-SelectCode-Application). You will need to choose a local folder on your machine where you want to pull the repository.

To start the pull request, go to the repository and copy the web URL:

> https://github.com/M4tt1-Coder/Full-stack-SelectCode-Application.git

Now open a terminal in the directory where you wanted to pull the repository and enter the following command:

```bash
  git clone https://github.com/M4tt1-Coder/Full-stack-SelectCode-Application.git
```

Git will pull the repository to your local folder. Now you have the project installed.

#### PNPM Setup (Optional)

If you want to work on the project, you have to install all dependencies using a package manager of your choice. I use PNPM for my projects, you install it [here](https://pnpm.io/installation) or use another package manager.

To make sure PNPM is installed enter this command in the terminal:

```bash
  pnpm version
```

Now go the folder **_./selectcode_tasks_backend_** and **_./selectcode_tasks_frontend_** and run this command in both directories:

```bash
  pnpm install
```

This will install all dependencies!

#### Testing

If you want to run all implemented test, run this command in a terminal in the folder you want to run the tests:

```bash
  pnpm test
```

This will run [vitest](https://vitest.dev/) or [jest](https://jestjs.io/) and handles all test cases that can be found in the repository.

If you look in the `package.json` file, you will find a scripts section with commands, there you are able to find the command **_test_**.

**_Okay now you are good to go and start coding!_**

## How to use the project?

So now everything is set up! Next, you have to build and start all the Docker containers. As mentioned before, we will be using _docker-compose_ to do so.

Go [here](https://docs.docker.com/guides/docker-concepts/the-basics/what-is-a-container/) to learn more about working with docker containers in general!

### Starting the Project

At first, you have to start the docker daemon. Just simply open [Docker Desktop](https://www.docker.com/products/docker-desktop/) or manually [here](https://docs.docker.com/engine/daemon/start/).

Head to the route directory and open a new terminal!

Now enter the following command:

```bash
  docker compose up
```

That's going to build and deploy the three Docker containers on your local machine. Information about the deployment is in the [`compose.yaml`](https://docs.docker.com/compose/compose-application-model/) file and the separate [`DOCKERFILE`](https://docs.docker.com/reference/dockerfile/) files.

To run the processes in the background, you can add the detached tag:

```bash
  docker compose up -d
```

Next, head to your browser and go to `http://localhost:3000` to start using the full-stack application. You won't need instructions for using the app itself, that is self-explaining.

### Exiting Process

After using the app, we want to close the application and shut down the containers. Depending on whether you run the containers detached or not, you have to do something different.

1. **Detached** - You just need to enter this in the route directory terminal:

```bash
  docker compose down
```

2. If you built your containers **undetached**, press `Control + C` in the terminal to exit the process and enter the last command again to shut down the containers.

## Credits

Instructions and the idea came from the [SelectCode GmbH](https://www.selectcode.de/).

Special thanks to Stephan Le @stephanLe for his guidance during the whole development process.

**_You find the challenge [here](https://apply.selectcode.de/challenges/fullstack)!_**

My personal socials:

- [LinkedIn](https://www.linkedin.com/in/matthis-gei%C3%9Fler-4198b9258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
- [Fiverr](https://www.fiverr.com/matthisgeissler)
- [Portfolio Website](https://matthisgeissler.pages.dev)

## Notes

- technology: Typeorm, NestJS, PostgreSQL, SvelteKit, tRPC
- encountered challenge to transfer data back to the frontend: trpc doesnt regonize the entity class for the database -> return or procedure was always 'any' so DTOs were needed as type declarations
- couldnt call the trpc backend server on the server side of svelte kit -> I know it is not recommended but for the sake of the project its acceptable
- decided to store user id in a store -> many decisions are made behind the knowledge that this project is for showcassing goals + new usage of trpc
- can't get to call the trpc client in on any svelte-server-side file -> need to do anything on the client
- you need atleast 1 GB of memory on your hard drive
