var request = require("supertest");
describe("loading express", function() {
  var server;
  beforeEach(function() {
    server = require("../server")();
  });
  afterEach(function() {
    server.close();
  });
  it("responds to /audio", function testSlash(done) {
    request(server)
      .get("/audio")
      .expect(200, done);
  });
  it("responds to /chat", function testSlash(done) {
    request(server)
      .get("/chat")
      .expect(200, done);
  });
  it("404 on incorrect page", function testPath(done) {
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  });
});
