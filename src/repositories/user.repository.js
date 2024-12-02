const User = require("../models/User");

class UserRepository {
  constructor() {
    this.model = User;
  }

  async create(data) {
    const savedUser = await this.model.create(data);

    return savedUser;
  }

  async getUserByEmail(email) {
    const user = await this.model.findOne({ email }).select("+password");

    return user;
  }

  async getUserById(id)
  {
 
    const user = await this.model.findById(id)

    return user

  }

}

module.exports = UserRepository;
