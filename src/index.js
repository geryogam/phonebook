#! /usr/bin/env node

import {CommandLineConfig} from "./config/command-line.js";
import {EnvironmentConfig} from "./config/environment.js";
import {FileConfig} from "./config/file.js";
import {HTTPProvider} from "./adapters/http-provider.js";
import {HTTPUser} from "./adapters/http-user.js";
import {Phonebook} from "./application/phonebook.js";

try {
  let config = new FileConfig();
  config = new EnvironmentConfig(config);
  config = new CommandLineConfig(config);
  const provider = HTTPProvider;
  const application = new Phonebook(provider);
  const user = new HTTPUser(
    application,
    config.get("host"),
    config.get("port")
  );
  user.start();
} catch (error) {
  if (process.exitCode) {
    console.error(error.message);
  } else {
    console.log(error.message);
  }
}
