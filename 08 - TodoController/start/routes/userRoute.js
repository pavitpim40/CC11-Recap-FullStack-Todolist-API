const express = require("express");

const AuthenWithpassportJWT = require("../middlewares/passportJwt");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.patch("/update", AuthenWithpassportJWT, userController.updateUser);
router.post("/login", userController.login);
module.exports = router;
