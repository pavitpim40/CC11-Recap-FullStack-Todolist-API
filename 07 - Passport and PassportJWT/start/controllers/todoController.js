// ## CREATE TODO
exports.createTodo = async (req, res, next) => {
  try {
    res.status(201).json({ message: "todo created successfully" });
  } catch (error) {
    next(error);
  }
};

// ## UPDATE TODO
exports.updateTodo = async (req, res, next) => {
  try {
    res.status(201).json({ message: "todo updated successfully" });
  } catch (error) {
    next(error);
  }
};

// ## DELETE TODO
exports.deleteTodo = async (req, res, next) => {
  try {
    res.status(204).json({ message: "todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ## GET ALL TODO
exports.getAllTodo = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Get All todo" });
  } catch (error) {
    next(error);
  }
};

// ## GET TODO BY ID
exports.getTodoById = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Get TODO by ID" });
  } catch (error) {
    next(error);
  }
};
