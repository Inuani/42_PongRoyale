FROM nginx:stable-alpine3.17

COPY ./nginx.conf .
COPY ./mime.types .
COPY ./script ./script

CMD ["sh", "script"]
