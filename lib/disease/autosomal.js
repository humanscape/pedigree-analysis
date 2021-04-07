const {
  genotypes: { AUTOSOMAL },
} = require('../const');
const CommonDisease = require('./common');

/**
 * @class
 */
class AutosomalDisease extends CommonDisease {
  /**
   * @override
   *
   * @param {Object} object
   * @param {Array[genotypes]} object.genotypes
   * @returns {boolean}
   */
  static hasValidGenotype({ genotypes }) {
    if (Array.isArray(genotypes) && genotypes.length) {
      const genotypeSet = new Set(genotypes);
      if (genotypeSet.size === genotypes.length) {
        AUTOSOMAL.forEach((genotype) => genotypeSet.delete(genotype));
        return genotypeSet.size === 0;
      }
    }
    return false;
  }
}

module.exports = AutosomalDisease;
