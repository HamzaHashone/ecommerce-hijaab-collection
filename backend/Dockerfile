FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
