const {
  inheritances,
  genotypes: { DOMINANT, RECESSIVE },
} = require('../const');
const FamilyMember = require('../family-member');

/**
 * @class
 */
class CommonDisease {
  constructor(name, inheritance) {
    this._name = name;
    this._inheritance = inheritance;
    this._isDominant = inheritances.isDominant(inheritance);
  }

  get name() {
    return this._name;
  }

  get inheritance() {
    return this._inheritance;
  }

  static _getProbabilitiesFromGenotypes(motherGenotype, fatherGenotype) {
    const cases = motherGenotype.length * fatherGenotype.length;
    const probabilities = {};
    motherGenotype.split('').forEach((motherAllele) => {
      fatherGenotype.split('').forEach((fatherAllele) => {
        const genotype =
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
        (diseaseProbability += probabilities[genotype] ?? 0),
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
   * @param {Object} parents
   * @param {FamilyMember} parents.mother
   * @param {FamilyMember} parents.father
   * @returns {Array[Array[Object]]}
   * - genotype:
   * - probabilities:
   * - disease:
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
