import assert from "node:assert/strict";
import test from "node:test";

import {HTTPProvider} from "../../src/adapters/http-provider.js";
import {Phonebook} from "../../src/application/phonebook.js";

const testSearch = (application) => {
  test.test("search on id", async () => {
    const query = {id: "30383024400024"};
    const results = await application.search(query);
    const expectedResults = [
      {
        id: "30383024400024",
        name: "EXPERDECO",
        street: "70 RTE GIFFRE",
        town: "74970 MARIGNIER",
        phone: "+33 450346354",
      },
    ];
    assert.deepEqual(results, expectedResults);
  });
  test.test("search on name, street, and town", async () => {
    const query = {
      name: "Experdéco",
      street: "70 route du Giffre",
      town: "74970 Marignier",
    };
    const results = await application.search(query);
    const expectedResults = [
      {
        id: "30383024400024",
        name: "EXPERDECO",
        street: "70 RTE GIFFRE",
        town: "74970 MARIGNIER",
        phone: "+33 450346354",
      },
    ];
    assert.deepEqual(results, expectedResults);
  });
};

test.describe("Phonebook", () => {
  const provider = {
    searchBusiness() {
      return [
        {
          id: "30383024400024",
          name: "EXPERDECO",
          street: "70 RTE GIFFRE",
          town: "74970 MARIGNIER",
        },
      ];
    },
    lookUpPhone() {
      return "+33 450346354";
    },
  };
  const application = new Phonebook(provider);
  testSearch(application);
});
test.describe("Phonebook and HTTPProvider", () => {
  const provider = HTTPProvider;
  const application = new Phonebook(provider);
  testSearch(application);
});
