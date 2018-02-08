'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.deepMerge = deepMerge;
exports.deepCompare = deepCompare;
exports.getValueByKey = getValueByKey;
exports.setValueByKey = setValueByKey;
function isObject(item) {
  return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
}

function deepMerge(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if (!sources.length) {
    return target;
  }
  // making sure to not change target (immutable)
  var output = _extends({}, target);
  var source = sources.shift();
  if (isObject(output) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!output[key]) {
          output[key] = _extends({}, source[key]);
        } else {
          output[key] = deepMerge({}, output[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return deepMerge.apply(undefined, [output].concat(sources));
}

function deepCompare(obj1, obj2) {
  if (obj1 && obj2) {
    var diff = Object.keys(obj1).find(function (key) {
      if (obj1.hasOwnProperty(key) !== obj2.hasOwnProperty(key)) {
        return true;
      }
      switch (_typeof(obj1[key])) {
        case 'object':
          if (!deepCompare(obj1[key], obj2[key])) {
            return true;
          }
          break;
        case 'function':
          if (typeof obj2[key] === 'undefined' || obj1[key].toString() !== obj2[key].toString()) {
            return true;
          }
          break;
        default:
          if (obj1[key] !== obj2[key]) {
            return true;
          }
      }
      return false;
    });
    if (diff) {
      return false;
    }
    // check if obj2 has any props that do not exist in obj1
    diff = Object.keys(obj2).find(function (key) {
      return typeof obj1[key] === 'undefined';
    });
    if (diff) {
      return false;
    }
  }
  return obj1 === obj2;
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