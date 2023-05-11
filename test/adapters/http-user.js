import assert from "node:assert/strict";
import test from "node:test";

import {HTTPProvider} from "../../src/adapters/http-provider.js";
import {HTTPUser} from "../../src/adapters/http-user.js";
import {Phonebook} from "../../src/application/phonebook.js";

const testGET = (validURI, invalidURI, results) => {
  test.test("GET on valid resource", async () => {
    const response = await fetch(validURI, {method: "GET"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 200;
    const expectedBody = JSON.stringify(results);
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("GET on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "GET"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = JSON.stringify("resource not found");
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testHEAD = (validURI, invalidURI, results) => {
  test.test("HEAD on valid resource", async () => {
    const response = await fetch(validURI, {method: "HEAD"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 200;
    const expectedBody = "";
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(results)).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("HEAD on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "HEAD"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = "";
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(
        JSON.stringify("resource not found")
      ).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testPOST = (validURI, invalidURI) => {
  test.test("POST on valid resource", async () => {
    const response = await fetch(validURI, {method: "POST"});
    const statusCode = response.status;
    const headers = {
      "Allow": response.headers.get("Allow"),
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 405;
    const expectedBody = JSON.stringify(
      "method not allowed (allowed: GET, HEAD, OPTIONS, TRACE)"
    );
    const expectedHeaders = {
      "Allow": "GET, HEAD, OPTIONS, TRACE",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("POST on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "POST"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = JSON.stringify("resource not found");
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testPUT = (validURI, invalidURI) => {
  test.test("PUT on valid resource", async () => {
    const response = await fetch(validURI, {method: "PUT"});
    const statusCode = response.status;
    const headers = {
      "Allow": response.headers.get("Allow"),
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 405;
    const expectedBody = JSON.stringify(
      "method not allowed (allowed: GET, HEAD, OPTIONS, TRACE)"
    );
    const expectedHeaders = {
      "Allow": "GET, HEAD, OPTIONS, TRACE",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("PUT on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "PUT"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = JSON.stringify("resource not found");
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testDELETE = (validURI, invalidURI) => {
  test.test("DELETE on valid resource", async () => {
    const response = await fetch(validURI, {method: "DELETE"});
    const statusCode = response.status;
    const headers = {
      "Allow": response.headers.get("Allow"),
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 405;
    const expectedBody = JSON.stringify(
      "method not allowed (allowed: GET, HEAD, OPTIONS, TRACE)"
    );
    const expectedHeaders = {
      "Allow": "GET, HEAD, OPTIONS, TRACE",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("DELETE on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "DELETE"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = JSON.stringify("resource not found");
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testOPTIONS = (validURI, invalidURI) => {
  test.test("OPTIONS on valid resource", async () => {
    const response = await fetch(validURI, {method: "OPTIONS"});
    const statusCode = response.status;
    const headers = {Allow: response.headers.get("Allow")};
    const body = await response.text();
    const expectedStatusCode = 204;
    const expectedBody = "";
    const expectedHeaders = {Allow: "GET, HEAD, OPTIONS, TRACE"};
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
  test.test("OPTIONS on invalid resource", async () => {
    const response = await fetch(invalidURI, {method: "OPTIONS"});
    const statusCode = response.status;
    const headers = {
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Length": response.headers.get("Content-Length"),
    };
    const body = await response.text();
    const expectedStatusCode = 404;
    const expectedBody = JSON.stringify("resource not found");
    const expectedHeaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(expectedBody).toString(),
    };
    assert.equal(statusCode, expectedStatusCode);
    assert.deepEqual(headers, expectedHeaders);
    assert.equal(body, expectedBody);
  });
};

const testMethods = (validURI, invalidURI, results) => {
  testGET(validURI, invalidURI, results);
  testHEAD(validURI, invalidURI, results);
  testPOST(validURI, invalidURI);
  testPUT(validURI, invalidURI);
  testDELETE(validURI, invalidURI);
  testOPTIONS(validURI, invalidURI);
};

console.log = () => {
  // Do nothing.
};

const host = "localhost";
const business = {
  id: "30383024400024",
  name: "EXPERDECO",
  street: "70 RTE GIFFRE",
  town: "74970 MARIGNIER",
};
const phone = "+33 450346354";
const results = [{...business, phone}];
const query = {id: "30383024400024"};
test.describe("HTTPUser", () => {
  const port = 8000;
  const application = {
    search() {
      return results;
    },
  };
  const user = new HTTPUser(application, host, port);
  const validURI = `http://${host}:${port}/search?id=${query.id}`;
  const invalidURI = `http://${host}:${port}/`;
  test.before(() => {
    user.start();
  });
  test.after(() => {
    user.stop();
  });
  testMethods(validURI, invalidURI, results);
});
test.describe("HTTPUser and Phonebook", () => {
  const port = 8001;
  const provider = {
    searchBusiness() {
      return [business];
    },
    lookUpPhone() {
      return phone;
    },
  };
  const application = new Phonebook(provider);
  const user = new HTTPUser(application, host, port);
  const validURI = `http://${host}:${port}/search?id=${query.id}`;
  const invalidURI = `http://${host}:${port}/`;
  test.before(() => {
    user.start();
  });
  test.after(() => {
    user.stop();
  });
  testMethods(validURI, invalidURI, results);
});
test.describe("HTTPUser, Phonebook, and HTTPProvider", () => {
  const port = 8002;
  const provider = HTTPProvider;
  const application = new Phonebook(provider);
  const user = new HTTPUser(application, host, port);
  const validURI = `http://${host}:${port}/search?id=${query.id}`;
  const invalidURI = `http://${host}:${port}/`;
  test.before(() => {
    user.start();
  });
  test.after(() => {
    user.stop();
  });
  testMethods(validURI, invalidURI, results);
});
