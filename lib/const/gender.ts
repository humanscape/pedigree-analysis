const genderList = ['XX', 'XY', 'X', 'XXX', 'XXY', 'XYY', 'XXYY'] as const;
const choices = new Set(genderList);

export type Gender = typeof genderList[number];

export default Object.freeze({
  FEMALE: 'XX' as Gender,
  MALE: 'XY' as Gender,
  isValid: (gender: string) => choices.has(gender as Gender),
  isMale: (gender: Gender) => gender.endsWith('Y'),
});
