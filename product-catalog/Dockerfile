# Base stage for building both frontend and backend
FROM node:20-alpine AS build

RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy both server and frontend package.json and package-lock.json
COPY server/package.json server/pnpm-lock.yaml ./server/
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/

# Install dependencies for server
WORKDIR /app/server
RUN pnpm install

# Install dependencies for frontend
WORKDIR /app/frontend
RUN pnpm install

# Copy source codes for both frontend and backend
COPY ./server /app/server
COPY ./frontend /app/frontend

# Build the frontend
WORKDIR /app/frontend
RUN pnpm build

# Build the server
WORKDIR /app/server
RUN pnpm build

# Production image
FROM hoosin/alpine-nginx-nodejs:latest AS production

# Set working directory
WORKDIR /app

# Copy the server code and build output
COPY --from=build /app/server ./

# Copy the frontend build output into the server's static files directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY start.sh start.sh

RUN npm install -g pnpm

# Expose the port the server will run on
EXPOSE 80
EXPOSE 5000



# Start the server
CMD ["./start.sh" ]
# CMD ["nginx", "-g", "daemon off;"]

