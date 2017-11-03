'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.getValueByKey = getValueByKey;
exports.setValueByKey = setValueByKey;
function isObject(item) {
  return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
}

function getValueByKey(resource, key) {
  var group = key.split('.');
  var currentObject = resource;
  var value = void 0;
  group.forEach(function (currentKey) {
    if (!currentObject[currentKey]) {
      return false;
    }
    if (isObject(currentObject[currentKey])) {
      currentObject = currentObject[currentKey];
    } else {
      value = currentObject[currentKey];
    }
    return true;
  });
  return value;
}

function setValueByKey(resource, key, value) {
  var group = key.split('.');
  var currentObject = resource;
  group.forEach(function (currentKey, index) {
    if (!currentObject[currentKey] && index < group.length - 1) {
      currentObject[currentKey] = {};
      currentObject = currentObject[currentKey];
    } else if (isObject(currentObject[currentKey])) {
      currentObject = currentObject[currentKey];
    } else if (group.length - 1 === index) {
      currentObject[currentKey] = value;
    }
  });
}

exports.default = { isObject: isObject, getValueByKey: getValueByKey, setValueByKey: setValueByKey };