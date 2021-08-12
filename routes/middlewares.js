exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(403).send("LogIn is required!");
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) next();
  else {
    const message = encodeURIComponent("Already LoggedIn");
    res.redirect(`/?error=${message}`);
  }
};
