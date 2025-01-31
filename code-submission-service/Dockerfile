FROM node:22.13.0-alpine3.21

WORKDIR /home/app/

COPY package*.json .

RUN npm install

COPY src ./src

EXPOSE 3005

CMD ["node", "src/index.js"]