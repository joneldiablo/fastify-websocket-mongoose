const mongoose = require('../db');
const schemas = {
  userSchema: ['UserModel', require('./userSchema')],
  //sessionSchema: ['SessionModel', require('./sessionSchema')],
};
const exportsElements = {};
Object.keys(schemas).forEach(schemaName => {
  let [modelName, schema] = schemas[schemaName];
  schema.add({
    active: {
      type: Boolean,
      default: false
    }
  });
  exportsElements[modelName] = mongoose.model(modelName, schema);
});
module.exports = exportsElements;