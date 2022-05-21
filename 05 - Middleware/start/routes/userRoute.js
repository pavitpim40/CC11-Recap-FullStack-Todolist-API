const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.patch("/update", userController.updateUser);
router.post("/login", userController.login);
module.exports = router;
