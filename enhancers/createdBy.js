const _ = require('lodash');

function enhanceCreatedBy() {
  return function enhance(db, hooks, settings) {
    const { utils } = settings;
    _.each(db, (model) => {
      if (utils.isModel(model) && _.has(utils.getRawAttributes(model), 'createdBy')) {
        const name = utils.getName(model);
        hooks[name].beforeCreate.push((instance, options) => {
          instance.createdBy = instance.createdBy || options.user.id;
        });
        hooks[name].beforeBulkCreate.push((instances, options) => {
          _.each(instances, (instance) => {
            instance.createdBy = instance.createdBy || options.user.id;
          });
        });
      }
    });
  };
}
module.exports = enhanceCreatedBy;
