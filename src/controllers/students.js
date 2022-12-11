const studentModel = require("../models/studentModel");
const {
  isValidName,
  isValidObjectId,
  isValidRequestBody,
} = require("../validators/validator");


//-------------------------------- register student--------------------------------
const student = async (req, res) => {
  try {
    let sData = req.body;
    let userId = req.params.userId;
    let { name, subject, marks } = sData;

    if (!isValidRequestBody(sData)) {
      return res.send({
        status: false,
        message: "Kindly send correct request",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.send({
        status: false,
        message: "UserId is not correct or user does not exist",
      });
    }

    // check authentication
    if (req.headers.userId != userId) {
      return res.status(400).send({
        status: false,
        message: "User is not authorised to add students",
      });
    }

    let isStudentPresent = await studentModel
      .findOne({
        name: name,
        subject: subject,
      })
      .select({ updatedAt: 0, __v: 0, createdAt: 0 });

    if (isStudentPresent) {
      isStudentPresent.marks += marks;
      await isStudentPresent.save();
      return res.send({ status: true, ["student data"]: isStudentPresent });
    }

    sData["userId"] = userId;

    let createStudent = await studentModel.create(sData);

    let getStudent = await studentModel
      .findOne(createStudent)
      .select({ updatedAt: 0, __v: 0, createdAt: 0 });
    return res.send({ status: true, ["student data"]: getStudent });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ------------------------------- view students ------------------------------------------
const viewStudent = async (req, res) => {
    try {
      let data = req.query;
      let userId = req.params.userId;

      if (!isValidObjectId(userId)) {
        return res.send({
          status: false,
          message: "UserId is not correct or user does not exist",
        });
      }
  
      //authorization
      if (req.headers.userId != userId) {
        return res.send({
          status: false,
          message: "You are not authorised to view this users data",
        });
      }
      data["userId"] = userId;
  
      let getStudent = await studentModel
        .find(data)
        .select({ updatedAt: 0, __v: 0, createdAt: 0, _id: 0 });
  
      if (getStudent.length == 0) {
        return res.send({
          status: false,
          message: "Data not found",
        });
      }
      return res.send({ status: true, ["student data"]: getStudent });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  //------------------------------ edit student's details-----------------------------
const updateStudent = async function (req, res) {
  try {
    let userId = req.params.userId;
    let studentId = req.params.studentId;

    if (!isValidObjectId(userId)) {
      return res.send({
        status: false,
        message: "UserId is not correct or user does not exist",
      });
    }

    if (!isValidObjectId(studentId)) {
      return res.send({
        status: false,
        message: "StudentID is not correct or user does not exist",
      });
    }

    if (req.headers.userId != userId) {
      return res.status(400).send({
        status: false,
        message: "User is not authorised to add students",
      });
    }

    let data = req.body;
    let updateData = { isDeleted: false };
    let { name, marks, subject } = data;

    let check = await studentModel.findById(studentId);
    if (!check) return res.send({status:false, message :"No student found with this student ID"});
    if (name == check.name)
      return res.send({status:false,message:"This name already exists.No need to update"});
    updateData["name"] = name;

    if (marks == check.marks)
      return res.send({status:false,message:"Marks are same.No need to update"});
    updateData["marks"] = marks;

    let update = await studentModel.findOneAndUpdate(
      { _id: studentId },
      updateData,
      { new: true, upsert: true }
    );
    res.status(200).send({ status: true,message: "Data updated", data: update });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//--------------------------------- delete student -----------------------------
const deleteStudent = async function (req, res) {
  try {
    let userId = req.params.userId;
    let studentId = req.params.studentId;

    if (!isValidObjectId(userId)) {
      return res.send({
        status: false,
        message: "UserId is not correct or user does not exist",
      });
    }

    if (!isValidObjectId(studentId)) {
      return res.send({
        status: false,
        message: "StudentID is not correct",
      });
    }

    let student = await studentModel.findOne({
      _id: studentId,
    });
    if (!student) {
      return res.send({
        status: false,
        message: "Student with this StudentId does not exist",
      });
    }
    if (req.headers.userId != userId) {
      return res.status(400).send({
        status: false,
        message: "User is not authorised to add students",
      });
    }
    let deletedData = await studentModel.findOneAndUpdate(studentId, {
      isDeleted: true,
    });
    return res.status(200).send({
      status: false,
      message: "Student's Data is deleted",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = { student,viewStudent, updateStudent, deleteStudent };
