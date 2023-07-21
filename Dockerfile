FROM node:18.15.0
#RUN apk add --no-cache make gcc g++ python
WORKDIR /var/www
COPY package*.json ./
RUN npm i -g rimraf && npm install && npm install -g @nestjs/cli && npm cache clean --force \
  && npm install -g node-gyp \
  && npm install --unsafe-perm=true
COPY . .
EXPOSE 4000
CMD ["sh", "-c", "npm i -g rimraf && npm i -g @nestjs/cli && npm run prebuild && npm run build && npm run migrate && npm run start:prod"]