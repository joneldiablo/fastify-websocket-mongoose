module.exports = [
  ['GET', '/users', 'UserController', 'get', , 'getAllUsers'],
  ['GET', '/users/:id', 'UserController', 'getById', , 'getFullUser'],
  ['POST', '/users/:id', 'UserController', 'set', , 'setFullUser'],
  ['PATCH', '/users/:id', 'UserController', 'updateById', , 'updateFullUser'],
  ['DELETE', '/users/:id', 'UserController', 'delete', , 'deleteUser']
];