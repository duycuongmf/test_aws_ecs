FROM node:16.17-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g yarn \
  && npm install
COPY . .
CMD ["sh", "-c", "yarn migrate && yarn prebuild && yarn build && yarn start:prod"]