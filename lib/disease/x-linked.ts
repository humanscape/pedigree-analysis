/* eslint-disable class-methods-use-this */
import { genotypes } from '../const';
import type { Gender, Genotype } from '../const';
import CommonDisease from './common';
import type { Phenotype } from './common';

/**
 * Class representing a X-linked disease
 * @class
 */
class XLinkedDisease extends CommonDisease {
  static _validGenotypes = genotypes.byGender;

  getValidGenotypes({ gender }: { gender: Gender }) {
    const list = XLinkedDisease._validGenotypes[gender];
    if (!list) throw new Error(`gender '${gender}' is invalid.`);
    return list;
  }

  hasValidGenotypes({
    gender,
    genotypes: list,
  }: {
    gender: Gender;
    genotypes: Genotype[];
  }) {
    if (!Array.isArray(list) || !list.length) return false;

    const genotypeSet = new Set(list);
    if (genotypeSet.size !== list.length) return false;

    (XLinkedDisease._validGenotypes[gender] ?? []).forEach((genotype) =>
      genotypeSet.delete(genotype),
    );
    return genotypeSet.size === 0; // if not 0, has invalid genotypes
  }

  getPossibleGenotypes({
    gender,
    phenotype,
  }: {
    gender: Gender;
    phenotype: Phenotype;
  }) {
    const list = this.getValidGenotypes({ gender });
    const filter = phenotype
      ? (genotype: Genotype) => super.hasDisease(genotype)
      : phenotype === false
      ? (genotype: Genotype) => !super.hasDisease(genotype)
      : null;
    if (filter) return list.filter(filter);
    return list;
  }
}

export default XLinkedDisease;
