const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "MyInfo - NodeBird" });
});

router.get("join", (req, res) => {
  res.render("join", { title: "SignUp - Nodebird" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "Nodebird",
    twits,
  });
});

module.exports = router;
