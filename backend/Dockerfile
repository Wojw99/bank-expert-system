# Use an official Node.js image as a base image
FROM node:20 as backend

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend application code to the working directory
COPY . .

# Expose the port your backend application will run on
EXPOSE 3000

# Command to start your backend application
CMD ["npm", "start"]
