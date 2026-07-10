# Take a light Node.js image and alpine linux 
FROM node:18-alpine

# Set the working directory 
WORKDIR /app

# Copy package.json files first (for better caching)
COPY package*.json ./
RUN npm ci --only=production 

# Copy all the source code 
COPY . .

#  Create logs directory (will be mounted as volume)
RUN mkdir -p logs 

# Expose the port 3000
EXPOSE 3000

# Run the app 
CMD ["npm", "start"]
