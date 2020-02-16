FROM node:12
RUN mkdir -p /squad/src

WORKDIR /squad/src
COPY package.json /squad/src
COPY config.env /squad/src
RUN npm config set registry http://registry.npmjs.org/ && npm install

COPY . /squad/src

WORKDIR /squad/src/client
RUN npm install
RUN npm run bundle

WORKDIR /squad/src
EXPOSE 4444
CMD ["node", "index.js"]