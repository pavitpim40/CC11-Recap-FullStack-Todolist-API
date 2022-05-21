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
