import Disease from './disease';
import FamilyMember from './family-member';
import Pedigree from './pedigree';
import constants from './const';

const PedigreeAnalysis = {
  Disease,
  FamilyMember,
  Pedigree,
  ...constants,
};

export default PedigreeAnalysis;
