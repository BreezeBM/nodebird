const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

// 그룹화 describe
// req, res, next를 진짜로 넣어주기 힘들 때는 가짜로 넣어준다. 가짜로 만드는 것을 모킹이라도 한다.
describe("IsLoggedIn", () => {
  const res = {
    // res를 반환해야 체이닝이 가능
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();
  // 실행되는 것은 toBeCalledTimes로 확인
  test("로그인이되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("로그인이되어 있지 않으면 isLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("IsNotLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    message: jest.fn(),
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("로그인이되어 있으면 isNotLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    const message = encodeURIComponent("로그인한 상태입니다.");
    isNotLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인이되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
