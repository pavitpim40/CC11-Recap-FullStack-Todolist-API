`prerequisite` 
- แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา
- npm install

# STEP 0 : INSTALL PACKAGES

```
npm install passport passport-jwt
```


# STEP 1 : CONFIGURATION PASSPORT

- สร้างไฟล์ passport.js ในโฟลเดอร์ config

```js
const {Strategy:JwtStrategy,ExtractJwt} = require ('passport-jwt');
const passport = require('passport');
const {User} = require('../models');



```
- กำหนด option ในการตรวจสอบ

```js 
const option = {
    secretOrKey: process.env.JWT_SECRET_KEY || "YOUR_SECRET_KEY",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

```

- กำหนดฟังก์ชันที่ใช้ในการตรวจสอบ

```js
const extractFunction = async(payload,done)=>{

    try {
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) {
        done(new Error('user not found'),false);
    }

    if(payload.iat*1000 < new Date(user.lastUpdatedPassword).getTime()){
        done(new Error("token expired"), false);
    }
    // ส่ง user เข้าไปใน req เพื่อให้ middleware ตัวถัดไปทำงาน
    done(null,user) // req.user = user
        
    } catch (error) {
        done(error,false);
    }
   
}

```

- นำค่าต่างๆไปใส่ใน `passport.use`

```js

passport.use(new JwtStrategy(option,extractFunction));

```
- ทำให้ node app เรารู้จัก Strategy

```js
//index.js
require('./config/passport')

```

# STEP 2 : USE PASSPORT

- สร้างไฟล์ passportJWT.js ในโฟลเดอร์ middleware
- เรียกใช้เมธอด authenticate

```js
const passport = require('passport')


module.exports = passport.authenticate('jwt', { session: false })
```


- นำ middleware ที่สร้างขึ้นมาใหม่ไปใช้แทน middleware ตัวเดิมใน userRoute
- ทดสอบ update user ใน postman

```js
//Routes/userRoute.js


const AuthenWithpassportJWT = require("../middlewares/passportJwt");

router.patch("/update",AuthenWithpassportJWT, userController.updateUser);
```

# STEP 3 : REMOVE UNUSED CODE

```js
//routes/userRoute.js
const UserMiddleware = require("../middlewares/userAuthorize");
```
- ลบไฟล์  userAuthorize.js ออกจากโฟลเดอร์ middleware

# STEP4 : PROTECT TODO ROUTE

- import ตัว JWT มาใช้ใน index.js
- นำ middleware ไปดักหน้า todoRoute
- ทดสอบ postman 

```js
const AuthenWithpassportJWT = require("./middlewares/passportJwt");

app.use("/api/todo", AuthenWithpassportJWT,todoRoute);

```