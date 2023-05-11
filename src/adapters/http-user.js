import http from "node:http";

export class HTTPUser {
  #application;
  #host;
  #port;
  #server;

  constructor(application, host, port) {
    this.#application = application;
    this.#host = host;
    this.#port = port;
    this.#server = http.createServer(async (request, response) => {
      HTTPUser.#logRequest(request);
      if (request.method === "TRACE") {
        HTTPUser.#handleTRACE(request, response);
      } else if (request.url === "*") {
        HTTPUser.#handleAsterisk(request, response);
      } else if (request.url.match(/^\/search(?=\?|$)/u)) {
        await this.#handleSearch(request, response);
      } else {
        HTTPUser.#handleResourceNotFound(request, response);
      }
      HTTPUser.#logResponse(response);
    });
  }

  start() {
    this.#server.listen(this.#port, this.#host, () => {
      console.log(`Server running at http://${this.#host}:${this.#port}/`);
    });
  }

  stop() {
    this.#server.close();
  }

  static #logRequest(request) {
    const address = request.connection.remoteAddress;
    const date = new Date().toISOString();
    const startLine = HTTPUser.#getStartLine(request);
    console.log(`> ${address} - ${date} - ${startLine}`);
  }

  static #logResponse(response) {
    console.log("<", response.statusCode);
  }

  static #getStartLine(request) {
    return `${request.method} ${request.url} HTTP/${request.httpVersion}`;
  }

  static #handleTRACE(request, response) {
    const startLine = HTTPUser.#getStartLine(request);
    const {body, statusCode} = HTTPUser.#computeTRACEBody(
      startLine,
      request.rawHeaders
    );
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "message/http");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
  }

  static #computeTRACEBody(startLine, headers) {
    const statusCode = 200;
    let body = `${startLine}\r\n`;
    const step = 2;
    const offset = 1;
    for (let index = 0; index < headers.length; index += step) {
      const [fieldName, fieldValue] = [headers[index], headers[index + offset]];
      if (!["authorization", "cookie"].includes(fieldName.toLowerCase())) {
        body += `${fieldName}: ${fieldValue}\r\n`;
      }
    }
    body += "\r\n";
    return {statusCode, body};
  }

  static #handleAsterisk(request, response) {
    const allow = "OPTIONS";
    if (request.method === "OPTIONS") {
      HTTPUser.#handleOPTIONSAsterisk(response, allow);
    } else {
      HTTPUser.#handleMethodNotAllowed(response, allow);
    }
  }

  static #handleOPTIONSAsterisk(response, allow) {
    response.statusCode = 204;
    response.setHeader("Allow", allow);
    response.end();
  }

  static #handleMethodNotAllowed(response, allow) {
    const {statusCode, body} = HTTPUser.#computeMethodNotAllowedBody(allow);
    response.statusCode = statusCode;
    response.setHeader("Allow", allow);
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
  }

  static #computeMethodNotAllowedBody(allow) {
    const statusCode = 405;
    const body = JSON.stringify(`method not allowed (allowed: ${allow})`);
    return {statusCode, body};
  }

  async #handleSearch(request, response) {
    const targetURI = new URL(request.url, `http://${request.headers.host}`);
    const query = Object.fromEntries(targetURI.searchParams);
    const allow = "GET, HEAD, OPTIONS, TRACE";
    if (request.method === "GET") {
      await this.#handleGETSearch(response, query);
    } else if (request.method === "HEAD") {
      await this.#handleHEADSearch(response, query);
    } else if (request.method === "OPTIONS") {
      HTTPUser.#handleOPTIONSSearch(response, allow);
    } else {
      HTTPUser.#handleMethodNotAllowed(response, allow);
    }
  }

  async #handleGETSearch(response, query) {
    const {statusCode, body} = await this.#computeGETSearchBody(query);
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
  }

  async #computeGETSearchBody(query) {
    try {
      const results = await this.#application.search(query);
      const statusCode = 200;
      const body = JSON.stringify(results);
      return {statusCode, body};
    } catch (error) {
      console.error(error);
      return HTTPUser.#computeResourceNotFoundBody();
    }
  }

  async #handleHEADSearch(response, query) {
    const {statusCode, body} = await this.#computeGETSearchBody(query);
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end();
  }

  static #handleOPTIONSSearch(response, allow) {
    response.statusCode = 204;
    response.setHeader("Allow", allow);
    response.end();
  }

  static #handleResourceNotFound(request, response) {
    if (request.method === "HEAD") {
      HTTPUser.#handleHEADResourceNotFound(response);
    } else {
      HTTPUser.#handleNonHEADResourceNotFound(response);
    }
  }

  static #handleHEADResourceNotFound(response) {
    const {statusCode, body} = HTTPUser.#computeResourceNotFoundBody();
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end();
  }

  static #computeResourceNotFoundBody() {
    const statusCode = 404;
    const body = JSON.stringify("resource not found");
    return {statusCode, body};
  }

  static #handleNonHEADResourceNotFound(response) {
    const {statusCode, body} = HTTPUser.#computeResourceNotFoundBody();
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
  }
}
