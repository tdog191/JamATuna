var request = require("supertest");

describe("loading express", function() {
  var server;

  beforeEach(function() {
    server = require("../server")();
  });

  afterEach(function() {
    server.close();
  });

  it("responds to /", function testSlash(done) {
    request(server)
      .get("/")
      .expect(200, done);
  });

  it("responds on /html/chat.html", function testSlash(done) {
    request(server)
      .get("/html/chat.html")
      .expect(200, done);
  });

  it("responds on /html/audio.html", function testSlash(done) {
    request(server)
      .get("/html/audio.html")
      .expect(200, done);
  });

  it("responds on /html/index.html", function testSlash(done) {
    request(server)
      .get("/html/index.html")
      .expect(200, done);
  });

  it("responds on /html/users.html", function testSlash(done) {
    request(server)
      .get("/html/users.html")
      .expect(200, done);
  });

  it("responds on /html/profile.html", function testSlash(done) {
    request(server)
      .get("/html/profile.html")
      .expect(200, done);
  });

  it("404 on /foo/bar", function testPath(done) {
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  });
});
