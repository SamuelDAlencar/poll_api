FROM node
WORKDIR /usr/src/poll_api
COPY ./package.json .
RUN npm install --only=prod