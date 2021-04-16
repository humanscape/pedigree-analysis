import { inheritances, genotypes } from '../const';
import type { Allele, Genotype, Inheritance } from '../const';
import type { FamilyMember } from '../family-member';

export const MIN = 0;
export const MAX = 1;
const LIMIT = 2;
export const throwRangeError = () => {
  throw new Error('range[MAX] cannot be less than range[MIN].');
};
// always gets disease allele if parent only has disease alleles
export const willInheritAllele = (parentRange: DiseaseAlleleCountRange) =>
  parentRange[MIN] === parentRange[LIMIT];

// never gets disease allele if parent does not have disease allele
export const mayInheritAllele = (parentRange: DiseaseAlleleCountRange) =>
  parentRange[MAX] !== 0;

export const shouldHaveDiseaseAllele = (
  parentRange: DiseaseAlleleCountRange,
) => {
  if (parentRange[MIN] === 0) parentRange[MIN]++;
};

export const shouldHaveWildTypeAllele = (
  parentRange: DiseaseAlleleCountRange,
) => {
  if (parentRange[MAX] === parentRange[LIMIT]) parentRange[MAX]--;
};

export type Phenotype = boolean | null;

export type DiseaseAlleleCountRange = [number, number, number]; // [min, max, limit]
export type ParentRanges = [DiseaseAlleleCountRange, DiseaseAlleleCountRange]; // [father, mother]

export interface Disease {
  name: string;
  inheritance: Inheritance;
  isDominant: boolean;
  hasDisease: (genotype: Genotype) => boolean;
}

abstract class CommonDisease implements Disease {
  _name: string;

  _inheritance: Inheritance;

  _isDominant: boolean;

  abstract _getRangeFromPhenotype: (
    member: FamilyMember,
  ) => DiseaseAlleleCountRange;

  abstract _updateRangeFromParents: (
    parentRanges: ParentRanges,
    childRange: DiseaseAlleleCountRange,
    { _isMale }: FamilyMember,
  ) => void;

  abstract _updateRangeFromSon: (
    parentRanges: ParentRanges,
    sonRange: DiseaseAlleleCountRange,
  ) => void;

  abstract _updateRangeFromDaughter: (
    parentRanges: ParentRanges,
    daughterRange: DiseaseAlleleCountRange,
  ) => void;

  abstract _getGenotypesFromRange: (
    range: DiseaseAlleleCountRange,
    { gender }: FamilyMember,
  ) => Genotype[];

  /**
   * Creates an abstract disease with name and inheritance
   * @param {string} name
   * @param {Inheritance} inheritance
   */
  constructor(name: string, inheritance: Inheritance) {
    this._name = name;
    this._inheritance = inheritance;
    this._isDominant = inheritances.isDominant(inheritance);
  }

  get name() {
    return this._name;
  }

  get inheritance() {
    return this._inheritance;
  }

  get isDominant() {
    return this._isDominant;
  }

  hasDisease(genotype: Genotype) {
    return this._isDominant === genotype.includes(genotypes.DOMINANT_ALLELE);
  }
}

export default CommonDisease;
