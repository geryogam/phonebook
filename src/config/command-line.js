import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import util from "node:util";

export class CommandLineConfig {
  #next;
  #map;

  constructor(next, commandLine) {
    this.#next = next;
    this.#map = CommandLineConfig.#validate(commandLine);
  }

  get(key) {
    let value = this.#map[key];
    if (value) {
      if (key === "port") {
        value = Number.parseInt(value);
      }
      return value;
    }
    if (this.#next) {
      return this.#next.get(key);
    }
    throw new RangeError(`invalid 'key' argument '${key}'`);
  }

  static #validate(commandLine) {
    const index = 2;
    const schema = {
      host: {type: "string", short: "h"},
      port: {type: "string", short: "p"},
      help: {type: "boolean"},
      version: {type: "boolean"},
    };
    let map = null;
    try {
      map = util.parseArgs({
        args: commandLine ?? process.argv.slice(index),
        options: schema,
      }).values;
    } catch (error) {
      process.exitCode = 1;
      const [option] = error.message.match(/(?<=').*(?=')/u);
      throw new RangeError(CommandLineConfig.#getError(option));
    }
    CommandLineConfig.#handleHelpAndVersion(map);
    return map;
  }

  static #handleHelpAndVersion(map) {
    if (map.help) {
      throw new RangeError(CommandLineConfig.#getHelp());
    }
    if (map.version) {
      throw new RangeError(CommandLineConfig.#getVersion());
    }
  }

  static #getError(option) {
    const {name} = CommandLineConfig.#getConfig();
    return `\
  ${name}: unrecognized option '${option}'
  Try '${name} --help' for more information.`;
  }

  static #getHelp() {
    const {name} = CommandLineConfig.#getConfig();
    return `\
  Usage: ${name} [OPTION]...
  Run the HTTP server.

    -h, --host=HOST  bind the socket to HOST
    -p, --port=PORT  bind the socket to PORT
        --help     display this help and exit
        --version  output version information and exit`;
  }

  static #getVersion() {
    const {name, version} = CommandLineConfig.#getConfig();
    const [initial, ...rest] = name;
    return `${initial.toUpperCase()}${rest.join("").toLowerCase()} ${version}`;
  }

  static #getConfig() {
    const filePath = path.join(
      url.fileURLToPath(import.meta.url),
      "..",
      "..",
      "..",
      "package.json"
    );
    return JSON.parse(fs.readFileSync(filePath));
  }
}
