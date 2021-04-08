const { inheritances } = require('../const');
const AutosomalDisease = require('./autosomal');
const XLinkedDisease = require('./x-linked');

/**
 * @function createDisease
 * @param {string} name
 * @param {Inheritance} inheritance
 * @returns {(AutosomalDisease|XLinkedDisease)}
 */
const createDisease = (name, inheritance) => {
  if (!inheritances.isValid(inheritance))
    throw new Error(`Provided inheritance mode '${inheritance}' is invalid.`);
  return new (inheritances.isAutosomal(inheritance)
    ? AutosomalDisease
    : XLinkedDisease)(name, inheritance);
};

/**
 * @readonly
 * @property {createDisease} create
 */
module.exports = Object.freeze({
  create: createDisease,
});
