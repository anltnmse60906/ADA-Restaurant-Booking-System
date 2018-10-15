const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const checkUserValidation = (req, res, next) => {

  const decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id,"email firstName lastName phoneNumber _id", (err, user) => {
    if (err) {
      return res.status(500).json({
        title: "An error occurred!",
        error: err
      });
    }
    if (!user) {
      return res.status(404).json({
        title: "User is not found",
        error: {
          message: "User is not found"
        }
      });
    }
    next(err, user);
  });
};


module.exports = {
  checkUserValidation,
};
