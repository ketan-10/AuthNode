const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");
const db = require("../db/connection"); // this requires dotenv config, which is done in app.js, so app.js must be imported before db

const users = db.get("users");
const newUser = {
  username: "testuser",
  password: "testPassword",
};

describe("GET /auth", () => {
  it("should respond with message", async () => {
    const respond = await request(app).get("/auth").expect(200);
    expect(respond.body.message).to.equal("🔐");
  });
});

describe("POST /auth/signup", () => {
  // describe,it,before,beforeEach are form mocha

  // before runs on each descibe
  // beforeEach runs on each it
  before(async () => {
    await users.remove({});
  });

  it("should require a username", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({})
      .expect(500);
    expect(response.body.message).to.equal("\"username\" is required");
  });

  it("should require a password", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ username: "ketan" })

      .expect(500);
    expect(response.body.message).to.equal("\"password\" is required");
  });

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send(newUser)
      .expect(200);
    expect(response.body).to.have.property("token");
  });

  it("should not allow duplicate username", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send(newUser)
      .expect(500);
    expect(response.body.message).to.equal("User Already exists");
  });
});

describe("POST /auth/login", () => {
  // before(async () => {
  //   await users.remove({});
  // });

  it("should require a username", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({})
      .expect(500);
    expect(response.body.message).to.equal("\"username\" is required");
  });

  it("should require a password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "ketan" })

      .expect(500);
    expect(response.body.message).to.equal("\"password\" is required");
  });

  it("should only allow non existing users to login", async () => {
    const unknownUser = {
      username: "idontexist",
      password: "testPassword",
    };
    const response = await request(app)
      .post("/auth/login")
      .send(unknownUser)
      .expect(500);
    expect(response.body.message).to.equal("User does not exists");
  });

  it("should not allow wrong password", async () => {
    const wrongPassUser = {
      username: newUser.username,
      password: "i am wrong password",
    };
    const response = await request(app)
      .post("/auth/login/")
      .send(wrongPassUser)
      .expect(500);
    expect(response.body.message).to.equal("Password does not match");
  });

  it("should allow user to login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send(newUser);
    expect(response.body).to.have.property("token");
  });
});
