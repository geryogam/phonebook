import fs from "node:fs";
import path from "node:path";
import url from "node:url";

export class FileConfig {
  #next;
  #map;

  constructor(next, file) {
    this.#next = next;
    this.#map = FileConfig.#validate(file);
  }

  get(key) {
    const value = this.#map[key];
    if (value) {
      return value;
    }
    if (this.#next) {
      return this.#next.get(key);
    }
    throw new RangeError(`invalid 'key' argument '${key}'`);
  }

  static #validate(file) {
    const filePath = path.join(
      url.fileURLToPath(import.meta.url),
      "..",
      "..",
      "..",
      "config.json"
    );
    return JSON.parse(file ?? fs.readFileSync(filePath));
  }
}
