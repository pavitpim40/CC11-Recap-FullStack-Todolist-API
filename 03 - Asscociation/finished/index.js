const { sequelize, User, Todo } = require("./models");

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

// sequelize
//   .sync({ force: true })
//   .then(() => console.log("DB synced!"))
//   .catch((err) => console.log(err));

// const run = async () => {
//   try {
//     const user = await User.create({
//       username: "john",
//       password: "123456",
//       email: "john@g.com",
//     });
//     console.log(JSON.stringify(user, null, 2));
//   } catch (err) {
//     console.log(err);
//   }
// };

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
