`prerequisite` แก้ไฟล์ config ให้เชื่อมต่อกับ database ของเรา

# STEP 1 : ASSOCIATION ฝั่ง USER

```js
  User.associate = function (models) {
    User.hasMany(models.Todo, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
      onDelete: "RESTRICT",
    });
  };

```

# STEP 2 : ASSOCIATION ฝั่ง TODO

```js
Todo.associate = function (models) {
    Todo.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
      onDelete: "RESTRICT",
    });
  };

```

# ABOUT OPTION IN FK

1. `allowNull`: 

2. `name` 
- 2.1 กำหนดชื่อตามใจได้ เช่น test_id
- 2.2 หากไม่กำหนด name จะมีการกำหนดให้โดยอัติโนมัติ โดยขึ้นกับตอน define model ด้วย
    - case 1 : ถ้าตอน define model ไม่ใช้  underscore:true  
    ชื่อที่กำหนดจะใช้ชื่อ model ของฝั่ง one 
เช่นโมเดล User => name : UserId (เป็นแบบ Pascal case)

    - case 2 : ถ้าตอน define model ใช้ underscore : true 
  name จะกลายเป็น user_id แทน UserId

3. `field` : เป็นชือของคอลัมน์ใน MySQL ที่เก็บ ForeignKey
เขียนให้ตรงกับ WorkBench ก็ใช้งานได้
ตอนเรียกใช้งาน เช่น create : ให้เรียกผ่าน name 


# STEP 3 : SYNC MODEL

- ใช้คำสั่ง force : true ใน index.js
- รัน `node index.js`
- ดู config ของแต่ละ table ใน workbench

```js

const { sequelize } = require("./models");

sequelize
  .sync({ force: true })
  .then(() => console.log("DB synced!"))
  .catch((err) => console.log(err));

```

# STEP 4 : TEST 

- สร้าง user  

```js 
const { User } = require("./models");

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

run()

```

- สร้าง todo

```js
const { Todo } = require("./models");

const run = async () => {
  try {
    const todo = await Todo.bulkCreate([
      { title: "math", completed: false, dueDate: new Date(), userId: 1 },
      { title: "english", completed: true, dueDate: new Date(), userId: 1 },
      { title: "science", completed: false, userId: 1 },
      { title: "history", userId: 1 },
    ]);
    console.log(JSON.stringify(todo, null, 2));
  } catch (err) {
    console.log(err);
  }
};

run();

```

