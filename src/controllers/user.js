const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const jwt = require("jsonwebtoken");
const { isValidEmail, isValidPwd } = require("../validators/validator");

const register = async function (req, res) {
  try {
    let data = req.body;
    const { email, password } = data;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "enter email or password" });
    }
    if (email) {
      if (!isValidEmail(email))
        return res
          .status(400)
          .send({ status: false, message: "Invalid email" });

      let user = await userModel.findOne({ email: email });
      if (user) {
        return res.status(400).send({
          status: false,
          message: "User already registered, please login!",
        });
      }
    }
    if (password) {
      if (!isValidPwd(password))
        return res.status(400).send({
          status: false,
          message:
            "Password must contain 8-15 characters, and atleast one uppercase, one special character, one number!",
        });
    }
    let createdUser = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "User registered", data: createdUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const login = async function (req, res) {
  try {
    let data = req.body;
    const { email, password } = data;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "enter email and password" });
    }

    let user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      return res.status(200).send({
        status: true,
        message: "No such user exist, please register!",
      });
    }
    let token = jwt.sign(
      {
        userId: user._id,
        batch: 2022 - 23,
      },
      "Veryverysecretkey"
    );
    let studentList = await studentModel.find({ userId: user._id }); //new code
    if (studentList.length == 0) {
      return res
        .status(200)
        .send({
          status: true,
          token: token,
          studentList: "No students for logged In user!",
        });
    }
    return res
      .status(200)
      .send({ status: true, token: token, studentList: studentList }); //new
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { register, login };
