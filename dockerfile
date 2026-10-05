# Take a light Node.js image and alpine linux 
FROM node:22-alpine

# Set the working directory 
WORKDIR /app

# Copy package.json files first (for better caching)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy all the source code 
COPY . .

RUN mkdir -p logs && chown -R node:node /app
USER node

# Expose the port 3000
EXPOSE 3000

# Run the app 
CMD ["node", "server.js"]
