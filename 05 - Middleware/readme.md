`prerequisite` 
- แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา
- npm install

# STEP0 : MIDDLEWARE
- สร้างโฟลเดอร์ middlewares

# STEP1 : NOT FOUND MIDDLEWARE

- สร้างไฟล์ notFound.js

```js
module.exports = (req, res, next) => {
  res.status(404).json({ message: "resource not found on this sever" });
};

```
- นำมาใช้ใน index.js

```js
const notFoundMiddleWare = require("./middlewares/notFound");



app.use(notFoundMiddleWare);
```

- ทดสอบใน postman

# STEP2 : ERROR MIDDLEWARE
- สร้างไฟล์ error.js

```js
module.exports = (err, req, res, next) => {
  
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
};


```

- นำมาใช้ใน index.js

```js
const errorMiddleWare = require("./middlewares/error");

app.use(errorMiddleWare);
```

# STEP 3 : TEST ERROR MIDDLEWARE
- ลองเปลี่ยน logic ใน register ตามนี้

```js
exports.register = async (req, res, next) => {
  try {
    console.log(e);
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

```
- ทดสอบใน postman

# STEP 4 : CUSTOM ERROR IN UTIL

- สร่้างโฟลเดอร์ util
- สร้างไฟล์ createError.js

```js
module.exports = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

```
- ทดสอบการใช้งานใน userController.js

```js
const createError = require("../utils/createError");

exports.register = async (req, res, next) => {
  try {
     createError("cant not register", 409);
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};
 
```

- ทดสอบใน postman
- ลบ logic ที่ใช้ทดสอบออกจาก controller