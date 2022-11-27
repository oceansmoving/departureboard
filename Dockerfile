# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY . .
# RUN yarn install --production
RUN npm install --save-dev electron

RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 3000