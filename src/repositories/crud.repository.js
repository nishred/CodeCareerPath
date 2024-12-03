class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async getAll(params, populate) {
    //find filter obj, select,sort,pagination(limit,page)

    let query;

    let paramsCpy = { ...params };

    let keywords = ["select", "sort", "page", "limit"];

    keywords.forEach((key) => {
      delete paramsCpy[key];
    });

    paramsCpy = JSON.stringify(paramsCpy);

    paramsCpy = paramsCpy.replace(/\b(lte|gte|gt|lt|in)\b/g, (match) => {
      return `$${match}`;
    });

    paramsCpy = JSON.parse(paramsCpy);
    query = this.model.find(paramsCpy);

    //sort

    if (params.sort) {
      const sortArray = params.sort.split(" ");

      const sortObj = {};

      sortArray.forEach((key) => {
        if (key.startsWith("-")) {
          sortObj[key.substring(1)] = -1;
        } else sortObj[key] = 1;
      });

      query = query.sort(sortObj);
    }

    const pagination = {};

    let page = params.page ? parseInt(params.page) : 1;

    let limit = params.limit ? parseInt(params.limit) : 20;

    const totalDocuments = await query.count();

    const skipResults = (page - 1) * limit;

    const nextResults = totalDocuments - skipResults;

    if (nextResults > 0) {
      const next = {};

      next.pageNumber = page + 1;

      next.pageCount = Math.max(limit, nextResults);

      pagination.next = next;
    }

    if (page > 1) {
      const prev = {
        pageNumber: page - 1,
        pageCount: limit,
      };

      pagination.prev = prev;
    }

    query = query.skip(skipResults).limit(limit);

    //select

    if (params.select) {
      const selectStr = params.select.split(",").join(" ");

      query = query.select(selectStr);
    }

    //populate

    query = query.populate(populate);

    const documents = await query;

    return {
      count: totalDocuments,
      documents,

      pagination,
    };
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
