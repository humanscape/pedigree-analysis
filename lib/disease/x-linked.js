const {
  genders,
  genotypes: { X_FEMALE, X_MALE },
} = require('../const');
const CommonDisease = require('./common');

const genotypesByGender = {
  [genders.MALE]: X_MALE,
  [genders.FEMALE]: X_FEMALE,
};

/**
 * @class
 */
class XLinkedDisease extends CommonDisease {
  /**
   * @override
   *
   * @param {Object} object
   * @param {Gender} object.gender
   * @param {Genotype[]} object.genotypes
   * @returns {boolean}
   */
  static hasValidGenotype({ gender, genotypes }) {
    if (Array.isArray(genotypes) && genotypes.length) {
      const genotypeSet = new Set(genotypes);
      if (genotypeSet.size === genotypes.length) {
        (genotypesByGender[gender] ?? []).forEach((genotype) =>
          genotypeSet.delete(genotype),
        );
        return genotypeSet.size === 0;
      }
    }
    return false;
  }
}

module.exports = XLinkedDisease;
