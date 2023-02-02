FROM node:13.12.0-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install

CMD npm run server

ENV PORT 8080
ENV TZ America/Argentina/Buenos_Aires

EXPOSE ${PORT}

COPY . ./
RUN rm -fr .env