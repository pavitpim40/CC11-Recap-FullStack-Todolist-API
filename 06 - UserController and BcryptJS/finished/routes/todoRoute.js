const express = require("express");
const todoController = require("../controllers/todoController");
const router = express.Router();

router.post("/", todoController.createTodo);
router.patch("/", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.get("/", todoController.getAllTodo);
router.get("/:id", todoController.getTodoById);
module.exports = router;
