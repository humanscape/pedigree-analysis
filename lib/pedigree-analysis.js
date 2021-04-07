const PedigreeAnalysis = {
  Disease: require('./disease'),
  FamilyMember: require('./family-member'),
  Pedigree: require('./pedigree'),
  ...require('./const'),
};

module.exports = PedigreeAnalysis;
module.exports.default = PedigreeAnalysis;
