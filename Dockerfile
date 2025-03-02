# Build Stage
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage
FROM node:23-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 80
CMD [ "serve", "-s", "dist", "-p", "80" ]
