import assert from "node:assert/strict";
import test from "node:test";

import {HTTPProvider} from "../../src/adapters/http-provider.js";

const testSearchBusiness = (provider) => {
  test.test("searchBusiness on id", async () => {
    const query = {id: "30383024400024"};
    const business = await provider.searchBusiness(query);
    const expectedBusiness = [
      {
        id: "30383024400024",
        name: "EXPERDECO",
        street: "70 RTE GIFFRE",
        town: "74970 MARIGNIER",
      },
    ];
    assert.deepEqual(business, expectedBusiness);
  });
  test.test("searchBusiness on name, street, and town", async () => {
    const query = {
      name: "Experdéco",
      street: "70 route du Giffre",
      town: "74970 Marignier",
    };
    const business = await provider.searchBusiness(query);
    const expectedBusiness = [
      {
        id: "30383024400024",
        name: "EXPERDECO",
        street: "70 RTE GIFFRE",
        town: "74970 MARIGNIER",
      },
    ];
    assert.deepEqual(business, expectedBusiness);
  });
};

const testLookUpPhone = (provider) => {
  test.test("lookUpPhone on name, street, and town", async () => {
    const business = {
      id: "30383024400024",
      name: "EXPERDECO",
      street: "70 RTE GIFFRE",
      town: "74970 MARIGNIER",
    };
    const phone = await provider.lookUpPhone(business);
    const expectedPhone = "+33 450346354";
    assert.equal(phone, expectedPhone);
  });
};

test.describe("HTTPProvider", () => {
  const provider = HTTPProvider;
  testSearchBusiness(provider);
  testLookUpPhone(provider);
});
