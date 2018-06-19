const Sequelize = require('sequelize');

const connection = () => new Sequelize(
  process.env.SEQ_MYSQL_DB || 'sequelize_test',
  process.env.SEQ_MYSQL_USER || 'root',
  process.env.SEQ_MYSQL_PW || '',
  {
    port: process.env.SEQ_MYSQL_PORT || '3306',
    host: process.env.SEQ_MYSQL_HOST || '127.0.0.1',
    // logging: m => global.console.log(m),
    logging: false,
    dialect: 'mysql',
  },
);
module.exports = connection;
