FROM node:22-alpine

WORKDIR /app

COPY package*.json .
COPY vite.config.ts tsconfig*.json components.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]