FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Using a simple server to serve the static build + proxy would be ideal, 
# but for dev mode (as per README instructions to run via docker-compose up for "Start everything")
# We will just run "npm run dev" with --host to expose it.
# In prod, we would build and serve with Nginx.
CMD ["npm", "run", "dev", "--", "--host"]
