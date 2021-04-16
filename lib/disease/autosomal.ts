import { genotypes } from '../const';
import CommonDisease, { MAX, MIN, LIMIT, throwRangeError } from './common';
import type { DiseaseAlleleCountRange, ParentRanges } from './common';
import type { FamilyMember } from '../family-member';

const limit = 2;

/**
 * Class representing an autosomal disease
 * @class
 */
class AutosomalDisease extends CommonDisease {
  static _validGenotypes = genotypes.AUTOSOMAL;

  static _updateRangeFromParents = (
    parentRanges: ParentRanges,
    childRange: DiseaseAlleleCountRange,
  ) => {
    const range = [
      // always gets disease allele if parent only has disease alleles
      parentRanges.filter((parentRange) => parentRange[MIN] === limit).length,

      // never gets disease allele if parent does not have disease allele
      parentRanges.filter((parentRange) => parentRange[MAX] !== 0).length,

      limit,
    ] as DiseaseAlleleCountRange;
    if (range[MIN] > childRange[MIN]) childRange[MIN] = range[MIN];
    if (range[MAX] < childRange[MAX]) childRange[MAX] = range[MAX];
    if (childRange[MIN] > childRange[MAX]) throwRangeError();
  };

  static _updateRangeFromChild = (
    parentRanges: ParentRanges,
    childRange: DiseaseAlleleCountRange,
  ) => {
    const [childMin, childMax] = childRange;
    const [fatherRange, motherRange] = parentRanges;

    /* using childRange[MIN] */
    if (childMin > parentRanges.filter((range) => range[MAX] !== 0).length)
      throw new Error(
        'child has more disease alleles than parents would inherit at most',
      );

    if (childMin === 2) {
      // all parents should have at lease one disease allele
      parentRanges.forEach((range) => {
        if (range[MIN] === 0) range[MIN] = 1;
      });
    } else if (childMin === 1) {
      // if one parent does not have disease allele, it should come from the other one
      if (fatherRange[MAX] === 0) {
        if (motherRange[MIN] === 0) motherRange[MIN] = 1;
      } else if (motherRange[MAX] === 0 && fatherRange[MIN] === 0)
        fatherRange[MIN] = 1;
    }

    /* using childRange[MAX] */
    if (
      childMax <
      parentRanges.filter((range) => range[MIN] === range[LIMIT]).length
    )
      throw new Error(
        'child has less diseases alleles than parent would inherit at least',
      );

    if (childMax === 0) {
      // all parents should have at lease one wild-type allele
      parentRanges.forEach((range) => {
        if (range[MAX] === range[LIMIT]) range[MAX] = 1;
      });
    } else if (childMax === 1) {
      // if one parent does not have wild-type allele, it should come from the other one
      if (fatherRange[MIN] === fatherRange[LIMIT]) {
        if (motherRange[MAX] === 2) {
          motherRange[MAX] = 1;
        }
      } else if (motherRange[MIN] === limit && fatherRange[MAX] === 2)
        fatherRange[MAX] = 1;
    }
  };

  _getRangeFromPhenotype = ({ phenotype }: FamilyMember) =>
    [
      phenotype ? (this._isDominant ? 1 : 2) : 0,
      phenotype === false ? (this._isDominant ? 0 : 1) : limit,
      limit,
    ] as DiseaseAlleleCountRange;

  _updateRangeFromParents = AutosomalDisease._updateRangeFromParents;

  _updateRangeFromSon = AutosomalDisease._updateRangeFromChild;

  _updateRangeFromDaughter = AutosomalDisease._updateRangeFromChild;

  _getGenotypesFromRange = ([min, max]: DiseaseAlleleCountRange) => {
    max++; // exclusive
    if (!this._isDominant) {
      const temp = -max;
      max = (-min || undefined) as number;
      min = temp;
    }
    return AutosomalDisease._validGenotypes.slice(min, max);
  };
}

export default AutosomalDisease;
