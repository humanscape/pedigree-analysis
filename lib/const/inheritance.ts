const AD = 'AD';
const AR = 'AR';
const XD = 'XD';
const XR = 'XR';

const inheritanceList = [AD, AR, XD, XR] as const;
const choices = new Set(inheritanceList);

export type Inheritance = typeof inheritanceList[number];

export default Object.freeze({
  AUTOSOMAL_DOMINANT: AD,
  AD,
  AUTOSOMAL_RECESSIVE: AR,
  AR,
  X_DOMINANT: XD,
  XD,
  X_RECESSIVE: XR,
  XR,
  X_SEMIDOMINANT: 'XS', // heterozygotes have milder and more variable phenotype than hemizygotes
  isAutosomal: (inheritance: Inheritance) => inheritance.startsWith('A'),
  isDominant: (inheritance: Inheritance) => inheritance.endsWith('D'),
  isValid: (inheritance: string) => choices.has(inheritance as Inheritance),
});
