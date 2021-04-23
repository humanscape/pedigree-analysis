import { genotypes, inheritances } from '../const';
import CommonDisease, {
  MAX,
  MIN,
  throwRangeError,
  willInheritAllele,
  mayInheritAllele,
  shouldHaveDiseaseAllele,
  shouldHaveWildTypeAllele,
} from './common';
import AutosomalDisease from './autosomal';
import type { DiseaseAlleleCountRange, ParentRanges } from './common';
import type { FamilyMember } from '../family-member';

/**
 * Class representing a X-linked disease
 * @class
 */
class XLinkedDisease extends CommonDisease {
  static _validGenotypes = genotypes.X_LINKED;

  static updateRangeFromParents = (
    [fatherRange, motherRange]: ParentRanges,
    childRange: DiseaseAlleleCountRange,
    { _isMale }: FamilyMember,
  ) => {
    const motherHasMin = motherRange[MIN] && 1;
    const motherHasMax = motherRange[MAX] && 1;
    const range = (_isMale
      ? [motherHasMin, motherHasMax, 1]
      : [
          fatherRange[MIN] + motherHasMin,
          fatherRange[MAX] + motherHasMax,
          2,
        ]) as DiseaseAlleleCountRange;
    if (range[MIN] > childRange[MIN]) childRange[MIN] = range[MIN];
    if (range[MAX] < childRange[MAX]) childRange[MAX] = range[MAX];
    if (childRange[MIN] > childRange[MAX]) throwRangeError();
  };

  static _updateRangeFromSon = (
    [_, motherRange]: ParentRanges,
    sonRange: DiseaseAlleleCountRange,
  ) => {
    if (sonRange[MIN] === 1) {
      if (!mayInheritAllele(motherRange))
        throw new Error('son has disease allele where mother does not.');
      shouldHaveDiseaseAllele(motherRange);
      return;
    }
    if (sonRange[MAX] === 0) {
      if (willInheritAllele(motherRange))
        throw new Error(
          'son does not have disease allele where mother only has disease alleles.',
        );
      shouldHaveWildTypeAllele(motherRange);
    }
  };

  _getRangeFromPhenotype = ({ phenotype, _isMale, gender }: FamilyMember) => {
    const limit = XLinkedDisease._validGenotypes[gender].length - 1;
    return [
      phenotype
        ? _isMale ||
          this._isDominant ||
          this._inheritance === inheritances.X_LINKED
          ? 1
          : 2
        : 0,
      phenotype === false ? (_isMale || this._isDominant ? 0 : 1) : limit,
      limit,
    ] as DiseaseAlleleCountRange;
  };

  _updateRangeFromParents = XLinkedDisease.updateRangeFromParents;

  _updateRangeFromSon = XLinkedDisease._updateRangeFromSon;

  _updateRangeFromDaughter = AutosomalDisease._updateRangeFromChild; // can use same logic

  _getGenotypesFromRange = (
    [min, max]: DiseaseAlleleCountRange,
    { gender }: FamilyMember,
  ) => {
    return XLinkedDisease._validGenotypes[gender].slice(min, max + 1);
  };
}

export default XLinkedDisease;
