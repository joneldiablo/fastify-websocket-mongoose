module.exports = [
  ['GET', '/users', 'UserController', 'getActive', , 'getUsers'],
  ['GET', '/users/:id', 'UserController', 'getActiveById', , 'getUser'],
  ['POST', '/users/:id', 'UserController', 'set', , 'setUser'],
  ['PATCH', '/users/:id', 'UserController', 'updateActive', , 'updateUser'],
  ['DELETE', '/users/:id', 'UserController', 'disable', , 'disableUser']
  //['HEAD', '/users/:id', 'UserController', 'delete', {}], // set headers, return true to let know its ok
  //['OPTIONS', '/users/:id', 'UserController', 'delete', {}], // set documentation
];