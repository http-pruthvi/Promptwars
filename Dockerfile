# Stage 1: Build the Vite React App
FROM node:18-alpine AS build
WORKDIR /app

# Accept the API key as a build argument for Vite to package securely into the static bundle
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Install dependencies and build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the Application
FROM node:18-alpine
WORKDIR /app

# Use 'serve' lightweight package to host the static site
RUN npm install -g serve

# Pull the compiled assets from the previous stage
COPY --from=build /app/dist ./dist

# Google Cloud Run dictates port 8080 by default
EXPOSE 8080

# Serve targeting single-page application routing (-s) on port 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
