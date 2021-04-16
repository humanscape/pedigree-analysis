const genderList = ['XX', 'XY'] as const; // , 'X', 'XXX', 'XXY', 'XYY', 'XXYY'] as const;
const choices = new Set(genderList);

export type Gender = typeof genderList[number];

export default Object.freeze({
  FEMALE: 'XX' as const,
  MALE: 'XY' as const,
  isValid: (gender: string) => choices.has(gender as Gender),
  isMale: (gender: Gender) => gender.endsWith('Y'),
});
