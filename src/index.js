// init db
require('./db');

const fastify = require('fastify')({
  logger: true
});

fastify.register(require('fastify-routes'))
fastify.register(require('fastify-ws'));

// routes mapper
const {
  routesRegister,
  wsRegister
} = require('./routes');
// routes
const adminRoutes = require('./routes/admin');
const privateRoutes = require('./routes/private');
const publicRoutes = require('./routes/public');
const pathControllers = '../controllers/api/';
const finalRoutes = [{
    // Admin level
    routes: adminRoutes,
    path: pathControllers,
    opts: {
      prefix: '/admin',
      preHandler: (reqData) => {
        console.log('security preHandler');
      }
    }
  },
  // User level
  {
    routes: privateRoutes,
    path: pathControllers,
    opts: {
      prefix: '/private',
      preHandler: (reqData) => {
        console.log('security preHandler');
      }
    }
  },
  // Public
  {
    routes: publicRoutes,
    path: pathControllers
  }
];
// routes register
fastify.register((instance, opts, next) => {
  routesRegister(instance, finalRoutes);
  wsRegister(instance, finalRoutes);

  next();
}, {
  prefix: '/api/v1'
});

/* fastify.addHook('onRoute', (routeOptions) => {
  const type = `${routeOptions.method} ${routeOptions.url}`;
});*/

// server
fastify.listen(3000, (err, address) => {
  if (err) throw err;
  console.log(`server listening on ${address}`);
});

fastify.ready(err => {
  if (err) throw err
  console.log('Server started.');
});