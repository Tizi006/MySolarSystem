# Build Stage
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage
FROM httpd:2.4-alpine
COPY --from=builder /app/dist /usr/local/apache2/htdocs/
