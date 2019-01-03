const  unflatten = require('flat').unflatten;

module.exports = (routesArr, pathControllers, file) => {
  const classesSet = new Set(routesArr.map(route => route[2]));
  const objects = {};
  classesSet.forEach(classInSet => {
    objects[classInSet] = new(require(pathControllers + classInSet))();
  });
  const routes = routesArr.map(route => Object.assign({}, {
    method: route[0],
    url: route[1],
    handler: async (request, reply) => {
      let {
        params,
        query,
        body
      } = request;
      let data = unflatten(Object.assign({}, params, query, body));
      const classMethod = route[3];
      let responseData = await objects[route[2]][classMethod](data);
      reply.code(responseData.status);
      return responseData;
    }
  }, route[4]));
  return (fastify, opts, next) => {
    if (opts.preHandler) {
      fastify.addHook('preHandler', (req, res, next) => {
        opts.preHandler(req, res, next);
        next();
      });
    }
    routes.forEach(route => {
      fastify.route(route);
    });
    next();
  };
}