const {
  Pedigree,
  DiseaseFactory,
  FamilyMemberFactory,
  genders: { MALE, FEMALE },
  inheritances,
} = require('../dist/index.cjs');

const me = FamilyMemberFactory.create('나', MALE, null);
const I = me;

const dad = FamilyMemberFactory.create('아버지', MALE, null);
const mom = FamilyMemberFactory.create('어머니', FEMALE, false);
dad.marry(mom);
mom.has.son(me); // if female, use daughter

const grandMother1 = FamilyMemberFactory.create('할머니', FEMALE, null);
const grandFather1 = FamilyMemberFactory.create('할아버지', MALE, true);
grandFather1.marry(grandMother1);
grandFather1.has.son(dad);

const grandMother2 = FamilyMemberFactory.create('외할머니', FEMALE, null);
const grandFather2 = FamilyMemberFactory.create('외할아버지', MALE);
grandMother2.marry(grandFather2);
grandFather2.has.daughter(mom);

const disease = DiseaseFactory.create(
  '질환명',
  inheritances.X_LINKED_RECESSIVE,
);

const pd = new Pedigree(disease, me);
console.dir(pd.calculateProbabilities(), { depth: null });
