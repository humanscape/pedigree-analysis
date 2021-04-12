/* eslint-disable class-methods-use-this */
import { genotypes } from '../const';
import type { Genotype } from '../const';
import CommonDisease from './common';
import type { Phenotype } from './common';

/**
 * Class representing an autosomal disease
 * @class
 */
class AutosomalDisease extends CommonDisease {
  static validGenotypes = genotypes.AUTOSOMAL;

  getValidGenotypes() {
    return AutosomalDisease.validGenotypes;
  }

  hasValidGenotypes({ genotypes: list }: { genotypes: Genotype[] }) {
    if (Array.isArray(list) && list.length) {
      const genotypeSet = new Set(list);
      if (genotypeSet.size === list.length) {
        AutosomalDisease.validGenotypes.forEach((genotype) =>
          genotypeSet.delete(genotype),
        );
        return genotypeSet.size === 0;
      }
    }
    return false;
  }

  getPossibleGenotypes({ phenotype }: { phenotype: Phenotype }) {
    const filter = phenotype
      ? (genotype: Genotype) => super.hasDisease(genotype)
      : phenotype === false
      ? (genotype: Genotype) => !super.hasDisease(genotype)
      : null;
    if (filter) return AutosomalDisease.validGenotypes.filter(filter);
    return AutosomalDisease.validGenotypes;
  }
}

export default AutosomalDisease;
