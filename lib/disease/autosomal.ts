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
  static _validGenotypes = genotypes.AUTOSOMAL;

  getValidGenotypes() {
    return AutosomalDisease._validGenotypes;
  }

  hasValidGenotypes({ genotypes: list }: { genotypes: Genotype[] }) {
    if (!Array.isArray(list) || !list.length) return false;

    const genotypeSet = new Set(list);
    if (genotypeSet.size !== list.length) return false; // duplicate check

    AutosomalDisease._validGenotypes.forEach((genotype) =>
      genotypeSet.delete(genotype),
    );
    return genotypeSet.size === 0; // if not 0, it has invalid genotype
  }

  getPossibleGenotypes({ phenotype }: { phenotype: Phenotype }) {
    const { _validGenotypes: validGenotypes } = AutosomalDisease;
    if (typeof phenotype !== 'boolean') return validGenotypes;
    return validGenotypes.filter(
      (genotype: Genotype) => super.hasDisease(genotype) === phenotype,
    );
  }
}

export default AutosomalDisease;
