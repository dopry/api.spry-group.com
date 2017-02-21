FROM mhart/alpine-node:6.6.0

ADD . /src
WORKDIR /src

RUN npm install --production

EXPOSE 3000
VOLUME /src

ENTRYPOINT [ "node",  "src/index.js" ]
