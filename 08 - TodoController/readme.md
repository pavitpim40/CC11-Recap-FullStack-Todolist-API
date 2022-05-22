`prerequisite` 
- แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา
- npm install

# STEP 1 : CREATE TODO 

- ใส่ logic ในการ create
- เทสกับ postman

```js
// ## CREATE TODO
exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;
    const todo = await Todo.create({ title, completed, dueDate, userId:req.user.id });
    res.status(201).json({ todo, message: "todo created successfully" });
  } catch (error) {
    next(error);
  }
};

```

# STEP 2 : UPDATE TODO 


- ใส่ logic ในการ update
- เทสกับ postman

```js
// ## UPDATE TODO
exports.updateTodo = async (req, res, next) => {
  try {
    const { todoId, title, completed, dueDate } = req.body;
    const todo = await Todo.findOne({ where: { id: todoId, userId: req.user.id } });
    if (!todo) {
      createError("todo not found", 404);
    }
    const result = await Todo.update(
      { title, completed, dueDate },
      { where: { id: todoId, userId: req.user.id } }
    );
    console.log(result, { id: todoId, userId: req.user.id })
    if (result[0] === 0) {
      createError("Todo with this id is not found", 400);
    }
    res.status(201).json({
      message: "todo updated successfully",
      updatedTodo: { ...result.dataValues, title, completed, dueDate },
    });
  } catch (error) {
    next(error);
  }
};
```

# STEP 3  : DELETE TODO

- ใส่ logic ในการ delete
- เทสกับ postman

```js
// ## DELETE TODO
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Todo.destroy({ where: { id: id, userId: req.user.id } }); //เอามา row เดียว
    if (result === 0) {
      createError("todo is not found", 400);
    }
    res.status(204).json({ message: "todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

```


# STEP 4 : GET ALL TODO


- ใส่ logic ในการ get todo by userId
- เทสกับ postman

```js
// ## GET ALL TODO
exports.getAllTodo = async (req, res, next) => {
  try {

    const user = await User.findByPk(req.user.id);
    if (!user) {
      createError("user not found", 400);
    }

    const todos = await Todo.findAll({ where: { userId: req.user.id } });
    if (todos.length === 0) {
      createError("todo not found", 404);
    }

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

```


# STEP 5 : GET TODO BY ID

- ใส่ logic ในการ get todo by userId & by todoId
- เทสกับ postman

```js
exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
      attribute: ["id", "title", "completed", "dueDate"],
    });
    if (!todo) {
      createError("todo not found", 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }

```