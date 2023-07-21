FROM node:16.17-alpine
#RUN apk add --no-cache make gcc g++ python
WORKDIR /var/www
VOLUME /var/www
COPY package*.json ./
RUN npm i -g rimraf && npm install -g npm@9.8.1 && npm cache clean --force \
  && npm install -g node-gyp \
  && npm install --unsafe-perm=true
COPY . .
EXPOSE 4000
CMD ["sh", "-c", "npm i -g rimraf && npm run prebuild && npm run build && npm run migrate && npm run start:prod"]