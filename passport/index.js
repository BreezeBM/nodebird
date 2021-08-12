const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 user.id만 저장
  });

  // { id: 3, 'connect.sid': 's%1234023324102'} 세션 쿠키와 id매칭

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user)) // req.user로 조회가능,  req.isAuthenticated()함수로 로그인 여부 확인, 로그인했으면 true반환
      .catch((err) => done(err));
  });

  local();
  kakao();
};
