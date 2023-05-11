export class EnvironmentConfig {
  #next;
  #map;

  constructor(next, environment) {
    this.#next = next;
    this.#map = EnvironmentConfig.#validate(environment);
  }

  get(key) {
    let value = this.#map[key.toUpperCase()];
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

  static #validate(environment) {
    return environment ?? process.env;
  }
}
