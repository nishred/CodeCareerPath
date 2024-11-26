class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async getAll() {
    const results = await this.model.find();

    return results;
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = CrudRepository;
