const { sequelize, User } = require("./models");

// sequelize
//   .sync({ force: true })
//   .then(() => console.log("DB synced!"))
//   .catch((err) => console.log(err));

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

const run = async () => {
  try {
    const user = await User.create({
      username: "john",
      password: "123456",
      email: "john@g.com",
    });
  } catch (err) {
    console.log(err);
  }
};

// run();
