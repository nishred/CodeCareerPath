const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../errors/ErrorResponse");

class CourseRepository {
  constructor() {
    this.Course = Course;
    this.Bootcamp = Bootcamp;
  }

  async getAllCourses(params) {
    let query;

    console.log(params);

    if (params.bootcampId) {
      query = this.Course.find({
        bootcamp: params.bootcampId,
      });
    } else {
      query = this.Course.find();
    }

    query = query.populate({
      path: "bootcamp",
      select: "name description",
    });

    const courses = await query;

    return courses;
  }

  async create(course) {
    const response = await this.Course.create(course);

    return response;
  }

  async getById(id) {
    const course = await this.Course.findById(id);

    return course;
  }

  async update(id, data) {
    const course = await this.getById(id);

    if (!course)
      throw new ErrorResponse(`Course not found with id of ${id}`, 404);

    const updatedCourse = await this.Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updatedCourse;
  }

  async delete(id) {
    const course = await this.Course.findById(id);

    if (!course) {
      throw new ErrorResponse(`Course not found with id of ${id}`, 404);
    }

    await course.remove();

    return true;
  }
}

module.exports = CourseRepository;
