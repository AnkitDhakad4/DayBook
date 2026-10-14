FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .


# jis pe chal rha hai use hi expose kare
EXPOSE 5000


CMD ["npm","start"]


