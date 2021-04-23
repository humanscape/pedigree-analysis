import genders from './gender';

const { MALE, FEMALE } = genders;

const DOMINANT_ALLELE = 'A' as const;
const RECESSIVE_ALLELE = 'a' as const;

const X_DOMINANT_ALLELE = 'X' as const;
const X_RECESSIVE_ALLELE = 'x' as const;
const Y_DOMINANT_ALLELE = 'Y' as const;
// const Y_RECESSIVE_ALLELE = 'y' as const;

// const NULL_ALLELE = '_' as const; // women do not have Y chromosome

export type Allele =
  | typeof DOMINANT_ALLELE
  | typeof RECESSIVE_ALLELE
  | typeof X_DOMINANT_ALLELE
  | typeof X_RECESSIVE_ALLELE
  | typeof Y_DOMINANT_ALLELE;
// | typeof Y_RECESSIVE_ALLELE
// | typeof NULL_ALLELE;

// Autosomal
const HOMOZYGOUS_DOMINANT = `${DOMINANT_ALLELE}${DOMINANT_ALLELE}` as const; // AA
const HETEROZYGOUS = `${DOMINANT_ALLELE}${RECESSIVE_ALLELE}` as const; // Aa
const HOMOZYGOUS_RECESSIVE = `${RECESSIVE_ALLELE}${RECESSIVE_ALLELE}` as const; // aa

// X-linked
const X_HOMOZYGOUS_DOMINANT = `${X_DOMINANT_ALLELE}${X_DOMINANT_ALLELE}` as const; // XX
const X_HETEROZYGOUS = `${X_DOMINANT_ALLELE}${X_RECESSIVE_ALLELE}` as const; // Xx
const X_HOMOZYGOUS_RECESSIVE = `${X_RECESSIVE_ALLELE}${X_RECESSIVE_ALLELE}` as const; // xx
const X_HEMIZYGOUS_DOMINANT = `${X_DOMINANT_ALLELE}${Y_DOMINANT_ALLELE}` as const; // XY
const X_HEMIZYGOUS_RECESSIVE = `${X_RECESSIVE_ALLELE}${Y_DOMINANT_ALLELE}` as const; // xY

const genotypeList = [
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HOMOZYGOUS_RECESSIVE,
  X_HOMOZYGOUS_DOMINANT,
  X_HETEROZYGOUS,
  X_HOMOZYGOUS_RECESSIVE,
  X_HEMIZYGOUS_DOMINANT,
  X_HEMIZYGOUS_RECESSIVE,
] as const;

export type Genotype = typeof genotypeList[number];

const AUTOSOMAL = Object.freeze([
  HOMOZYGOUS_RECESSIVE,
  HETEROZYGOUS,
  HOMOZYGOUS_DOMINANT,
]) as Genotype[];
const X_FEMALE = Object.freeze([
  X_HOMOZYGOUS_RECESSIVE,
  X_HETEROZYGOUS,
  X_HOMOZYGOUS_RECESSIVE,
]);
const X_MALE = Object.freeze([
  X_HEMIZYGOUS_RECESSIVE,
  X_HEMIZYGOUS_DOMINANT,
]) as Genotype[];

export default Object.freeze({
  AUTOSOMAL,
  X_LINKED: {
    [MALE]: X_MALE,
    [FEMALE]: X_FEMALE,
  },
  _isAlleleY: (fatherAllele: Allele) =>
    fatherAllele.toUpperCase() === Y_DOMINANT_ALLELE,
  _hasDominantAllele: (genotype: string) =>
    genotype[0].toUpperCase() === genotype[0],
  _fromAlleles: (motherAllele: Allele, fatherAllele: Allele) => {
    const motherFirst =
      fatherAllele === Y_DOMINANT_ALLELE || motherAllele < fatherAllele;
    // (fatherAllele.toUpperCase() === Y_DOMINANT_ALLELE)
    //   ? motherAllele !== NULL_ALLELE
    //   : motherAllele < fatherAllele

    return (motherFirst
      ? `${motherAllele}${fatherAllele}`
      : `${fatherAllele}${motherAllele}`) as Genotype;
  },
});
