################################
# Cleans the monorepository workspace leaving only the server related files

FROM node:18-alpine as cleaner 

WORKDIR /app

COPY . .

RUN npm i -g turbo

RUN turbo prune --scope=server --docker

################################
# Builds and runs the application

FROM node:18-alpine as runner

WORKDIR /app

RUN apk add --no-cache --update redis

RUN npm i -g pnpm@9.6.0

COPY --from=cleaner /app/out/full/ .
COPY --from=cleaner /app/scripts ./scripts
COPY --from=cleaner /app/turbo.json ./turbo.json

RUN pnpm install --ignore-scripts

RUN pnpm build

WORKDIR /app/server

EXPOSE 8080

# Not a good practice to run redis in the same container as the server
# But for the sake of simplicity of this deployment, we are doing it here
CMD ["sh", "-c",  "redis-server --daemonize yes && pnpm start:prod"]