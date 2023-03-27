const router = require('express').Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

router.post(
    "/register",body("first_name").isString(),
    body("last_name").isString(),
    body("email").isEmail(),
    body("password").isStrongPassword(),
    body("address").isString(),authController.registerController
);

router.get("/verify/:token",authController.verifyEmailController);

router.post("/login",authController.loginController);

module.exports = router;