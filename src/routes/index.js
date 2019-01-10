const {
  unflatten
} = require('flat');
const flatten = require('array-flatten');

const dataProcessing = (request) => {
  const {
    params,
    query,
    body
  } = request;
  return unflatten(Object.assign({}, params, query, body));
};

const createObjects = (routesArr, pathControllers, file) => {
  const classesSet = new Set(routesArr.map(([, , className] = route) => className));
  const controllerObjects = {};
  classesSet.forEach(classInSet => {
    let Class;
    if (!file) {
      Class = require(pathControllers + classInSet);
    } else {
      Class = require(pathControllers + file)[classInSet];
    }
    controllerObjects[classInSet] = new Class();
  });
  return controllerObjects;
}

const routesManager = (routesArr, pathControllers, file) => {
  const controllerObjects = createObjects(routesArr, pathControllers, file);

  const routes = routesArr.map(
    ([method, url, className, methodClass, moreOpts] = route) =>
    Object.assign({}, {
      method: method,
      url: url,
      handler: async (request, reply) => {
        const data = dataProcessing(request);
        const pre = request.pre;
        const responseData = await reply.context.config.controller(data, pre);
        reply.code(responseData.status);
        return responseData;
      },
      config: {
        controller: async (data, pre) => await controllerObjects[className][methodClass](data, pre)
      }
    }, moreOpts)
  );

  return (instance, opts, next) => {
    if (opts.preHandler) {
      instance.addHook('preHandler', (request, reply, next) => {
        const data = dataProcessing(request);
        try {
          request.pre = opts.preHandler(data);
          next();
        } catch (e) {
          reply.code(e.status);
          next(e);
        }
      });
    }
    routes.forEach(route => {
      instance.route(route);
    });

    next();
  };
};

let wsAllControllers = [];
const wsManager = (routesArr, pathControllers, file, opts) => {
  const controllerObjects = createObjects(routesArr, pathControllers, file);
  return routesArr.map(([, , className, methodClass, , type] = route) => ({
    type,
    preHandler: (data) => {
      if (opts.preHandler) return opts.preHandler(data);
      else return true;
    },
    handler: async (data, pre) => await controllerObjects[className][methodClass](data, pre)
  }));
};

const wsHandler = async (socket, msg) => {
  let [route] = wsAllControllers.filter(
    ({
      type
    } = route) => type === msg.type);
  if (typeof msg.type !== 'string' || !route) {
    socket.send(JSON.stringify({
      status: 404,
      error: {
        code: 404,
        description: 'not found'
      },
      success: false,
      payload: null
    }));
  } else {
    try {
      let pre = route.preHandler(msg);
      socket.send(JSON.stringify(await route.handler(msg, pre)));
    } catch (e) {
      console.log(e);
      socket.send(JSON.stringify({
        status: e.status || 400,
        error: e.toString(),
        success: false,
        payload: null
      }));
    }
  }
};

const routesRegister = (instance, routes) => {
  routes.forEach(({
    routes,
    path,
    file,
    opts
  } = routeBatch) => {
    instance.register(routesManager(routes, path, file), opts);
  });
}

const wsRegister = (instance, routes) => {
  routes.forEach(({
    routes,
    path,
    file,
    opts = {}
  } = routeBatch) => {
    wsAllControllers.push(wsManager(routes, path, file, opts));
    wsAllControllers = flatten(wsAllControllers);
  });
  instance.ws
    .on('connection', socket => {
      console.log('Client connected.');
      socket.on('message', async msg => {
        try {
          msg = JSON.parse(msg);
          wsHandler(socket, msg);
        } catch (e) {
          console.log(e);
          socket.send(JSON.stringify({
            status: 400,
            error: e.toString(),
            success: false,
            payload: null
          }));
        }
      });

      socket.on('close', () => console.log('Client disconnected.'));
    });
}

module.exports = {
  routesRegister,
  wsRegister
};