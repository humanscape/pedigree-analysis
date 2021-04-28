const AD = 'AD' as const;
const AR = 'AR' as const;
const XLD = 'XLD' as const;
const XLR = 'XLR' as const;
const XL = 'XL' as const;

const inheritanceList = [AD, AR, XLD, XLR, XL] as const;
const choices = new Set(inheritanceList);

export type Inheritance = typeof inheritanceList[number];

export default Object.freeze({
  AUTOSOMAL_DOMINANT: AD,
  AD,
  AUTOSOMAL_RECESSIVE: AR,
  AR,
  X_LINKED_DOMINANT: XLD,
  XLD,
  X_LINKED_RECESSIVE: XLR,
  XLR,
  X_LINKED: XL, // carriers have ambiguous phenotype
  XL,
  isAutosomal: (inheritance: Inheritance) => inheritance.startsWith('A'),
  isDominant: (inheritance: Inheritance) => inheritance.endsWith('D'),
  isValid: (inheritance: string) => choices.has(inheritance as Inheritance),
});
