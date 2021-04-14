import { genders } from '../const';
import type { Gender } from '../const';
import type { Phenotype } from '../disease';

type Relationship = {
  dad?: FamilyMember; // male
  mom?: FamilyMember; // female
  spouse?: FamilyMember; // of different gender
  sons: {
    [id: string]: FamilyMember; // male
  };
  daughters: {
    [id: string]: FamilyMember; // female
  };
};

type Child = 'son' | 'daughter';
type Sibling = 'brother' | 'sister';
export type Id = number | string;

interface Has {
  disease: () => void;
  son: (son: FamilyMember) => void;
  daughter: (daughter: FamilyMember) => void;
  brother: (brother: FamilyMember) => void;
  sister: (sister: FamilyMember) => void;
}

interface DoesNotHave {
  disease: () => void;
  son: (id: Id) => void;
  daughter: (id: Id) => void;
  brother: (id: Id) => void;
  sister: (id: Id) => void;
}

const male = {
  isMale: true,
  gender: 'male',
};

const female = {
  isMale: false,
  gender: 'female',
};

const genderByRelationship = {
  son: {
    ...male,
    getRelationship: (member: FamilyMember, id: Id) => member.sons[id],
  },
  brother: {
    ...male,
    getRelationship: (member: FamilyMember, id: Id) => member.mom?.sons?.[id],
  },
  daughter: {
    ...female,
    getRelationship: (member: FamilyMember, id: Id) => member.daughters[id],
  },
  sister: {
    ...female,
    getRelationship: (member: FamilyMember, id: Id) =>
      member.dad?.daughters?.[id],
  },
};

class FamilyMember {
  _id: string | number;

  _gender: Gender;

  _isMale: boolean; // existence of Y chromosome

  _phenotype: Phenotype;

  _spouse?: FamilyMember;

  _relationships: Relationship;

  has: Has;

  have: Has;

  doesNotHave: DoesNotHave;

  doNotHave: DoesNotHave;

  mayHave: { disease: () => void };

  _validateMember(relationship: Child | Sibling, member: FamilyMember) {
    const { isMale, gender, getRelationship } = genderByRelationship[
      relationship
    ];
    if (!(member instanceof FamilyMember) || member._isMale !== isMale)
      throw new Error(`${relationship} must be a ${gender} FamilyMember.`);

    const { id } = member;
    if (getRelationship(this, id))
      throw new Error(`${relationship} with given id ${id} already exists.`);
  }

  _validateExistence(relationship: Child | Sibling, id: Id) {
    if (typeof id !== 'string' && typeof id !== 'number')
      throw new Error(`given id '${id}' of ${relationship} is invalid.`);

    if (!genderByRelationship[relationship].getRelationship(this, id))
      throw new Error(`${relationship} with given id ${id} does not exist.`);
  }

  _addChild(relationship: Child, child: FamilyMember) {
    if (!this.spouse)
      throw new Error(`cannot have ${relationship} before getting married.`);

    const { id } = child;
    this._relationships[`${relationship}s` as const][id] = child;
    if (this._isMale) {
      child._relationships.dad = this;
      child._relationships.mom = this.spouse;
    } else {
      child._relationships.mom = this;
      child._relationships.dad = this.spouse;
    }
  }

  _deleteChild(relationship: Child, id: Id) {
    if (!this.spouse)
      throw new Error(`cannot delete ${relationship} before getting married`);

    const children = this._relationships[`${relationship}s` as const];
    children[id]._deleteParents();
    delete children[id];
  }

  _deleteParents() {
    this._relationships.mom = undefined;
    this._relationships.dad = undefined;
  }

  _hasChild(childObject: { [relationship: string]: FamilyMember }) {
    const [[relationship, child]] = Object.entries(childObject) as [
      [Child, FamilyMember],
    ];

    this._validateMember(relationship, child);
    this._addChild(relationship, child);
  }

  _doesNotHaveChild(childObject: { [relationship: string]: Id }) {
    const [[relationship, id]] = Object.entries(childObject) as [[Child, Id]];

    this._validateExistence(relationship, id);
    this._deleteChild(relationship, id);
  }

  _hasSibling(siblingObject: { [relationship: string]: FamilyMember }) {
    const [[relationship, sibling]] = Object.entries(siblingObject) as [
      [Sibling, FamilyMember],
    ];

    this._validateMember(relationship, sibling); // throws if this.mom is undefined
    if (!this.mom) throw new Error(`must have parent to have ${relationship}.`);
    (this.mom as FamilyMember)._addChild(
      relationship === 'brother' ? 'son' : 'daughter',
      sibling,
    );
  }

  _doesNotHaveSibling(siblingObject: { [relationship: string]: Id }) {
    const [[relationship, id]] = Object.entries(siblingObject) as [
      [Sibling, Id],
    ];

    this._validateExistence(relationship, id); // throws if this.dad is undefined
    (this.dad as FamilyMember)._deleteChild(
      relationship === 'brother' ? 'son' : 'daughter',
      id,
    );
  }

  constructor(id: Id, gender: Gender, phenotype: Phenotype) {
    this._id = id;
    this._gender = gender;
    this._isMale = genders.isMale(gender);
    this._phenotype = phenotype;
    this._relationships = {
      sons: {},
      daughters: {},
    };

    this.has = Object.freeze({
      disease: () => {
        this._phenotype = true;
      },
      son: (son: FamilyMember) => this._hasChild({ son }),
      daughter: (daughter: FamilyMember) => this._hasChild({ daughter }),
      brother: (brother: FamilyMember) => this._hasSibling({ brother }),
      sister: (sister: FamilyMember) => this._hasSibling({ sister }),
    });
    this.have = this.has;

    this.doesNotHave = Object.freeze({
      disease: () => {
        this._phenotype = false;
      },
      son: (son: Id) => this._doesNotHaveChild({ son }),
      daughter: (daughter: Id) => this._doesNotHaveChild({ daughter }),
      brother: (brother: Id) => this._doesNotHaveSibling({ brother }),
      sister: (sister: Id) => this._doesNotHaveSibling({ sister }),
    });
    this.doNotHave = this.doesNotHave;

    this.mayHave = Object.freeze({
      disease: () => {
        this._phenotype = null;
      },
    });
  }

  marry(spouse: FamilyMember) {
    if (this.spouse)
      throw new Error(
        'pedigree analysis is not prepared for multiple marriages... divorce first in order to marry again.',
      );

    if (!(spouse instanceof FamilyMember) || this._isMale === spouse._isMale)
      throw new Error(
        'spouse must be an instance of FamilyMember with different gender for pedigree analysis.',
      );
    this._relationships.spouse = spouse;
    spouse._relationships.spouse = this;
    spouse._relationships.sons = this.sons; // share reference
    spouse._relationships.daughters = this.daughters;
  }

  divorce() {
    const {
      _relationships: { spouse, sons, daughters },
    } = this;
    if (!spouse) throw new Error('cannot divorce before getting married.');

    Object.values(sons).forEach((son) => son._deleteParents());
    Object.values(daughters).forEach((daughter) => daughter._deleteParents());

    [spouse, this].forEach((member) => {
      const { _relationships } = member;
      _relationships.sons = {};
      _relationships.daughters = {};
      _relationships.spouse = undefined;
    });
  }

  get id() {
    return this._id;
  }

  get gender() {
    return this._gender;
  }

  get mom() {
    return this._relationships.mom;
  }

  get dad() {
    return this._relationships.dad;
  }

  get spouse() {
    return this._relationships.spouse;
  }

  get sons() {
    return this._relationships.sons;
  }

  get daughters() {
    return this._relationships.daughters;
  }

  get brothers() {
    const { mom } = this;
    return (
      mom && Object.values(mom.sons).filter((brother) => brother.id !== this.id)
    ); // exclude self
  }

  get sisters() {
    const { dad } = this;
    return (
      dad &&
      Object.values(dad.daughters).filter((sister) => sister.id !== this.id)
    );
  }
}

export default FamilyMember;
