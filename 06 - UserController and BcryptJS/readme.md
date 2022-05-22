`prerequisite` 
- แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา
- npm install


# STEP 0 : BCRYPTJS

- `npm install bcryptjs`

# STEP 1 : REGISTER CONTROLLER

- เพิ่ม logic ในการ register
- จากนั้นทดสอบ register ใน postman
- ลบ key user ออกจาก response
```js
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, birthDate } = req.body;
    if (password !== confirmPassword) {
      createError("passwords do not match", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    if (password.length < 6) {
      createError("password must be at least 6 characters", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      birthDate,
    });
    res.status(201).json({ message: "user created successfully",user });
  } catch (error) {
    next(error);
  }
};
```

# STEP2 : LOGIN CONTROLLER PART1

- เพิ่ม logic สำหรับการ login

```js
try {
    const { username, password } = req.body;
    if (!username) {
      createError("username is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    if (password.length < 6) {
      createError("password must be at least 6 characters", 400);
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      createError("username or password is not correct", 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError("username or password is not correct", 400);
    }
     console.log(JSON.stringify(user, null, 2));
    // const payload = { id: user.id, username: user.username };
    // const SECRET_KEY = process.env.SECRET_KEY || "YOUR SECRET MESSAGE";
    // const option = { expiresIn: "1h" };
    // const token = jwt.sign(payload, SECRET_KEY, option);
    res.json({ message: "login successfully" });
  } catch (error) {
    next(error);
  }

```


# STEP 3 : LOGIN CONTROLLER PART2
- `npm install jsonwebtoken` ติดตั้งสำหรับส่ง token
- ใส่ค่า secret key ในไฟล์ .env

```
SECRET_KEY=QWERTY
```
- ใส่ logic สำหรับส่ง token ใน login controller
- ทดสอบ login ใน postman

```js
const jwt = require("jsonwebtoken");
```

```js
// if (!isMatch) {
//       createError("username or password is not correct", 400);
//     }
//  console.log(JSON.stringify(user, null, 2));
    const payload = { id: user.id, username: user.username };
    const SECRET_KEY = process.env.SECRET_KEY || "YOUR SECRET MESSAGE";
    const option = { expiresIn: "1h" };
    const token = jwt.sign(payload, SECRET_KEY, option);
    // res.json({ message: "login successfully" });
    res.json({ message: "login successfully", token: token });

```

# TIP : AUTOMATE WITH POSTMAN

- สร้างตัวแปร token ใน environment
- ใส่ script สำหรับเซตค่า token ใน postman ในส่วน tests ของ login
- ทดสอบ login แล้วดูค่าตัวแปร token

```js
var jsonData = JSON.parse(responseBody);

postman.setEnvironmentVariable("token", jsonData.token);

```

# STEP 4 : UPDATE USER CONTROLLER PART1


- เพิ่ม logic ในการแกะ request header ในการ update user
- ทดสอบใน postman

```js
const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("you are unauthorized", 401);
    }
    const [, token] = authorization.split(" ");
    if (!token) {
      createError("you are unauthorized!", 401);
    }

    // decode token
    const SECRET_KEY = process.env.SECRET_KEY || "YOUR SECRET MESSAGE";
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);

    // use token after decode
    const { id: userId } = decoded;
    const user = await User.findByPk(userId);
    if (!user) {
      createError("user not found", 400);
    }

    res.status(200).json({ message: "user updated successfully", user });

```

# STEP 5 : UPDATE USER CONTROLLER PART2
- เพิ่มการ validate
- ทดสอบใน postman ทั้ง update,login
```js
    // const { authorization } = req.headers;
      const {  oldPassword, newPassword, confirmNewPassword, birthDate } =
      req.body;
    // const { id: userId } = decoded;
    // const user = await User.findByPk(userId);
    // if (!user) {
    //   createError("user not found", 400);
    // }
    if (!user) {
      createError("user not found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      createError("invalid password", 400);
    }

    if (newPassword !== confirmNewPassword) {
      createError("new passwords do not match", 400);
    }
    if (!newPassword) {
      createError("new password is required", 400);
    }
    if (newPassword.length < 6) {
      createError("new password must be at least 6 characters", 400);
    }

```

# STEP 6 : UPDATE USER CONTROLLER PART3
- เพิ่ม logic ในการ update 
- ทดสอบใน postman (ลองเปลี่ยน email กับ password)
-  ทั้ง update,login

```js
   
    // const { id: userId } = decoded;
    // const user = await User.findByPk(userId);
    // if (!user) {
    //   createError("user not found", 400);
    // }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.update(
      { email, password: hashedPassword, birthDate,lastUpdatedPassword:new Date() },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "user updated successfully", result });
```

# STEP 7 : REFRACTOR USER CONTROLLER TO MIDDLEWARE Part1

- สร้างไฟล์ userAuthorize ใน folder middleware
- ใส่ logic สำหรับตรวจสอบ token

```js
const jwt = require("jsonwebtoken");
const { User } = require("../models/");
const createError = require("../utils/createError");

exports.getUserByToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("you are unauthorized", 401);
    }
    const [, token] = authorization.split(" ");
    if (!token) {
      createError("you are unauthorized", 401);
    }
   const SECRET_KEY = process.env.SECRET_KEY || "YOUR SECRET MESSAGE";
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      createError("you are unauthorized", 401);
    }

    next();
  } catch (err) {
    next(err);
  }
};

```

- ใส่ logic สำหรับการ modified request object

```js
//  if (!user) {
//       createError("you are unauthorized", 401);
//     }
req.user = user;
//     next();
    
```
# STEP 8 : REFRACTOR USER CONTROLLER TO MIDDLEWARE Part2

- นำ Middleware ไปใส่ที่ route

```js
//routes/userRoute.js
const UserMiddleware = require("../middlewares/userAuthorize");

router.patch("/update",UserMiddleware.getUserByToken, userController.updateUser);

```
# STEP 9 : REFRACTOR USER CONTROLLER TO MIDDLEWARE Part3

- ลบ logic ในการ Authenticate จาก userController 
- หากทดสอบใน postman จะบึ้ม เพราะ user เป็น undefined

```js
    //const { authorization } = req.headers;
    const { email, oldPassword, newPassword, confirmNewPassword, birthDate } =
      req.body;
    // if (!authorization || !authorization.startsWith("Bearer")) {
    //   createError("you are unauthorized", 401);
    // }
    // const [, token] = authorization.split(" ");
    // if (!token) {
    //   createError("you are unauthorized!", 401);
    // }

    // // decode token
    // const SECRET_KEY = process.env.SECRET_KEY || "YOUR SECRET MESSAGE";
    // const decoded = jwt.verify(token, SECRET_KEY);
    // console.log(decoded);

    // // use token after decode
    // const { id: userId } = decoded;
    // const user = await User.findByPk(userId);
    // if (!user) {
    //   createError("user not found", 400);
    // }

    // Validate
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      createError("invalid password", 400);
    }

    if (newPassword !== confirmNewPassword) {
      createError("new passwords do not match", 400);
    }
    if (!newPassword) {
      createError("new password is required", 400);
    }
    if (newPassword.length < 6) {
      createError("new password must be at least 6 characters", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.update(
      {
        email,
        password: hashedPassword,
        birthDate,
        lastUpdatedPassword: new Date(),
      },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "user updated successfully", result });

```

- แก้ code ที่ใช้ user เป็น req.user
- ทดสอบใน postman

```js
//  const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       createError("invalid password", 400);
//     }

 const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
      createError("invalid password", 400);
    }

   

   
    // const result = await User.update(
    //   {
    //     email,
    //     password: hashedPassword,
    //     birthDate,
    //     lastUpdatedPassword: new Date(),
    //   },
    //   { where: { id: userId } }
    // );

        const result = await User.update(
      {
        email,
        password: hashedPassword,
        birthDate,
        lastUpdatedPassword: new Date(),
      },
      { where: { id: req.user.id } }
    );

```

# STEP 10 : REFRACTOR USER CONTROLLER TO MIDDLEWARE Part4

- เพิ่ม logic สำหรับ token ที่ถูกสร้างก่อนการเปลี่ยนรหัสผ่าน

```js
// middleware/userAuthorize.js
   if(decoded.iat*1000 < new Date(user.lastUpdatedPassword).getTime()){
      createError("token is outdate", 401);
    }

```

# STEP 11 : ERROR CONFIG

- เพิ่ม logic ในการดัก error
- ทดสอบเมื่อใส่ token ผิด
- ทดสอบเมื่อใส่ token เก่า
- ทดสอบ field แปลกๆใน sequelize เช่น `password: "1111",`

```js
// middleware/errorHandler.js
  if (err.name === "SequelizeValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }

  res.status(err.statusCode || 500).json({
    message: err.message,
    name: err.name,
  });

```