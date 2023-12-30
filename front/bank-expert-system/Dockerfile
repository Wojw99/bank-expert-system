# Frontend Dockerfile
FROM node:20 AS build

WORKDIR /app

# Use a different Debian package mirror
# RUN echo "deb http://mirrors.umd.edu/debian/ bullseye main" > /etc/apt/sources.list

# Install npm with --fix-missing
RUN apt-get update --fix-missing && apt-get install -y npm


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Use a lightweight Nginx image as the final image
# FROM nginx:alpine

# Copy the built frontend files to the Nginx web server directory
# COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 8080

# Command to start Nginx
CMD ["npm", "start"]
