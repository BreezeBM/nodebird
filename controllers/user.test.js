const { addFollowing } = require("./user");

// 데이터베이스 모킹하기
jest.mock("../models/user.js");
const User = require("../models/user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고, success를 응답해야 함", async () => {
    // 반환값을 가짜로 만들어 준다.
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        name: "ㅇ",
        addFollowings(value) {
          return Promise.resolve(true);
        },
      })
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출함", async () => {
    // 사용자를 찾지 못함
    User.findOne.mockReturnValue(Promise.resolve(null));
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error) 호출함 ", async () => {
    const error = "테스트용 에러";
    // reject하면 catch로 넘어간다
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
