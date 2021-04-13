import DiseaseFactory from './disease';
import FamilyMember from './family-member';
import Pedigree from './pedigree';
import * as constants from './const';

const PedigreeAnalysis = {
  DiseaseFactory,
  FamilyMember,
  Pedigree,
  ...constants,
};

export default PedigreeAnalysis;
