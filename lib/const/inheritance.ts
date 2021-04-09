const AD = 'AD';
const AR = 'AR';
const XD = 'XD';
const XR = 'XR';

export default {
  AUTOSOMAL_DOMINANT: AD,
  AD,
  AUTOSOMAL_RECESSIVE: AR,
  AR,
  X_DOMINANT: XD,
  XD,
  X_RECESSIVE: XR,
  XR,
  isAutosomal: (inheritance: string) => inheritance.startsWith('A'),
  isDominant: (inheritance: string) => inheritance.endsWith('D'),
  choices: new Set([AD, AR, XD, XR]),
};
