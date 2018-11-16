'use strict';

var request = require("supertest");

test('broadcastMessage', function() {

});

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



'use strict';

import axios from 'axios';
import {
  executeAuthentication,
  executeFollowersSearchQuery,
  executeFollowingSearchQuery,
  executeFollowUser,
  executeRepoSearchQuery,
  executeStarRepo,
  executeUnfollowUser,
  executeUnstarRepo,
  executeUserSearchQuery
} from '../../main/api/queries';
import {
  userQueryUrl,
  repoQueryUrl,
  followingQueryUrl,
  followersQueryUrl,
  userFollowUrl,
  repoStarUrl,
  authenticationUrl,
} from '../../main/api/url';
import {client_id, client_secret} from '../../main/api/auth_details';

const username = 'torvalds';
const owner = 'owner';
const repo = 'repo';
const access_token = 'test_token';
const password = 'password';

const successCallback = (jsonResponse) => { return jsonResponse };
const failureCallback = (errorResponse) => { return errorResponse };

jest.mock('axios');

test('executeUserSearchQuery catches error responses', async function(){
  axios.get.mockRejectedValue({});

  await executeUserSearchQuery(username, access_token, successCallback, failureCallback);
});

test('executeUserSearchQuery makes GET request with correct parameters', async function(){
  axios.get.mockResolvedValue({});
  const url = userQueryUrl(username);
  const config = {
    auth: {
      token: access_token,
    },
  };

  await executeUserSearchQuery(username, access_token, successCallback, failureCallback);

  expect(axios.get)
      .toHaveBeenCalledWith(url, config);
});

test('executeRepoSearchQuery catches error responses', async function(){
  axios.get.mockRejectedValue({});

  await executeRepoSearchQuery(username, access_token, successCallback, failureCallback);
});

test('executeRepoSearchQuery makes GET request with correct parameters', async function(){
  axios.get.mockResolvedValue({});
  const url = repoQueryUrl(username);
  const config = {
    auth: {
      token: access_token,
    },
  };

  await executeRepoSearchQuery(username, access_token, successCallback, failureCallback);

  expect(axios.get)
      .toHaveBeenCalledWith(url, config);
});

test('executeFollowingSearchQuery catches error responses', async function(){
  axios.get.mockRejectedValue({});

  await executeFollowingSearchQuery(username, access_token, successCallback, failureCallback);
});

test('executeFollowingSearchQuery makes GET request with correct parameters', async function(){
  axios.get.mockResolvedValue({});
  const url = followingQueryUrl(username);
  const config = {
    auth: {
      token: access_token,
    },
  };

  await executeFollowingSearchQuery(username, access_token, successCallback, failureCallback);

  expect(axios.get)
      .toHaveBeenCalledWith(url, config);
});

test('executeFollowersSearchQuery catches error responses', async function(){
  axios.get.mockRejectedValue({});

  await executeFollowersSearchQuery(username, access_token, successCallback, failureCallback);
});

test('executeFollowersSearchQuery makes GET request with correct parameters', async function(){
  axios.get.mockResolvedValue({});
  const url = followersQueryUrl(username);
  const config = {
    auth: {
      token: access_token,
    },
  };

  await executeFollowersSearchQuery(username, access_token, successCallback, failureCallback);

  expect(axios.get)
      .toHaveBeenCalledWith(url, config);
});

test('executeFollowUser catches error responses', async function(){
  axios.put.mockRejectedValue({});

  await executeFollowUser(username, access_token, successCallback, failureCallback);
});

test('executeFollowUser makes PUT request with correct parameters', async function(){
  axios.put.mockResolvedValue({});
  const url = userFollowUrl(username);
  const data = {};
  const config = {
    auth: {
      username: access_token,
    },
  };

  await executeFollowUser(username, access_token, successCallback, failureCallback);

  expect(axios.put)
      .toHaveBeenCalledWith(url, data, config);
});

test('executeUnfollowUser catches error responses', async function(){
  axios.delete.mockRejectedValue({});

  await executeUnfollowUser(username, access_token, successCallback, failureCallback);
});

test('executeUnfollowUser makes DELETE request with correct parameters', async function(){
  axios.delete.mockResolvedValue({});
  const url = userFollowUrl(username);
  const config = {
    auth: {
      username: access_token,
    },
  };

  await executeUnfollowUser(username, access_token, successCallback, failureCallback);

  expect(axios.delete)
      .toHaveBeenCalledWith(url, config);
});

test('executeStarRepo catches error responses', async function(){
  axios.put.mockRejectedValue({});

  await executeStarRepo(owner, repo, access_token, successCallback, failureCallback);
});

test('executeStarRepo makes PUT request with correct parameters', async function(){
  axios.put.mockResolvedValue({});
  const url = repoStarUrl(owner, repo);
  const data = {};
  const config = {
    auth: {
      username: access_token,
    },
  };

  await executeStarRepo(owner, repo, access_token, successCallback, failureCallback);

  expect(axios.put)
      .toHaveBeenCalledWith(url, data, config);
});

test('executeUnstarRepo catches error responses', async function(){
  axios.delete.mockRejectedValue({});

  await executeUnstarRepo(owner, repo, access_token, successCallback, failureCallback);
});

test('executeUnstarRepo makes DELETE request with correct parameters', async function(){
  axios.delete.mockResolvedValue({});
  const url = repoStarUrl(owner, repo);
  const config = {
    auth: {
      username: access_token,
    },
  };

  await executeUnstarRepo(owner, repo, access_token, successCallback, failureCallback);

  expect(axios.delete)
      .toHaveBeenCalledWith(url, config);
});

test('executeAuthentication catches error responses', async function(){
  axios.post.mockRejectedValue({});

  await executeAuthentication(username, password, successCallback, failureCallback);
});

test('executeAuthentication makes POST request with correct parameters', async function(){
  axios.post.mockResolvedValue({});
  const url = authenticationUrl();
  const data = {
    scopes: [
      'user',
      'repo',
    ],
    note: 'authenticate user',
    client_id: client_id,
    client_secret: client_secret,
  };
  const config = {
    auth: {
      username: username,
      password: password,
    },
  };

  await executeAuthentication(username, password, successCallback, failureCallback);

  expect(axios.post)
      .toHaveBeenCalledWith(url, data, config);
});