FROM node:18-alpine

WORKDIR /app

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm i -g pnpm@9.6.0

COPY . .

RUN pnpm install --ignore-scripts

RUN pnpm build

WORKDIR /app/client

EXPOSE 5173

CMD ["sh", "-c",  "pnpm start"]