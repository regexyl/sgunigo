FROM node:slim
WORKDIR /usr/src/app
COPY ./app/package*.json ./
RUN npm install
COPY ./app/* ./.env ./
EXPOSE 3001
CMD ["npm", "run", "dev"]