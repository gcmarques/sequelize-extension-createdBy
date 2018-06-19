# sequelize-extension-view

[![Build Status](https://travis-ci.org/gcmarques/sequelize-extension-view.svg?branch=master)](https://travis-ci.org/gcmarques/sequelize-extension-view)
[![codecov](https://codecov.io/gh/gcmarques/sequelize-extension-view/branch/master/graph/badge.svg)](https://codecov.io/gh/gcmarques/sequelize-extension-view)
![GitHub license](https://img.shields.io/github/license/gcmarques/sequelize-extension-view.svg)

## Installation
```bash
$ npm install --save sequelize-extension-view
```

## Usage

This library uses [sequelize-extension](https://www.npmjs.com/package/sequelize-extension) to extend sequelize models. Models with the method `createViews` will be called to create table views (virtual models). The virtual model/instance inherits all the methods created by Sequelize.
```javascript
const Sequelize = require('sequelize');
const extendSequelize = require('sequelize-extension');
const enhanceView = require('sequelize-extension-view');

const sequelize = new Sequelize(...);

const db = {}
db.Task = sequelize.define('task', {
  name: Sequelize.STRING(255),
  status: Sequelize.ENUM('PENDING', 'COMPLETED'),
});
Task.createViews = (create) => {
  db.PendingTask = create({
    where: { status: 'PENDING' },
  });
  db.CompletedTask = create({
    where: { status: 'COMPLETED' },
  });
};

extendSequelize([Task], {
  view: enhanceView(),
});

// ...

// Now you can call .findById(), .find(), .findOne() and 
// .findAll() and they will only return instances that 
// respect the view where statement.
db.PendingTask.find(options).then((pendingTask) => {
  // Do something with pending task
  pendingTask.name = 'new name';
  pendingTask.save().then(...);
});
```

## Other Extensions
[sequelize-extension-graphql](https://www.npmjs.com/package/sequelize-extension-graphql) - Create GraphQL schema based on sequelize models.\
[sequelize-extension-tracking](https://www.npmjs.com/package/sequelize-extension-tracking) - Automatically track sequelize instance updates.\
[sequelize-extension-createdby](https://www.npmjs.com/package/sequelize-extension-createdby) - Automatically set `createdBy` with `options.user.id` option.\
[sequelize-extension-updatedby](https://www.npmjs.com/package/sequelize-extension-updatedby) - Automatically set `updatedBy` with `options.user.id` option.\
[sequelize-extension-deletedby](https://www.npmjs.com/package/sequelize-extension-deletedby) - Automatically set `deletedBy` with `options.user.id` option.