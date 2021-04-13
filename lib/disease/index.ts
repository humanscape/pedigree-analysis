import { inheritances } from '../const';
import type { Inheritance } from '../const';
import AutosomalDisease from './autosomal';
import XLinkedDisease from './x-linked';

export type { Disease, Phenotype } from './common';

/**
 * @function createDisease
 * @param {string} name
 * @param {Inheritance} inheritance
 * @returns {(AutosomalDisease|XLinkedDisease)}
 */
const createDisease = (name: string, inheritance: Inheritance) => {
  if (!inheritances.isValid(inheritance))
    throw new Error(`Provided inheritance mode '${inheritance}' is invalid.`);
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
  _isInstance: (disease: Object) =>
    disease instanceof AutosomalDisease || disease instanceof XLinkedDisease,
});
