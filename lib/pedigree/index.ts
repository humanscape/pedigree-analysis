import { genotypes, inheritances } from '../const';
import CommonDisease, { ParentRanges } from '../disease/common';
import FamilyMemberFactory from '../family-member';

import type { Genotype, Allele } from '../const';
import type { FamilyMember } from '../family-member';

type ChildrenInfo = {
  genotype: {
    mother: Genotype;
    father: Genotype;
  };
  son: ChildrenSubInfoByGender;
  daughter: ChildrenSubInfoByGender;
};

type ChildrenSubInfoByGender = {
  probabilities: Probabilities; // probabilities of children having each genotype
  disease: number; // probability of children having disease
};

type Probabilities = {
  [genotype: string]: number; // type of genotype is Genotype
};

class Pedigree {
  _disease: CommonDisease;

  _target: FamilyMember;

  constructor(disease: CommonDisease, target: FamilyMember) {
    if (!(disease instanceof CommonDisease))
      throw new Error('disease must be instance created by DiseaseFactory.');
    if (!FamilyMemberFactory._isInstance(target))
      throw new Error(
        'target must be instance created by FamilyMemberFactory.',
      );

    this._disease = disease;
    this._target = target;
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

  static _calculateAutosomalProbabilities(
    motherGenotypes: Genotype[],
    fatherGenotypes: Genotype[],
    disease: CommonDisease, // use this for only AutosomalDisease
  ) {
    // pedigree analysis does not support aneuploidy yet
    const cases = 4; // motherGenotype.length * fatherGenotype.length;

    return motherGenotypes.map((motherGenotype) =>
      fatherGenotypes.map((fatherGenotype) => {
        const probabilities = {} as Probabilities;
        [...motherGenotype].forEach((motherAllele) =>
          [...fatherGenotype].forEach((fatherAllele) => {
            const genotype = Pedigree._getGenotype(
              fatherAllele as Allele,
              motherAllele as Allele,
            );
            if (probabilities[genotype] === undefined)
              probabilities[genotype] = 0;
            probabilities[genotype] += 1 / cases;
          }),
        );
        const subInfo = {
          probabilities,
          disease: Pedigree._calculateDisease(probabilities, disease),
        };

        return {
          genotype: { mother: motherGenotype, father: fatherGenotype },
          son: subInfo,
          daughter: subInfo,
        } as ChildrenInfo;
      }),
    );
  }

  static _calculateSexLinkedProbabilities(
    motherGenotypes: Genotype[],
    fatherGenotypes: Genotype[],
    disease: CommonDisease, // use this for only XLinkedDisease
  ) {
    // pedigree analysis does not support sex chromosome aneuploidy yet
    /**
     * const countY = fatherGenotype.match(
     * new RegExp(genotypes.NULL_ALLELE, 'g'),
     * )?.length as number;
     */
    const cases = {
      son: 2, // motherGenotype.length * countY,
      daughter: 2, // motherGenotype.length * (fatherGenotype.length - countY),
    };

    return motherGenotypes.map((motherGenotype) =>
      fatherGenotypes.map((fatherGenotype) => {
        const childrenInfo = {
          genotype: { mother: motherGenotype, father: fatherGenotype },
          son: { probabilities: {} },
          daughter: { probabilities: {} },
        } as ChildrenInfo;

        [...motherGenotype].forEach((motherAllele) =>
          [...fatherGenotype].forEach((fatherAllele) => {
            const genotype = Pedigree._getGenotype(
              fatherAllele as Allele,
              motherAllele as Allele,
            );
            const key =
              genotype.indexOf(genotypes.NULL_ALLELE) === 1
                ? 'son' // *_
                : 'daughter'; // ** (X-linked) or __ (Y-linked)
            const { probabilities } = childrenInfo[key];
            if (probabilities[genotype] === undefined)
              probabilities[genotype] = 0;
            probabilities[genotype] += 1 / cases[key];
          }),
        );

        childrenInfo.son.disease = Pedigree._calculateDisease(
          childrenInfo.son.probabilities,
          disease,
        );
        childrenInfo.daughter.disease = Pedigree._calculateDisease(
          childrenInfo.daughter.probabilities,
          disease,
        );

        return childrenInfo;
      }),
    );
  }

  _analyze(target: FamilyMember) {
    const { _disease } = this;
    const { mom, dad } = target as {
      mom: FamilyMember;
      dad: FamilyMember;
    };
    const parents = [dad, mom];
    const parentRanges = [
      _disease._getRangeFromPhenotype(dad),
      _disease._getRangeFromPhenotype(mom),
    ] as ParentRanges;

    // analyze from children
    Object.values(mom.sons).forEach((son) => {
      if (son.phenotype !== null)
        _disease._updateRangeFromSon(
          parentRanges,
          _disease._getRangeFromPhenotype(son),
        );
    });
    Object.values(dad.daughters).forEach((daughter) => {
      if (daughter.phenotype !== null)
        _disease._updateRangeFromDaughter(
          parentRanges,
          _disease._getRangeFromPhenotype(daughter),
        );
    });

    // analyze from parents
    parentRanges.forEach((parentRange, index) => {
      const parent = parents[index];
      if (parent.mom) {
        const grandParentRanges = this._analyze(parent);
        _disease._updateRangeFromParents(
          grandParentRanges,
          parentRange,
          parent,
        );
      }
    });

    return parentRanges;
  }

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
