# sequelize-extension-createdBy

[![Build Status](https://travis-ci.org/gcmarques/sequelize-extension-createdBy.svg?branch=master)](https://travis-ci.org/gcmarques/sequelize-extension-createdBy)
[![codecov](https://codecov.io/gh/gcmarques/sequelize-extension-createdBy/branch/master/graph/badge.svg)](https://codecov.io/gh/gcmarques/sequelize-extension-createdBy)
![GitHub license](https://img.shields.io/github/license/gcmarques/sequelize-extension-createdBy.svg)

### Installation
```bash
$ npm install --save sequelize-extension-createdBy
```

### Usage

This library uses [sequelize-extension](https://www.npmjs.com/package/sequelize-extension) to extend sequelize models. If a model has a `createdBy` field, this extension will automatically set `createdBy` to `options.user.id` when an instance is created.
```javascript
const Sequelize = require('sequelize');
const extendSequelize = require('sequelize-extension');
const enhanceCreatedBy = require('sequelize-extension-createdBy');

const sequelize = new Sequelize(...);

const Task = sequelize.define('task', {
  name: Sequelize.STRING(255),
});

extendSequelize([Task], {
  createdBy: enhanceCreatedBy(),
});

const task1 = await Task.create({...}, { user: { id: 2 } });
console.log(task1.createdBy);
// 2

const task2 = await Task.create({...});
console.log(task2.createdBy);
// 1 <- default userId

await Task.bulkCreate([
  {...},
  {...},
], { user: { id: 3 } });
// All created tasks will have createdBy === 3
```

### Other Extensions
[sequelize-extension-tracking](https://www.npmjs.com/package/sequelize-extension-tracking) - Automatically track sequelize instance updates.\
[sequelize-extension-updatedBy](https://www.npmjs.com/package/sequelize-extension-updatedBy) - Automatically set `updatedBy` with `options.user.id` option.\
[sequelize-extension-deletedBy](https://www.npmjs.com/package/sequelize-extension-deletedBy) - Automatically set `deletedBy` with `options.user.id` option.\
[sequelize-extension-graphql](https://www.npmjs.com/package/sequelize-extension-graphql) - Create GraphQL schema based on sequelize models.