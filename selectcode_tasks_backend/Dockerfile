# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.5.1
ARG PNPM_VERSION=9.5

FROM node:${NODE_VERSION}-alpine 

RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 4000
# CMD ["node", "dist/src/main.js"]
CMD ["pnpm", "start"]

