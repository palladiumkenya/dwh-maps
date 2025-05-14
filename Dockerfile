# Step 1: Build the React app
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Step 2: Serve it with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
