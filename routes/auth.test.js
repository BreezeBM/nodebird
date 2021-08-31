const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/user");

// 모든 테스트가 실행되기 전에
beforeAll(async () => {
  await sequelize.sync();
});

// 처음 가입하면 성공하지만, 2번째 할 때는 이미 생성이 되었기 떄문에 또 가입이라 실패
describe("POST /join", () => {
  test("로그인 안했으면, 회원가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "seyya77@gmail.com",
        nick: "asdf",
        password: "12345678",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /login", () => {
  // agent를 만들면, 여러 테스트를 걸쳐서 계속 유지를 시켜준다.
  const agent = request.agent(app);
  // 로그아웃 테스트 전에 로그인을 시킨다.
  // beforeEach 테스트 하기 직전에 실행이 된다.
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "seyya77@gmail.com",
        password: "12345678",
      })
      .end(done);
  });

  test("이미 로그인했으면 redirect /", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "seyya77@gmail.com",
        nick: "asdf",
        password: "12345678",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("가입되지 않은 회원", (done) => {
    const message = encodeURIComponent("가입되지 않은 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "zerohch1@gmail.com",
        password: "12345678",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "seyya77@gmail.com",
        password: "12345678",
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "seyya77@gmail.com",
        password: "wrong",
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe("GET /logout", () => {
  test("로그인 되어있지 않으면 403", (done) => {
    request(app)
      .get("/auth/logout")
      .expect(403, done);
  });

  const agent = request.agent(app);
  // 로그인을 시켜놓고, 로그아웃 테스트
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "seyya77@gmail.com",
        password: "12345678",
      })
      .end(done);
  });

  test("로그아웃 수행", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    agent
      .get("/auth/logout")
      .expect("Location", `/`)
      .expect(302, done);
  });
});

// 모든 테스트가 끝난 후에
// 데이터 베이스를 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
