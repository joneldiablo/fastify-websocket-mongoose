// init db
require('./db');

const fastify = require('fastify')({
  logger: true
});

// routes mapper
const routes = require('./routes');
// routes
const adminRoutes = require('./routes/admin');
const privateRoutes = require('./routes/private');
const publicRoutes = require('./routes/public');
// routes register
fastify.register((instance, opts, next) => {

  // Admin level
  instance.register(routes(adminRoutes, '../controllers/api/'), {
    prefix: '/admin',
    preHandler: (req, res) => console.log('security preHandler')
  });

  // Users level
  instance.register(routes(privateRoutes, '../controllers/api/'), {
    prefix: '/private',
    preHandler: (req, res) => console.log('security preHandler')
  });

  // Public
  instance.register(routes(publicRoutes, '../controllers/api/'));
  next();
}, {
  prefix: '/api/v1'
});

// server
fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});