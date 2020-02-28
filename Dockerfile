FROM node:13.8.0-stretch-slim
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 3000
CMD [ "node", "index.js" ]