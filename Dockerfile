# Base Node.js image
FROM node:23-slim
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Serve for static site server
RUN npm i -g serve
# Copy source code into the container
COPY . .
# Build it
RUN npm run build
# Expose app port
EXPOSE 80
# Start the app
CMD [ "serve", "-s", "dist","-p","80" ]
