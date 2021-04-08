/**
 * @readonly
 * @property {Genders} genders
 * @property {Genotypes} genotypes
 * @property {Inheritances} inheritances
 */
module.exports = Object.freeze({
  genders: require('./gender'),
  genotypes: require('./genotype'),
  inheritances: require('./inheritance'),
});
