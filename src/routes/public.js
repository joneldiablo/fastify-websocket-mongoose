module.exports = [
  ['POST', '/register', 'SessionController', 'register', , 'register'],
  ['GET', '/verify', 'SessionController', 'verify', , 'verify'],
  ['POST', '/login', 'SessionController', 'login', , 'login'],
  ['POST', '/match/:something', 'MatchArrayController', 'getMatch', , 'getMatch']
];