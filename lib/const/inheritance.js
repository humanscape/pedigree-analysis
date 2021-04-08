const AD = 'AD';
const AR = 'AR';
const XD = 'XD';
const XR = 'XR';

/**
 * Enum for inheritance of trait(disease)
 * @enum {string}
 */
const Inheritance = {
  AUTOSOMAL_DOMINANT: AD,
  AD,
  AUTOSOMAL_RECESSIVE: AR,
  AR,
  X_DOMINANT: XD,
  XD,
  X_RECESSIVE: XR,
  XR,
};

const choices = new Set([AD, AR, XD, XR]);

/**
 * @function isInheritanceValid
 * @param {string} inheritance
 * @returns {boolean}
 */
const isInheritanceValid = (inheritance) => choices.has(inheritance);

/**
 * @function isInheritanceAutosomal
 * @param {Inheritance} inheritance
 * @returns {boolean}
 */
const isInheritanceAutosomal = (inheritance) => inheritance.startsWith('A');

/**
 * @function isInheritanceDominant
 * @param {Inheritance} inheritance
 * @returns {boolean}
 */
const isInheritanceDominant = (inheritance) => inheritance.endsWith('D');

/**
 * @readonly
 * @typedef {Object} Inheritances
 * @property {Inheritance} [inheritance]
 * @property {isInheritanceAutosomal} isAutosomal
 * @property {isInheritanceDominant} isDominant
 * @property {isInheritanceValid} isValid
 */
module.exports = Object.freeze({
  ...Inheritance,
  isAutosomal: isInheritanceAutosomal,
  isDominant: isInheritanceDominant,
  isValid: isInheritanceValid,
});
