# Use an official Node.js runtime base image
FROM node:20-alpine

# Set working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Optional: expose port if you're using an Express API
EXPOSE 3000

# Define the command to run your bot
CMD ["node", "index.js"]
