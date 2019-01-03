const Controller = require('./_Controller');
const SessionModel = require('../../models/_models');
const UserController = require('./UserController');

class SessionController extends Controller {

  constructor() {
    super(SessionModel);
  }

  async register(data) {
    let userC = new UserController();
    let user = await userC.set(data);
    return user;
  }

  async verify(data) {
    return {
      Session: 'verify'
    }
  }

  async login(data) {
    return {
      Session: 'login'
    }
  }

}

module.exports = SessionController;