const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 프론트에서 로그인 요청을 보낼 때, passport.authenticate("local" )에서 localStrategy가 실행
// done 함수가 실행되면 (authError, user, info)가 실행
// IsNotLoggedIn으로 로그인이 안된 사람들만 통과
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    // req.login은 로그인 성공했을 때, 사용한다.
    // req.login을 하는 순간, passport index로 가서 serializeUser가 실행된다.
    // serialize가 done되는 순간 (loginError)부터 실행
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 로그인 성공, 세션 쿠키를 브라우저로 전송
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  // 세션 쿠키 삭제
  req.logout();
  // 세션 삭제
  req.session.destroy();
  res.redirect("/");
});

// 카카오 로그인하기를 누르면 passport.authenticate("kakao") 실행 -> kakaoStrategy이동
// 실행되는 순간 카카오 로그인 페이지가 실행이 된다. 로그인이 성공하면 카카오가 kakao/callback으로 쏘아준다.
router.get("/kakao", passport.authenticate("kakao"));

// kakao가 kakao/callback으로 요청을 보내줘서 실행이 된다.
// 이때 passport.authenticate를 실행을 하고 kakaostrategy.js에서 async (accessToken, refreshToken, profile, done) 부분이 실행
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    // 카카오 로그인 실패 시 이동
    failureRedirect: "/",
  }),
  (req, res) => {
    // 카카오 로그인 성공 시 이동
    res.redirect("/");
  }
);

module.exports = router;
