import DiseaseFactory from './disease';
import FamilyMemberFactory from './family-member';
import Pedigree from './pedigree';
import * as constants from './const';

const PedigreeAnalysis = {
  DiseaseFactory,
  FamilyMemberFactory,
  Pedigree,
  ...constants,
};

export default PedigreeAnalysis;
