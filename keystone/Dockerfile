FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN SKIP_POSTINSTALL=1 npm install

COPY . /app

EXPOSE 8000

CMD ["npm", "run", "dev"]
