FROM node:20.3-alpine3.17

WORKDIR /app

COPY . .

RUN npm install && npm update -g

CMD ["npm","run","start"]