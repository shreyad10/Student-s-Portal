const express = require('express')
const router = express.Router();
const {register,login} = require('../controllers/user')
const { student, updateStudent, deleteStudent, viewStudent } = require("../controllers/students");
const {authentication} = require('../middlewares/auth')

router.post('/register',register)
router.post('/login',login)
router.post("/student/:userId",authentication, student);
router.get("/student/:userId",authentication, viewStudent);
router.put("/student/:userId/:studentId",authentication, updateStudent);
router.delete("/student/:userId/:studentId",authentication, deleteStudent);



module.exports = router