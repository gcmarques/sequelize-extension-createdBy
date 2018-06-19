FROM node:9

RUN apt-get install libpq-dev

WORKDIR /sequelize
VOLUME /sequelize

COPY . /sequelize