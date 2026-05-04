FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client and Build
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
