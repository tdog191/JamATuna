var request = require("supertest");

describe("express server", function() {
  var server;

  beforeEach(function() {
    server = require("../server")();
  });

  afterEach(function() {
    server.close();
  });

  it("responds on /", function (done) {
    request(server)
      .get("/")
      .expect(200, done);
  });

  it("responds on /html/chat.html", function (done) {
    request(server)
      .get("/html/chat.html")
      .expect(200, done);
  });

  it("responds on /html/audio.html", function (done) {
    request(server)
      .get("/html/audio.html")
      .expect(200, done);
  });

  it("responds on /html/index.html", function (done) {
    request(server)
      .get("/html/index.html")
      .expect(200, done);
  });

  it("responds on /html/users.html", function (done) {
    request(server)
      .get("/html/users.html")
      .expect(200, done);
  });

  it("responds on /html/profile.html", function (done) {
    request(server)
      .get("/html/profile.html")
      .expect(200, done);
  });

  it("returns 404 Not Found on /foo/bar", function testPath(done) {
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  });
});