import { inheritances, genotypes } from '../const';
import type { Allele, Gender, Genotype, Inheritance } from '../const';

};

export type Phenotype = boolean | null;

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
    return genotype.includes(this._diseaseAllele);
  }
  }
}

export default CommonDisease;
