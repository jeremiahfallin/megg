FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app

CMD ["npm", "run", "dev"]
