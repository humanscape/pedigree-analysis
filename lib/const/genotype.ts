import genders from './gender';

const { MALE, FEMALE } = genders;

// use '|' so that 'A' < 'a' < '|' (charCode)
const DOMINANT_ALLELE = 'A';
const RECESSIVE_ALLELE = 'a';
const NULL_ALLELE = '|';

export type Allele =
  | typeof DOMINANT_ALLELE
  | typeof RECESSIVE_ALLELE
  | typeof NULL_ALLELE;

const HOMOZYGOUS_DOMINANT = `${DOMINANT_ALLELE}${DOMINANT_ALLELE}` as const;
const HETEROZYGOUS = `${DOMINANT_ALLELE}${RECESSIVE_ALLELE}` as const;
const HOMOZYGOUS_RECESSIVE = `${RECESSIVE_ALLELE}${RECESSIVE_ALLELE}` as const;
const HEMIZYGOUS_DOMINANT = `${DOMINANT_ALLELE}${NULL_ALLELE}` as const;
const HEMIZYGOUS_RECESSIVE = `${RECESSIVE_ALLELE}${NULL_ALLELE}` as const;
const NULL = `${NULL_ALLELE}${NULL_ALLELE}` as const; // for example, women do not have Y chromosome

const genotypeList = [
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HOMOZYGOUS_RECESSIVE,
  HEMIZYGOUS_DOMINANT,
  HEMIZYGOUS_RECESSIVE,
  NULL,
] as const;
const choices = new Set(genotypeList);

export type Genotype = typeof genotypeList[number];

const AUTOSOMAL = Object.freeze([
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HOMOZYGOUS_RECESSIVE,
]) as Genotype[];
const X_FEMALE = AUTOSOMAL;
const X_MALE = Object.freeze([
  HEMIZYGOUS_DOMINANT,
  HEMIZYGOUS_RECESSIVE,
]) as Genotype[];
const Y_FEMALE = Object.freeze([NULL]) as Genotype[];
const Y_MALE = X_MALE;
const DOMINANT = Object.freeze([
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HEMIZYGOUS_DOMINANT,
]) as Genotype[];
const RECESSIVE = Object.freeze([
  HOMOZYGOUS_RECESSIVE,
  HEMIZYGOUS_RECESSIVE,
]) as Genotype[];

export default Object.freeze({
  HOMOZYGOUS_DOMINANT,
  HETEROZYGOUS,
  HOMOZYGOUS_RECESSIVE,
  HEMIZYGOUS_DOMINANT,
  HEMIZYGOUS_RECESSIVE,
  NULL,
  AUTOSOMAL,
  Y_FEMALE,
  Y_MALE,
  X_FEMALE,
  X_MALE,
  DOMINANT,
  RECESSIVE,
  isValid: (genotype: string) => choices.has(genotype as Genotype),
  byGender: {
    [MALE]: X_MALE,
    [FEMALE]: X_FEMALE,
  },
});
