# Use an official Node.js image as a base image
FROM node:20.10.0 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Optional: Clean npm cache
RUN npm cache clean --force

# Install frontend dependencies with additional options
RUN npm install

# Copy the rest of the frontend application code to the working directory
COPY . .

# Build the frontend application
RUN npm run build

# Use a lightweight Nginx image as the final image
FROM nginx:alpine

# Copy the built frontend files to the Nginx web server directory
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
