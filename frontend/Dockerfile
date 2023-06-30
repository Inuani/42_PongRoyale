FROM node:20.3-alpine3.17

COPY . .

RUN npm install

RUN npm run build && npm update -g && mkdir app

CMD ["cp", "-fr", "./build", "/app/build"]