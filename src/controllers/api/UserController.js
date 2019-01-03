const Controller = require('./_Controller');
const {
  UserModel
} = require('../../models/_models');

class UserController extends Controller {
  constructor() {
    super(UserModel);
  }
}

module.exports = UserController;