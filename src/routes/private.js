module.exports = [
  ['GET', '/users', 'UserController', 'getActive'],
  ['GET', '/users/:id', 'UserController', 'getActiveById'],
  ['POST', '/users/:id', 'UserController', 'set'],
  ['PATCH', '/users/:id', 'UserController', 'updateActive'],
  ['DELETE', '/users/:id', 'UserController', 'disable'],
  //['HEAD', '/users/:id', 'UserController', 'delete', {}], // set headers, return true to let know its ok
  //['OPTIONS', '/users/:id', 'UserController', 'delete', {}], // set documentation
];