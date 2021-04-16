import { inheritances } from '../const';
import CommonDisease from './common';
import AutosomalDisease from './autosomal';
import XLinkedDisease from './x-linked';

import type { Inheritance } from '../const';

export type { Disease, Phenotype } from './common';

/**
 * @function createDisease
 * @param {string} name
 * @param {Inheritance} inheritance
 * @returns {(AutosomalDisease|XLinkedDisease)}
 */
const createDisease = (name: string, inheritance: Inheritance) => {
  if (typeof name !== 'string')
    throw new Error('name of disease must be string.');
  if (!inheritances.isValid(inheritance))
    throw new Error(`provided inheritance mode '${inheritance}' is invalid.`);
  return new (inheritances.isAutosomal(inheritance)
    ? AutosomalDisease
    : XLinkedDisease)(name, inheritance);
};

/**
 * @readonly
 * @property {createDisease} create
 */
export default Object.freeze({
  create: createDisease,
  _isInstance: (disease: Object) => disease instanceof CommonDisease,
});
