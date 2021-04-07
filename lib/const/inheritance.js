const AD = 'AD';
const AR = 'AR';
const XD = 'XD';
const XR = 'XR';

module.exports = {
  AUTOSOMAL_DOMINANT: AD,
  AD,
  AUTOSOMAL_RECESSIVE: AR,
  AR,
  X_DOMINANT: XD,
  XD,
  X_RECESSIVE: XR,
  XR,
  isAutosomal: (inheritance) => inheritance.startsWith('A'),
  isDominant: (inheritance) => inheritance.endsWith('D'),
  choices: new Set([AD, AR, XD, XR]),
};
