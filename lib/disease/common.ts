import { inheritances, genotypes } from '../const';
import type { Allele, Gender, Genotype, Inheritance } from '../const';

export type ChildrenProbabilities = {
  [genotype: string]: number; // type of genotype is Genotype
};

export type Phenotype = boolean | null;

export interface Disease {
  name: string;
  inheritance: Inheritance;
  isDominant: boolean;
  getValidGenotypes: ({ gender }: { gender?: Gender }) => Genotype[];
  hasValidGenotypes: ({
    gender,
    genotypes: list,
  }: {
    gender: Gender;
    genotypes: Genotype[];
  }) => boolean;
  getPhenotype: ({ genotypes: list }: { genotypes: Genotype[] }) => Phenotype;
  hasDisease: (genotype: Genotype) => boolean;
  getPossibleGenotypes: ({
    gender,
    phenotype,
  }: {
    gender: Gender;
    phenotype: Phenotype;
  }) => Genotype[];
}

abstract class CommonDisease implements Disease {
  abstract getValidGenotypes({ gender }: { gender?: Gender }): Genotype[];

  abstract hasValidGenotypes({
    gender,
    genotypes: list,
  }: {
    gender: Gender;
    genotypes: Genotype[];
  }): boolean;

  abstract getPossibleGenotypes({
    gender,
    phenotype,
  }: {
    gender: Gender;
    phenotype: Phenotype;
  }): Genotype[];

  _name: string;

  _inheritance: Inheritance;

  _isDominant: boolean;

  _diseaseAllele: Allele;

  /**
   * Creates an abstract disease with name and inheritance
   * @param {string} name
   * @param {Inheritance} inheritance
   */
  constructor(name: string, inheritance: Inheritance) {
    this._name = name;
    this._inheritance = inheritance;
    this._isDominant = inheritances.isDominant(inheritance);
    this._diseaseAllele =
      genotypes[this._isDominant ? 'DOMINANT_ALLELE' : 'RECESSIVE_ALLELE'];
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

  getPhenotype({ genotypes: list }: { genotypes: Genotype[] }) {
    let yes = false;
    let no = false;
    list.forEach((genotype) => {
      if (this.hasDisease(genotype)) yes = true;
      else no = true;
    });
    return yes ? (no ? null : true) : false;
  }

  hasDisease(genotype: Genotype) {
    return genotype.includes(this._diseaseAllele);
  }

  static _getProbabilitiesFromGenotypes(
    motherGenotype: Genotype,
    fatherGenotype: Genotype,
  ) {
    const cases = motherGenotype.length * fatherGenotype.length;
    const probabilities = {} as ChildrenProbabilities;
    motherGenotype.split('').forEach((motherAllele) => {
      fatherGenotype.split('').forEach((fatherAllele) => {
        const genotype =
          motherAllele > fatherAllele // sort alleles ASC
            ? `${fatherAllele}${motherAllele}`
            : `${motherAllele}${fatherAllele}`;
        if (probabilities[genotype] === undefined) probabilities[genotype] = 0;
        probabilities[genotype] += 1 / cases;
      });
    });
    return probabilities;
  }

  _calculateDiseaseProbability({
    mother: motherGenotype,
    father: fatherGenotype,
  }: {
    mother: Genotype;
    father: Genotype;
  }) {
    return Object.entries(
      CommonDisease._getProbabilitiesFromGenotypes(
        motherGenotype,
        fatherGenotype,
      ),
    ).reduce(
      (diseaseProbability, [genotype, probability]) =>
        this.hasDisease(genotype as Genotype)
          ? diseaseProbability + probability
          : diseaseProbability,
      0,
    );
  }
}

export default CommonDisease;
