const CrudRepository = require("./crud.repository");
const Review = require("../models/Review");
const { query } = require("express");

class ReviewRepository extends CrudRepository {
  constructor() {
    super(Review)
  }

  async getAllReviewsByBootcampId(bootcampId, queryParams) {
    // filtering using find
    //pagination
    //select,sort by rating
    //population

    const copyParams = { ...queryParams };

    const keywords = ["select", "sort", "page", "limit"];

    keywords.forEach((key) => {
      delete copyParams[key];
    });

    copyParams = JSON.stringify(copyParams);

    copyParams.replace(/\b(lte|gte|gt|lt|in)\b/g, (match) => {
      return `$${match}`;
    });

    copyParams = JSON.parse(copyParams);

    let query;

    copyParams.bootcamp = bootcampId;

    query = this.model.find(copyParams);

    if (queryParams.sort && queryParams.sort === "asc") {
      query = query.sort({ rating: 1 });
    } else query = query.sort({ rating: -1 });

    if (queryParams.select) {
      const selectStr = queryParams.select.split(",").join(" ");

      query = query.select(selectStr);
    }

    //pagination

    const pagination = {};

    const totalDocuments = await query.countDocuments();

    pagination.count = totalDocuments;

    const page = queryParams.page ? parseInt(queryParams.page) : 1;

    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;

    const skipDocuments = (page - 1) * limit;

    query = query.skip(skipDocuments).limit(limit);

    const nextDocuments = totalDocuments - skipDocuments;

    if (nextDocuments > 0) {
      const next = {
        pageNumber: page + 1,
        pageSize: Math.max(limit, nextDocuments),
      };

      pagination.next = next;
    }

    if (page > 1 && totalDocuments >= skipDocuments) {
      const prev = {
        pageNumber: page - 1,
        pageSize: Math.min(limit, totalDocuments),
      };

      pagination.prev = prev;
    }

    const current = {
      pageNumber: page,
      pageSize: Math.min(limit, nextDocuments),
    };

    pagination.current = current;

    //select

    if (queryParams.select) {
      const selectStr = queryParams.select.split(",").join(" ");

      query = query.select(selectStr);
    }

    //populate

    if (queryParams.populate) {
      const population = queryParams.populate.split(",");

      population.forEach((key) => {
        query = query.populate(key);
      });
    }

    const documents = await query;

    return {
      data: documents,
      pagination,
    };
  }
}

module.exports = ReviewRepository;
