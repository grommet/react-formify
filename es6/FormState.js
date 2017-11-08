'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormState = function FormState(rules) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var onChange = arguments[2];

  _classCallCheck(this, FormState);

  _initialiseProps.call(this);

  if (!rules || typeof rules !== 'function' && !Object.keys(rules).length) {
    throw new Error('Rules is a required argument');
  }
  this.rules = rules;
  this.obj = obj;
  this.onChange = onChange;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.set = function (key, value) {
    if (typeof key === 'string') {
      (0, _utils.setValueByKey)(_this.obj, key, value);
    } else if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      _this.obj = (0, _utils.deepMerge)(_this.obj, key);
    }

    if (_this.onChange) {
      _this.onChange();
    }
  };

  this.get = function () {
    return _this.obj;
  };

  this.getErrors = function (rules, target) {
    var errors = {};
    var targetRules = rules || (typeof _this.rules === 'function' ? _this.rules(_this.obj) : _this.rules);
    var targetObject = target || _this.obj;
    Object.keys(targetRules).forEach(function (key) {
      var rule = targetRules[key];
      if (typeof rule === 'function') {
        var value = targetObject[key];
        if (Array.isArray(value)) {
          var errorsArray = [];
          value.forEach(function (v, index) {
            var message = rule(targetObject[key], index, targetObject);
            if (message) {
              errorsArray[index] = message;
            }
          });
          if (errorsArray.length) {
            errors[key] = errorsArray;
          }
        } else {
          var message = rule(targetObject[key], undefined, targetObject);
          if (message) {
            errors[key] = message;
          }
        }
      } else if ((0, _utils.isObject)(rule)) {
        var ruleErrors = _this.getErrors(rule, targetObject[key]);
        if (Object.keys(ruleErrors).length) {
          errors[key] = ruleErrors;
        }
      } else if (typeof rule === 'string' && !targetObject[key]) {
        errors[key] = rule;
      }
    });
    return errors;
  };

  this.isValid = function () {
    return !Object.keys(_this.getErrors()).length;
  };
};

exports.default = FormState;