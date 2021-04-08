// use '|' so that 'A' < 'a' < '|' (charCode)
const HOMOZYGOUS_DOMINANT = 'AA';
const HETEROZYGOUS = 'Aa';
const HOMOZYGOUS_RECESSIVE = 'aa';
const HEMIZYGOUS_DOMINANT = 'A|';
const HEMIZYGOUS_RECESSIVE = 'a|';

/**
 * Enum for genotypes
 * @enum {string}
 */
const Genotype = {
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HOMOZYGOUS_RECESSIVE,
  HEMIZYGOUS_DOMINANT,
  HEMIZYGOUS_RECESSIVE,
};

const AUTOSOMAL = [HOMOZYGOUS_DOMINANT, HETEROZYGOUS, HOMOZYGOUS_RECESSIVE];
const X_MALE = [HEMIZYGOUS_DOMINANT, HEMIZYGOUS_RECESSIVE];
const DOMINANT = [HOMOZYGOUS_DOMINANT, HETEROZYGOUS, HEMIZYGOUS_DOMINANT];
const RECESSIVE = [HOMOZYGOUS_RECESSIVE, HEMIZYGOUS_RECESSIVE];

/**
 * Enum for possible genotypes depending on inheritance
 * @enum {Genotype[]}
 */
const PossibleGenotypes = {
  AUTOSOMAL: [HOMOZYGOUS_DOMINANT, HETEROZYGOUS, HOMOZYGOUS_RECESSIVE],
  X_FEMALE: AUTOSOMAL,
  X_MALE,
  DOMINANT,
  RECESSIVE,
};

const choices = new Set([...AUTOSOMAL, ...X_MALE]);

/**
 * @function isGenotypeValid
 * @param {string} genotype
 * @returns {boolean}
 */
const isGenotypeValid = (genotype) => choices.has(genotype);

/**
 * @readonly
 * @typedef {Object} Genotypes
 * @property {Genotype} [genotype]
 * @property {PossibleGenotypes} [inheritance]
 * @property {isGenotypeValid} isValid
 */
module.exports = Object.freeze({
  ...Genotype,
  ...PossibleGenotypes,
  isValid: isGenotypeValid,
});
