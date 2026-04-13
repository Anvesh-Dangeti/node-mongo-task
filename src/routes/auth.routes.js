const express = require("express");
const authController = require("../controllers/auth.controller.js");
const validationMiddleware = require("../middlewear/validation.middlewear.js");

const router = express.Router(); 


router.post('/register', validationMiddleware.registerValidationRules, authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;