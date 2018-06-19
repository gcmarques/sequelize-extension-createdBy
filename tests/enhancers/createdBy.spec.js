const extendSequelize = require('sequelize-extension');
const connection = require('../helpers/connection');
const dropAll = require('../helpers/dropAll');
const enhanceCreatedBy = require('../../');

describe('enhancers', () => {
  let sequelize;
  let db;

  const reset = async () => {
    await dropAll(sequelize);
    db = {};
    db.user = sequelize.define('user', {
      username: sequelize.Sequelize.STRING(255),
      createdBy: sequelize.Sequelize.INTEGER,
    });
    await sequelize.sync();
  };

  before(async () => {
    sequelize = connection();
    await reset();
    extendSequelize(db, {
      createdBy: enhanceCreatedBy(),
    });
  });

  after(async () => {
    sequelize.close();
  });

  describe('-> createdBy:', () => {
    it('should add createdBy when creating instances', async () => {
      const user = await db.user.create({
        username: 'test1',
      }, {
        user: { id: 2 },
      });
      expect(user.createdBy).to.be.equal(2);
    });

    it('should add default createdBy when creating instances without user', async () => {
      const user = await db.user.create({
        username: 'test2',
      });
      expect(user.createdBy).to.be.equal(1);
    });

    it('should add createdBy when bulk creating instances', async () => {
      await db.user.bulkCreate([
        { username: 'test3' },
        { username: 'test3' },
      ], {
        user: { id: 2 },
      });
      const users = await db.user.findAll({
        where: { username: 'test3' },
      });
      users.forEach((user) => {
        expect(user.createdBy).to.be.equal(2);
      });
    });

    it('should add default createdBy when bulk creating instances without user', async () => {
      await db.user.bulkCreate([
        { username: 'test4' },
        { username: 'test4' },
      ]);
      const users = await db.user.findAll({
        where: { username: 'test4' },
      });
      users.forEach((user) => {
        expect(user.createdBy).to.be.equal(1);
      });
    });
  });
});
