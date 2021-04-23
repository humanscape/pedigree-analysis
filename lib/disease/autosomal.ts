import { genotypes } from '../const';
import CommonDisease, {
  MAX,
  MIN,
  throwRangeError,
  willInheritAllele,
  mayInheritAllele,
  shouldHaveDiseaseAllele,
  shouldHaveWildTypeAllele,
} from './common';
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
      parentRanges.filter(willInheritAllele).length,
      parentRanges.filter(mayInheritAllele).length,
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

    if (childMin > parentRanges.filter(mayInheritAllele).length)
      throw new Error(
        'child has more disease alleles than parents would inherit at most.',
      );

    if (childMin === 2) {
      // all parents should have at lease one disease allele
      parentRanges.forEach(shouldHaveDiseaseAllele);
      return;
    }

    if (childMax < parentRanges.filter(willInheritAllele).length)
      throw new Error(
        'child has less diseases alleles than parent would inherit at least.',
      );

    if (childMax === 0) {
      // all parents should have at lease one wild-type allele
      parentRanges.forEach(shouldHaveWildTypeAllele);
      return;
    }

    if (childMin === 1) {
      // if one parent does not have disease allele, it should come from the other one
      if (!mayInheritAllele(fatherRange)) shouldHaveDiseaseAllele(motherRange);
      else if (!mayInheritAllele(motherRange))
        shouldHaveDiseaseAllele(fatherRange);
    }

    if (childMax === 1) {
      // if one parent does not have wild-type allele, it should come from the other one
      if (willInheritAllele(fatherRange)) shouldHaveWildTypeAllele(motherRange);
      else if (willInheritAllele(motherRange))
        shouldHaveWildTypeAllele(fatherRange);
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
