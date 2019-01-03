module.exports = [
  ['POST', '/register', 'SessionController', 'register'],
  ['GET', '/verify', 'SessionController', 'verify'],
  ['POST', '/login', 'SessionController', 'login'],
  ['POST', '/match/:something', 'MatchArrayController', 'getMatch']
];