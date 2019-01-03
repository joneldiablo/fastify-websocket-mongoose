module.exports = [
  ['GET', '/users', 'UserController', 'get'],
  ['GET', '/users/:id', 'UserController', 'getById'],
  ['POST', '/users/:id', 'UserController', 'set'],
  ['PATCH', '/users/:id', 'UserController', 'updateById'],
  ['DELETE', '/users/:id', 'UserController', 'delete']
];