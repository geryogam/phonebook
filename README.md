# Phonebook

_HTTP API to search for business phone numbers_

Phonebook provides an HTTP interface for developers to search for phone numbers of businesses by identifier, name, street, or town. Businesses are searched in the [Sirene](https://www.sirene.fr/) French business register and phone numbers are looked up in the [Pagespro](https://www.pagespro.com/) French business phonebook.

## Technology

This project uses

- [JavaScript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) and [Node](https://nodejs.org/en) for information processing;
- [JSON](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/) and [HTTP](https://datatracker.ietf.org/doc/rfc9110/) for information transmission.

## Usage

Install the package with `npm`:

```shell
npm install github:geryogam/phonebook
```

Run the HTTP server with `npm`:

```shell
npm exec -- phonebook
```

The host and port to bind the socket to can be specified by

- the `-h`, `--host` and `-p`, `--port` options in the command-line;
- the `HOST` and `PORT` variables in the environment;
- the `"host"` and `"port"` entries in the config.json file.

The command-line has the highest priority and the config.json file has the lowest priority. In the default config.json file, the `"host"` entry has the value `"localhost"` and the `"port"` entry has the value `8000`, so those are the values used by the HTTP server when they are not changed in the config.json file nor overridden in the environment or command-line.

Send requests with an HTTP client to the resources of the HTTP server identified by the following [URI Template](https://www.rfc-editor.org/rfc/rfc6570):

```text
http://localhost:8000/search{?id,name,street,town}
```

1. Search parameters are conveyed by the URI of the target resource in the request. They comprise the `id`, `name`, `street`, and `town` query parameters.
2. Search results are conveyed by the JSON representation of the target resource in the response. They comprise an array of active businesses (closed businesses are excluded). Each active business comprises the `"id"`, `"name"`, `"street"`, and `"town"` entries from the Sirene register that match the search parameters, as well as the `"phone"` entry from the Pagespro phonebook that is associated with the previous entries and set to `null` if not found.

The allowed request methods are `GET`, `HEAD`, `OPTIONS`, and `TRACE`.

Examples of `GET` requests with `curl`:

```shell
curl -i 'http://localhost:8000/search?id=30383024400024'
# HTTP/1.1 200 OK
# Content-Type: application/json
# Content-Length: 118
# Date: Mon, 01 May 2023 22:28:08 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#
# [{"id":"30383024400024","name":"EXPERDECO","street":"70 RTE GIFFRE","town":"74970 MARIGNIER","phone":"+33 450346354"}]

curl -i 'http://localhost:8000/search?name=Experd%C3%A9co&street=70%20route%20du%20Giffre&town=74970%20Marignier'
# HTTP/1.1 200 OK
# Content-Type: application/json
# Content-Length: 118
# Date: Mon, 01 May 2023 22:28:15 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#
# [{"id":"30383024400024","name":"EXPERDECO","street":"70 RTE GIFFRE","town":"74970 MARIGNIER","phone":"+33 450346354"}]
```

Examples of `HEAD`, `OPTIONS`, and `TRACE` requests with `curl`:

```shell
curl -I 'http://localhost:8000/search?id=30383024400024'
# HTTP/1.1 200 OK
# Content-Type: application/json
# Content-Length: 118
# Date: Mon, 01 May 2023 22:28:20 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#

curl -i -X OPTIONS --request-target '*' http://localhost:8000/
# HTTP/1.1 204 No Content
# Allow: OPTIONS
# Date: Mon, 01 May 2023 22:28:25 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#

curl -i -X OPTIONS 'http://localhost:8000/search?id=30383024400024'
# HTTP/1.1 204 No Content
# Allow: GET, HEAD, OPTIONS, TRACE
# Date: Mon, 01 May 2023 22:28:29 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#

curl -i -X TRACE 'http://localhost:8000/search?id=30383024400024'
# HTTP/1.1 200 OK
# Content-Type: message/http
# Content-Length: 104
# Date: Mon, 01 May 2023 22:28:35 GMT
# Connection: keep-alive
# Keep-Alive: timeout=5
#
# TRACE /search?id=30383024400024 HTTP/1.1
# Host: localhost:8000
# User-Agent: curl/7.64.1
# Accept: */*
#
```

## Development

Clone the repository with `git`:

```shell
git clone https://github.com/geryogam/phonebook.git
cd phonebook
```

Install the package with `npm`:

```shell
npm install
```

Run the formatter with `npm`:

```shell
npm run format
```

Run the linter with `npm`:

```shell
npm run lint
```

Run the test suite with `npm`:

```shell
npm run test
```

## Authors

This project was authored by Géry Ogam (<gery.ogam@gmail.com>).
