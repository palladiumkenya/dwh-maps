# Step 1: Build the React app
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve it with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's public folder
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Custom Nginx config (see below)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]