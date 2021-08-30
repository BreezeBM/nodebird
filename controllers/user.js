const User = require("../models/user");

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      // 내가 :id의 유저를 팔로우 한다.
      await user.addFollowings(parseInt(req.params.id, 10)); //setFollowings 수정하는 메서드
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
