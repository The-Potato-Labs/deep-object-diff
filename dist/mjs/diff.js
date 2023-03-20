import { isDate, isEmptyObject, isObject, hasOwnProperty, makeObjectWithoutPrototype } from './utils.js';

const diff = (lhs, rhs, diffableKeys, wholeDiffableKeys, parentKey) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    if (!hasOwnProperty(rhs, key)) {
      acc[key] = undefined;
      
    }

    return acc;
  }, makeObjectWithoutPrototype());

  if (isDate(lhs) || isDate(rhs)) {
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  const isRHSACollection = Array.isArray(rhs) || rhs instanceof Set || rhs instanceof Map;
  return Object.keys(rhs).reduce((acc, key) => {

    if (!isRHSACollection && diffableKeys && !diffableKeys.has(key)) {
      return acc;
    }

    if (!hasOwnProperty(lhs, key)){
      if (wholeDiffableKeys.has(parentKey)) {
        acc[parentKey] = rhs;
        return acc;
      }
      acc[key] = rhs[key]; // return added r key
      return acc;
    }

    const difference = diff(lhs[key], rhs[key], diffableKeys, wholeDiffableKeys, key);

    // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
    if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key])))
      return acc; // return no diff

    if (wholeDiffableKeys.has(parentKey)) {
      acc[parentKey] = rhs;
      return acc;
    }

    acc[key] = difference // return updated key
    return acc; // return updated key
  }, deletedValues);
};

export default diff;
