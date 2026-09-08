FROM node:22-alpine AS deps
WORKDIR /app
# @letta-ai/letta-agent-sdk pulls in @letta-ai/letta-code, which depends on
# node-pty (a native addon). No prebuilt binary is published for this
# platform, so npm falls back to compiling it via node-gyp, which needs
# Python and a C/C++ toolchain - neither of which node:alpine ships by
# default. Without this, npm install fails with "Could not find any Python
# installation to use".
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
