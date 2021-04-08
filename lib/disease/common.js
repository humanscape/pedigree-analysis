const {
  inheritances,
  genotypes: { DOMINANT, RECESSIVE },
} = require('../const');
const FamilyMember = require('../family-member');

/**
 * @abstract
 */
class CommonDisease {
  /**
   * Creates an abstract disease with name and inheritance
   * @param {string} name
   * @param {Inheritance} inheritance
   */
  constructor(name, inheritance) {
    this._name = name;
    this._inheritance = inheritance;
    this._isDominant = inheritances.isDominant(inheritance);
  }

  /**
   * Get the name of disease
   * @returns {string}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the inheritance of disease
   * @returns {Inheritance}
   */
  get inheritance() {
    return this._inheritance;
  }

  static _getProbabilitiesFromGenotypes(motherGenotype, fatherGenotype) {
    const cases = motherGenotype.length * fatherGenotype.length;
    const probabilities = {};
    motherGenotype.split('').forEach((motherAllele) => {
      fatherGenotype.split('').forEach((fatherAllele) => {
        const genotype = // sort alleles ASC
          motherAllele > fatherAllele
            ? `${fatherAllele}${motherAllele}`
            : `${motherAllele}${fatherAllele}`;
        if (probabilities[genotype] === undefined) probabilities[genotype] = 0;
        probabilities[genotype] += 1 / cases;
      });
    });
    return probabilities;
  }

  static _calculateDiseaseProbability(probabilities) {
    return (this._isDominant ? DOMINANT : RECESSIVE).reduce(
      (diseaseProbability, genotype) =>
        diseaseProbability + (probabilities[genotype] ?? 0),
      0,
    );
  }

  /**
   * @abstract
   *
   * @returns {boolean}
   * */
  static hasValidGenotype() {
    return false; // should override
  }

  /**
   * @abstract
   *
   * @typedef {Object} Children
   * @property {Object} genotype
   * @property {Genotype} genotype.mother
   * @property {Genotype} genotype.father
   * @property {Object} probabilities - probabilities of children having each genotype
   * @property {number} probabilities[genotype] - type of genotype is Genotype
   * @property {number} disease - probability of children having disease
   *
   * @param {Object} parents
   * @param {FamilyMember} parents.mother
   * @param {FamilyMember} parents.father
   * @returns {Children[][]}
   */
  calculateProbabilities({ mother, father } = {}) {
    if (
      !(mother instanceof FamilyMember) ||
      !FamilyMember._isValidMother(mother)
    )
      throw new Error('mother should be a valid instance of FamilyMember.');
    if (
      !(father instanceof FamilyMember) ||
      !FamilyMember._isValidFather(father)
    )
      throw new Error('father should be a valid instance of FamilyMember.');

    const result = mother.genotypes.map((motherGenotype) =>
      father.genotypes.map((fatherGenotype) => {
        const probabilities = this._getProbabilitiesFromGenotypes(
          motherGenotype,
          fatherGenotype,
        );
        return {
          genotype: { mother: motherGenotype, father: fatherGenotype },
          probabilities,
          disease: this._calculateDiseaseProbability(probabilities),
        };
      }),
    );
    return result;
  }
}

module.exports = CommonDisease;
