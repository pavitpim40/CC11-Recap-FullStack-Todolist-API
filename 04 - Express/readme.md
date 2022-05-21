`prerequisite` แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา


# STEP 1 : INSTALL 

- `express` : สำหรับจัดการ request,response
- `dotenv` : สำหรับเก็บตัวแปร environment
- `cors` : สำหรับจัดการเรื่อง cross origin
- `morgan` : สำหรับ log 

```
npm install express dotenv cors morgan
```

# STEP 2 : CREATE SERVER

```js
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = 8002;
// sequelize.sync({ force: true }).then(() => console.log("DATABASE SYNC"))
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```
# STEP 3 : API
```js
app.use("/api/users");
app.use("/api/todo");

```

# STEP 4 : ROUTER
- สร้างโฟลเดอร์ Routes
- สร้างไฟล์ todoRoutes.js และ userRoutes.js

```js

// routes/userRoute.js
const express = require("express");
const router = express.Router();

router.post("/register");
router.patch("/update");
router.post("/login");
module.exports = router;
```

```js
//route/todoRoute.js
const express = require("express");
const router = express.Router();

router.post("/");
router.patch("/");
router.delete("/:id");
router.get("/");
module.exports = router;

```
# STEP 5 : CONTROLLER
- สร้างโฟลเดอร์ controllers 
- สร้างไฟล์  userController.js กับ todoController

```js

exports.register = async (req, res, next) => {
  try {

    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {

   
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
   
    res.json({ message: "login successfully" });
  } catch (error) {
    next(error);
  }
};


```

```js
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
    res.status(201).json({message: "todo updated successfully"});
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

    res.status(200).json({message: "Get All todo"});
  } catch (error) {
    next(error);
  }
};

// ## GET TODO BY ID
exports.getTodoById = async (req, res, next) => {
  try {
   
    res.status(200).json({message: "Get TODO by ID"});
  } catch (error) {
    next(error);
  }
};


```
# STEP 6 - UPDATE CONTROLLER TO ROUTE

- อัพเดทไฟล์ route ให้ส่ง request ไปที่ controller
```js 
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.patch("/update", userController.updateUser);
router.post("/login", userController.login);
module.exports = router;

```

```js
const express = require("express");
const todoController = require("../controllers/todoController");
const router = express.Router();

router.post("/", todoController.createTodo);
router.patch("/", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.get("/", todoController.getAllTodo);
router.get("/:id", todoController.getTodoById);
module.exports = router;

```

# STEP 7 - UPDATE ROUTE TO APP

```js

const userRoute = require("./routes/userRoute");
const todoRoute = require("./routes/todoRoute");

app.use("/api/users", userRoute);
app.use("/api/todo",todoRoute);

```

# STEP 8 - TEST API WITH POSTMAN

# STEP 9 - USE DOTENV
- สร้างไฟล์ dotenv ใน root
- ใส่ค่า `PORT=8003`
- อัพเดทไฟล์ index.js

```js
require('dotenv').config()

process.env.PORT || 8002

```