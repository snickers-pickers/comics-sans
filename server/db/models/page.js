const Sequelize = require('sequalize');
const db = require('../db');

const Page = db.define('page', {
  canvasPage: {
    type: Sequelize.JSON,
  },
});

module.exports = Page;