import jsdom from "jsdom";

export class HTTPProvider {
  static async searchBusiness(query) {
    const cleanQuery = {
      id: HTTPProvider.#clean(query.id ?? ""),
      name: HTTPProvider.#clean(query.name ?? ""),
      street: HTTPProvider.#clean(query.street ?? ""),
      town: HTTPProvider.#clean(query.town ?? ""),
    };
    const page = await HTTPProvider.#fetchBusinessPage(cleanQuery);
    return HTTPProvider.#extractBusiness(page, cleanQuery);
  }

  static async lookUpPhone(business) {
    const page = await HTTPProvider.#fetchPhonePage(business);
    return HTTPProvider.#extractPhone(page, business);
  }

  static async #fetchBusinessPage(query) {
    const uri = "https://www.sirene.fr/sirene/public/recherche";
    const method = "POST";
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};
    const body = new URLSearchParams({
      "recherche.sirenSiret": query.id,
      "recherche.raisonSociale": query.name,
      "recherche.adresse": query.street,
      "recherche.commune": query.town,
      "recherche.excludeClosed": true,
    }).toString();
    const response = await fetch(uri, {method, headers, body});
    if (!response.ok) {
      throw new RangeError(
        `cannot fetch business page (${response.status} status code)`
      );
    }
    return response.text();
  }

  static #extractBusiness(page, query) {
    const dom = new jsdom.JSDOM(page);
    const candidates = {
      id: dom.window.document.querySelectorAll(
        ".accordion .accordion-group .accordion-heading span:nth-of-type(3)"
      ),
      name: dom.window.document.querySelectorAll(
        ".accordion .accordion-group .accordion-heading span:nth-of-type(1)"
      ),
      street: dom.window.document.querySelectorAll(
        ".accordion .accordion-group .result-left p:nth-of-type(4)"
      ),
      town: dom.window.document.querySelectorAll(
        ".accordion .accordion-group .result-left p:nth-of-type(5)"
      ),
    };
    if (
      !candidates.id.length ||
      candidates.id.length !== candidates.name.length ||
      candidates.name.length !== candidates.street.length ||
      candidates.street.length !== candidates.town.length
    ) {
      throw new RangeError("cannot extract business candidates");
    }
    const businesses = HTTPProvider.#filterBusinessCandidates(
      candidates,
      query
    );
    if (!businesses.length) {
      throw new RangeError("cannot extract business");
    }
    return businesses;
  }

  static #filterBusinessCandidates(candidates, query) {
    const extendedQuery = {
      ...query,
      streetNumber: HTTPProvider.#extractStreetNumber(query.street),
      streetName: HTTPProvider.#extractStreetName(query.street),
      townPostcode: HTTPProvider.#extractTownPostcode(query.town),
      townName: HTTPProvider.#extractTownName(query.town),
    };
    const step = 1;
    const businesses = [];
    for (let index = 0; index < candidates.id.length; index += step) {
      const candidate = {
        id: HTTPProvider.#clean(candidates.id[index].textContent),
        name: HTTPProvider.#clean(candidates.name[index].textContent),
        street: HTTPProvider.#clean(
          candidates.street[index].textContent.replace(/.*?:/u, "")
        ),
        town: HTTPProvider.#clean(
          candidates.town[index].textContent.replace(/.*?:/u, "")
        ),
      };
      const extendedCandidate = {
        ...candidate,
        streetNumber: HTTPProvider.#extractStreetNumber(candidate.street),
        streetName: HTTPProvider.#extractStreetName(candidate.street),
        townPostcode: HTTPProvider.#extractTownPostcode(candidate.town),
        townName: HTTPProvider.#extractTownName(candidate.town),
      };
      if (
        HTTPProvider.#checkBusinessCandidate(extendedCandidate, extendedQuery)
      ) {
        businesses.push(candidate);
      }
    }
    return businesses;
  }

  static #checkBusinessCandidate(candidate, query) {
    return (
      HTTPProvider.#compareIds(candidate.id, query.id) &&
      HTTPProvider.#compareNames(candidate.name, query.name) &&
      HTTPProvider.#compareStreetNumbers(
        candidate.streetNumber,
        query.streetNumber
      ) &&
      HTTPProvider.#compareStreetNames(
        candidate.streetName,
        query.streetName
      ) &&
      HTTPProvider.#compareTownPostcodes(
        candidate.townPostcode,
        query.townPostcode
      ) &&
      HTTPProvider.#compareTownNames(candidate.townName, query.townName)
    );
  }

  static async #fetchPhonePage(business) {
    const uri =
      "https://www.pagespro.com/recherche/auto/" +
      `${encodeURIComponent(business.town)}/` +
      `${encodeURIComponent(business.name)}`;
    const response = await fetch(uri);
    if (!response.ok) {
      throw new RangeError(
        `cannot fetch phone page (${response.status} status code)`
      );
    }
    return response.text();
  }

  static #extractPhone(page, business) {
    const dom = new jsdom.JSDOM(page);
    const candidates = {
      name: dom.window.document.querySelectorAll(
        ".bi_list .bi_denomination h2"
      ),
      street: dom.window.document.querySelectorAll(
        ".bi_list .bi_adress p:first-of-type"
      ),
      town: dom.window.document.querySelectorAll(
        ".bi_list .bi_adress p:last-of-type"
      ),
      phone: dom.window.document.querySelectorAll(
        ".bi_list .bi_cta a:last-of-type span"
      ),
    };
    if (
      !candidates.name.length ||
      candidates.name.length !== candidates.street.length ||
      candidates.street.length !== candidates.town.length ||
      candidates.town.length !== candidates.phone.length
    ) {
      throw new RangeError("cannot extract phone candidates");
    }
    const phone = HTTPProvider.#filterPhoneCandidates(candidates, business);
    if (!phone) {
      throw new RangeError("cannot extract phone");
    }
    return phone;
  }

  static #filterPhoneCandidates(candidates, business) {
    const step = 1;
    const extendedBusiness = {
      ...business,
      streetNumber: HTTPProvider.#extractStreetNumber(business.street),
      streetName: HTTPProvider.#extractStreetName(business.street),
      townPostcode: HTTPProvider.#extractTownPostcode(business.town),
      townName: HTTPProvider.#extractTownName(business.town),
    };
    for (let index = 0; index < candidates.name.length; index += step) {
      const candidate = {
        name: HTTPProvider.#clean(candidates.name[index].textContent),
        street: HTTPProvider.#clean(candidates.street[index].textContent),
        town: HTTPProvider.#clean(candidates.town[index].textContent),
      };
      const extendedCandidate = {
        ...candidate,
        streetNumber: HTTPProvider.#extractStreetNumber(candidate.street),
        streetName: HTTPProvider.#extractStreetName(candidate.street),
        townPostcode: HTTPProvider.#extractTownPostcode(candidate.town),
        townName: HTTPProvider.#extractTownName(candidate.town),
      };
      if (
        HTTPProvider.#checkPhoneCandidate(extendedCandidate, extendedBusiness)
      ) {
        const phoneCandidate = HTTPProvider.#clean(
          candidates.phone[index].textContent
        );
        const subscriberNumber =
          HTTPProvider.#extractSubscriberNumber(phoneCandidate);
        return `+33 ${subscriberNumber}`;
      }
    }
    return null;
  }

  static #checkPhoneCandidate(candidate, business) {
    return (
      HTTPProvider.#compareNames(business.name, candidate.name) &&
      HTTPProvider.#compareStreetNumbers(
        business.streetNumber,
        candidate.streetNumber
      ) &&
      HTTPProvider.#compareStreetNames(
        business.streetName,
        candidate.streetName
      ) &&
      HTTPProvider.#compareTownPostcodes(
        business.townPostcode,
        candidate.townPostcode
      ) &&
      HTTPProvider.#compareTownNames(business.townName, candidate.townName)
    );
  }

  static #clean(text) {
    return text
      .trim()
      .replace(/\s+/gu, " ")
      .replace(/(?<=\p{Nd})\s+(?=\p{Nd})/gu, "");
  }

  static #extractStreetNumber(text) {
    const matchIndex = 0;
    return text.match(/^\p{Nd}+/u)?.[matchIndex] ?? "";
  }

  static #extractStreetName(text) {
    const matchIndex = 0;
    return text.match(/[^\s\p{Pd}]+$/u)?.[matchIndex] ?? "";
  }

  static #extractTownPostcode(text) {
    const matchIndex = 0;
    return text.match(/^\p{Nd}+/u)?.[matchIndex] ?? "";
  }

  static #extractTownName(text) {
    const matchIndex = 0;
    return text.match(/[^\s\p{Nd}].*$/u)?.[matchIndex] ?? "";
  }

  static #extractSubscriberNumber(text) {
    return Number.parseInt(text.replace(/\s/gu, ""));
  }

  static #compareIds(reference, approximation) {
    return HTTPProvider.#normalize(reference).includes(
      HTTPProvider.#normalize(approximation)
    );
  }

  static #compareNames(reference, approximation) {
    return HTTPProvider.#normalize(reference).includes(
      HTTPProvider.#normalize(approximation)
    );
  }

  static #compareStreetNumbers(reference, approximation) {
    return !reference || !approximation || reference === approximation;
  }

  static #compareStreetNames(reference, approximation) {
    return HTTPProvider.#normalize(reference).includes(
      HTTPProvider.#normalize(approximation)
    );
  }

  static #compareTownPostcodes(reference, approximation) {
    return !reference || !approximation || reference === approximation;
  }

  static #compareTownNames(reference, approximation) {
    return HTTPProvider.#normalize(reference).includes(
      HTTPProvider.#normalize(approximation)
    );
  }

  static #normalize(text) {
    return text
      .normalize("NFKD")
      .replace(/[^\p{Alphabetic}\p{Nd}]/gu, "")
      .toLowerCase();
  }
}
