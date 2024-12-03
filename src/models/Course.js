const mongoose = require("mongoose");
const ErrorResponse = require("../errors/ErrorResponse");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Static method to get avg of course tuitions
// in this context this refers to the model class itself
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after tuition update
CourseSchema.post("findOneAndUpdate", async function (doc) {
  if (this.tuition != doc.tuition) {
    await doc.constructor.getAverageCost(doc.bootcamp);
  }
});

CourseSchema.pre("findOneAndUpdate", async function (next) {
  const data = this.getUpdate();

  if (data.bootcamp) {
    const Bootcamp = mongoose.model("Bootcamp");

    const bootcamp = await Bootcamp.findById(data.bootcamp);

    if (!bootcamp) {
      throw new ErrorResponse(
        `Bootcamp not found with id of ${data.bootcamp}`,
        404
      );
    }
  }

  next();
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
