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
    preHandler: (req, res, next) => {
      console.log('security preHandler');
      next();
    }
  });

  // Users level
  instance.register(routes(privateRoutes, '../controllers/api/'), {
    prefix: '/private',
    preHandler: (req, res, next) => {
      console.log('security preHandler');
      next();
    }
  });

  // Public
  instance.register(routes(publicRoutes, '../controllers/api/'));

  next();
}, {
  prefix: '/api/v1'
});

fastify.register(require('fastify-ws'));

fastify.ready(err => {
  if (err) throw err

  console.log('Server started.')

  fastify.ws
    .on('connection', socket => {
      console.log('Client connected.');

      socket.on('message', msg => socket.send(`[${msg}]`)); // Creates an echo server

      socket.on('close', () => console.log('Client disconnected.'));
    });
});

// server
fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});