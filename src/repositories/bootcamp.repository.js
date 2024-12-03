const ErrorResponse = require("../errors/ErrorResponse");
const Bootcamp = require("../models/Bootcamp");
const CrudRepository = require("./crud.repository");

class BootcampRepository extends CrudRepository {
  constructor() {
    super(Bootcamp);
  }

  async getBootcampsWithinRadius(coordinates, distance) {
    const radiusInRadians = distance / 6378.1; // Convert km to radians (Earth's radius = 6378.1 km)

    const results = await this.model.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [coordinates.longitude, coordinates.latitude],
            radiusInRadians,
          ],
        },
      },
    });

    return results;
  }

  async getAll(queryParams) {
    const queryCopy = { ...queryParams };

    console.log("step 1:", "queryCopy", queryCopy);

    // Remove fields from query
    const removeFields = ["select", "sort", "page", "limit"];

    removeFields.forEach((param) => delete queryCopy[param]);

    // Create query string
    let queryStr = JSON.stringify(queryCopy);

    console.log("step 2:", "queryStr", queryStr);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    console.log("step 3: After Replace", queryStr);

    const parsedQuery = JSON.parse(queryStr);

    console.log("step 4: After parsing", parsedQuery);

    let query = this.model.find(parsedQuery);

    // Select fields
    if (queryParams.select) {
      const fields = queryParams.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (queryParams.sort) {
      const sortBy = queryParams.sort.split(",");

      const sortObj = {};

      sortBy.forEach((sort) => {
        if (sort.includes("-")) {
          sortObj[sort.substring(1)] = -1;
        } else {
          sortObj[sort] = 1;
        }
      });

      query = query.sort(sortObj);
    } else {
      query = query.sort({
        createdAt: -1,
      });
    }

    // Pagination
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await this.model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //reverse populate
    //you can select the fields you want to populate in the courses as well
    query = query.populate("courses");

    const results = await query;

    // Pagination result
    const pagination = { totalPages: Math.ceil(total / limit) };

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        size: Math.min(limit, total - endIndex),
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        size: limit,
      };
    }

    return {
      count: results.length,
      pagination,
      data: results,
    };
  }

  async delete(id) {
    const bootcamp = await this.model.findById(id);

    if (!bootcamp)
      throw new ErrorResponse(`Bootcamp not found with id of ${id}`, 404);

    //we need to do it this way as findByIdAndDelete does not trigger the middleware
    await bootcamp.remove();

    return true;
  }

  async getBootcampsByUser(userId) {
    const bootcamps = await this.model.find({
      user: userId,
    });

    return bootcamps;
  }
}

module.exports = BootcampRepository;

// mongoose advanced query

// const getPosts = async (page = 2, limit = 5) => {
//   try {
//     const filter = {
//       likes: { $gt: 100 }, // Likes greater than 100
//       title: { $regex: /mongoose/i }, // Title containing "mongoose" (case-insensitive)
//       createdAt: { $gte: new Date("2023-01-01") }, // Created after January 1, 2023
//     };

//     const posts = await Post.find(filter) // Apply the filter
//       .sort({ likes: -1 }) // Sort by likes in descending order
//       .skip((page - 1) * limit) // Skip posts for pagination
//       .limit(limit) // Limit results to 5 per page
//       .select("title likes author") // Select specific fields
//       .populate("author", "name email"); // Populate author with name and email

//     console.log(posts);
//     return posts;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//   }
// };

// getPosts();
