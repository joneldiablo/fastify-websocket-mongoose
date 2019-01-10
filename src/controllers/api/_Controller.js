class Controller {

  constructor(Model) {
    this.Model = Model;
  }

  async get(reqData) {
    let {
      offset,
      limit,
      page
    } = reqData.pagination || {};
    if (typeof limit === 'string') {
      reqData.pagination.limit = parseInt(limit);
    }
    if (typeof offset === 'string') {
      reqData.pagination.offset = parseInt(offset);
    }
    if (typeof page === 'string') {
      reqData.pagination.page = parseInt(page);
    }
    // convert query to regex as LIKE
    if (typeof reqData.q === 'string') {
      // search at any column in searchFields
      reqData.q = this.buildSearch(reqData.q);
    } else {
      // search at any column requested
      Object.keys(reqData.q || {}).forEach(i => {
        if (typeof reqData.q[i] === 'string') {
          const re = new RegExp(`^(.*)?${reqData.q[i]}(.*)?$`, 'i');
          reqData.q[i] = re;
        }
      });
    }
    // https://www.npmjs.com/package/mongoose-paginate reqData.pagination
    try {
      let data = await this.Model.paginate(reqData.q, reqData.pagination);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async getActive(reqData) {
    reqData.q = this.buildSearch(reqData.q);
    reqData.q.active = true;
    return await this.get(reqData);
  }

  async getById(reqData) {
    try {
      let data = await this.Model.findById(reqData.id);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async getByColumn(reqData) {
    try {
      let data = await this.Model.findOne(reqData.q);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async set(reqData) {
    let obj = new this.Model(reqData.payload);
    try {
      let data = await obj.save();
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async updateById(reqData) {
    try {
      let data = await this.Model.findByIdAndUpdate(reqData.id, reqData.payload);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async updateByColumn(reqData) {
    try {
      let data = await this.Model.findAndUpdate(reqData.q, reqData.payload);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async updateActive(reqData) {
    reqData.q.active = true;
    reqData.q._id = reqData.id;
    return await this.updateByColumn(reqData);
  }

  async delete(reqData) {
    try {
      let data = await this.Model.findByIdAndDelete(reqData.id);
      return this.success(data);
    } catch (e) {
      return this.error(e);
    }
  }

  async setActive(reqData) {
    return await this.update({
      id: reqData.id,
      payload: {
        active: !!reqData.active
      }
    });
  }

  async disable(reqData) {
    return await this.update({
      id: reqData.id,
      payload: {
        active: false
      }
    });
  }

  async enable(reqData) {
    return await this.update({
      id: reqData.id,
      payload: {
        active: true
      }
    });
  }

  success(data, statusCode = 200) {
    return {
      success: true,
      error: false,
      status: statusCode,
      payload: data
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
      success: false,
      error: e,
      status: statusCode,
      payload: null
    }
  }

  buildSearch(search) {
    let toReturn = {
      $or: []
    };
    const re = new RegExp(`^(.*)?${search}(.*)?$`, 'i');
    this.Model.searchFields.forEach(i => {
      toReturn.$or.push({
        [i]: re
      });
    });
    return toReturn;
  }

}

module.exports = Controller;