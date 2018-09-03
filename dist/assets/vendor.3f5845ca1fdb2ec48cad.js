webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(57);
var isBuffer = __webpack_require__(134);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(42)('wks');
var uid = __webpack_require__(43);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(85);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(46);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(9);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var createDesc = __webpack_require__(38);
module.exports = __webpack_require__(10) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(3);
var ctx = __webpack_require__(13);
var hide = __webpack_require__(7);
var has = __webpack_require__(16);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(22)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canonical = __webpack_require__(67);

Object.defineProperty(exports, 'canonical', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_canonical).default;
  }
});

var _convenient = __webpack_require__(68);

Object.defineProperty(exports, 'convenient', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_convenient).default;
  }
});

var _helpers = __webpack_require__(18);

Object.defineProperty(exports, 'minute', {
  enumerable: true,
  get: function get() {
    return _helpers.minute;
  }
});
Object.defineProperty(exports, 'hour', {
  enumerable: true,
  get: function get() {
    return _helpers.hour;
  }
});
Object.defineProperty(exports, 'day', {
  enumerable: true,
  get: function get() {
    return _helpers.day;
  }
});
Object.defineProperty(exports, 'month', {
  enumerable: true,
  get: function get() {
    return _helpers.month;
  }
});
Object.defineProperty(exports, 'year', {
  enumerable: true,
  get: function get() {
    return _helpers.year;
  }
});
Object.defineProperty(exports, 'getStep', {
  enumerable: true,
  get: function get() {
    return _helpers.getStep;
  }
});
Object.defineProperty(exports, 'getDate', {
  enumerable: true,
  get: function get() {
    return _helpers.getDate;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(14);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var IE8_DOM_DEFINE = __webpack_require__(90);
var toPrimitive = __webpack_require__(91);
var dP = Object.defineProperty;

exports.f = __webpack_require__(10) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStep = getStep;
exports.getDate = getDate;
var minute = exports.minute = 60; // in seconds

var hour = exports.hour = 60 * minute; // in seconds

var day = exports.day = 24 * hour; // in seconds

// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
var month = exports.month = 30.44 * day; // in seconds

// "400 years have 146097 days (taking into account leap year rules)"
var year = exports.year = 146097 / 400 * day; // in seconds

/**
 * Returns a step of gradation corresponding to the unit.
 * @param  {Object[]} gradation
 * @param  {string} unit
 * @return {?Object}
 */
function getStep(gradation, unit) {
  for (var _iterator = gradation, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var step = _ref;

    if (step.unit === unit) {
      return step;
    }
  }
}

/**
 * Converts value to a `Date`
 * @param {(number|Date)} value
 * @return {Date}
 */
function getDate(value) {
  return value instanceof Date ? value : new Date(value);
}
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = choose_locale;
exports.intlDateTimeFormatSupportedLocale = intlDateTimeFormatSupportedLocale;
exports.intlDateTimeFormatSupported = intlDateTimeFormatSupported;
// Chooses the most appropriate locale
// (one of the registered ones)
// based on the list of preferred `locales` supplied by the user.
//
// @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
// @param {Object} registered_locales - a map of available locales.
//
// @returns {string} The most suitable locale
//
// @example
// // Returns 'en'
// choose_locale(['en-US'], undefined, { 'ru', 'en' })
//
function choose_locale(locales, registered_locales) {
	// This is not an intelligent algorythm,
	// but it will do for this library's case.
	// `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
	for (var _iterator = locales, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var locale = _ref;

		if (registered_locales[locale]) {
			return locale;
		}

		var parts = locale.split('-');
		while (parts.length > 1) {
			parts.pop();
			locale = parts.join('-');
			if (registered_locales[locale]) {
				return locale;
			}
		}
	}

	throw new Error('No locale data has been registered for any of the locales: ' + locales.join(', '));
}

/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that can be used.
 */
function intlDateTimeFormatSupportedLocale(locales) {
	/* istanbul ignore else */
	if (intlDateTimeFormatSupported()) {
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0];
	}
}
/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */
function intlDateTimeFormatSupported() {
	// Babel transforms `typeof` into some "branches"
	// so istanbul will show this as "branch not covered".
	/* istanbul ignore next */
	var is_intl_available = (typeof Intl === 'undefined' ? 'undefined' : _typeof(Intl)) === 'object';

	return is_intl_available && typeof Intl.DateTimeFormat === 'function';
}
//# sourceMappingURL=locale.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports) {

function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var query = __webpack_require__(20);
} catch (err) {
  var query = __webpack_require__(20);
}

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(9);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(40);
var defined = __webpack_require__(25);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(42)('keys');
var uid = __webpack_require__(43);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(15).f;
var has = __webpack_require__(16);
var TAG = __webpack_require__(2)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(14);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o, visited) {
			var type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = {};
					visited[_.util.objId(o)] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = [];
					visited[_.util.objId(o)] = clone;

					o.forEach(function (v, i) {
						clone[i] = _.util.clone(v, visited);
					});

					return clone;
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		greedy: true,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: null // See below
				}
			},
			'string': /[\s\S]+/
		}
	}
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism.languages.javascript;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

Prism.languages.markdown = Prism.languages.extend('markup', {});
Prism.languages.insertBefore('markdown', 'prolog', {
	'blockquote': {
		// > ...
		pattern: /^>(?:[\t ]*>)*/m,
		alias: 'punctuation'
	},
	'code': [
		{
			// Prefixed by 4 spaces or 1 tab
			pattern: /^(?: {4}|\t).+/m,
			alias: 'keyword'
		},
		{
			// `code`
			// ``code``
			pattern: /``.+?``|`[^`\n]+`/,
			alias: 'keyword'
		}
	],
	'title': [
		{
			// title 1
			// =======

			// title 2
			// -------
			pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
			alias: 'important',
			inside: {
				punctuation: /==+$|--+$/
			}
		},
		{
			// # title 1
			// ###### title 6
			pattern: /(^\s*)#+.+/m,
			lookbehind: true,
			alias: 'important',
			inside: {
				punctuation: /^#+|#+$/
			}
		}
	],
	'hr': {
		// ***
		// ---
		// * * *
		// -----------
		pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
		lookbehind: true,
		alias: 'punctuation'
	},
	'list': {
		// * item
		// + item
		// - item
		// 1. item
		pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
		lookbehind: true,
		alias: 'punctuation'
	},
	'url-reference': {
		// [id]: http://example.com "Optional title"
		// [id]: http://example.com 'Optional title'
		// [id]: http://example.com (Optional title)
		// [id]: <http://example.com> "Optional title"
		pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
		inside: {
			'variable': {
				pattern: /^(!?\[)[^\]]+/,
				lookbehind: true
			},
			'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
			'punctuation': /^[\[\]!:]|[<>]/
		},
		alias: 'url'
	},
	'bold': {
		// **strong**
		// __strong__

		// Allow only one line break
		pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: true,
		inside: {
			'punctuation': /^\*\*|^__|\*\*$|__$/
		}
	},
	'italic': {
		// *em*
		// _em_

		// Allow only one line break
		pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: true,
		inside: {
			'punctuation': /^[*_]|[*_]$/
		}
	},
	'url': {
		// [example](http://example.com "Optional title")
		// [example] [id]
		pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
		inside: {
			'variable': {
				pattern: /(!?\[)[^\]]+(?=\]$)/,
				lookbehind: true
			},
			'string': {
				pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
			}
		}
	}
});

Prism.languages.markdown['bold'].inside['url'] = Prism.languages.markdown['url'];
Prism.languages.markdown['italic'].inside['url'] = Prism.languages.markdown['url'];
Prism.languages.markdown['bold'].inside['italic'] = Prism.languages.markdown['italic'];
Prism.languages.markdown['italic'].inside['bold'] = Prism.languages.markdown['bold'];

/***/ }),
/* 33 */,
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(1);
var normalizeHeaderName = __webpack_require__(137);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(58);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(58);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(136)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _grade = __webpack_require__(66);

var _grade2 = _interopRequireDefault(_grade);

var _locale = __webpack_require__(19);

var _locale2 = _interopRequireDefault(_locale);

var _style = __webpack_require__(69);

var _RelativeTimeFormat = __webpack_require__(36);

var _RelativeTimeFormat2 = _interopRequireDefault(_RelativeTimeFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JavascriptTimeAgo = function () {

	/**
  * @param {(string|string[])} locales=[] - Preferred locales (or locale).
  */

	// Fallback locale
	// (when not a single supplied preferred locale is available)
	function JavascriptTimeAgo() {
		var locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, JavascriptTimeAgo);

		// Convert `locales` to an array.
		if (typeof locales === 'string') {
			locales = [locales];
		}

		// Choose the most appropriate locale
		// (one of the previously added ones)
		// based on the list of preferred `locales` supplied by the user.
		this.locale = (0, _locale2.default)(locales.concat(JavascriptTimeAgo.default_locale), JavascriptTimeAgo.locales);
	}

	// Formats the relative date/time.
	//
	// @return {string} Returns the formatted relative date/time.
	//
	// @param {(Object|string)} [style] - Relative date/time formatting style.
	//
	// @param {string[]} [style.units] - A list of allowed time units
	//                                  (e.g. ['second', 'minute', 'hour', …])
	//
	// @param {Function} [style.custom] - `function ({ elapsed, time, date, now })`.
	//                                    If this function returns a value, then
	//                                    the `.format()` call will return that value.
	//                                    Otherwise it has no effect.
	//
	// @param {string} [style.flavour] - e.g. "long", "short", "tiny", etc.
	//
	// @param {Object[]} [style.gradation] - Time scale gradation steps.
	//
	// @param {string} style.gradation[].unit - Time interval measurement unit.
	//                                          (e.g. ['second', 'minute', 'hour', …])
	//
	// @param {Number} style.gradation[].factor - Time interval measurement unit factor.
	//                                            (e.g. `60` for 'minute')
	//
	// @param {Number} [style.gradation[].granularity] - A step for the unit's "amount" value.
	//                                                   (e.g. `5` for '0 minutes', '5 minutes', etc)
	//
	// @param {Number} [style.gradation[].threshold] - Time interval measurement unit threshold.
	//                                                 (e.g. `45` seconds for 'minute').
	//                                                 There can also be specific `threshold_[unit]`
	//                                                 thresholds for fine-tuning.
	//


	// For all configured locales
	// their relative time formatter messages will be stored here


	_createClass(JavascriptTimeAgo, [{
		key: 'format',
		value: function format(input) {
			var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _style.defaultStyle;

			if (typeof style === 'string') {
				switch (style) {
					case 'twitter':
						style = _style.twitterStyle;
						break;
					case 'time':
						style = _style.timeStyle;
						break;
					default:
						style = _style.defaultStyle;
				}
			}

			var _get_date_and_time_be = get_date_and_time_being_formatted(input),
			    date = _get_date_and_time_be.date,
			    time = _get_date_and_time_be.time;

			// Get locale messages for this formatting flavour


			var _get_locale_data = this.get_locale_data(style.flavour),
			    flavour = _get_locale_data.flavour,
			    locale_data = _get_locale_data.locale_data;

			// Can pass a custom `now`, e.g. for testing purposes.
			// Technically it doesn't belong to `style`
			// but since this is an undocumented internal feature,
			// taking it from the `style` argument will do (for now).


			var now = style.now || Date.now();

			// how much time elapsed (in seconds)
			var elapsed = (now - time) / 1000; // in seconds

			// `custom` – A function of `{ elapsed, time, date, now, locale }`.
			// If this function returns a value, then the `.format()` call will return that value.
			// Otherwise the relative date/time is formatted as usual.
			// This feature is currently not used anywhere and is here
			// just for providing the ultimate customization point
			// in case anyone would ever need that. Prefer using
			// `gradation[step].format(value, locale)` instead.
			//
			// I guess `custom` is deprecated and will be removed
			// in some future major version release.
			//
			if (style.custom) {
				var custom = style.custom({
					now: now,
					date: date,
					time: time,
					elapsed: elapsed,
					locale: this.locale
				});

				if (custom !== undefined) {
					return custom;
				}
			}

			// Available time interval measurement units.
			var units = get_time_interval_measurement_units(locale_data, style.units);

			// If no available time unit is suitable, just output an empty string.
			if (units.length === 0) {
				console.error('Units "' + units.join(', ') + '" were not found in locale data for "' + this.locale + '".');
				return '';
			}

			// Choose the appropriate time measurement unit
			// and get the corresponding rounded time amount.
			var step = (0, _grade2.default)(Math.abs(elapsed), now, units, style.gradation);

			// If no time unit is suitable, just output an empty string.
			// E.g. when "now" unit is not available
			// and "second" has a threshold of `0.5`
			// (e.g. the "canonical" grading scale).
			if (!step) {
				return '';
			}

			if (step.format) {
				return step.format(date || time, this.locale);
			}

			var unit = step.unit,
			    factor = step.factor,
			    granularity = step.granularity;


			var amount = Math.abs(elapsed) / factor;

			// Apply granularity to the time amount
			// (and fallback to the previous step
			//  if the first level of granularity
			//  isn't met by this amount)
			if (granularity) {
				// Recalculate the elapsed time amount based on granularity
				amount = Math.round(amount / granularity) * granularity;
			}

			// Format the time elapsed.
			// Using `Intl.RelativeTimeFormat` proposal polyfill.
			//
			// TODO: Should cache `Intl.RelativeTimeFormat` instances
			// for given `this.locale` and `flavour`.
			//
			// ```js
			// import Cache from './cache'
			// const cache = new Cache()
			// const formatter = this.cache.get(this.locale, flavour) ||
			//   this.cache.put(this.locale, flavour, new Intl.RelativeTimeFormat(...))
			// return formatter.format(...)
			// ```
			//
			return new _RelativeTimeFormat2.default(this.locale, { style: flavour }).format(-1 * Math.sign(elapsed) * Math.round(amount), unit);
		}

		/**
   * Gets locale messages for this formatting flavour
   *
   * @param {(string|string[])} flavour - Relative date/time formatting flavour.
   *                                      If it's an array then all flavours are tried in order.
   *
   * @returns {Object} Returns an object of shape { flavour, locale_data }
   */

	}, {
		key: 'get_locale_data',
		value: function get_locale_data() {
			var flavour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			// Get relative time formatting rules for this locale
			var locale_data = JavascriptTimeAgo.locales[this.locale];

			// Convert `flavour` to an array.
			if (typeof flavour === 'string') {
				flavour = [flavour];
			}

			// "long" flavour is the default one.
			// (it's always present)
			flavour = flavour.concat('long');

			// Find a suitable flavour.
			for (var _iterator = flavour, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var _ = _ref;

				if (locale_data[_]) {
					return {
						flavour: _,
						locale_data: locale_data[_]
					};
				}
			}

			// Can't happen - "long" flavour is always present.
			// throw new Error(`None of the flavours - ${flavour.join(', ')} - was found for locale "${this.locale}".`)
		}
	}]);

	return JavascriptTimeAgo;
}();

/**
 * Sets default locale.
 * @param  {string} locale
 */


JavascriptTimeAgo.default_locale = 'en';
JavascriptTimeAgo.locales = {};
exports.default = JavascriptTimeAgo;
JavascriptTimeAgo.setDefaultLocale = function (locale) {
	JavascriptTimeAgo.default_locale = locale;
};

/**
 * Adds locale data for a specific locale.
 * @param {Object} locale_data
 */
JavascriptTimeAgo.locale = function (locale_data) {
	if (!locale_data) {
		throw new Error('[javascript-time-ago] Invalid locale data passed.');
	}
	// This locale data is stored in a global variable
	// and later used when calling `.format(time)`.
	JavascriptTimeAgo.locales[locale_data.locale] = locale_data;
};

// Normalizes `.format()` `time` argument.
function get_date_and_time_being_formatted(input) {
	if (input.constructor === Date) {
		return {
			date: input,
			time: input.getTime()
		};
	}

	if (typeof input === 'number') {
		return {
			time: input
			// `date` is not required for formatting
			// relative times unless "twitter" preset is used.
			// date : new Date(input)
		};
	}

	// For some weird reason istanbul doesn't see this `throw` covered.
	/* istanbul ignore next */
	throw new Error('Unsupported relative time formatter input: ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + ', ' + input);
}

// Get available time interval measurement units.
function get_time_interval_measurement_units(locale_data, restricted_set_of_units) {
	// All available time interval measurement units.
	var units = Object.keys(locale_data);

	// If only a specific set of available
	// time measurement units can be used.
	if (restricted_set_of_units) {
		// Reduce available time interval measurement units
		// based on user's preferences.
		return restricted_set_of_units.filter(function (_) {
			return units.indexOf(_) >= 0;
		});
	}

	return units;
}
//# sourceMappingURL=JavascriptTimeAgo.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.loadLocale = loadLocale;

var _JavascriptTimeAgo = __webpack_require__(35);

var _JavascriptTimeAgo2 = _interopRequireDefault(_JavascriptTimeAgo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Polyfill for `Intl.RelativeTimeFormat` proposal.
 * https://github.com/tc39/proposal-intl-relative-time
 * https://github.com/tc39/proposal-intl-relative-time/issues/55
 */
var RelativeTimeFormat = function () {
  /**
   * @param {(string|string[])} [locales] - Preferred locales (or locale).
   * @param {Object} [options] - Formatting options.
   * @param {string} [options.style="long"] - One of: "long", "short", "narrow".
   * @param {string} [options.type="numeric"] - One of: "numeric", "text".
   * @param {string} [options.localeMatcher="best fit"] - One of: "lookup", "best fit".
   */
  function RelativeTimeFormat(locales) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RelativeTimeFormat);

    var style = options.style;

    this.style = style || 'long';

    // Choose the most appropriate locale.
    // This could implement some kind of a "best-fit" algorythm.
    if (locales) {
      this.locale = RelativeTimeFormat.supportedLocalesOf(locales)[0];
    }
    this.locale = this.locale ? resolveLocale(this.locale) : getDefaultLocale();
  }

  /**
   * Formats time `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
   * @example
   * // Returns "2 days ago"
   * rtf.format(-2, "day")
   * // Returns "in 5 minutes"
   * rtf.format(5, "minute")
   */


  _createClass(RelativeTimeFormat, [{
    key: 'format',
    value: function format(value, unit) {
      return this.getRule(value, unit).replace('{0}', Math.abs(value));
    }

    /**
     * Formats time `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {Object[]} The parts (`{ type, value }`).
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Returns [
     * //   { type: "literal", value: "in "},
     * //   { type: "day", value: "100"},
     * //   { type: "literal", value: " days"}
     * // ]
     * rtf.formatToParts(100, "day")
     */

  }, {
    key: 'formatToParts',
    value: function formatToParts(value, unit) {
      var rule = this.getRule(value, unit);
      var valueIndex = rule.indexOf("{0}");
      var parts = [];
      if (valueIndex > 0) {
        parts.push({
          type: "literal",
          value: rule.slice(0, valueIndex)
        });
      }
      parts.push({
        type: unit,
        value: String(Math.abs(value))
      });
      if (valueIndex + "{0}".length < rule.length - 1) {
        parts.push({
          type: "literal",
          value: rule.slice(valueIndex + "{0}".length)
        });
      }
      return parts;
    }

    /**
     * Returns formatting rule for `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {string}
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Returns "{0} days ago"
     * getRule(-2, "day")
     */

  }, {
    key: 'getRule',
    value: function getRule(value, unit) {
      // "now" is used in `javascript-time-ago`.
      if (["now", "second", "minute", "hour", "day", "week", "month", "quarter", "year"].indexOf(unit) < 0) {
        throw new RangeError('Unknown time unit: ' + unit + '.');
      }
      // Get locale-specific time interval formatting rules
      // of a given `style` for the given value of measurement `unit`.
      //
      // E.g.:
      //
      // ```json
      // {
      //  "past": {
      //    "one": "a second ago",
      //    "other": "{0} seconds ago"
      //  },
      //  "future": {
      //    "one": "in a second",
      //    "other": "in {0} seconds"
      //  }
      // }
      // ```
      //
      var unitRules = getLocales()[this.locale][this.style][unit];
      if (typeof unitRules === "string") {
        return unitRules;
      }
      // Choose either "past" or "future" based on time `value` sign.
      // If "past" is same as "future" then they're stored as "other".
      // If there's only "other" then it's being collapsed.
      var quantifierRules = unitRules[value <= 0 ? "past" : "future"] || unitRules;
      if (typeof quantifierRules === "string") {
        return quantifierRules;
      }
      // Quantify `value`.
      var quantify = getLocales()[this.locale].quantify;
      var quantifier = quantify && quantify(Math.abs(value));
      // There seems to be no such locale in CLDR
      // for which `quantify` is missing
      // and still `past` and `future` messages
      // contain something other than "other".
      /* istanbul ignore next */
      quantifier = quantifier || 'other';
      // "other" rule is supposed to always be present.
      // If only "other" rule is present then "rules" is not an object and is a string.
      return quantifierRules[quantifier] || quantifierRules.other;
    }

    /**
     * Returns a new object with properties reflecting the locale and date and time formatting options computed during initialization of this DateTimeFormat object.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions
     * @return {Object}
     */

  }, {
    key: 'resolvedOptions',
    value: function resolvedOptions() {
      return {
        locale: this.locale
      };
    }
  }]);

  return RelativeTimeFormat;
}();

/**
 * Returns an array containing those of the provided locales
 * that are supported in collation without having to fall back
 * to the runtime's default locale.
 * @param {(string|string[])} locale - A string with a BCP 47 language tag, or an array of such strings. For the general form of the locales argument, see the Intl page.
 * @param {Object} [options] - An object that may have the following property:
 * @param {Function} [options.localeMatcher] - The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". For information about this option, see the Intl page.
 * @return {string[]} An array of strings representing a subset of the given locale tags that are supported in collation without having to fall back to the runtime's default locale.
 * @example
 * var locales = ['ban', 'id-u-co-pinyin', 'de-ID'];
 * var options = { localeMatcher: 'lookup' };
 * console.log(Intl.RelativeTimeFormat.supportedLocalesOf(locales, options).join(', '));
 * // → "id-u-co-pinyin, de-ID"
 */


exports.default = RelativeTimeFormat;
RelativeTimeFormat.supportedLocalesOf = function (locales, options) {
  // Convert `locales` to an array.
  if (typeof locales === 'string') {
    locales = [locales];
  }
  // This is not an intelligent algorythm,
  // but it will do for the polyfill purposes.
  // This could implement some kind of a "best-fit" algorythm.
  return locales.filter(resolveLocale);
};

/**
 * Resolves a locale to a supported one.
 * @param  {string} locale
 * @return {string}
 */
function resolveLocale(locale) {
  if (getLocales()[locale]) {
    return locale;
  }
  // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
  var parts = locale.split('-');
  while (locale.length > 1) {
    parts.pop();
    locale = parts.join('-');
    if (getLocales()[locale]) {
      return locale;
    }
  }
}

function loadLocale(locale) {
  _JavascriptTimeAgo2.default.locale(locale);
}

function getLocales() {
  return _JavascriptTimeAgo2.default.locales;
}

function getDefaultLocale() {
  return _JavascriptTimeAgo2.default.default_locale;
}

/**
 * Extracts language from an IETF BCP 47 language tag.
 * @param {string} languageTag - IETF BCP 47 language tag.
 * @return {string}
 * @example
 * // Returns "he"
 * getLanguageFromLanguageTag("he-IL-u-ca-hebrew-tz-jeruslm")
 * // Returns "ar"
 * getLanguageFromLanguageTag("ar-u-nu-latn")
 */
// export function getLanguageFromLanguageTag(languageTag) {
//   const hyphenIndex = languageTag.indexOf('-')
//   if (hyphenIndex > 0) {
//     return languageTag.slice(0, hyphenIndex)
//   }
//   return languageTag
// }
//# sourceMappingURL=RelativeTimeFormat.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(93);
var enumBugKeys = __webpack_require__(44);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(17);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(28) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 43 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(25);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(98), __esModule: true };

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(28);
var $export = __webpack_require__(8);
var redefine = __webpack_require__(102);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(11);
var $iterCreate = __webpack_require__(103);
var setToStringTag = __webpack_require__(29);
var getPrototypeOf = __webpack_require__(106);
var ITERATOR = __webpack_require__(2)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(17);
var TAG = __webpack_require__(2)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(6);
var aFunction = __webpack_require__(14);
var SPECIES = __webpack_require__(2)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(13);
var invoke = __webpack_require__(117);
var html = __webpack_require__(48);
var cel = __webpack_require__(23);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(17)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var isObject = __webpack_require__(9);
var newPromiseCapability = __webpack_require__(30);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

(function(Prism) {
	var insideString = {
		variable: [
			// Arithmetic Environment
			{
				pattern: /\$?\(\([\s\S]+?\)\)/,
				inside: {
					// If there is a $ sign at the beginning highlight $(( and )) as variable
					variable: [{
							pattern: /(^\$\(\([\s\S]+)\)\)/,
							lookbehind: true
						},
						/^\$\(\(/
					],
					number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
					// Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
					operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
					// If there is no $ sign at the beginning highlight (( and )) as punctuation
					punctuation: /\(\(?|\)\)?|,|;/
				}
			},
			// Command Substitution
			{
				pattern: /\$\([^)]+\)|`[^`]+`/,
				greedy: true,
				inside: {
					variable: /^\$\(|^`|\)$|`$/
				}
			},
			/\$(?:[\w#?*!@]+|\{[^}]+\})/i
		]
	};

	Prism.languages.bash = {
		'shebang': {
			pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
			alias: 'important'
		},
		'comment': {
			pattern: /(^|[^"{\\])#.*/,
			lookbehind: true
		},
		'string': [
			//Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
			{
				pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
				lookbehind: true,
				greedy: true,
				inside: insideString
			},
			{
				pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
				greedy: true,
				inside: insideString
			}
		],
		'variable': insideString.variable,
		// Originally based on http://ss64.com/bash/
		'function': {
			pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/,
			lookbehind: true
		},
		'keyword': {
			pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
			lookbehind: true
		},
		'boolean': {
			pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
			lookbehind: true
		},
		'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
		'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
	};

	var inside = insideString.variable[1].inside;
	inside.string = Prism.languages.bash.string;
	inside['function'] = Prism.languages.bash['function'];
	inside.keyword = Prism.languages.bash.keyword;
	inside['boolean'] = Prism.languages.bash['boolean'];
	inside.operator = Prism.languages.bash.operator;
	inside.punctuation = Prism.languages.bash.punctuation;
	
	Prism.languages.shell = Prism.languages.bash;
})(Prism);


/***/ }),
/* 55 */
/***/ (function(module, exports) {

Prism.languages.scss = Prism.languages.extend('css', {
	'comment': {
		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
		lookbehind: true
	},
	'atrule': {
		pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	// url, compassified
	'url': /(?:[-a-z]+-)*url(?=\()/i,
	// CSS selector regex is not appropriate for Sass
	// since there can be lot more things (var, @ directive, nesting..)
	// a selector must start at the end of a property or after a brace (end of other rules or nesting)
	// it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
	// the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
	// can "pass" as a selector- e.g: proper#{$erty})
	// this one was hard to do, so please be careful if you edit this one :)
	'selector': {
		// Initial look-ahead is used to prevent matching of blank selectors
		pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|&|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
		inside: {
			'parent': {
				pattern: /&/,
				alias: 'important'
			},
			'placeholder': /%[-\w]+/,
			'variable': /\$[-\w]+|#\{\$[-\w]+\}/
		}
	}
});

Prism.languages.insertBefore('scss', 'atrule', {
	'keyword': [
		/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
		{
			pattern: /( +)(?:from|through)(?= )/,
			lookbehind: true
		}
	]
});

Prism.languages.scss.property = {
	pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/i,
	inside: {
		'variable': /\$[-\w]+|#\{\$[-\w]+\}/
	}
};

Prism.languages.insertBefore('scss', 'important', {
	// var and interpolated vars
	'variable': /\$[-\w]+|#\{\$[-\w]+\}/
});

Prism.languages.insertBefore('scss', 'function', {
	'placeholder': {
		pattern: /%[-\w]+/,
		alias: 'selector'
	},
	'statement': {
		pattern: /\B!(?:default|optional)\b/i,
		alias: 'keyword'
	},
	'boolean': /\b(?:true|false)\b/,
	'null': /\bnull\b/,
	'operator': {
		pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
		lookbehind: true
	}
});

Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;

/***/ }),
/* 56 */
/***/ (function(module, exports) {

Prism.languages.json = {
	'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
	'string': {
		pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		greedy: true
	},
	'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	'punctuation': /[{}[\]);,]/,
	'operator': /:/g,
	'boolean': /\b(?:true|false)\b/i,
	'null': /\bnull\b/i
};

Prism.languages.jsonp = Prism.languages.json;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);
var settle = __webpack_require__(138);
var buildURL = __webpack_require__(140);
var parseHeaders = __webpack_require__(141);
var isURLSameOrigin = __webpack_require__(142);
var createError = __webpack_require__(59);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(143);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ('production' !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(144);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(139);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 62 */,
/* 63 */,
/* 64 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_JavascriptTimeAgo__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_JavascriptTimeAgo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__modules_JavascriptTimeAgo__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__modules_JavascriptTimeAgo___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_locale__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_locale___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__modules_locale__);
/* unused harmony reexport intlDateTimeFormatSupported */
/* unused harmony reexport intlDateTimeFormatSupportedLocale */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_RelativeTimeFormat__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_RelativeTimeFormat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__modules_RelativeTimeFormat__);
/* unused harmony reexport RelativeTimeFormat */






/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = grade;

var _gradation = __webpack_require__(12);

/**
 * Takes seconds `elapsed` and measures them against
 * `gradation` to return the suitable `gradation` step.
 *
 * @param {number} elapsed - Time interval (in seconds)
 *
 * @param {string[]} units - A list of allowed time units
 *                           (e.g. ['second', 'minute', 'hour', …])
 *
 * @param {Object} [gradation] - Time scale gradation steps.
 *
 *                               E.g.:
 *                               [
 *                                 { unit: 'second', factor: 1 },
 *                                 { unit: 'minute', factor: 60, threshold: 60 },
 *                                 { format(), threshold: 24 * 60 * 60 },
 *                                 …
 *                               ]
 *
 * @return {?Object} `gradation` step.
 */
function grade(elapsed, now, units) {
	var gradation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _gradation.convenient;

	// Leave only allowed time measurement units.
	// E.g. omit "quarter" unit.
	gradation = get_allowed_steps(gradation, units);

	// If no steps of gradation fit the conditions
	// then return nothing.
	if (gradation.length === 0) {
		return;
	}

	// Find the most appropriate gradation step
	var i = find_gradation_step(elapsed, now, gradation);
	var step = gradation[i];

	// If time elapsed is too small and even
	// the first gradation step doesn't suit it
	// then return nothing.
	if (i === -1) {
		return;
	}

	// Apply granularity to the time amount
	// (and fall back to the previous step
	//  if the first level of granularity
	//  isn't met by this amount)
	if (step.granularity) {
		// Recalculate the elapsed time amount based on granularity
		var amount = Math.round(elapsed / step.factor / step.granularity) * step.granularity;

		// If the granularity for this step
		// is too high, then fallback
		// to the previous step of gradation.
		// (if there is any previous step of gradation)
		if (amount === 0 && i > 0) {
			return gradation[i - 1];
		}
	}

	return step;
}

/**
 * Gets threshold for moving from `from_step` to `next_step`.
 * @param  {Object} from_step - From step.
 * @param  {Object} next_step - To step.
 * @param  {number} now - The current timestamp.
 * @return {number}
 * @throws Will throw if no threshold is found.
 */
function get_threshold(from_step, to_step, now) {
	var threshold = void 0;

	// Allows custom thresholds when moving
	// from a specific step to a specific step.
	if (from_step && (from_step.id || from_step.unit)) {
		threshold = to_step['threshold_for_' + (from_step.id || from_step.unit)];
	}

	// If no custom threshold is set for this transition
	// then use the usual threshold for the next step.
	if (threshold === undefined) {
		threshold = to_step.threshold;
	}

	// Convert threshold to a number.
	if (typeof threshold === 'function') {
		threshold = threshold(now);
	}

	// Throw if no threshold is found.
	if (from_step && typeof threshold !== 'number') {
		// Babel transforms `typeof` into some "branches"
		// so istanbul will show this as "branch not covered".
		/* istanbul ignore next */
		var type = typeof threshold === 'undefined' ? 'undefined' : _typeof(threshold);
		throw new Error('Each step of a gradation must have a threshold defined except for the first one. Got "' + threshold + '", ' + type + '. Step: ' + JSON.stringify(to_step));
	}

	return threshold;
}

/**
 * @param  {number} elapsed - Time elapsed (in seconds).
 * @param  {number} now - Current timestamp.
 * @param  {Object} gradation - Gradation.
 * @param  {number} i - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */
function find_gradation_step(elapsed, now, gradation) {
	var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	// If the threshold for moving from previous step
	// to this step is too high then return the previous step.
	if (elapsed < get_threshold(gradation[i - 1], gradation[i], now)) {
		return i - 1;
	}

	// If it's the last step of gradation then return it.
	if (i === gradation.length - 1) {
		return i;
	}

	// Move to the next step.
	return find_gradation_step(elapsed, now, gradation, i + 1);
}

/**
 * Leaves only allowed gradation steps.
 * @param  {Object[]} gradation
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */
function get_allowed_steps(gradation, units) {
	return gradation.filter(function (_ref) {
		var unit = _ref.unit;

		// If this step has a `unit` defined
		// then this `unit` must be in the list of `units` allowed.
		if (unit) {
			return units.indexOf(unit) >= 0;
		}

		// A gradation step is not required to specify a `unit`.
		// E.g. for Twitter gradation it specifies `format()` instead.
		return true;
	});
}
//# sourceMappingURL=grade.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = __webpack_require__(18);

// just now
// 1 second ago
// 2 seconds ago
// …
// 59 seconds ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 7 days ago
// 1 week ago
// 2 weeks ago
// …
// 3 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
exports.default = [{
	factor: 1,
	unit: 'now'
}, {
	threshold: 0.5,
	factor: 1,
	unit: 'second'
}, {
	threshold: 59.5,
	factor: 60,
	unit: 'minute'
}, {
	threshold: 59.5 * 60,
	factor: 60 * 60,
	unit: 'hour'
}, {
	threshold: 23.5 * 60 * 60,
	factor: _helpers.day,
	unit: 'day'
}, {
	threshold: 6.5 * _helpers.day,
	factor: 7 * _helpers.day,
	unit: 'week'
}, {
	threshold: 3.5 * 7 * _helpers.day,
	factor: _helpers.month,
	unit: 'month'
}, {
	threshold: 11.5 * _helpers.month,
	factor: _helpers.year,
	unit: 'year'
}];
//# sourceMappingURL=canonical.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = __webpack_require__(18);

// just now
// 1 minute ago
// 2 minutes ago
// 5 minutes ago
// 10 minutes ago
// 15 minutes ago
// 20 minutes ago
// an hour ago
// 2 hours ago
// …
// 20 hours ago
// a day ago
// 2 days ago
// 5 days ago
// a week ago
// 2 weeks ago
// 3 weeks ago
// a month ago
// 2 months ago
// 4 months ago
// a year ago
// 2 years ago
// …
exports.default = [{
	factor: 1,
	unit: 'now'
}, {
	threshold: 1,
	threshold_for_now: 45,
	factor: 1,
	unit: 'second'
}, {
	threshold: 45,
	factor: 60,
	unit: 'minute'
}, {
	threshold: 2.5 * 60,
	factor: 60,
	granularity: 5,
	unit: 'minute'
}, {
	threshold: 22.5 * 60,
	factor: 30 * 60,
	unit: 'half-hour'
}, {
	threshold: 42.5 * 60,
	threshold_for_minute: 52.5 * 60,
	factor: 60 * 60,
	unit: 'hour'
}, {
	threshold: 20.5 / 24 * _helpers.day,
	factor: _helpers.day,
	unit: 'day'
}, {
	threshold: 5.5 * _helpers.day,
	factor: 7 * _helpers.day,
	unit: 'week'
}, {
	threshold: 3.5 * 7 * _helpers.day,
	factor: _helpers.month,
	unit: 'month'
}, {
	threshold: 10.5 * _helpers.month,
	factor: _helpers.year,
	unit: 'year'
}];
//# sourceMappingURL=convenient.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _time = __webpack_require__(70);

Object.defineProperty(exports, 'timeStyle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_time).default;
  }
});

var _twitter = __webpack_require__(71);

Object.defineProperty(exports, 'twitterStyle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_twitter).default;
  }
});

var _default = __webpack_require__(72);

Object.defineProperty(exports, 'defaultStyle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_default).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _gradation = __webpack_require__(12);

// Similar to the default style but with "ago" omitted.
//
// just now
// 5 minutes
// 10 minutes
// 15 minutes
// 20 minutes
// an hour
// 2 hours
// …
// 20 hours
// 1 day
// 2 days
// a week
// 2 weeks
// 3 weeks
// a month
// 2 months
// 3 months
// 4 months
// a year
// 2 years
//
exports.default = {
	gradation: _gradation.convenient,
	flavour: 'long_time',
	units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
//# sourceMappingURL=time.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gradation = __webpack_require__(12);

var _locale = __webpack_require__(19);

// A cache for `Intl.DateTimeFormat` twitter formatters
// for various locales (is a global variable).
var formatters = {};

// Twitter style relative time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
// Seconds, minutes and hours are shown relatively,
// and other intervals can be shown using full date format.
exports.default = {
	// Twitter gradation is derived from "canonical" gradation
	// adjusting its "minute" `threshold` to be 45.
	gradation: [
	// Minutes
	_extends({}, (0, _gradation.getStep)(_gradation.canonical, 'minute'), {
		threshold: 45
	}),
	// Hours
	(0, _gradation.getStep)(_gradation.canonical, 'hour'),
	// If `date` and `now` happened the same year,
	// then only output month and day.
	{
		threshold: _gradation.day - 0.5 * _gradation.hour,
		format: function format(value, locale) {
			// Whether can use `Intl.DateTimeFormat`.
			// If `Intl` is not available,
			// or the locale is not supported,
			// then don't override the default labels.
			/* istanbul ignore if */
			if (!(0, _locale.intlDateTimeFormatSupported)()) {
				return;
			}

			/* istanbul ignore else */
			if (!formatters[locale]) {
				formatters[locale] = {};
			}

			/* istanbul ignore else */
			if (!formatters[locale].this_year) {
				// "Apr 11" (MMMd)
				formatters[locale].this_year = new Intl.DateTimeFormat(locale, {
					month: 'short',
					day: 'numeric'
				});
			}

			// Output month and day.
			return formatters[locale].this_year.format((0, _gradation.getDate)(value));
		}
	},
	// If `date` and `now` happened in defferent years,
	// then output day, month and year.
	{
		threshold: function threshold(now) {
			// Jan 1st of the next year.
			var next_year = new Date(new Date(now).getFullYear() + 1, 0);
			return (next_year.getTime() - now) / 1000;
		},
		format: function format(value, locale) {
			// Whether can use `Intl.DateTimeFormat`.
			// If `Intl` is not available,
			// or the locale is not supported,
			// then don't override the default labels.
			/* istanbul ignore if */
			if (!(0, _locale.intlDateTimeFormatSupported)()) {
				return;
			}

			/* istanbul ignore if */
			if (!formatters[locale]) {
				formatters[locale] = {};
			}

			/* istanbul ignore else */
			if (!formatters[locale].other) {
				// "Apr 11, 2017" (yMMMd)
				formatters[locale].other = new Intl.DateTimeFormat(locale, {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
			}

			// Output day, month and year.
			return formatters[locale].other.format((0, _gradation.getDate)(value));
		}
	}],

	flavour: ['tiny', 'short_time', 'narrow', 'short']
};
//# sourceMappingURL=twitter.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _gradation = __webpack_require__(12);

exports.default = {
	gradation: _gradation.convenient,
	flavour: ['long_convenient', 'long'],
	units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
//# sourceMappingURL=default.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports =
{
	locale: 'es',
	long: __webpack_require__(74),
	short: __webpack_require__(75),
	narrow: __webpack_require__(76),
	quantify: __webpack_require__(77)
}

/***/ }),
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */
/***/ (function(module, exports) {

module.exports=function(n){return 1==n?"one":"other"}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function (str) {
    var key = isPrimitive(str) ? str : JSON.stringify(str);
    var hit = cache[key];
    return hit || (cache[key] = fn(str))
  }
}

/**
 * Hyphenate a camelCase string.
 */
var hyphenate = cached(function (str) {
  return str.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); })
});

var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Simple Object.assign polyfill
 */
var merge =
  Object.assign ||
  function (to) {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      var from = Object(arguments$1[i]);

      for (var key in from) {
        if (hasOwn.call(from, key)) {
          to[key] = from[key];
        }
      }
    }

    return to
  };

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Perform no operation.
 */
function noop() {}

/**
 * Check if value is function
 */
function isFn(obj) {
  return typeof obj === 'function'
}

function config () {
  var config = merge(
    {
      el: '#app',
      repo: '',
      maxLevel: 6,
      subMaxLevel: 0,
      loadSidebar: null,
      loadNavbar: null,
      homepage: 'README.md',
      coverpage: '',
      basePath: '',
      auto2top: false,
      name: '',
      themeColor: '',
      nameLink: window.location.pathname,
      autoHeader: false,
      executeScript: null,
      noEmoji: false,
      ga: '',
      ext: '.md',
      mergeNavbar: false,
      formatUpdated: '',
      externalLinkTarget: '_blank',
      routerMode: 'hash',
      noCompileLinks: []
    },
    window.$docsify
  );

  var script =
    document.currentScript ||
    [].slice
      .call(document.getElementsByTagName('script'))
      .filter(function (n) { return /docsify\./.test(n.src); })[0];

  if (script) {
    for (var prop in config) {
      if (hasOwn.call(config, prop)) {
        var val = script.getAttribute('data-' + hyphenate(prop));

        if (isPrimitive(val)) {
          config[prop] = val === '' ? true : val;
        }
      }
    }

    if (config.loadSidebar === true) {
      config.loadSidebar = '_sidebar' + config.ext;
    }
    if (config.loadNavbar === true) {
      config.loadNavbar = '_navbar' + config.ext;
    }
    if (config.coverpage === true) {
      config.coverpage = '_coverpage' + config.ext;
    }
    if (config.repo === true) {
      config.repo = '';
    }
    if (config.name === true) {
      config.name = '';
    }
  }

  window.$docsify = config;

  return config
}

function initLifecycle(vm) {
  var hooks = [
    'init',
    'mounted',
    'beforeEach',
    'afterEach',
    'doneEach',
    'ready'
  ];

  vm._hooks = {};
  vm._lifecycle = {};
  hooks.forEach(function (hook) {
    var arr = (vm._hooks[hook] = []);
    vm._lifecycle[hook] = function (fn) { return arr.push(fn); };
  });
}

function callHook(vm, hook, data, next) {
  if ( next === void 0 ) next = noop;

  var queue = vm._hooks[hook];

  var step = function (index) {
    var hook = queue[index];
    if (index >= queue.length) {
      next(data);
    } else if (typeof hook === 'function') {
      if (hook.length === 2) {
        hook(data, function (result) {
          data = result;
          step(index + 1);
        });
      } else {
        var result = hook(data);
        data = result === undefined ? data : result;
        step(index + 1);
      }
    } else {
      step(index + 1);
    }
  };

  step(0);
}

var inBrowser = !false;

var isMobile = inBrowser && document.body.clientWidth <= 600;

/**
 * @see https://github.com/MoOx/pjax/blob/master/lib/is-supported.js
 */
var supportsPushState =
  inBrowser &&
  (function () {
    // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
    return (
      window.history &&
      window.history.pushState &&
      window.history.replaceState &&
      // PushState isn’t reliable on iOS until 5.
      !navigator.userAgent.match(
        /((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/
      )
    )
  })();

var cacheNode = {};

/**
 * Get Node
 * @param  {String|Element} el
 * @param  {Boolean} noCache
 * @return {Element}
 */
function getNode(el, noCache) {
  if ( noCache === void 0 ) noCache = false;

  if (typeof el === 'string') {
    if (typeof window.Vue !== 'undefined') {
      return find(el)
    }
    el = noCache ? find(el) : cacheNode[el] || (cacheNode[el] = find(el));
  }

  return el
}

var $ = inBrowser && document;

var body = inBrowser && $.body;

var head = inBrowser && $.head;

/**
 * Find element
 * @example
 * find('nav') => document.querySelector('nav')
 * find(nav, 'a') => nav.querySelector('a')
 */
function find(el, node) {
  return node ? el.querySelector(node) : $.querySelector(el)
}

/**
 * Find all elements
 * @example
 * findAll('a') => [].slice.call(document.querySelectorAll('a'))
 * findAll(nav, 'a') => [].slice.call(nav.querySelectorAll('a'))
 */
function findAll(el, node) {
  return [].slice.call(
    node ? el.querySelectorAll(node) : $.querySelectorAll(el)
  )
}

function create(node, tpl) {
  node = $.createElement(node);
  if (tpl) {
    node.innerHTML = tpl;
  }
  return node
}

function appendTo(target, el) {
  return target.appendChild(el)
}

function before(target, el) {
  return target.insertBefore(el, target.children[0])
}

function on(el, type, handler) {
  isFn(type) ?
    window.addEventListener(el, type) :
    el.addEventListener(type, handler);
}

function off(el, type, handler) {
  isFn(type) ?
    window.removeEventListener(el, type) :
    el.removeEventListener(type, handler);
}

/**
 * Toggle class
 *
 * @example
 * toggleClass(el, 'active') => el.classList.toggle('active')
 * toggleClass(el, 'add', 'active') => el.classList.add('active')
 */
function toggleClass(el, type, val) {
  el && el.classList[val ? type : 'toggle'](val || type);
}

function style(content) {
  appendTo(head, create('style', content));
}


var dom = Object.freeze({
	getNode: getNode,
	$: $,
	body: body,
	head: head,
	find: find,
	findAll: findAll,
	create: create,
	appendTo: appendTo,
	before: before,
	on: on,
	off: off,
	toggleClass: toggleClass,
	style: style
});

/**
 * Render github corner
 * @param  {Object} data
 * @return {String}
 */
function corner(data) {
  if (!data) {
    return ''
  }
  if (!/\/\//.test(data)) {
    data = 'https://github.com/' + data;
  }
  data = data.replace(/^git\+/, '');

  return (
    "<a href=\"" + data + "\" class=\"github-corner\" aria-label=\"View source on Github\">" +
    '<svg viewBox="0 0 250 250" aria-hidden="true">' +
    '<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>' +
    '<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>' +
    '<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>' +
    '</svg>' +
    '</a>'
  )
}

/**
 * Render main content
 */
function main(config) {
  var aside =
    '<button class="sidebar-toggle">' +
    '<div class="sidebar-toggle-button">' +
    '<span></span><span></span><span></span>' +
    '</div>' +
    '</button>' +
    '<aside class="sidebar">' +
    (config.name ?
      ("<h1><a class=\"app-name-link\" data-nosearch>" + (config.logo ?
          ("<img alt=" + (config.name) + " src=" + (config.logo) + ">") :
          config.name) + "</a></h1>") :
      '') +
    '<div class="sidebar-nav"><!--sidebar--></div>' +
    '</aside>';

  return (
    (isMobile ? (aside + "<main>") : ("<main>" + aside)) +
    '<section class="content">' +
    '<article class="markdown-section" id="main"><!--main--></article>' +
    '</section>' +
    '</main>'
  )
}

/**
 * Cover Page
 */
function cover() {
  var SL = ', 100%, 85%';
  var bgc =
    'linear-gradient(to left bottom, ' +
    "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 0%," +
    "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 100%)";

  return (
    "<section class=\"cover show\" style=\"background: " + bgc + "\">" +
    '<div class="cover-main"><!--cover--></div>' +
    '<div class="mask"></div>' +
    '</section>'
  )
}

/**
 * Render tree
 * @param  {Array} tree
 * @param  {String} tpl
 * @return {String}
 */
function tree(toc, tpl) {
  if ( tpl === void 0 ) tpl = '';

  if (!toc || !toc.length) {
    return ''
  }

  toc.forEach(function (node) {
    tpl += "<li><a class=\"section-link\" href=\"" + (node.slug) + "\">" + (node.title) + "</a></li>";
    if (node.children) {
      tpl += "<li><ul class=\"children\">" + (tree(node.children)) + "</li></ul>";
    }
  });

  return tpl
}

function helper(className, content) {
  return ("<p class=\"" + className + "\">" + (content.slice(5).trim()) + "</p>")
}

function theme(color) {
  return ("<style>:root{--theme-color: " + color + ";}</style>")
}

var barEl;
var timeId;

/**
 * Init progress component
 */
function init() {
  var div = create('div');

  div.classList.add('progress');
  appendTo(body, div);
  barEl = div;
}
/**
 * Render progress bar
 */
function progressbar (ref) {
  var loaded = ref.loaded;
  var total = ref.total;
  var step = ref.step;

  var num;

  !barEl && init();

  if (step) {
    num = parseInt(barEl.style.width || 0, 10) + step;
    num = num > 80 ? 80 : num;
  } else {
    num = Math.floor(loaded / total * 100);
  }

  barEl.style.opacity = 1;
  barEl.style.width = num >= 95 ? '100%' : num + '%';

  if (num >= 95) {
    clearTimeout(timeId);
    timeId = setTimeout(function (_) {
      barEl.style.opacity = 0;
      barEl.style.width = '0%';
    }, 200);
  }
}

var cache = {};

/**
 * Simple ajax get
 * @param {string} url
 * @param {boolean} [hasBar=false] has progress bar
 * @return { then(resolve, reject), abort }
 */
function get(url, hasBar, headers) {
  if ( hasBar === void 0 ) hasBar = false;
  if ( headers === void 0 ) headers = {};

  var xhr = new XMLHttpRequest();
  var on = function () {
    xhr.addEventListener.apply(xhr, arguments);
  };
  var cached$$1 = cache[url];

  if (cached$$1) {
    return {then: function (cb) { return cb(cached$$1.content, cached$$1.opt); }, abort: noop}
  }

  xhr.open('GET', url);
  for (var i in headers) {
    if (hasOwn.call(headers, i)) {
      xhr.setRequestHeader(i, headers[i]);
    }
  }
  xhr.send();

  return {
    then: function (success, error) {
      if ( error === void 0 ) error = noop;

      if (hasBar) {
        var id = setInterval(
          function (_) { return progressbar({
              step: Math.floor(Math.random() * 5 + 1)
            }); },
          500
        );

        on('progress', progressbar);
        on('loadend', function (evt) {
          progressbar(evt);
          clearInterval(id);
        });
      }

      on('error', error);
      on('load', function (ref) {
        var target = ref.target;

        if (target.status >= 400) {
          error(target);
        } else {
          var result = (cache[url] = {
            content: target.response,
            opt: {
              updatedAt: xhr.getResponseHeader('last-modified')
            }
          });

          success(result.content, result.opt);
        }
      });
    },
    abort: function (_) { return xhr.readyState !== 4 && xhr.abort(); }
  }
}

function replaceVar(block, color) {
  block.innerHTML = block.innerHTML.replace(
    /var\(\s*--theme-color.*?\)/g,
    color
  );
}

function cssVars (color) {
  // Variable support
  if (window.CSS && window.CSS.supports && window.CSS.supports('(--v:red)')) {
    return
  }

  var styleBlocks = findAll('style:not(.inserted),link');
  [].forEach.call(styleBlocks, function (block) {
    if (block.nodeName === 'STYLE') {
      replaceVar(block, color);
    } else if (block.nodeName === 'LINK') {
      var href = block.getAttribute('href');

      if (!/\.css$/.test(href)) {
        return
      }

      get(href).then(function (res) {
        var style$$1 = create('style', res);

        head.appendChild(style$$1);
        replaceVar(style$$1, color);
      });
    }
  });
}

var RGX = /([^{]*?)\w(?=\})/g;

var dict = {
	YYYY: 'getFullYear',
	YY: 'getYear',
	MM: function (d) {
		return d.getMonth() + 1;
	},
	DD: 'getDate',
	HH: 'getHours',
	mm: 'getMinutes',
	ss: 'getSeconds'
};

function tinydate (str) {
	var parts=[], offset=0;
	str.replace(RGX, function (key, _, idx) {
		// save preceding string
		parts.push(str.substring(offset, idx - 1));
		offset = idx += key.length + 1;
		// save function
		parts.push(function(d){
			return ('00' + (typeof dict[key]==='string' ? d[dict[key]]() : dict[key](d))).slice(-key.length);
		});
	});

	if (offset !== str.length) {
		parts.push(str.substring(offset));
	}

	return function (arg) {
		var out='', i=0, d=arg||new Date();
		for (; i<parts.length; i++) {
			out += (typeof parts[i]==='string') ? parts[i] : parts[i](d);
		}
		return out;
	};
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var marked = createCommonjsModule(function (module, exports) {
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

(function() {
var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var this$1 = this;

  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this$1.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this$1.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this$1.tokens.push({
        type: 'code',
        text: !this$1.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this$1.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this$1.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this$1.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this$1.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this$1.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this$1.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this$1.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this$1.token(cap, top, true);

      this$1.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this$1.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this$1.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this$1.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this$1.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this$1.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) { loose = next; }
        }

        this$1.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this$1.token(item, false, bq);

        this$1.tokens.push({
          type: 'list_item_end'
        });
      }

      this$1.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this$1.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: this$1.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this$1.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this$1.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this$1.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this$1.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this$1.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this$1.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var this$1 = this;

  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this$1.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this$1.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(
          cap[1].charAt(6) === ':'
          ? this$1.mangle(cap[1].substring(7))
          : this$1.mangle(cap[1])
        );
        href = this$1.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this$1.inLink && (cap = this$1.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this$1.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this$1.rules.tag.exec(src)) {
      if (!this$1.inLink && /^<a /i.test(cap[0])) {
        this$1.inLink = true;
      } else if (this$1.inLink && /^<\/a>/i.test(cap[0])) {
        this$1.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this$1.options.sanitize
        ? this$1.options.sanitizer
          ? this$1.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this$1.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this$1.inLink = true;
      out += this$1.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this$1.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this$1.rules.reflink.exec(src))
        || (cap = this$1.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this$1.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this$1.inLink = true;
      out += this$1.outputLink(cap, link);
      this$1.inLink = false;
      continue;
    }

    // strong
    if (cap = this$1.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.strong(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this$1.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.em(this$1.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this$1.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this$1.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this$1.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.del(this$1.output(cap[1]));
      continue;
    }

    // text
    if (cap = this$1.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this$1.renderer.text(escape(this$1.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) { return text; }
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) { return text; }
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  var this$1 = this;

  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this$1.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var this$1 = this;

  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this$1.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  var this$1 = this;

  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this$1.token.align[i] };
        cell += this$1.renderer.tablecell(
          this$1.inline.output(this$1.token.header[i]),
          { header: true, align: this$1.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this$1.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this$1.renderer.tablecell(
            this$1.inline.output(row[j]),
            { header: false, align: this$1.token.align[j] }
          );
        }

        body += this$1.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this$1.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this$1.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.token.type === 'text'
          ? this$1.parseText()
          : this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this$1.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') { return ':'; }
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) { return new RegExp(regex, opt); }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var arguments$1 = arguments;

  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments$1[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) { return done(); }

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) { return done(err); }
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) { opt = merge({}, marked.defaults, opt); }
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

{
  module.exports = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : commonjsGlobal);
}());
});

var prism = createCommonjsModule(function (module) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						{ _.matchGrammar(text, strarr, grammar, i, pos, true, token); }

					if (oneshot)
						{ break; }
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if ('object' !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof commonjsGlobal !== 'undefined') {
	commonjsGlobal.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+(?:[Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
});

/**
 * Gen toc tree
 * @link https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
 * @param  {Array} toc
 * @param  {Number} maxLevel
 * @return {Array}
 */
function genTree(toc, maxLevel) {
  var headlines = [];
  var last = {};

  toc.forEach(function (headline) {
    var level = headline.level || 1;
    var len = level - 1;

    if (level > maxLevel) {
      return
    }
    if (last[len]) {
      last[len].children = (last[len].children || []).concat(headline);
    } else {
      headlines.push(headline);
    }
    last[level] = headline;
  });

  return headlines
}

var cache$1 = {};
var re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;

function lower(string) {
  return string.toLowerCase()
}

function slugify(str) {
  if (typeof str !== 'string') {
    return ''
  }

  var slug = str
    .trim()
    .replace(/[A-Z]+/g, lower)
    .replace(/<[^>\d]+>/g, '')
    .replace(re, '')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-')
    .replace(/^(\d)/, '_$1');
  var count = cache$1[slug];

  count = hasOwn.call(cache$1, slug) ? count + 1 : 0;
  cache$1[slug] = count;

  if (count) {
    slug = slug + '-' + count;
  }

  return slug
}

slugify.clear = function () {
  cache$1 = {};
};

function replace(m, $1) {
  return '<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/' + $1 + '.png" alt="' + $1 + '" />'
}

function emojify(text) {
  return text
    .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, function (m) { return m.replace(/:/g, '__colon__'); })
    .replace(/:(\w+?):/ig, (inBrowser && window.emojify) || replace)
    .replace(/__colon__/g, ':')
}

var decode = decodeURIComponent;
var encode = encodeURIComponent;

function parseQuery(query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  // Simple parse
  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');

    res[parts[0]] = parts[1] && decode(parts[1]);
  });

  return res
}

function stringifyQuery(obj, ignores) {
  if ( ignores === void 0 ) ignores = [];

  var qs = [];

  for (var key in obj) {
    if (ignores.indexOf(key) > -1) {
      continue
    }
    qs.push(
      obj[key] ?
        ((encode(key)) + "=" + (encode(obj[key]))).toLowerCase() :
        encode(key)
    );
  }

  return qs.length ? ("?" + (qs.join('&'))) : ''
}

var isAbsolutePath = cached(function (path) {
  return /(:|(\/{2}))/g.test(path)
});

var getParentPath = cached(function (path) {
  return /\/$/g.test(path) ?
    path :
    (path = path.match(/(\S*\/)[^/]+$/)) ? path[1] : ''
});

var cleanPath = cached(function (path) {
  return path.replace(/^\/+/, '/').replace(/([^:])\/{2,}/g, '$1/')
});

function getPath() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return cleanPath(args.join('/'))
}

var replaceSlug = cached(function (path) {
  return path.replace('#', '?id=')
});

var cachedLinks = {};

function getAndRemoveConfig(str) {
  if ( str === void 0 ) str = '';

  var config = {};

  if (str) {
    str = str
      .replace(/:([\w-]+)=?([\w-]+)?/g, function (m, key, value) {
        config[key] = (value && value.replace(/&quot;/g, '')) || true;
        return ''
      })
      .trim();
  }

  return {str: str, config: config}
}

var compileMedia = {
  markdown: function markdown(url) {
    return {
      url: url
    }
  },
  iframe: function iframe(url, title) {
    return {
      code: ("<iframe src=\"" + url + "\" " + (title || 'width=100% height=400') + "></iframe>")
    }
  },
  video: function video(url, title) {
    return {
      code: ("<video src=\"" + url + "\" " + (title || 'controls') + ">Not Support</video>")
    }
  },
  audio: function audio(url, title) {
    return {
      code: ("<audio src=\"" + url + "\" " + (title || 'controls') + ">Not Support</audio>")
    }
  },
  code: function code(url, title) {
    var lang = url.match(/\.(\w+)$/);

    lang = title || (lang && lang[1]);
    if (lang === 'md') {
      lang = 'markdown';
    }

    return {
      url: url,
      lang: lang
    }
  }
};

var Compiler = function Compiler(config, router) {
  this.config = config;
  this.router = router;
  this.cacheTree = {};
  this.toc = [];
  this.linkTarget = config.externalLinkTarget || '_blank';
  this.contentBase = router.getBasePath();

  var renderer = this._initRenderer();
  var compile;
  var mdConf = config.markdown || {};

  if (isFn(mdConf)) {
    compile = mdConf(marked, renderer);
  } else {
    marked.setOptions(
      merge(mdConf, {
        renderer: merge(renderer, mdConf.renderer)
      })
    );
    compile = marked;
  }

  this._marked = compile;
  this.compile = cached(function (text) {
    var html = '';

    if (!text) {
      return text
    }

    if (isPrimitive(text)) {
      html = compile(text);
    } else {
      html = compile.parser(text);
    }

    html = config.noEmoji ? html : emojify(html);
    slugify.clear();

    return html
  });
};

Compiler.prototype.compileEmbed = function compileEmbed (href, title) {
  var ref = getAndRemoveConfig(title);
    var str = ref.str;
    var config = ref.config;
  var embed;
  title = str;

  if (config.include) {
    if (!isAbsolutePath(href)) {
      href = getPath(
        this.contentBase,
        getParentPath(this.router.getCurrentPath()),
        href
      );
    }

    var media;
    if (config.type && (media = compileMedia[config.type])) {
      embed = media.call(this, href, title);
      embed.type = config.type;
    } else {
      var type = 'code';
      if (/\.(md|markdown)/.test(href)) {
        type = 'markdown';
      } else if (/\.html?/.test(href)) {
        type = 'iframe';
      } else if (/\.(mp4|ogg)/.test(href)) {
        type = 'video';
      } else if (/\.mp3/.test(href)) {
        type = 'audio';
      }
      embed = compileMedia[type].call(this, href, title);
      embed.type = type;
    }

    return embed
  }
};

Compiler.prototype._matchNotCompileLink = function _matchNotCompileLink (link) {
  var links = this.config.noCompileLinks || [];

  for (var i = 0; i < links.length; i++) {
    var n = links[i];
    var re = cachedLinks[n] || (cachedLinks[n] = new RegExp(("^" + n + "$")));

    if (re.test(link)) {
      return link
    }
  }
};

Compiler.prototype._initRenderer = function _initRenderer () {
  var renderer = new marked.Renderer();
  var ref = this;
    var linkTarget = ref.linkTarget;
    var router = ref.router;
    var contentBase = ref.contentBase;
  var _self = this;
  var origin = {};

  /**
   * Render anchor tag
   * @link https://github.com/chjj/marked#overriding-renderer-methods
   */
  origin.heading = renderer.heading = function (text, level) {
    var nextToc = {level: level, title: text};

    if (/{docsify-ignore}/g.test(text)) {
      text = text.replace('{docsify-ignore}', '');
      nextToc.title = text;
      nextToc.ignoreSubHeading = true;
    }

    if (/{docsify-ignore-all}/g.test(text)) {
      text = text.replace('{docsify-ignore-all}', '');
      nextToc.title = text;
      nextToc.ignoreAllSubs = true;
    }

    var slug = slugify(text);
    var url = router.toURL(router.getCurrentPath(), {id: slug});
    nextToc.slug = url;
    _self.toc.push(nextToc);

    return ("<h" + level + " id=\"" + slug + "\"><a href=\"" + url + "\" data-id=\"" + slug + "\" class=\"anchor\"><span>" + text + "</span></a></h" + level + ">")
  };
  // Highlight code
  origin.code = renderer.code = function (code, lang) {
      if ( lang === void 0 ) lang = '';

    code = code.replace(/@DOCSIFY_QM@/g, '`');
    var hl = prism.highlight(
      code,
      prism.languages[lang] || prism.languages.markup
    );

    return ("<pre v-pre data-lang=\"" + lang + "\"><code class=\"lang-" + lang + "\">" + hl + "</code></pre>")
  };
  origin.link = renderer.link = function (href, title, text) {
      if ( title === void 0 ) title = '';

    var attrs = '';

    var ref = getAndRemoveConfig(title);
      var str = ref.str;
      var config = ref.config;
    title = str;

    if (
      !isAbsolutePath(href) &&
      !_self._matchNotCompileLink(href) &&
      !config.ignore
    ) {
      if (href === _self.config.homepage) {
        href = 'README';
      }
      href = router.toURL(href, null, router.getCurrentPath());
    } else {
      attrs += " target=\"" + linkTarget + "\"";
    }

    if (config.target) {
      attrs += ' target=' + config.target;
    }

    if (config.disabled) {
      attrs += ' disabled';
      href = 'javascript:void(0)';
    }

    if (title) {
      attrs += " title=\"" + title + "\"";
    }

    return ("<a href=\"" + href + "\"" + attrs + ">" + text + "</a>")
  };
  origin.paragraph = renderer.paragraph = function (text) {
    var result;
    if (/^!&gt;/.test(text)) {
      result = helper('tip', text);
    } else if (/^\?&gt;/.test(text)) {
      result = helper('warn', text);
    } else {
      result = "<p>" + text + "</p>";
    }
    return result
  };
  origin.image = renderer.image = function (href, title, text) {
    var url = href;
    var attrs = '';

    var ref = getAndRemoveConfig(title);
      var str = ref.str;
      var config = ref.config;
    title = str;

    if (config['no-zoom']) {
      attrs += ' data-no-zoom';
    }

    if (title) {
      attrs += " title=\"" + title + "\"";
    }

    var size = config.size;
    if (size) {
      var sizes = size.split('x');
      if (sizes[1]) {
        attrs += 'width=' + sizes[0] + ' height=' + sizes[1];
      } else {
        attrs += 'width=' + sizes[0];
      }
    }

    if (!isAbsolutePath(href)) {
      url = getPath(contentBase, getParentPath(router.getCurrentPath()), href);
    }

    return ("<img src=\"" + url + "\"data-origin=\"" + href + "\" alt=\"" + text + "\"" + attrs + ">")
  };

  var CHECKED_RE = /^\[([ x])\] +/;
  origin.listitem = renderer.listitem = function (text) {
    var checked = CHECKED_RE.exec(text);
    if (checked) {
      text = text.replace(
        CHECKED_RE,
        ("<input type=\"checkbox\" " + (checked[1] === 'x' ? 'checked' : '') + " />")
      );
    }
    return ("<li" + (checked ? " class=\"task-list-item\"" : '') + ">" + text + "</li>\n")
  };

  renderer.origin = origin;

  return renderer
};

/**
 * Compile sidebar
 */
Compiler.prototype.sidebar = function sidebar (text, level) {
  var currentPath = this.router.getCurrentPath();
  var html = '';

  if (text) {
    html = this.compile(text);
  } else {
    var tree$$1 = this.cacheTree[currentPath] || genTree(this.toc, level);
    html = tree(tree$$1, '<ul>');
    this.cacheTree[currentPath] = tree$$1;
  }

  return html
};

/**
 * Compile sub sidebar
 */
Compiler.prototype.subSidebar = function subSidebar (level) {
  if (!level) {
    this.toc = [];
    return
  }
  var currentPath = this.router.getCurrentPath();
  var ref = this;
    var cacheTree = ref.cacheTree;
    var toc = ref.toc;

  toc[0] && toc[0].ignoreAllSubs && toc.splice(0);
  toc[0] && toc[0].level === 1 && toc.shift();

  for (var i = 0; i < toc.length; i++) {
    toc[i].ignoreSubHeading && toc.splice(i, 1) && i--;
  }

  var tree$$1 = cacheTree[currentPath] || genTree(toc, level);

  cacheTree[currentPath] = tree$$1;
  this.toc = [];
  return tree(tree$$1, '<ul class="app-sub-sidebar">')
};

Compiler.prototype.article = function article (text) {
  return this.compile(text)
};

/**
 * Compile cover page
 */
Compiler.prototype.cover = function cover$$1 (text) {
  var cacheToc = this.toc.slice();
  var html = this.compile(text);

  this.toc = cacheToc.slice();

  return html
};

var title = $.title;
/**
 * Toggle button
 */
function btn(el) {
  var toggle = function (_) { return body.classList.toggle('close'); };

  el = getNode(el);
  on(el, 'click', function (e) {
    e.stopPropagation();
    toggle();
  });

  isMobile &&
    on(
      body,
      'click',
      function (_) { return body.classList.contains('close') && toggle(); }
    );
}

function collapse(el) {
  el = getNode(el);

  on(el, 'click', function (ref) {
    var target = ref.target;

    if (
      target.nodeName === 'A' &&
      target.nextSibling &&
      target.nextSibling.classList.contains('app-sub-sidebar')
    ) {
      toggleClass(target.parentNode, 'collapse');
    }
  });
}

function sticky() {
  var cover = getNode('section.cover');
  if (!cover) {
    return
  }
  var coverHeight = cover.getBoundingClientRect().height;

  if (window.pageYOffset >= coverHeight || cover.classList.contains('hidden')) {
    toggleClass(body, 'add', 'sticky');
  } else {
    toggleClass(body, 'remove', 'sticky');
  }
}

/**
 * Get and active link
 * @param  {object} router
 * @param  {string|element}  el
 * @param  {Boolean} isParent   acitve parent
 * @param  {Boolean} autoTitle  auto set title
 * @return {element}
 */
function getAndActive(router, el, isParent, autoTitle) {
  el = getNode(el);

  var links = findAll(el, 'a');
  var hash = decodeURI(router.toURL(router.getCurrentPath()));
  var target;

  links.sort(function (a, b) { return b.href.length - a.href.length; }).forEach(function (a) {
    var href = a.getAttribute('href');
    var node = isParent ? a.parentNode : a;

    if (hash.indexOf(href) === 0 && !target) {
      target = a;
      toggleClass(node, 'add', 'active');
    } else {
      toggleClass(node, 'remove', 'active');
    }
  });

  if (autoTitle) {
    $.title = target ? ((target.innerText) + " - " + title) : title;
  }

  return target
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tweezer = function () {
  function Tweezer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tweezer);

    this.duration = opts.duration || 1000;
    this.ease = opts.easing || this._defaultEase;
    this.start = opts.start;
    this.end = opts.end;

    this.frame = null;
    this.next = null;
    this.isRunning = false;
    this.events = {};
    this.direction = this.start < this.end ? 'up' : 'down';
  }

  _createClass(Tweezer, [{
    key: 'begin',
    value: function begin() {
      if (!this.isRunning && this.next !== this.end) {
        this.frame = window.requestAnimationFrame(this._tick.bind(this));
      }
      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      window.cancelAnimationFrame(this.frame);
      this.isRunning = false;
      this.frame = null;
      this.timeStart = null;
      this.next = null;
      return this;
    }
  }, {
    key: 'on',
    value: function on(name, handler) {
      this.events[name] = this.events[name] || [];
      this.events[name].push(handler);
      return this;
    }
  }, {
    key: 'emit',
    value: function emit(name, val) {
      var _this = this;

      var e = this.events[name];
      e && e.forEach(function (handler) {
        return handler.call(_this, val);
      });
    }
  }, {
    key: '_tick',
    value: function _tick(currentTime) {
      this.isRunning = true;

      var lastTick = this.next || this.start;

      if (!this.timeStart) { this.timeStart = currentTime; }
      this.timeElapsed = currentTime - this.timeStart;
      this.next = Math.round(this.ease(this.timeElapsed, this.start, this.end - this.start, this.duration));

      if (this._shouldTick(lastTick)) {
        this.emit('tick', this.next);
        this.frame = window.requestAnimationFrame(this._tick.bind(this));
      } else {
        this.emit('tick', this.end);
        this.emit('done', null);
      }
    }
  }, {
    key: '_shouldTick',
    value: function _shouldTick(lastTick) {
      return {
        up: this.next < this.end && lastTick <= this.next,
        down: this.next > this.end && lastTick >= this.next
      }[this.direction];
    }
  }, {
    key: '_defaultEase',
    value: function _defaultEase(t, b, c, d) {
      if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }
      return -c / 2 * (--t * (t - 2) - 1) + b;
    }
  }]);

  return Tweezer;
}();

var nav = {};
var hoverOver = false;
var scroller = null;
var enableScrollEvent = true;
var coverHeight = 0;

function scrollTo(el) {
  if (scroller) {
    scroller.stop();
  }
  enableScrollEvent = false;
  scroller = new Tweezer({
    start: window.pageYOffset,
    end: el.getBoundingClientRect().top + window.pageYOffset,
    duration: 500
  })
    .on('tick', function (v) { return window.scrollTo(0, v); })
    .on('done', function () {
      enableScrollEvent = true;
      scroller = null;
    })
    .begin();
}

function highlight(path) {
  if (!enableScrollEvent) {
    return
  }
  var sidebar = getNode('.sidebar');
  var anchors = findAll('.anchor');
  var wrap = find(sidebar, '.sidebar-nav');
  var active = find(sidebar, 'li.active');
  var doc = document.documentElement;
  var top = ((doc && doc.scrollTop) || document.body.scrollTop) - coverHeight;
  var last;

  for (var i = 0, len = anchors.length; i < len; i += 1) {
    var node = anchors[i];

    if (node.offsetTop > top) {
      if (!last) {
        last = node;
      }
      break
    } else {
      last = node;
    }
  }
  if (!last) {
    return
  }
  var li = nav[getNavKey(decodeURIComponent(path), last.getAttribute('data-id'))];

  if (!li || li === active) {
    return
  }

  active && active.classList.remove('active');
  li.classList.add('active');
  active = li;

  // Scroll into view
  // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
  if (!hoverOver && body.classList.contains('sticky')) {
    var height = sidebar.clientHeight;
    var curOffset = 0;
    var cur = active.offsetTop + active.clientHeight + 40;
    var isInView =
      active.offsetTop >= wrap.scrollTop && cur <= wrap.scrollTop + height;
    var notThan = cur - curOffset < height;
    var top$1 = isInView ? wrap.scrollTop : notThan ? curOffset : cur - height;

    sidebar.scrollTop = top$1;
  }
}

function getNavKey(path, id) {
  return (path + "?id=" + id)
}

function scrollActiveSidebar(router) {
  var cover = find('.cover.show');
  coverHeight = cover ? cover.offsetHeight : 0;

  var sidebar = getNode('.sidebar');
  var lis = findAll(sidebar, 'li');

  for (var i = 0, len = lis.length; i < len; i += 1) {
    var li = lis[i];
    var a = li.querySelector('a');
    if (!a) {
      continue
    }
    var href = a.getAttribute('href');

    if (href !== '/') {
      var ref = router.parse(href);
      var id = ref.query.id;
      var path$1 = ref.path;
      if (id) {
        href = getNavKey(path$1, id);
      }
    }

    if (href) {
      nav[decodeURIComponent(href)] = li;
    }
  }

  if (isMobile) {
    return
  }
  var path = router.getCurrentPath();
  off('scroll', function () { return highlight(path); });
  on('scroll', function () { return highlight(path); });
  on(sidebar, 'mouseover', function () {
    hoverOver = true;
  });
  on(sidebar, 'mouseleave', function () {
    hoverOver = false;
  });
}

function scrollIntoView(path, id) {
  if (!id) {
    return
  }

  var section = find('#' + id);
  section && scrollTo(section);

  var li = nav[getNavKey(path, id)];
  var sidebar = getNode('.sidebar');
  var active = find(sidebar, 'li.active');
  active && active.classList.remove('active');
  li && li.classList.add('active');
}

var scrollEl = $.scrollingElement || $.documentElement;

function scroll2Top(offset) {
  if ( offset === void 0 ) offset = 0;

  scrollEl.scrollTop = offset === true ? 0 : Number(offset);
}

var cached$1 = {};

function walkFetchEmbed(ref, cb) {
  var embedTokens = ref.embedTokens;
  var compile = ref.compile;
  var fetch = ref.fetch;

  var token;
  var step = 0;
  var count = 1;

  if (!embedTokens.length) {
    return cb({})
  }

  while ((token = embedTokens[step++])) {
    var next = (function (token) {
      return function (text) {
        var embedToken;
        if (text) {
          if (token.embed.type === 'markdown') {
            embedToken = compile.lexer(text);
          } else if (token.embed.type === 'code') {
            embedToken = compile.lexer(
              '```' +
                token.embed.lang +
                '\n' +
                text.replace(/`/g, '@DOCSIFY_QM@') +
                '\n```\n'
            );
          }
        }
        cb({token: token, embedToken: embedToken});
        if (++count >= step) {
          cb({});
        }
      }
    })(token);

    {
      get(token.embed.url).then(next);
    }
  }
}

function prerenderEmbed(ref, done) {
  var compiler = ref.compiler;
  var raw = ref.raw; if ( raw === void 0 ) raw = '';
  var fetch = ref.fetch;

  var hit;
  if ((hit = cached$1[raw])) {
    return done(hit)
  }

  var compile = compiler._marked;
  var tokens = compile.lexer(raw);
  var embedTokens = [];
  var linkRE = compile.InlineLexer.rules.link;
  var links = tokens.links;

  tokens.forEach(function (token, index) {
    if (token.type === 'paragraph') {
      token.text = token.text.replace(
        new RegExp(linkRE.source, 'g'),
        function (src, filename, href, title) {
          var embed = compiler.compileEmbed(href, title);

          if (embed) {
            if (embed.type === 'markdown' || embed.type === 'code') {
              embedTokens.push({
                index: index,
                embed: embed
              });
            }
            return embed.code
          }

          return src
        }
      );
    }
  });

  var moveIndex = 0;
  walkFetchEmbed({compile: compile, embedTokens: embedTokens, fetch: fetch}, function (ref) {
    var embedToken = ref.embedToken;
    var token = ref.token;

    if (token) {
      var index = token.index + moveIndex;

      merge(links, embedToken.links);

      tokens = tokens
        .slice(0, index)
        .concat(embedToken, tokens.slice(index + 1));
      moveIndex += embedToken.length - 1;
    } else {
      cached$1[raw] = tokens.concat();
      tokens.links = cached$1[raw].links = links;
      done(tokens);
    }
  });
}

function executeScript() {
  var script = findAll('.markdown-section>script')
    .filter(function (s) { return !/template/.test(s.type); })[0];
  if (!script) {
    return false
  }
  var code = script.innerText.trim();
  if (!code) {
    return false
  }

  setTimeout(function (_) {
    window.__EXECUTE_RESULT__ = new Function(code)();
  }, 0);
}

function formatUpdated(html, updated, fn) {
  updated =
    typeof fn === 'function' ?
      fn(updated) :
      typeof fn === 'string' ?
        tinydate(fn)(new Date(updated)) :
        updated;

  return html.replace(/{docsify-updated}/g, updated)
}

function renderMain(html) {
  if (!html) {
    html = '<h1>404 - Not found</h1>';
  }

  this._renderTo('.markdown-section', html);
  // Render sidebar with the TOC
  !this.config.loadSidebar && this._renderSidebar();

  // Execute script
  if (
    this.config.executeScript !== false &&
    typeof window.Vue !== 'undefined' &&
    !executeScript()
  ) {
    setTimeout(function (_) {
      var vueVM = window.__EXECUTE_RESULT__;
      vueVM && vueVM.$destroy && vueVM.$destroy();
      window.__EXECUTE_RESULT__ = new window.Vue().$mount('#main');
    }, 0);
  } else {
    this.config.executeScript && executeScript();
  }
}

function renderNameLink(vm) {
  var el = getNode('.app-name-link');
  var nameLink = vm.config.nameLink;
  var path = vm.route.path;

  if (!el) {
    return
  }

  if (isPrimitive(vm.config.nameLink)) {
    el.setAttribute('href', nameLink);
  } else if (typeof nameLink === 'object') {
    var match = Object.keys(nameLink).filter(function (key) { return path.indexOf(key) > -1; })[0];

    el.setAttribute('href', nameLink[match]);
  }
}

function renderMixin(proto) {
  proto._renderTo = function (el, content, replace) {
    var node = getNode(el);
    if (node) {
      node[replace ? 'outerHTML' : 'innerHTML'] = content;
    }
  };

  proto._renderSidebar = function (text) {
    var ref = this.config;
    var maxLevel = ref.maxLevel;
    var subMaxLevel = ref.subMaxLevel;
    var loadSidebar = ref.loadSidebar;

    this._renderTo('.sidebar-nav', this.compiler.sidebar(text, maxLevel));
    var activeEl = getAndActive(this.router, '.sidebar-nav', true, true);
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML +=
        this.compiler.subSidebar(subMaxLevel) || '';
    } else {
      // Reset toc
      this.compiler.subSidebar();
    }
    // Bind event
    this._bindEventOnRendered(activeEl);
  };

  proto._bindEventOnRendered = function (activeEl) {
    var ref = this.config;
    var autoHeader = ref.autoHeader;
    var auto2top = ref.auto2top;

    scrollActiveSidebar(this.router);

    if (autoHeader && activeEl) {
      var main$$1 = getNode('#main');
      var firstNode = main$$1.children[0];
      if (firstNode && firstNode.tagName !== 'H1') {
        var h1 = create('h1');
        h1.innerText = activeEl.innerText;
        before(main$$1, h1);
      }
    }

    auto2top && scroll2Top(auto2top);
  };

  proto._renderNav = function (text) {
    text && this._renderTo('nav', this.compiler.compile(text));
    if (this.config.loadNavbar) {
      getAndActive(this.router, 'nav');
    }
  };

  proto._renderMain = function (text, opt, next) {
    var this$1 = this;
    if ( opt === void 0 ) opt = {};

    if (!text) {
      return renderMain.call(this, text)
    }

    callHook(this, 'beforeEach', text, function (result) {
      var html;
      var callback = function () {
        if (opt.updatedAt) {
          html = formatUpdated(html, opt.updatedAt, this$1.config.formatUpdated);
        }

        callHook(this$1, 'afterEach', html, function (text) { return renderMain.call(this$1, text); });
      };
      if (this$1.isHTML) {
        html = this$1.result = text;
        callback();
        next();
      } else {
        prerenderEmbed(
          {
            compiler: this$1.compiler,
            raw: result
          },
          function (tokens) {
            html = this$1.compiler.compile(tokens);
            callback();
            next();
          }
        );
      }
    });
  };

  proto._renderCover = function (text, coverOnly) {
    var el = getNode('.cover');

    toggleClass(getNode('main'), coverOnly ? 'add' : 'remove', 'hidden');
    if (!text) {
      toggleClass(el, 'remove', 'show');
      return
    }
    toggleClass(el, 'add', 'show');

    var html = this.coverIsHTML ? text : this.compiler.cover(text);
    var m = html
      .trim()
      .match('<p><img.*?data-origin="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$');

    if (m) {
      if (m[2] === 'color') {
        el.style.background = m[1] + (m[3] || '');
      } else {
        var path = m[1];

        toggleClass(el, 'add', 'has-mask');
        if (!isAbsolutePath(m[1])) {
          path = getPath(this.router.getBasePath(), m[1]);
        }
        el.style.backgroundImage = "url(" + path + ")";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center center';
      }
      html = html.replace(m[0], '');
    }

    this._renderTo('.cover-main', html);
    sticky();
  };

  proto._updateRender = function () {
    // Render name link
    renderNameLink(this);
  };
}

function initRender(vm) {
  var config = vm.config;

  // Init markdown compiler
  vm.compiler = new Compiler(config, vm.router);
  if (inBrowser) {
    window.__current_docsify_compiler__ = vm.compiler;
  }

  var id = config.el || '#app';
  var navEl = find('nav') || create('nav');

  var el = find(id);
  var html = '';
  var navAppendToTarget = body;

  if (el) {
    if (config.repo) {
      html += corner(config.repo);
    }
    if (config.coverpage) {
      html += cover();
    }

    if (config.logo) {
      config.logo = getPath(vm.router.getBasePath(), config.logo);
    }

    html += main(config);
    // Render main app
    vm._renderTo(el, html, true);
  } else {
    vm.rendered = true;
  }

  if (config.mergeNavbar && isMobile) {
    navAppendToTarget = find('.sidebar');
  } else {
    navEl.classList.add('app-nav');

    if (!config.repo) {
      navEl.classList.add('no-badge');
    }
  }

  // Add nav
  if (config.loadNavbar) {
    before(navAppendToTarget, navEl);
  }

  if (config.themeColor) {
    $.head.appendChild(
      create('div', theme(config.themeColor)).firstElementChild
    );
    // Polyfll
    cssVars(config.themeColor);
  }
  vm._updateRender();
  toggleClass(body, 'ready');
}

var cached$2 = {};

function getAlias(path, alias, last) {
  var match = Object.keys(alias).filter(function (key) {
    var re = cached$2[key] || (cached$2[key] = new RegExp(("^" + key + "$")));
    return re.test(path) && path !== last
  })[0];

  return match ?
    getAlias(path.replace(cached$2[match], alias[match]), alias, path) :
    path
}

function getFileName(path, ext) {
  return new RegExp(("\\.(" + (ext.replace(/^\./, '')) + "|html)$"), 'g').test(path) ?
    path :
    /\/$/g.test(path) ? (path + "README" + ext) : ("" + path + ext)
}

var History = function History(config) {
  this.config = config;
};

History.prototype.getBasePath = function getBasePath () {
  return this.config.basePath
};

History.prototype.getFile = function getFile (path, isRelative) {
    if ( path === void 0 ) path = this.getCurrentPath();

  var ref = this;
    var config = ref.config;
  var base = this.getBasePath();
  var ext = typeof config.ext === 'string' ? config.ext : '.md';

  path = config.alias ? getAlias(path, config.alias) : path;
  path = getFileName(path, ext);
  path = path === ("/README" + ext) ? config.homepage || path : path;
  path = isAbsolutePath(path) ? path : getPath(base, path);

  if (isRelative) {
    path = path.replace(new RegExp(("^" + base)), '');
  }

  return path
};

History.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

  cb();
};

History.prototype.getCurrentPath = function getCurrentPath () {};

History.prototype.normalize = function normalize () {};

History.prototype.parse = function parse () {};

History.prototype.toURL = function toURL (path, params, currentRoute) {
  var local = currentRoute && path[0] === '#';
  var route = this.parse(replaceSlug(path));

  route.query = merge({}, route.query, params);
  path = route.path + stringifyQuery(route.query);
  path = path.replace(/\.md(\?)|\.md$/, '$1');

  if (local) {
    var idIndex = currentRoute.indexOf('?');
    path =
      (idIndex > 0 ? currentRoute.substr(0, idIndex) : currentRoute) + path;
  }

  return cleanPath('/' + path)
};

function replaceHash(path) {
  var i = location.href.indexOf('#');
  location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path);
}

var HashHistory = (function (History$$1) {
  function HashHistory(config) {
    History$$1.call(this, config);
    this.mode = 'hash';
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  HashHistory.prototype.getBasePath = function getBasePath () {
    var path = window.location.pathname || '';
    var base = this.config.basePath;

    return /^(\/|https?:)/g.test(base) ? base : cleanPath(path + '/' + base)
  };

  HashHistory.prototype.getCurrentPath = function getCurrentPath () {
    // We can't use location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = location.href;
    var index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1)
  };

  HashHistory.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

    on('hashchange', cb);
  };

  HashHistory.prototype.normalize = function normalize () {
    var path = this.getCurrentPath();

    path = replaceSlug(path);

    if (path.charAt(0) === '/') {
      return replaceHash(path)
    }
    replaceHash('/' + path);
  };

  /**
   * Parse the url
   * @param {string} [path=location.herf]
   * @return {object} { path, query }
   */
  HashHistory.prototype.parse = function parse (path) {
    if ( path === void 0 ) path = location.href;

    var query = '';

    var hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      path = path.slice(hashIndex + 1);
    }

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    return {
      path: path,
      file: this.getFile(path, true),
      query: parseQuery(query)
    }
  };

  HashHistory.prototype.toURL = function toURL (path, params, currentRoute) {
    return '#' + History$$1.prototype.toURL.call(this, path, params, currentRoute)
  };

  return HashHistory;
}(History));

var HTML5History = (function (History$$1) {
  function HTML5History(config) {
    History$$1.call(this, config);
    this.mode = 'history';
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.getCurrentPath = function getCurrentPath () {
    var base = this.getBasePath();
    var path = window.location.pathname;

    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length);
    }

    return (path || '/') + window.location.search + window.location.hash
  };

  HTML5History.prototype.onchange = function onchange (cb) {
    if ( cb === void 0 ) cb = noop;

    on('click', function (e) {
      var el = e.target.tagName === 'A' ? e.target : e.target.parentNode;

      if (el.tagName === 'A' && !/_blank/.test(el.target)) {
        e.preventDefault();
        var url = el.href;
        window.history.pushState({key: url}, '', url);
        cb();
      }
    });

    on('popstate', cb);
  };

  /**
   * Parse the url
   * @param {string} [path=location.href]
   * @return {object} { path, query }
   */
  HTML5History.prototype.parse = function parse (path) {
    if ( path === void 0 ) path = location.href;

    var query = '';

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    var base = getPath(location.origin);
    var baseIndex = path.indexOf(base);

    if (baseIndex > -1) {
      path = path.slice(baseIndex + base.length);
    }

    return {
      path: path,
      file: this.getFile(path),
      query: parseQuery(query)
    }
  };

  return HTML5History;
}(History));

function routerMixin(proto) {
  proto.route = {};
}

var lastRoute = {};

function updateRender(vm) {
  vm.router.normalize();
  vm.route = vm.router.parse();
  body.setAttribute('data-page', vm.route.file);
}

function initRouter(vm) {
  var config = vm.config;
  var mode = config.routerMode || 'hash';
  var router;

  if (mode === 'history' && supportsPushState) {
    router = new HTML5History(config);
  } else {
    router = new HashHistory(config);
  }

  vm.router = router;
  updateRender(vm);
  lastRoute = vm.route;

  router.onchange(function (_) {
    updateRender(vm);
    vm._updateRender();

    if (lastRoute.path === vm.route.path) {
      vm.$resetEvents();
      return
    }

    vm.$fetch();
    lastRoute = vm.route;
  });
}

function eventMixin(proto) {
  proto.$resetEvents = function () {
    scrollIntoView(this.route.path, this.route.query.id);

    if (this.config.loadNavbar) {
      getAndActive(this.router, 'nav');
    }
  };
}

function initEvent(vm) {
  // Bind toggle button
  btn('button.sidebar-toggle', vm.router);
  collapse('.sidebar', vm.router);
  // Bind sticky effect
  if (vm.config.coverpage) {
    !isMobile && on('scroll', sticky);
  } else {
    body.classList.add('sticky');
  }
}

function loadNested(path, qs, file, next, vm, first) {
  path = first ? path : path.replace(/\/$/, '');
  path = getParentPath(path);

  if (!path) {
    return
  }

  get(
    vm.router.getFile(path + file) + qs,
    false,
    vm.config.requestHeaders
  ).then(next, function (_) { return loadNested(path, qs, file, next, vm); });
}

function fetchMixin(proto) {
  var last;

  var abort = function () { return last && last.abort && last.abort(); };
  var request = function (url, hasbar, requestHeaders) {
    abort();
    last = get(url, true, requestHeaders);
    return last
  };

  var get404Path = function (path, config) {
    var notFoundPage = config.notFoundPage;
    var ext = config.ext;
    var defaultPath = '_404' + (ext || '.md');
    var key;
    var path404;

    switch (typeof notFoundPage) {
      case 'boolean':
        path404 = defaultPath;
        break
      case 'string':
        path404 = notFoundPage;
        break

      case 'object':
        key = Object.keys(notFoundPage)
          .sort(function (a, b) { return b.length - a.length; })
          .find(function (key) { return path.match(new RegExp('^' + key)); });

        path404 = (key && notFoundPage[key]) || defaultPath;
        break

      default:
        break
    }

    return path404
  };

  proto._loadSideAndNav = function (path, qs, loadSidebar, cb) {
    var this$1 = this;

    return function () {
      if (!loadSidebar) {
        return cb()
      }

      var fn = function (result) {
        this$1._renderSidebar(result);
        cb();
      };

      // Load sidebar
      loadNested(path, qs, loadSidebar, fn, this$1, true);
    }
  };

  proto._fetch = function (cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    var ref = this.route;
    var path = ref.path;
    var query = ref.query;
    var qs = stringifyQuery(query, ['id']);
    var ref$1 = this.config;
    var loadNavbar = ref$1.loadNavbar;
    var requestHeaders = ref$1.requestHeaders;
    var loadSidebar = ref$1.loadSidebar;
    // Abort last request

    var file = this.router.getFile(path);
    var req = request(file + qs, true, requestHeaders);

    // Current page is html
    this.isHTML = /\.html$/g.test(file);

    // Load main content
    req.then(
      function (text, opt) { return this$1._renderMain(
          text,
          opt,
          this$1._loadSideAndNav(path, qs, loadSidebar, cb)
        ); },
      function (_) {
        this$1._fetchFallbackPage(file, qs, cb) || this$1._fetch404(file, qs, cb);
      }
    );

    // Load nav
    loadNavbar &&
      loadNested(
        path,
        qs,
        loadNavbar,
        function (text) { return this$1._renderNav(text); },
        this,
        true
      );
  };

  proto._fetchCover = function () {
    var this$1 = this;

    var ref = this.config;
    var coverpage = ref.coverpage;
    var requestHeaders = ref.requestHeaders;
    var query = this.route.query;
    var root = getParentPath(this.route.path);

    if (coverpage) {
      var path = null;
      var routePath = this.route.path;
      if (typeof coverpage === 'string') {
        if (routePath === '/') {
          path = coverpage;
        }
      } else if (Array.isArray(coverpage)) {
        path = coverpage.indexOf(routePath) > -1 && '_coverpage';
      } else {
        var cover = coverpage[routePath];
        path = cover === true ? '_coverpage' : cover;
      }

      var coverOnly = Boolean(path) && this.config.onlyCover;
      if (path) {
        path = this.router.getFile(root + path);
        this.coverIsHTML = /\.html$/g.test(path);
        get(path + stringifyQuery(query, ['id']), false, requestHeaders).then(
          function (text) { return this$1._renderCover(text, coverOnly); }
        );
      } else {
        this._renderCover(null, coverOnly);
      }
      return coverOnly
    }
  };

  proto.$fetch = function (cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    var done = function () {
      callHook(this$1, 'doneEach');
      cb();
    };

    var onlyCover = this._fetchCover();

    if (onlyCover) {
      done();
    } else {
      this._fetch(function () {
        this$1.$resetEvents();
        done();
      });
    }
  };

  proto._fetchFallbackPage = function (path, qs, cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    var ref = this.config;
    var requestHeaders = ref.requestHeaders;
    var fallbackLanguages = ref.fallbackLanguages;
    var loadSidebar = ref.loadSidebar;

    if (!fallbackLanguages) {
      return false
    }

    var local = path.split('/')[1];

    if (fallbackLanguages.indexOf(local) === -1) {
      return false
    }
    var newPath = path.replace(new RegExp(("^/" + local)), '');
    var req = request(newPath + qs, true, requestHeaders);

    req.then(
      function (text, opt) { return this$1._renderMain(
          text,
          opt,
          this$1._loadSideAndNav(path, qs, loadSidebar, cb)
        ); },
      function () { return this$1._fetch404(path, qs, cb); }
    );

    return true
  };
  /**
   * Load the 404 page
   * @param path
   * @param qs
   * @param cb
   * @returns {*}
   * @private
   */
  proto._fetch404 = function (path, qs, cb) {
    var this$1 = this;
    if ( cb === void 0 ) cb = noop;

    var ref = this.config;
    var loadSidebar = ref.loadSidebar;
    var requestHeaders = ref.requestHeaders;
    var notFoundPage = ref.notFoundPage;

    var fnLoadSideAndNav = this._loadSideAndNav(path, qs, loadSidebar, cb);
    if (notFoundPage) {
      var path404 = get404Path(path, this.config);

      request(this.router.getFile(path404), true, requestHeaders).then(
        function (text, opt) { return this$1._renderMain(text, opt, fnLoadSideAndNav); },
        function () { return this$1._renderMain(null, {}, fnLoadSideAndNav); }
      );
      return true
    }

    this._renderMain(null, {}, fnLoadSideAndNav);
    return false
  };
}

function initFetch(vm) {
  var ref = vm.config;
  var loadSidebar = ref.loadSidebar;

  // Server-Side Rendering
  if (vm.rendered) {
    var activeEl = getAndActive(vm.router, '.sidebar-nav', true, true);
    if (loadSidebar && activeEl) {
      activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__;
    }
    vm._bindEventOnRendered(activeEl);
    vm.$resetEvents();
    callHook(vm, 'doneEach');
    callHook(vm, 'ready');
  } else {
    vm.$fetch(function (_) { return callHook(vm, 'ready'); });
  }
}

function initMixin(proto) {
  proto._init = function () {
    var vm = this;
    vm.config = config();

    initLifecycle(vm); // Init hooks
    initPlugin(vm); // Install plugins
    callHook(vm, 'init');
    initRouter(vm); // Add router
    initRender(vm); // Render base DOM
    initEvent(vm); // Bind events
    initFetch(vm); // Fetch data
    callHook(vm, 'mounted');
  };
}

function initPlugin(vm) {
  [].concat(vm.config.plugins).forEach(function (fn) { return isFn(fn) && fn(vm._lifecycle, vm); });
}



var util = Object.freeze({
	cached: cached,
	hyphenate: hyphenate,
	hasOwn: hasOwn,
	merge: merge,
	isPrimitive: isPrimitive,
	noop: noop,
	isFn: isFn,
	inBrowser: inBrowser,
	isMobile: isMobile,
	supportsPushState: supportsPushState,
	parseQuery: parseQuery,
	stringifyQuery: stringifyQuery,
	isAbsolutePath: isAbsolutePath,
	getParentPath: getParentPath,
	cleanPath: cleanPath,
	getPath: getPath,
	replaceSlug: replaceSlug
});

function initGlobalAPI () {
  window.Docsify = {util: util, dom: dom, get: get, slugify: slugify};
  window.DocsifyCompiler = Compiler;
  window.marked = marked;
  window.Prism = prism;
}

/**
 * Fork https://github.com/bendrucker/document-ready/blob/master/index.js
 */
function ready(callback) {
  var state = document.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', callback);
}

function Docsify() {
  this._init();
}

var proto = Docsify.prototype;

initMixin(proto);
routerMixin(proto);
renderMixin(proto);
fetchMixin(proto);
eventMixin(proto);

/**
 * Global API
 */
initGlobalAPI();

/**
 * Version
 */
Docsify.version = '4.7.0';

/**
 * Run Docsify
 */
ready(function (_) { return new Docsify(); });

}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)))

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pagination__ = __webpack_require__(80);


window.$docsify = window.$docsify || {}

window.$docsify.plugins = [__WEBPACK_IMPORTED_MODULE_0__pagination__["a" /* install */]].concat(window.$docsify.plugins || [])


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = install;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component_query__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component_query___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_component_query__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_component_closest__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_component_closest___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_component_closest__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_component_matches_selector__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_component_matches_selector___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_component_matches_selector__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stylesheet_css__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stylesheet_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__stylesheet_css__);





/**
 * constants
 */
const DEFAULT_OPTIONS = {
  previousText: 'PREVIOUS',
  nextText: 'NEXT',
}
const CONTAINER_CLASSNAME = 'docsify-pagination-container'

/**
 * basic utilities
 */
function toArray (elements) {
  return Array.prototype.slice.call(elements)
}
function findHyperlink (li) {
  return __WEBPACK_IMPORTED_MODULE_0_component_query___default()('a', li)
}
function isALinkTo (path, element) {
  if (arguments.length === 1) {
    return (element) => isALinkTo(path, element)
  }
  return element.getAttribute('href').split('?')[0] === `#${path}`
}


/**
 * core renderer
 */
class Link {
  constructor (element) {
    if (!element) {
      return
    }
    this.hyperlink = findHyperlink(element)
  }
  toJSON () {
    if (!this.hyperlink) {
      return
    }
    return {
      name: this.hyperlink.innerText,
      href: this.hyperlink.getAttribute('href'),
    }
  }
}

function pagination (vm) {
  try {
    const path = vm.route.path
    const all = toArray(__WEBPACK_IMPORTED_MODULE_0_component_query___default.a.all('.sidebar li a')).filter((element) => !__WEBPACK_IMPORTED_MODULE_2_component_matches_selector___default()(element, '.section-link'))
    const active = all.find(isALinkTo(path))
    const group = toArray((__WEBPACK_IMPORTED_MODULE_1_component_closest___default()(active, 'ul') || {}).children)
      .filter((element) => element.tagName.toUpperCase() === 'LI')
    const index = group.findIndex((item) => {
      const hyperlink = findHyperlink(item)
      return hyperlink && isALinkTo(path, hyperlink)
    })
    return {
      prev: new Link(group[index - 1]).toJSON(),
      next: new Link(group[index + 1]).toJSON(),
    }
  } catch (error) {
    return {}
  }
}

const template = {
  container () {
    return `<div class="${CONTAINER_CLASSNAME}"></div>`
  },

  inner (data, options) {
    return [
      data.prev && `
        <div class="pagination-item pagination-item--previous">
          <a href="${data.prev.href}">
            <div class="pagination-item-label">
              <svg class="icon" width="10" height="16" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
                <polyline fill="none" vector-effect="non-scaling-stroke" points="8,2 2,8 8,14"/>
              </svg>
              <span>${options.previousText}</span>
            </div>
            <div class="pagination-item-title">${data.prev.name}</div>
          </a>
        </div>
      `,
      data.next && `
        <div class="pagination-item pagination-item--next">
          <a href="${data.next.href}">
            <div class="pagination-item-label">
              <span>${options.nextText}</span>
              <svg width="10" height="16" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
                <polyline fill="none" vector-effect="non-scaling-stroke" points="2,2 8,8 2,14"/>
              </svg>
            </div>
            <div class="pagination-item-title">${data.next.name}</div>
          </a>
        </div>
      `
    ].filter(Boolean).join('')
  },
}

/**
 * installation
 */
function install (hook, vm) {
  let options = Object.assign({}, DEFAULT_OPTIONS, vm.config.pagination || {})

  function render () {
    const container = __WEBPACK_IMPORTED_MODULE_0_component_query___default()(`.${CONTAINER_CLASSNAME}`)
    if (!container) {
      return
    }
    container.innerHTML = template.inner(pagination(vm), options)
  }

  hook.afterEach((html) => html + template.container())
  hook.doneEach(() => render())
}


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module Dependencies
 */

try {
  var matches = __webpack_require__(21)
} catch (err) {
  var matches = __webpack_require__(21)
}

/**
 * Export `closest`
 */

module.exports = closest

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} scope (optional)
 */

function closest (el, selector, scope) {
  scope = scope || document.documentElement;

  // walk up the dom
  while (el && el !== scope) {
    if (matches(el, selector)) return el;
    el = el.parentNode;
  }

  // check scope for match
  return matches(el, selector) ? el : null;
}


/***/ }),
/* 82 */,
/* 83 */
/***/ (function(module, exports) {

/*!
 * docsify-copy-code
 * v2.0.2
 * https://github.com/jperasmus/docsify-copy-code
 * (c) 2018 JP Erasmus <jperasmus11@gmail.com>
 * MIT license
 */
(function() {
    "use strict";
    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === "undefined") {
            return;
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.type = "text/css";
        if (insertAt === "top") {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild);
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
    var css = '.docsify-copy-code-button{z-index:1;right:0;padding:10px;opacity:0;border:0;border-radius:0;outline:0;cursor:pointer}.docsify-copy-code-button,.docsify-copy-code-button:after{position:absolute;top:0;background:#ccc;color:#fff;transition:all .25s ease}.docsify-copy-code-button:after{content:"Copied!";z-index:0;right:100%;margin:5px 10px 0;padding:5px;border-radius:3px;font-size:11px;-webkit-transform:translateX(120%) scale(0);transform:translateX(120%) scale(0)}.docsify-copy-code-button.success:after{-webkit-transform:translateX(0) scale(1);transform:translateX(0) scale(1)}pre[v-pre]:hover .docsify-copy-code-button{opacity:1}';
    styleInject(css);
    function docsifyCopyCode(hook, vm) {
        hook.doneEach(function() {
            var codeBlocks = Array.apply(null, document.querySelectorAll("pre[v-pre]"));
            codeBlocks.forEach(function(element, i, obj) {
                var button = document.createElement("button");
                button.appendChild(document.createTextNode("Click to copy"));
                button.classList.add("docsify-copy-code-button");
                if (vm.config.themeColor) {
                    button.style.background = vm.config.themeColor;
                }
                button.addEventListener("click", function(event) {
                    var range = document.createRange();
                    var codeBlock = element.querySelector("code");
                    var selection = window.getSelection();
                    range.selectNode(codeBlock);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    try {
                        var successful = document.execCommand("copy");
                        if (successful) {
                            button.classList.add("success");
                            setTimeout(function() {
                                button.classList.remove("success");
                            }, 1e3);
                        }
                    } catch (err) {
                        button.classList.add("error");
                        setTimeout(function() {
                            button.classList.remove("error");
                        }, 1e3);
                    }
                    selection = window.getSelection();
                    if (typeof selection.removeRange === "function") {
                        selection.removeRange(range);
                    } else if (typeof selection.removeAllRanges === "function") {
                        selection.removeAllRanges();
                    }
                });
                element.appendChild(button);
            });
        });
    }
    if (document.querySelector('link[href*="docsify-copy-code"]')) {
        console.warn("[Deprecation] Link to external docsify-copy-code stylesheet is no longer necessary.");
    }
    window.DocsifyCopyCodePlugin = {
        init: function init() {
            return function(hook, vm) {
                hook.ready(function() {
                    console.warn("[Deprecation] Manually initializing docsify-copy-code using window.DocsifyCopyCodePlugin.init() is no longer necessary.");
                });
            };
        }
    };
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [ docsifyCopyCode ].concat(window.$docsify.plugins || []);
})();
//# sourceMappingURL=docsify-copy-code.js.map


/***/ }),
/* 84 */,
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(86);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
module.exports = __webpack_require__(3).Object.assign;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(8);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(92) });


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(10) && !__webpack_require__(22)(function () {
  return Object.defineProperty(__webpack_require__(23)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(9);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(39);
var gOPS = __webpack_require__(96);
var pIE = __webpack_require__(97);
var toObject = __webpack_require__(45);
var IObject = __webpack_require__(40);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(22)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(16);
var toIObject = __webpack_require__(24);
var arrayIndexOf = __webpack_require__(94)(false);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(24);
var toLength = __webpack_require__(41);
var toAbsoluteIndex = __webpack_require__(95);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 97 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(99);
__webpack_require__(100);
__webpack_require__(107);
__webpack_require__(111);
__webpack_require__(123);
__webpack_require__(124);
module.exports = __webpack_require__(3).Promise;


/***/ }),
/* 99 */
/***/ (function(module, exports) {



/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(101)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(47)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var defined = __webpack_require__(25);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(104);
var descriptor = __webpack_require__(38);
var setToStringTag = __webpack_require__(29);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(2)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(6);
var dPs = __webpack_require__(105);
var enumBugKeys = __webpack_require__(44);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(23)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(48).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var anObject = __webpack_require__(6);
var getKeys = __webpack_require__(39);

module.exports = __webpack_require__(10) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(16);
var toObject = __webpack_require__(45);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(108);
var global = __webpack_require__(0);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(11);
var TO_STRING_TAG = __webpack_require__(2)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(109);
var step = __webpack_require__(110);
var Iterators = __webpack_require__(11);
var toIObject = __webpack_require__(24);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(47)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 109 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(28);
var global = __webpack_require__(0);
var ctx = __webpack_require__(13);
var classof = __webpack_require__(49);
var $export = __webpack_require__(8);
var isObject = __webpack_require__(9);
var aFunction = __webpack_require__(14);
var anInstance = __webpack_require__(112);
var forOf = __webpack_require__(113);
var speciesConstructor = __webpack_require__(50);
var task = __webpack_require__(51).set;
var microtask = __webpack_require__(118)();
var newPromiseCapabilityModule = __webpack_require__(30);
var perform = __webpack_require__(52);
var userAgent = __webpack_require__(119);
var promiseResolve = __webpack_require__(53);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(2)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(120)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(29)($Promise, PROMISE);
__webpack_require__(121)(PROMISE);
Wrapper = __webpack_require__(3)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(122)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(13);
var call = __webpack_require__(114);
var isArrayIter = __webpack_require__(115);
var anObject = __webpack_require__(6);
var toLength = __webpack_require__(41);
var getIterFn = __webpack_require__(116);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(6);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(11);
var ITERATOR = __webpack_require__(2)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(49);
var ITERATOR = __webpack_require__(2)('iterator');
var Iterators = __webpack_require__(11);
module.exports = __webpack_require__(3).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 117 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(51).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(17)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(7);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(3);
var dP = __webpack_require__(15);
var DESCRIPTORS = __webpack_require__(10);
var SPECIES = __webpack_require__(2)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(2)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(8);
var core = __webpack_require__(3);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(50);
var promiseResolve = __webpack_require__(53);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(8);
var newPromiseCapability = __webpack_require__(30);
var perform = __webpack_require__(52);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(131), __esModule: true };

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(133);

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);
var bind = __webpack_require__(57);
var Axios = __webpack_require__(135);
var defaults = __webpack_require__(34);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(61);
axios.CancelToken = __webpack_require__(150);
axios.isCancel = __webpack_require__(60);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(151);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 134 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(34);
var utils = __webpack_require__(1);
var InterceptorManager = __webpack_require__(145);
var dispatchRequest = __webpack_require__(146);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(59);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);
var transformData = __webpack_require__(147);
var isCancel = __webpack_require__(60);
var defaults = __webpack_require__(34);
var isAbsoluteURL = __webpack_require__(148);
var combineURLs = __webpack_require__(149);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(61);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 152 */,
/* 153 */,
/* 154 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(64);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ })
]);
//# sourceMappingURL=vendor.3f5845ca1fdb2ec48cad.js.map