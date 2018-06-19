const extendSequelize = require('sequelize-extension');
const connection = require('../helpers/connection');
const dropAll = require('../helpers/dropAll');
const enhanceView = require('../../');

describe('enhancers', () => {
  let sequelize;
  let db;
  let settings;

  const reset = async () => {
    await dropAll(sequelize);
    db = {};
    db.user = sequelize.define('user', {
      role: sequelize.Sequelize.ENUM('VISITOR', 'USER'),
    });
    db.user.createViews = (create) => {
      db.visitor = create('visitor', {
        where: { role: 'VISITOR' },
      });
    };
    await sequelize.sync();
  };

  before(async () => {
    sequelize = connection();
    await reset();
    extendSequelize(db, {
      view: enhanceView(),
      extractUtils: (_, __, _settings) => {
        settings = _settings;
      },
    });
    await db.user.bulkCreate([
      { id: 1, role: 'USER' },
      { id: 2, role: 'VISITOR' },
      { id: 3, role: 'VISITOR' },
      { id: 4, role: 'USER' },
    ]);
  });

  after(async () => {
    sequelize.close();
  });

  describe('-> view:', () => {
    it('should be a virtual model', async () => {
      expect(settings.utils.isVirtualModel(db.visitor)).to.be.true;
    });

    it('should return only visitors', async () => {
      const visitors = await db.visitor.findAll();
      expect(visitors[0].id).to.be.equal(2);
      expect(visitors[1].id).to.be.equal(3);
      expect(visitors.length).to.be.equal(2);
    });

    it('should return only one visitor', async () => {
      const visitor = await db.visitor.find();
      expect(visitor.id).to.be.equal(2);
    });

    it('should return all users', async () => {
      const users = await db.user.findAll();
      expect(users[0].id).to.be.equal(1);
      expect(users[1].id).to.be.equal(2);
      expect(users[2].id).to.be.equal(3);
      expect(users[3].id).to.be.equal(4);
      expect(users.length).to.be.equal(4);
    });

    it('should return only one user', async () => {
      const user = await db.user.find();
      expect(user.id).to.be.equal(1);
    });
  });
});
