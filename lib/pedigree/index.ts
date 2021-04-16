import { genotypes, inheritances } from '../const';
import CommonDisease, { ParentRanges } from '../disease/common';
import FamilyMemberFactory from '../family-member';

import type { Genotype, Allele } from '../const';
import type { FamilyMember } from '../family-member';

type Probabilities = {
  [genotype: string]: number; // type of genotype is Genotype
};

class Pedigree {
  _disease: CommonDisease;

  _target: FamilyMember;

  constructor(disease: CommonDisease, target: FamilyMember) {
    if (!(disease instanceof CommonDisease))
      throw new Error('diease must be instance created by DiseaseFactory.');
    if (!FamilyMemberFactory._isInstance(target))
      throw new Error(
        'target must be instance created by FamilyMemberFactory.',
      );

    this._disease = disease;
    this._target = target;
    this._genotypes = {};
  }

  static _calculateDisease = (
    probabilities: Probabilities,
    disease: CommonDisease,
  ) =>
    Object.entries(probabilities).reduce(
      (diseaseProbability, [genotype, probability]) =>
        disease.hasDisease(genotype as Genotype)
          ? diseaseProbability + probability
          : diseaseProbability,
      0,
    );

  static _getGenotype = (fatherAllele: Allele, motherAllele: Allele) =>
    (motherAllele > fatherAllele // sort alleles ASC
      ? `${fatherAllele}${motherAllele}`
      : `${motherAllele}${fatherAllele}`) as Genotype;
  calculateProbabilities() {
    try {
      const { _disease, _target } = this;
      if (!_target.mom || !_target.dad)
        throw new Error('target must have parents for pedigree-analysis.');

      const [fatherRange, motherRange] = this._analyze(_target);
      const motherGenotypes = _disease._getGenotypesFromRange(
        motherRange,
        _target.mom,
      );
      const fatherGenotypes = _disease._getGenotypesFromRange(
        fatherRange,
        _target.dad,
      );

      return (inheritances.isAutosomal(_disease.inheritance)
        ? Pedigree._calculateAutosomalProbabilities
        : Pedigree._calculateSexLinkedProbabilities)(
        motherGenotypes,
        fatherGenotypes,
        _disease,
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default Pedigree;
