FROM node:12.16.3-alpine3.9
MAINTAINER miaowing <me@mxb.cc>

ENV VERSION 2.0.0
ENV MAILER_HOST smtp.mxhichina.com
ENV MAILER_PORT 465
ENV NODE_ENV production

WORKDIR /usr/src/app

ADD package.json ./package.json
ADD node_modules ./node_modules
ADD src/.keystone ./src/.keystone
ADD src/.env ./src/.keystone/.env

CMD ["npm","start"]

EXPOSE 3000
