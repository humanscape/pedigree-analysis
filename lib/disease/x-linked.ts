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

}

export default XLinkedDisease;
