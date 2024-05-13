# Use the official Node.js image as the base image
FROM node:alpine AS build

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app using the custom build:prod script
RUN npm run build:prod

# Use Nginx as the web server
FROM nginx:alpine

# Copy the build output from the previous stage to the nginx web root directory
COPY --from=build /frontend/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start the application
CMD ["npm", "start:prod"]
