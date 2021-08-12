const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            // result value is Boolean
            const result = await bcrypt.compare(password, exUser.password);
            if (result) done(null, exUser);
            else done(null, false, { message: "Wrong password!" });
          } else {
            done(null, false, { message: "unsigned account." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

// done(server error, success login, failed login message)
