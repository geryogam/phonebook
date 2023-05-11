import assert from "node:assert/strict";
import test from "node:test";

import {CommandLineConfig} from "../../src/config/command-line.js";
import {EnvironmentConfig} from "../../src/config/environment.js";
import {FileConfig} from "../../src/config/file.js";

const testGet1 = () => {
  test.test("get on host set by file", () => {
    const file = '{"host": "localhost"}';
    const config = new FileConfig(null, file);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by file", () => {
    const file = '{"port": 8000}';
    const config = new FileConfig(null, file);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

const testGet2 = (file) => {
  test.test("get on host set by command-line (long option)", () => {
    const commandLine = ["--host", "localhost"];
    let config = new CommandLineConfig(null, commandLine);
    config = new FileConfig(config, file);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on host set by command-line (short option)", () => {
    const commandLine = ["-h", "localhost"];
    let config = new CommandLineConfig(null, commandLine);
    config = new FileConfig(config, file);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by command-line (long option)", () => {
    const commandLine = ["--port", "8000"];
    let config = new CommandLineConfig(null, commandLine);
    config = new FileConfig(config, file);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by command-line (short option)", () => {
    const commandLine = ["-p", "8000"];
    let config = new CommandLineConfig(null, commandLine);
    config = new FileConfig(config, file);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

const testGet3 = (file) => {
  test.test("get on host set by environment", () => {
    const environment = {HOST: "localhost"};
    let config = new EnvironmentConfig(null, environment);
    config = new FileConfig(config, file);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by environment", () => {
    const environment = {PORT: "8000"};
    let config = new EnvironmentConfig(null, environment);
    config = new FileConfig(config, file);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

test.describe("FileConfig", () => {
  testGet1();
});
test.describe("FileConfig and CommandLineConfig", () => {
  const file = "{}";
  testGet2(file);
});
test.describe("FileConfig and EnvironmentConfig", () => {
  const file = "{}";
  testGet3(file);
});
