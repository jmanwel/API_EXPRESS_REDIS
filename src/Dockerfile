FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install express redis response-time axios
COPY . .
EXPOSE 3000

CMD ["node", "index.js"]