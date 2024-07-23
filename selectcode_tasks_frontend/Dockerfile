ARG NODE_VERSION=22.4.0
ARG PNPM_VERSION=8.10.2

# FROM node:16-alpine
FROM node:${NODE_VERSION}-alpine 

RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "build"]