const User = require("../models/User");
const CrudRepository = require("./crud.repository");

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async create(data) {
    const savedUser = await this.model.create(data);

    return savedUser;
  }

  async getUserByEmail(email) {
    const user = await this.model.findOne({ email }).select("+password");

    return user;
  }

  async getUserById(id) {
    const user = await this.model.findById(id).select("+password");

    return user;
  }

  async getUserByResetPasswordToken(token) {
    const user = await this.model.findOne({
      resetpasswordtoken: token,
      resetpasswordexpire: { $gt: Date.now() },
    });

    return user;
  }

  async update(id, data) {
    const user = await this.model.finfByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return user;
  }
}

module.exports = UserRepository;
