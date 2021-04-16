import { genotypes } from '../const';
import CommonDisease, { MAX, MIN, throwRangeError } from './common';
import AutosomalDisease from './autosomal';
import type { DiseaseAlleleCountRange, ParentRanges } from './common';
import type { FamilyMember } from '../family-member';

/**
 * Class representing a X-linked disease
 * @class
 */
class XLinkedDisease extends CommonDisease {
  static _validGenotypes = genotypes.byGender;

}

export default XLinkedDisease;
