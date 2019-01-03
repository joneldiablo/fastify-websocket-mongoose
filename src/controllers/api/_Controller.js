class Controller {

  constructor(Model) {
    this.Model = Model;
  }

  async get(reqData) {
    try {
      let data = await this.Model.find(reqData.search);
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async getById(reqData) {
    try {
      let data = await this.Model.findById(reqData.id);
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async getByColumn(reqData) {
    try {
      let data = await this.Model.findOne(reqData.search);
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async set(reqData) {
    let obj = new this.Model(reqData.row);
    try {
      let data = await obj.save();
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async update(reqData) {
    try {
      let data = await this.Model.findByIdAndUpdate(reqData.id, reqData.row);
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async delete(reqData) {
    try {
      let data = await this.Model.findByIdAndDelete(reqData.id);
      return this.done(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async setActive(reqData) {
    return await this.update({
      id: reqData.id,
      row: {
        active: !!reqData.active
      }
    });
  }

  async disable(reqData) {
    return await this.update({
      id: reqData.id,
      row: {
        active: false
      }
    });
  }

  async enable(reqData) {
    return await this.update({
      id: reqData.id,
      row: {
        active: true
      }
    });
  }

  done(data, statusCode = 200) {
    return {
      done: true,
      statusCode: statusCode,
      data: data
    }
  }

  error(e, statusCode = 400) {
    if (e.name === 'MongoError') {
      switch (e.code) {
        case 11000:
          statusCode = 409;
          break;
        default:
          break;
      }
    }
    return {
      error: true,
      statusCode: statusCode,
      description: e
    }
  }

}

module.exports = Controller;