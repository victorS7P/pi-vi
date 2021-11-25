FROM node:14.18.0 as build

COPY . .

RUN yarn install
RUN yarn build

RUN yarn global add serve
CMD ["serve", "-s", "build", "-l", "8080"]
