import FamilyMember from './common';
import { genders } from '../const';

import type { Id } from './common';
import type { Gender } from '../const';
import type { Phenotype } from '../disease';

export type { FamilyMember };

/**
 * @function createFamilyMember
 * @param {Id} id
 * @param {Gender} gender
 * @param {Phenotype} [phenotype]
 * @returns {FamilyMember}
 */
const createFamilyMember = (
  id: Id,
  gender: Gender,
  phenotype: Phenotype = null,
) => {
  if (typeof id !== 'string' && typeof id !== 'number')
    throw new Error('id of FamilyMember must be unique string or number.');

  if (!gender || !genders.isValid(gender))
    throw new Error('gender of FamilyMember is invalid.');

  if (typeof phenotype !== 'boolean' && phenotype !== null) {
    throw new Error('phenotype must be either boolean or null.');
  }

  return new FamilyMember(id, gender, phenotype);
};

/**
 * @readonly
 * @property {createFamilyMember} create
 */
export default Object.freeze({
  create: createFamilyMember,
  _isInstance: (familyMember: Object) => familyMember instanceof FamilyMember,
});
