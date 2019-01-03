module.exports = [
  ['GET', '/users', 'UserController', 'get', {}],
  ['GET', '/users/:id', 'UserController', 'getById', {}],
  ['POST', '/users/:id', 'UserController', 'set', {}],
  ['PATCH', '/users/:id', 'UserController', 'update', {}],
  ['DELETE', '/users/:id', 'UserController', 'delete', {}],
  //['HEAD', '/users/:id', 'UserController', 'delete', {}], // set headers, return true to let know its ok
  //['OPTIONS', '/users/:id', 'UserController', 'delete', {}], // set documentation
];