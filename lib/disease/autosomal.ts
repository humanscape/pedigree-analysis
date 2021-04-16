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

}

export default AutosomalDisease;
