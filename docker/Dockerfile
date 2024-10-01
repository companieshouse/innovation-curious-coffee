# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN echo "Build application"
RUN npm run build

# Stage 2: Create the final runtime image
FROM node:18

WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

# Expose the necessary port
EXPOSE 3000

# Command to start the application
CMD ["node", "dist/app.js"]
