# Use Node.js LTS version
FROM node:20-alpine

# Set working directory to backend
WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY backend/ ./

# Build the TypeScript code
RUN npm run build

# Expose port (Railway will set PORT env var)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
