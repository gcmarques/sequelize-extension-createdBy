const _ = require('lodash');
const inflection = require('inflection');

function where(Sequelize, where, required) {
  if (!where) {
    return required || undefined;
  }
  if (!required) {
    return where || undefined;
  }
  return { [Sequelize.Op.and]: [where, required] };
}

function enhanceView() {
  return function enhance(db, hooks, settings) {
    const { utils } = settings;
    _.each(db, (model) => {
      if (utils.isModel(model) && !utils.isVirtualModel(model)) {
        if (_.isFunction(model.createViews)) {
          model.createViews((name, _options) => {
            const sequelize = utils.getSequelize(model);
            const virtual = class extends model {};
            Object.defineProperty(virtual, 'name', { value: name });
            sequelize.models[name] = virtual;
            virtual.mutations = {};
            virtual.queries = {};
            virtual.subscriptions = {};
            virtual.options = _.clone(model.options);
            virtual.options.name = {
              singular: name,
              plural: inflection.pluralize(name),
            };
            virtual.virtual = true;

            const _findOne = virtual.findOne;
            virtual.findOne = async function findOne(options) {
              options = options || {};
              options.where = where(sequelize.Sequelize, options.where, _options.where);
              const result = await _findOne.call(virtual, options);
              return result;
            };

            const _findAll = virtual.findAll;
            virtual.findAll = async function findAll(options) {
              options = options || {};
              options.where = where(sequelize.Sequelize, options.where, _options.where);
              const result = await _findAll.call(virtual, options);
              return result;
            };

            return virtual;
          });
        }
      }
    });
  };
}
module.exports = enhanceView;
