
# STEP 0 : SEQUELIZE CLI (GLOBAL)

- สำหรับ windows ลง sequelize-cli ด้วยคำสั่ง `npm i -g sequelize cli`
- สำหรับ mac ลง sequelize-cli ด้วยคำสั่ง `sudo npm i -g sequelize cli` แล้วตามด้วย password ของเครื่อง

# STEP1 : CONFIG  DATABASE

- เริ่ม node project ด้่วยคำสั่ง `npm init -y`
- install sequelize และ mysql2 ด้วยคำสั่ง `npm i sequelize mysql2`
- พิมพ์คำสั่ง `sequelize init:config` เพื่อสร้างโฟลเดอร์ config
- ใส่ข้อมูลเกี่ยวกับการ Connection Database ของเรา
- ใช้ชื่อ database เป็น `recap_todolist`

```
{
  "development": {
    "username": "YOUR_DATABASE_USERNAME",
    "password": "YOUR_DATABASE_PASSWORD",
    "database": "YOUR_SCHEMA_NAME",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
# STEP 2 : CREATE DATABASE

- ใช้คำสั่งช่วยสร้าง database `sequelize db:create`
- ตรวจสอบ schemas ของเราใน workbence จะพบว่ามี database แล้วแต่ยังไม่มีตาราง
- ลองใช้คำสั่ง `sequelize db:drop` แล้วตรวจสอบ workbench อีกครั้ง
- สร้าง database อีกครั้ง

# STEP 3 : INIT MODEL

- ใช้คำสั่ง `sequelize init:models` ตัว cli จะทำการสร้างโฟลเดอร์ models ให้

# STEP 4.1 : USER MODEL
- สร้างไฟล์ user.js ในโฟลเดอร์ models
- เขียนฟังก์ชันที่คืนค่า instance ของ user ดังนี้  

```js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 100],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
      lastUpdatedPassword: DataTypes.DATE,
    },
    { underscored: true, paranoid: true }
  );

  return User;
};


```

# STEP 4.2 : TODO MODEL

- สร้างไฟล์ todo.js ในโฟลเดอร์ models
- เขียนฟังก์ชันที่คืนค่า instance ของ todo ดังนี้  

```js
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    "Todo",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      dueDate: DataTypes.DATEONLY,
    },
    { underscored: true }
  );

  return Todo;
};


```
# STEP 5 : INSPECT INDEX.JS IN MODEL
- ตรวจสอบไฟล์ index.js ในโฟลเดอร์ models ว่า export อะไรมาให้เราใช้บ้าง
- ตรวจสอบโค้ดในส่วนของการสร้าง instance
- ตรวจสอบโค้ดในส่วนของการ เพิ่ม key ของ model
- ตรวจสอบโค้ดในส่วนของการ เพิ่ม association

# STEP 6 : ทดสอบ CONNECTION TO DATABASE

- สร้างไฟล์ index.js ขึ้นมาใน root
- ทดสอบ Connection ด้วยเมธอด authenticate จากนั้นรันคำสั่ง `node index.js`

```js 
const { sequelize} = require("./models");

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });
```



# STEP 7 : SYNC MODEL

- นำ model ที่เราเขียนไว้ไปสร้างตารางด้วยเมธอด sync 

```js
const { sequelize } = require("./models");
sequelize
  .sync({ force: true })
  .then(() => console.log("DB synced!"))
  .catch((err) => console.log(err));
```

- รันคำสั่ง `node index.js` และดู termainal
- ตรวจสอบ schema ใน workbench

# STEP 8 : IMPLEMENT MODEL

- นำโมเดลมาใช้ในไฟล์ index.js 
- ลองสั่งสร้าง record ขึ้นมาด้วย static method ที่ชื่อว่า create

```js
const {  User } = require("./models");
const run = async () => {
  try {
    const user = await User.create({
      username: "john",
      password: "123456",
      email: "john@g.com",
    });
     console.log(JSON.stringify(user, null, 2));
  } catch (err) {
    console.log(err);
  }
};

run();

```
- ตรวจสอบตารางใน workbench