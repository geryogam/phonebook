import assert from "node:assert/strict";
import test from "node:test";

import {CommandLineConfig} from "../../src/config/command-line.js";
import {EnvironmentConfig} from "../../src/config/environment.js";
import {FileConfig} from "../../src/config/file.js";

const testGet1 = () => {
  test.test("get on host set by command-line (long option)", () => {
    const commandLine = ["--host", "localhost"];
    const config = new CommandLineConfig(null, commandLine);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on host set by command-line (short option)", () => {
    const commandLine = ["-h", "localhost"];
    const config = new CommandLineConfig(null, commandLine);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by command-line (long option)", () => {
    const commandLine = ["--port", "8000"];
    const config = new CommandLineConfig(null, commandLine);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by command-line (short option)", () => {
    const commandLine = ["-p", "8000"];
    const config = new CommandLineConfig(null, commandLine);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

const testGet2 = (commandLine) => {
  test.test("get on host set by environment", () => {
    const environment = {HOST: "localhost"};
    let config = new EnvironmentConfig(null, environment);
    config = new CommandLineConfig(config, commandLine);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by enviroment", () => {
    const environment = {PORT: "8000"};
    let config = new EnvironmentConfig(null, environment);
    config = new CommandLineConfig(config, commandLine);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

const testGet3 = (commandLine) => {
  test.test("get on host set by file", () => {
    const file = '{"host": "localhost"}';
    let config = new FileConfig(null, file);
    config = new CommandLineConfig(config, commandLine);
    const key = "host";
    const value = config.get(key);
    const expectedValue = "localhost";
    assert.equal(value, expectedValue);
  });
  test.test("get on port set by file", () => {
    const file = '{"port": 8000}';
    let config = new FileConfig(null, file);
    config = new CommandLineConfig(config, commandLine);
    const key = "port";
    const value = config.get(key);
    const expectedValue = 8000;
    assert.equal(value, expectedValue);
  });
};

test.describe("CommandLineConfig", () => {
  testGet1();
});
test.describe("CommandLineConfig and EnvironmentConfig", () => {
  const commandLine = [];
  testGet2(commandLine);
});
test.describe("CommandLineConfig and FileConfig", () => {
  const commandLine = [];
  testGet3(commandLine);
});
