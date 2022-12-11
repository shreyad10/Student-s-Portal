const mongoose = require('mongoose')
const isValidEmail = (Email) => {
  return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email);
};

const isValidPwd = (Password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
    Password
  );
};
const isValidRequestBody = function (requestBody) {
  if (Object.keys(requestBody).length > 0) return true;
  return false;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};


module.exports = { isValidEmail, isValidPwd,isValidObjectId, isValidRequestBody };
