FROM --platform=linux/amd64 node:16.16.0

WORKDIR /usr/src/app


COPY package-lock.json /usr/src/app/package-lock.json
COPY package.json /usr/src/app/package.json

RUN npm install


COPY . /usr/src/app/
EXPOSE 3000-3010
