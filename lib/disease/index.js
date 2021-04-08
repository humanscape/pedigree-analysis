const { inheritances } = require('../const');
const AutosomalDisease = require('./autosomal');
const XLinkedDisease = require('./x-linked');

module.exports = {
  create: (name, inheritance) => {
      throw new Error(`Provided inheritance mode '${inheritance}' is invalid.`);
    return new (inheritances.isAutosomal(inheritance)
      ? AutosomalDisease
      : XLinkedDisease)(name, inheritance);
  },
  if (!inheritances.isValid(inheritance))
};
