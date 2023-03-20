"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

const diff = (lhs, rhs, diffableKeys, wholeDiffableKeys, parentKey) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs; // return updated rhs

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    if (!(0, _utils.hasOwnProperty)(rhs, key)) {
      acc[key] = undefined;
    }

    return acc;
  }, (0, _utils.makeObjectWithoutPrototype)());

  if ((0, _utils.isDate)(lhs) || (0, _utils.isDate)(rhs)) {
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  const isRHSACollection = Array.isArray(rhs) || rhs instanceof Set || rhs instanceof Map;
  return Object.keys(rhs).reduce((acc, key) => {
    if (!isRHSACollection && diffableKeys && !diffableKeys.has(key)) {
      return acc;
    }

    if (!(0, _utils.hasOwnProperty)(lhs, key)) {
      if (wholeDiffableKeys.has(parentKey)) {
        acc[parentKey] = rhs;
        return acc;
      }

      acc[key] = rhs[key]; // return added r key

      return acc;
    }

    const difference = diff(lhs[key], rhs[key], diffableKeys, wholeDiffableKeys, key); // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object

    if ((0, _utils.isEmptyObject)(difference) && !(0, _utils.isDate)(difference) && ((0, _utils.isEmptyObject)(lhs[key]) || !(0, _utils.isEmptyObject)(rhs[key]))) return acc; // return no diff

    if (wholeDiffableKeys.has(parentKey)) {
      acc[parentKey] = rhs;
      return acc;
    }

    acc[key] = difference; // return updated key

    return acc; // return updated key
  }, deletedValues);
};

var _default = diff;
exports.default = _default;