export class Phonebook {
  #provider;

  constructor(provider) {
    this.#provider = provider;
  }

  async search(query) {
    const businesses = await this.#provider.searchBusiness(query);
    const promises = [];
    for (const business of businesses) {
      const promise = Promise.resolve(this.#provider.lookUpPhone(business))
        .then((value) => {
          business.phone = value;
        })
        .catch(() => {
          business.phone = null;
        });
      promises.push(promise);
    }
    await Promise.all(promises);
    return businesses;
  }
}
