const request = require("supertest");
const { expect } = require("chai");
const app = require("./app");

describe("GET /", () => {
  it("should respond with message ketan", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body.hello).to.equal("ketan");
  });
});
