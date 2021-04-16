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

}

export default AutosomalDisease;
