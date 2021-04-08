/**
 * Enum for common genders
 * @enum {string}
 */
const Gender = {
  FEMALE: 'XX',
  MALE: 'XY',
};

const choices = new Set(['XX', 'XY', 'X', 'XXX', 'XXY', 'XYY', 'XXYY']);

/**
 * @function isGenderValid
 * @param {string} gender
 * @returns {boolean}
 */
const isGenderValid = (gender) => choices.has(gender);

/**
 * @readonly
 * @typedef {Object} Genders
 * @property {Gender} [gender]
 * @property {isGenderValid} isValid
 */
module.exports = Object.freeze({
  ...Gender,
  isValid: isGenderValid,
});
