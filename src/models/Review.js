const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },

  text: {
    type: String,
    required: [true, "Please add some text"],
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

ReviewSchema.statics.computeAvgRating = async function (
  bootcamp,
  excludeCourseId
) {
  let filter = { bootcamp };

  if (excludeCourseId) {
    filter["_id"] = {
      $neq: excludeCourseId,
    };
  }

  const aggregationCompute = await this.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);


  console.log(aggregationCompute)

  await mongoose.model("Bootcamp").findByIdAndUpdate(
    bootcamp,
    {
      averageRating: aggregationCompute[0].averageRating,
    },
    {
      runValidators: true,
    }
  );
};

ReviewSchema.post("save", async function () {
  await mongoose.model("Review").computeAvgRating(this.bootcamp);
  
});

ReviewSchema.post("findOneAndUpdate", async function (next) {
  const updateObj = this.getUpdate();
  const query = this.getQuery();

  const bootcamp = await mongoose
    .model("Review")
    .findById(query._id)
    .select("bootcamp");

  if (updateObj.rating) {
    await mongoose.model("Review").computeAvgRating(bootcamp);
  }

  next();
});

ReviewSchema.pre("delete", async function (next) {
  await mongoose.model("Review").computeAvgRating(this.bootcamp, this._id);
  next();
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
