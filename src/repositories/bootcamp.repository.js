const Bootcamp = require("../models/Bootcamp");
const CrudRepository = require("./crud.repository");

class BootcampRepository extends CrudRepository {
  constructor() {
    super(Bootcamp);
  }
}


module.exports = BootcampRepository
