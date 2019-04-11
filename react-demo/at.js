/**
 * @license
 * at.js 2.0.1 | (c) Adobe Systems Incorporated | All rights reserved
 * zepto.js | (c) 2010-2016 Thomas Fuchs | zeptojs.com/license
*/
window.adobe = window.adobe || {};
window.adobe.target = (function () {
'use strict';

// This is used to make RequireJS happy
var define;
var _win = window;
var _doc = document;
var _isIE10OrModernBrowser = _doc.documentMode ? _doc.documentMode >= 10 : true;
var _isStandardMode = _doc.compatMode && _doc.compatMode === 'CSS1Compat';
var _isEnabled = _isStandardMode && _isIE10OrModernBrowser;
var _globalSettings = _win.targetGlobalSettings;

function empty() {}

if (!_isEnabled || (_globalSettings && _globalSettings.enabled === false)) {
  _win.adobe = _win.adobe || {};
  _win.adobe.target = {
    VERSION: '',
    event: {},
    getOffer: empty,
    applyOffer: empty,
    trackEvent: empty,
    registerExtension: empty,
    triggerView: empty,
    init: empty,
  };
  _win.mboxCreate = empty;
  _win.mboxDefine = empty;
  _win.mboxUpdate = empty;

  if ('console' in _win && 'warn' in _win.console) {
    _win.console.warn('AT: Adobe Target content delivery is disabled. Update your DOCTYPE to support Standards mode.');
  }

  return _win.adobe.target;
}


var index = window;

var index$1 = document;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}
	return Object(val);
}
function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}
		var test1 = new String('abc');
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}
		return true;
	} catch (err) {
		return false;
	}
}
var index$2 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;
	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);
		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}
		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}
	return to;
};

var index$3 = index$2;

var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
function baseGetTag(value) {
  return objectToString(value);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

function isObject(value) {
  var type = typeof value === "undefined" ? "undefined" : _typeof(value);
  var notNull = value != null;
  return notNull && (type === "object" || type === "function");
}

var funcTag = "[object Function]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  return baseGetTag(value) === funcTag;
}

function delay(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!isFunction(func)) {
    return -1;
  }
  return setTimeout(func, Number(wait) || 0);
}
function cancelDelay() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  if (id === -1) {
    return;
  }
  clearTimeout(id);
}

function isNil(value) {
  return value == null;
}

var isArray = Array.isArray;

function identity(value) {
  return value;
}

function castFunction(value) {
  return isFunction(value) ? value : identity;
}

function keys(object) {
  if (isNil(object)) {
    return [];
  }
  return Object.keys(object);
}

var arrayEach = function arrayEach(iteratee, collection) {
  return collection.forEach(iteratee);
};

var baseEach = function baseEach(iteratee, collection) {
  arrayEach(function (key) {
    return iteratee(collection[key], key);
  }, keys(collection));
};

var arrayFilter = function arrayFilter(predicate, collection) {
  return collection.filter(predicate);
};
var baseFilter = function baseFilter(predicate, collection) {
  var result = {};
  baseEach(function (value, key) {
    if (predicate(value, key)) {
      result[key] = value;
    }
  }, collection);
  return result;
};
function filter(predicate, collection) {
  if (isNil(collection)) {
    return [];
  }
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(castFunction(predicate), collection);
}

function first(array) {
  return array && array.length ? array[0] : undefined;
}

function flatten(array) {
  if (isNil(array)) {
    return [];
  }
  return [].concat.apply([], array);
}

function flow(funcs) {
  var _this = this;
  var length = funcs ? funcs.length : 0;
  var index = length;
  while (index -= 1) {
    if (!isFunction(funcs[index])) {
      throw new TypeError("Expected a function");
    }
  }
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var i = 0;
    var result = length ? funcs[i].apply(_this, args) : args[0];
    while ((i += 1) < length) {
      result = funcs[i].call(_this, result);
    }
    return result;
  };
}

function forEach(iteratee, collection) {
  if (isNil(collection)) {
    return;
  }
  var func = isArray(collection) ? arrayEach : baseEach;
  func(castFunction(iteratee), collection);
}

function isObjectLike(value) {
  var notNull = value != null;
  return notNull && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object";
}

var stringTag = "[object String]";
function isString(value) {
  return typeof value === "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) === stringTag;
}

function hash(string) {
  if (!isString(string)) {
    return -1;
  }
  var result = 0;
  var length = string.length;
  for (var i = 0; i < length; i += 1) {
    result = (result << 5) - result + string.charCodeAt(i) & 0xffffffff;
  }
  return result;
}

var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value === "number" && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

var arrayMap = function arrayMap(iteratee, collection) {
  return collection.map(iteratee);
};

function baseValues(props, object) {
  return arrayMap(function (key) {
    return object[key];
  }, props);
}
function copyArray(source) {
  var index = 0;
  var length = source.length;
  var array = Array(length);
  while (index < length) {
    array[index] = source[index];
    index += 1;
  }
  return array;
}
function stringToArray(str) {
  return str.split("");
}
function toArray$1(value) {
  if (isNil(value)) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  return baseValues(keys(value), value);
}

var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || isString(value) || isFunction(value.splice))) {
    return !value.length;
  }
  for (var key in value) {
    if (hasOwnProperty$1.call(value, key)) {
      return false;
    }
  }
  return true;
}

var stringProto = String.prototype;
var nativeStringTrim = stringProto.trim;
function trim(string) {
  return isNil(string) ? "" : nativeStringTrim.call(string);
}

function isBlank(value) {
  return isString(value) ? !trim(value) : isEmpty(value);
}

var objectTag = "[object Object]";
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function getPrototype(value) {
  return Object.getPrototypeOf(Object(value));
}
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
}

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

var isNotBlank = function isNotBlank(value) {
  return !isBlank(value);
};

var numberTag = "[object Number]";
function isNumber(value) {
  return typeof value === "number" || isObjectLike(value) && baseGetTag(value) === numberTag;
}

function join(joiner, collection) {
  if (!isArray(collection)) {
    return "";
  }
  return collection.join(joiner || "");
}

var baseMap = function baseMap(iteratee, collection) {
  var result = {};
  baseEach(function (value, key) {
    result[key] = iteratee(value, key);
  }, collection);
  return result;
};
function map(iteratee, collection) {
  if (isNil(collection)) {
    return [];
  }
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(castFunction(iteratee), collection);
}

function noop() {
}

function now() {
  return new Date().getTime();
}

var arrayReduce = function arrayReduce(iteratee, accumulator, collection) {
  return collection.reduce(iteratee, accumulator);
};
var baseReduce = function baseReduce(iteratee, accumulator, collection) {
  var localAcc = accumulator;
  baseEach(function (value, key) {
    localAcc = iteratee(localAcc, value, key);
  }, collection);
  return localAcc;
};
function reduce(iteratee, accumulator, collection) {
  if (isNil(collection)) {
    return accumulator;
  }
  var func = isArray(collection) ? arrayReduce : baseReduce;
  return func(castFunction(iteratee), accumulator, collection);
}

var arrayProto = Array.prototype;
var nativeReverse = arrayProto.reverse;
function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}

function split(separator, string) {
  if (isBlank(string)) {
    return [];
  }
  return string.split(separator || "");
}

function random(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}
function uuid() {
  var d = now();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + random(0, 16)) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
  });
}

var TYPE = "type";
var CONTENT = "content";
var HEIGHT = "height";
var WIDTH = "width";
var LEFT = "left";
var TOP = "top";
var FROM = "from";
var TO = "to";
var PRIORITY = "priority";
var SELECTOR = "selector";
var CSS_SELECTOR = "cssSelector";
var SET_HTML = "setHtml";
var SET_CONTENT = "setContent";
var SET_TEXT = "setText";
var SET_JSON = "setJson";
var SET_ATTRIBUTE = "setAttribute";
var SET_IMAGE_SOURCE = "setImageSource";
var SET_STYLE = "setStyle";
var REARRANGE = "rearrange";
var RESIZE = "resize";
var MOVE = "move";
var REMOVE = "remove";
var CUSTOM_CODE = "customCode";
var REDIRECT = "redirect";
var TRACK_CLICK = "trackClick";
var SIGNAL_CLICK = "signalClick";
var INSERT_BEFORE = "insertBefore";
var INSERT_AFTER = "insertAfter";
var APPEND_HTML = "appendHtml";
var APPEND_CONTENT = "appendContent";
var PREPEND_HTML = "prependHtml";
var PREPEND_CONTENT = "prependContent";
var REPLACE_HTML = "replaceHtml";
var REPLACE_CONTENT = "replaceContent";
var DEBUG = "mboxDebug";
var DISABLE = "mboxDisable";
var AUTHORING = "mboxEdit";
var CHECK = "check";
var TRUE = "true";
var MBOX_LENGTH = 250;
var DATA_SRC = "data-at-src";
var JSON$1 = "json";
var HTML = "html";
var DYNAMIC = "dynamic";
var SCRIPT = "script";
var SRC = "src";
var ID = "id";
var CLASS = "class";
var CLICK = "click";
var HEAD_TAG = "head";
var SCRIPT_TAG = "script";
var STYLE_TAG = "style";
var LINK_TAG = "link";
var IMAGE_TAG = "img";
var DIV_TAG = "div";
var DELIVERY_DISABLED = 'Adobe Target content delivery is disabled. Ensure that you can save cookies to your current domain, there is no "mboxDisable" cookie and there is no "mboxDisable" parameter in query string.';
var ALREADY_INITIALIZED = "Adobe Target has already been initialized.";
var OPTIONS_REQUIRED = "options argument is required";
var REQUEST_REQUIRED = "request option is required";
var RESPONE_REQUIRED = "response option is required";
var EXECUTE_OR_PREFETCH_REQUIRED = "execute or prefetch is required";
var MBOX_REQUIRED = "mbox option is required";
var MBOX_TOO_LONG = "mbox option is too long";
var SUCCESS_REQUIRED = "success option is required";
var ERROR_REQUIRED = "error option is required";
var OFFER_REQUIRED = "offer option is required";
var UNEXPECTED_ERROR = "Unexpected error";
var REQUEST_FAILED = "request failed";
var REQUEST_SUCCEEDED = "request succeeded";
var ACTION_RENDERED = "Action rendered successfully";
var ACTION_RENDERING = "Rendering action";
var EMPTY_CONTENT = "Action has no content";
var EMPTY_ATTRIBUTE = "Action has no attributes";
var EMPTY_PROPERTY = "Action has no CSS properties";
var EMPTY_SIZES = "Action has no height or width";
var EMPTY_COORDINATES = "Action has no left, top or position";
var EMPTY_REARRANGE = "Action has no from or to";
var EMPTY_URL = "Action has no url";
var EMPTY_IMAGE_URL = "Action has no image url";
var REARRANGE_MISSING = "Rearrange elements are missing";
var LOADING_IMAGE = "Loading image";
var TRACK_EVENT_SUCCESS = "Track event request succeeded";
var TRACK_EVENT_ERROR = "Track event request failed";
var NO_ACTIONS = "No actions to be rendered";
var REDIRECT_ACTION = "Redirect action";
var REMOTE_SCRIPT = "Script load";
var ERROR = "error";
var WARNING = "warning";
var UNKNOWN = "unknown";
var VALID = "valid";
var SUCCESS = "success";
var RENDER = "render";
var METRIC = "metric";
var MBOX = "mbox";
var OFFER = "offer";
var NAME = "name";
var STATUS = "status";
var PARAMS = "params";
var ACTIONS = "actions";
var RESPONSE_TOKENS = "responseTokens";
var DATA = "data";
var RESPONSE = "response";
var REQUEST = "request";
var PROVIDER = "provider";
var PAGE_LOAD = "pageLoad";
var FLICKER_CONTROL_CLASS = "at-flicker-control";
var MARKER_CSS_CLASS = "at-element-marker";
var CLICK_TRACKING_CSS_CLASS = "at-element-click-tracking";
var ENABLED = "enabled";
var CLIENT_CODE = "clientCode";
var IMS_ORG_ID = "imsOrgId";
var SERVER_DOMAIN = "serverDomain";
var TIMEOUT = "timeout";
var GLOBAL_MBOX_NAME = "globalMboxName";
var GLOBAL_MBOX_AUTO_CREATE = "globalMboxAutoCreate";
var VERSION = "version";
var DEFAULT_CONTENT_HIDDEN_STYLE = "defaultContentHiddenStyle";
var DEFAULT_CONTENT_VISIBLE_STYLE = "defaultContentVisibleStyle";
var BODY_HIDDEN_STYLE = "bodyHiddenStyle";
var BODY_HIDING_ENABLED = "bodyHidingEnabled";
var DEVICE_ID_LIFETIME = "deviceIdLifetime";
var SESSION_ID_LIFETIME = "sessionIdLifetime";
var SELECTORS_POLLING_TIMEOUT = "selectorsPollingTimeout";
var VISITOR_API_TIMEOUT = "visitorApiTimeout";
var OVERRIDE_MBOX_EDGE_SERVER = "overrideMboxEdgeServer";
var OVERRIDE_MBOX_EDGE_SERVER_TIMEOUT = "overrideMboxEdgeServerTimeout";
var OPTOUT_ENABLED = "optoutEnabled";
var SECURE_ONLY = "secureOnly";
var SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT = "supplementalDataIdParamTimeout";
var AUTHORING_SCRIPT_URL = "authoringScriptUrl";
var SCHEME = "scheme";
var COOKIE_DOMAIN = "cookieDomain";
var MBOX_PARAMS = "mboxParams";
var GLOBAL_MBOX_PARAMS = "globalMboxParams";
var URL_SIZE_LIMIT = "urlSizeLimit";
var DEVICE_ID_COOKIE = "PC";
var EDGE_CLUSTER_COOKIE = "mboxEdgeCluster";
var SESSION_ID_COOKIE = "session";
var TICK_EVENT = "at-tick";
var RENDER_COMPLETE_EVENT = "at-render-complete";
var TIMEOUT_EVENT = "at-timeout";
var NO_OFFERS_EVENT = "at-no-offers";
var DELIVERY_FAILED_EVENT = "at-delivery-failed";
var OPTION_HIDDEN_EVENT = "at-option-hidden";
var TRACES_SUFFIX = "Traces";
var SETTINGS = "settings";
var CLIENT_TRACES = "client" + TRACES_SUFFIX;
var SERVER_TRACES = "server" + TRACES_SUFFIX;
var TRACES = "___target_traces";
var GLOBAL_SETTINGS = "targetGlobalSettings";
var DATA_PROVIDER = "dataProvider";
var DATA_PROVIDERS = DATA_PROVIDER + "s";
var ENDPOINT = "endpoint";
var VIEWS_ENABLED = "viewsEnabled";
var PAGE_LOAD_ENABLED = "pageLoadEnabled";
var AUTH_STATE = "authState";
var AUTHENTICATED_STATE = "authenticatedState";
var INTEGRATION_CODE = "integrationCode";
var PAGE = "page";
var VIEW = "view";
var VIEWS = "views";
var OPTIONS = "options";
var METRICS = "metrics";
var VIEW_START = "at-view-start";
var VIEW_NAME = "viewName";
var DISPLAY_EVENT = "display";
var CONTENT_TYPE = "Content-Type";
var TEXT_PLAIN = "text/plain";
var RENDERING_VIEW_FAILED = "View rendering failed";
var VIEW_DELIVERY_ERROR = "View delivery error";
var VIEW_DELIVERY_NO_SAVED = "View delivery, no saved views";
var VIEW_NAME_ERROR = "View name should be a non-empty string";
var PAGE_LOAD_DISABLED = "Page load disabled";

var FILE_PROTOCOL = "file:";
var IP_V4_REGEX = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
var STANDARD_DOMAIN_REGEX = /^(com|edu|gov|net|mil|org|nom|co|name|info|biz)$/i;
var config = {};
var OVERRIDABLE_SETTINGS = [ENABLED, CLIENT_CODE, IMS_ORG_ID, SERVER_DOMAIN, COOKIE_DOMAIN, TIMEOUT, MBOX_PARAMS, GLOBAL_MBOX_PARAMS, DEFAULT_CONTENT_HIDDEN_STYLE, DEFAULT_CONTENT_VISIBLE_STYLE, BODY_HIDDEN_STYLE, BODY_HIDING_ENABLED, SELECTORS_POLLING_TIMEOUT, VISITOR_API_TIMEOUT, OVERRIDE_MBOX_EDGE_SERVER, OVERRIDE_MBOX_EDGE_SERVER_TIMEOUT, OPTOUT_ENABLED, SECURE_ONLY, SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT, AUTHORING_SCRIPT_URL, URL_SIZE_LIMIT, ENDPOINT, PAGE_LOAD_ENABLED, VIEWS_ENABLED];
function overrideSettingsIfRequired(settings, globalSettings) {
  if (!settings.enabled) {
    return;
  }
  if (!isNil(globalSettings[GLOBAL_MBOX_AUTO_CREATE])) {
    settings[PAGE_LOAD_ENABLED] = globalSettings[GLOBAL_MBOX_AUTO_CREATE];
  }
  forEach(function (field) {
    if (!isNil(globalSettings[field])) {
      settings[field] = globalSettings[field];
    }
  }, OVERRIDABLE_SETTINGS);
}
function isIE10OrModernBrowser(doc) {
  var documentMode = doc.documentMode;
  return documentMode ? documentMode >= 10 : true;
}
function isStandardMode(doc) {
  var compatMode = doc.compatMode;
  return compatMode && compatMode === "CSS1Compat";
}
function isIPv4(domain) {
  return IP_V4_REGEX.test(domain);
}
function getCookieDomain(domain) {
  if (isIPv4(domain)) {
    return domain;
  }
  var parts = reverse(split(".", domain));
  var len = parts.length;
  if (len >= 3) {
    if (STANDARD_DOMAIN_REGEX.test(parts[1])) {
      return parts[2] + "." + parts[1] + "." + parts[0];
    }
  }
  if (len === 1) {
    return parts[0];
  }
  return parts[1] + "." + parts[0];
}
function overrideFromGlobalSettings(win, doc, settings) {
  var fileProtocol = win.location.protocol === FILE_PROTOCOL;
  var cookieDomain = "";
  if (!fileProtocol) {
    cookieDomain = getCookieDomain(win.location.hostname);
  }
  settings[COOKIE_DOMAIN] = cookieDomain;
  settings[ENABLED] = isStandardMode(doc) && isIE10OrModernBrowser(doc);
  overrideSettingsIfRequired(settings, win[GLOBAL_SETTINGS] || {});
}
function initConfig(settings) {
  overrideFromGlobalSettings(index, index$1, settings);
  var fileProtocol = index.location.protocol === FILE_PROTOCOL;
  config = index$3({}, settings);
  config[DEVICE_ID_LIFETIME] = settings[DEVICE_ID_LIFETIME] / 1000;
  config[SESSION_ID_LIFETIME] = settings[SESSION_ID_LIFETIME] / 1000;
  config[SCHEME] = config[SECURE_ONLY] || fileProtocol ? "https:" : "";
}
function getConfig() {
  return config;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var js_cookie = createCommonjsModule(function (module, exports) {
(function (factory) {
		var registeredInModuleLoader = false;
		if (typeof define === 'function' && define.amd) {
			define(factory);
			registeredInModuleLoader = true;
		}
		if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	})(function () {
		function extend() {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[i];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}
		function init(converter) {
			function api(key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}
				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);
					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}
					attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';
					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}
					if (!converter.write) {
						value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}
					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);
					var stringifiedAttributes = '';
					for (var attributeName in attributes) {
						if (!attributes[attributeName]) {
							continue;
						}
						stringifiedAttributes += '; ' + attributeName;
						if (attributes[attributeName] === true) {
							continue;
						}
						stringifiedAttributes += '=' + attributes[attributeName];
					}
					return document.cookie = key + '=' + value + stringifiedAttributes;
				}
				if (!key) {
					result = {};
				}
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;
				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');
					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}
					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);
						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}
						if (key === name) {
							result = cookie;
							break;
						}
						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}
				return result;
			}
			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};
			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};
			api.withConverter = init;
			return api;
		}
		return init(function () {});
	});
});

var cookie = js_cookie;
var index$4 = {
  get: cookie.get,
  set: cookie.set,
  remove: cookie.remove
};

function hasOwnProperty$3(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var decode = function decode(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};
  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;
    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
    if (!hasOwnProperty$3(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
  return obj;
};

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;
    case 'boolean':
      return v ? 'true' : 'false';
    case 'number':
      return isFinite(v) ? v : '';
    default:
      return '';
  }
};
var encode = function encode(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return Object.keys(obj).map(function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var index$5 = createCommonjsModule(function (module, exports) {
  exports.decode = exports.parse = decode;
  exports.encode = exports.stringify = encode;
});
var encode$1 = index$5.encode;
var stringify = index$5.stringify;
var decode$1 = index$5.decode;
var parse = index$5.parse;

var querystring = index$5;
var index$6 = {
  parse: function parse(string) {
    if (typeof string === 'string') {
      string = string.trim().replace(/^[?#&]/, '');
    }
    return querystring.parse(string);
  },
  stringify: function stringify(object) {
    return querystring.stringify(object);
  }
};

var index$7 = function parseURI(str, opts) {
  opts = opts || {};
  var o = {
    key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
    q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
  var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = 14;
  while (i--) {
    uri[o.key[i]] = m[i] || '';
  }uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });
  return uri;
};

var parseQueryString = index$6.parse,
    stringifyQueryString = index$6.stringify;
var ANCHOR = index$1.createElement("a");
var CACHE = {};
function decode$2(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}
function encode$2(value) {
  try {
    return encodeURIComponent(value);
  } catch (e) {
    return value;
  }
}
function parseUri(url) {
  if (CACHE[url]) {
    return CACHE[url];
  }
  ANCHOR.href = url;
  var parsedUri = index$7(ANCHOR.href);
  parsedUri.queryKey = parseQueryString(parsedUri.query);
  CACHE[url] = parsedUri;
  return CACHE[url];
}

var getCookie = index$4.get,
    setCookie = index$4.set,
    removeCookie = index$4.remove;
var MBOX_COOKIE$1 = "mbox";
function createCookie(name, value, expires) {
  return { name: name, value: value, expires: expires };
}
function deserialize(str) {
  var parts = split("#", str);
  if (isEmpty(parts) || parts.length < 3) {
    return null;
  }
  if (isNaN(parseInt(parts[2], 10))) {
    return null;
  }
  return createCookie(decode$2(parts[0]), decode$2(parts[1]), Number(parts[2]));
}
function getInternalCookies(cookieValue) {
  if (isBlank(cookieValue)) {
    return [];
  }
  return split("|", cookieValue);
}
function readCookies() {
  var cookies = map(deserialize, getInternalCookies(getCookie(MBOX_COOKIE$1)));
  var nowInSeconds = Math.ceil(now() / 1000);
  var isExpired = function isExpired(val) {
    return isObject(val) && nowInSeconds <= val.expires;
  };
  return reduce(function (acc, val) {
    acc[val.name] = val;
    return acc;
  }, {}, filter(isExpired, cookies));
}

function getTargetCookie(name) {
  var cookiesMap = readCookies();
  var cookie = cookiesMap[name];
  return isObject(cookie) ? cookie.value : "";
}
function serialize(cookie) {
  return join("#", [encode$2(cookie.name), encode$2(cookie.value), cookie.expires]);
}
function getExpires(cookie) {
  return cookie.expires;
}
function getMaxExpires(cookies) {
  var expires = map(getExpires, cookies);
  return Math.max.apply(null, expires);
}
function saveCookies(cookiesMap, domain) {
  var cookies = toArray$1(cookiesMap);
  var maxExpires = Math.abs(getMaxExpires(cookies) * 1000 - now());
  var serializedCookies = join("|", map(serialize, cookies));
  var expires = new Date(now() + maxExpires);
  setCookie(MBOX_COOKIE$1, serializedCookies, { domain: domain, expires: expires });
}
function setTargetCookie(options) {
  var name = options.name,
      value = options.value,
      expires = options.expires,
      domain = options.domain;
  var cookiesMap = readCookies();
  cookiesMap[name] = createCookie(name, value, Math.ceil(expires + now() / 1000));
  saveCookies(cookiesMap, domain);
}

function isCookiePresent(name) {
  return isNotBlank(getCookie(name));
}
function isParamPresent(win, name) {
  var location = win.location;
  var search = location.search;
  var params = parseQueryString(search);
  return isNotBlank(params[name]);
}
function isRefParamPresent(doc, name) {
  var referrer = doc.referrer;
  var parsedUri = parseUri(referrer);
  var refParams = parsedUri.queryKey;
  return isNil(refParams) ? false : isNotBlank(refParams[name]);
}
function exists(win, doc, name) {
  return isCookiePresent(name) || isParamPresent(win, name) || isRefParamPresent(doc, name);
}

function isCookieEnabled() {
  var config = getConfig();
  var cookieDomain = config[COOKIE_DOMAIN];
  setCookie(CHECK, TRUE, { domain: cookieDomain });
  var result = getCookie(CHECK) === TRUE;
  removeCookie(CHECK);
  return result;
}
function isDeliveryDisabled() {
  return exists(index, index$1, DISABLE);
}
function isDeliveryEnabled() {
  var config = getConfig();
  var enabled = config[ENABLED];
  return enabled && isCookieEnabled() && !isDeliveryDisabled();
}
function isDebugEnabled() {
  return exists(index, index$1, DEBUG);
}
function isAuthoringEnabled() {
  return exists(index, index$1, AUTHORING);
}

var ADOBE_TARGET_PREFIX = "AT:";
function exists$1(win, method) {
  var console = win.console;
  return !isNil(console) && isFunction(console[method]);
}
function warn(win, args) {
  var console = win.console;
  if (!exists$1(win, "warn")) {
    return;
  }
  console.warn.apply(console, [ADOBE_TARGET_PREFIX].concat(args));
}
function debug(win, args) {
  var console = win.console;
  if (!exists$1(win, "debug")) {
    return;
  }
  if (isDebugEnabled()) {
    console.debug.apply(console, [ADOBE_TARGET_PREFIX].concat(args));
  }
}

function logWarn() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  warn(index, args);
}
function logDebug() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  debug(index, args);
}

var TRACES_FORMAT_VERSION = "1";
function getSettings(config) {
  return reduce(function (acc, key) {
    acc[key] = config[key];
    return acc;
  }, {}, OVERRIDABLE_SETTINGS);
}
function initialize(win, config, debugEnabled) {
  var result = win[TRACES] || [];
  win[TRACES] = result;
  if (!debugEnabled) {
    return;
  }
  var oldPush = result.push;
  result[VERSION] = TRACES_FORMAT_VERSION;
  result[SETTINGS] = getSettings(config);
  result[CLIENT_TRACES] = [];
  result[SERVER_TRACES] = [];
  result.push = function push(trace) {
    result[SERVER_TRACES].push(index$3({ timestamp: now() }, trace));
    oldPush.call(this, trace);
  };
}
function saveTrace(win, namespace, trace, debugEnabled) {
  if (namespace === SERVER_TRACES) {
    win[TRACES].push(trace);
  }
  if (!debugEnabled) {
    return;
  }
  if (namespace !== SERVER_TRACES) {
    win[TRACES][namespace].push(index$3({ timestamp: now() }, trace));
  }
}

function initTraces() {
  initialize(index, getConfig(), isDebugEnabled());
}
function addServerTrace(trace) {
  saveTrace(index, SERVER_TRACES, trace, isDebugEnabled());
}
function addClientTrace(trace) {
  saveTrace(index, CLIENT_TRACES, trace, isDebugEnabled());
}

var promise = createCommonjsModule(function (module) {
  (function (root) {
    var setTimeoutFunc = setTimeout;
    function noop() {}
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    function Promise(fn) {
      if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      this._state = 0;
      this._handled = false;
      this._value = undefined;
      this._deferreds = [];
      doResolve(fn, this);
    }
    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise._immediateFn(function () {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }
    function resolve(self, newValue) {
      try {
        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }
    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }
    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise._immediateFn(function () {
          if (!self._handled) {
            Promise._unhandledRejectionFn(self._value);
          }
        });
      }
      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(function (value) {
          if (done) return;
          done = true;
          resolve(self, value);
        }, function (reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        });
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      var prom = new this.constructor(noop);
      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };
    Promise.all = function (arr) {
      var args = Array.prototype.slice.call(arr);
      return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.resolve = function (value) {
      if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
        return value;
      }
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
    Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
      setImmediate(fn);
    } || function (fn) {
      setTimeoutFunc(fn, 0);
    };
    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err);
      }
    };
    Promise._setImmediateFn = function _setImmediateFn(fn) {
      Promise._immediateFn = fn;
    };
    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
      Promise._unhandledRejectionFn = fn;
    };
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = Promise;
    } else if (!root.Promise) {
      root.Promise = Promise;
    }
  })(commonjsGlobal);
});

var index$8 = window.Promise || promise;

var ARRAY_EXPECTED = "Expected an array of promises";
function create(func) {
  return new index$8(func);
}
function resolve(value) {
  return index$8.resolve(value);
}
function reject(value) {
  return index$8.reject(value);
}
function race(arr) {
  if (!isArray(arr)) {
    return reject(new TypeError(ARRAY_EXPECTED));
  }
  return index$8.race(arr);
}
function all(arr) {
  if (!isArray(arr)) {
    return reject(new TypeError(ARRAY_EXPECTED));
  }
  return index$8.all(arr);
}
function timeout(promise, time, message) {
  var id = -1;
  var delayedPromise = create(function (_, rej) {
    id = delay(function () {
      return rej(new Error(message));
    }, time);
  });
  return race([promise, delayedPromise]).then(function (val) {
    cancelDelay(id);
    return val;
  }, function (err) {
    cancelDelay(id);
    throw err;
  });
}

var SESSION_ID$1 = uuid();
function saveSessionId(value, config) {
  setTargetCookie({
    name: SESSION_ID_COOKIE,
    value: value,
    expires: config[SESSION_ID_LIFETIME],
    domain: config[COOKIE_DOMAIN]
  });
}
function getSessionId() {
  var config = getConfig();
  var sessionId = getTargetCookie(SESSION_ID_COOKIE);
  if (isBlank(sessionId)) {
    saveSessionId(SESSION_ID$1, config);
  }
  return getTargetCookie(SESSION_ID_COOKIE);
}

function setDeviceId(value) {
  var config = getConfig();
  setTargetCookie({
    name: DEVICE_ID_COOKIE,
    value: value,
    expires: config[DEVICE_ID_LIFETIME],
    domain: config[COOKIE_DOMAIN]
  });
}
function getDeviceId() {
  return getTargetCookie(DEVICE_ID_COOKIE);
}

var CLUSTER_ID_REGEX = /.*\.(\d+)_\d+/;
function extractCluster(id) {
  if (isBlank(id)) {
    return "";
  }
  var result = CLUSTER_ID_REGEX.exec(id);
  if (isEmpty(result) || result.length !== 2) {
    return "";
  }
  return result[1];
}
function getEdgeCluster() {
  var config = getConfig();
  if (!config[OVERRIDE_MBOX_EDGE_SERVER]) {
    return "";
  }
  var result = getCookie(EDGE_CLUSTER_COOKIE);
  return isBlank(result) ? "" : result;
}
function setEdgeCluster(id) {
  var config = getConfig();
  if (!config[OVERRIDE_MBOX_EDGE_SERVER]) {
    return;
  }
  var domain = config[COOKIE_DOMAIN];
  var expires = new Date(now() + config[OVERRIDE_MBOX_EDGE_SERVER_TIMEOUT]);
  var savedCluster = getCookie(EDGE_CLUSTER_COOKIE);
  var attrs = { domain: domain, expires: expires };
  if (isNotBlank(savedCluster)) {
    setCookie(EDGE_CLUSTER_COOKIE, savedCluster, attrs);
    return;
  }
  var cluster = extractCluster(id);
  if (isBlank(cluster)) {
    return;
  }
  setCookie(EDGE_CLUSTER_COOKIE, cluster, attrs);
}

function bootstrapNotify(win, doc) {
  if (isFunction(win.CustomEvent)) {
    return;
  }
  function CustomEvent(event, params) {
    var evt = doc.createEvent("CustomEvent");
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = win.Event.prototype;
  win.CustomEvent = CustomEvent;
}
function createTracking(getSessionId, getDeviceId) {
  var sessionId = getSessionId();
  var deviceId = getDeviceId();
  var result = {};
  result.sessionId = sessionId;
  if (isNotBlank(deviceId)) {
    result.deviceId = deviceId;
    return result;
  }
  return result;
}
function notify(win, doc, eventName, detail) {
  var event = new win.CustomEvent(eventName, { detail: detail });
  doc.dispatchEvent(event);
}

bootstrapNotify(index, index$1);
var LIBRARY_LOADED = "at-library-loaded";
var REQUEST_START = "at-request-start";
var REQUEST_SUCCEEDED$1 = "at-request-succeeded";
var REQUEST_FAILED$1 = "at-request-failed";
var CONTENT_RENDERING_START = "at-content-rendering-start";
var CONTENT_RENDERING_SUCCEEDED = "at-content-rendering-succeeded";
var CONTENT_RENDERING_FAILED = "at-content-rendering-failed";
var CONTENT_RENDERING_NO_OFFERS = "at-content-rendering-no-offers";
var CONTENT_RENDERING_REDIRECT = "at-content-rendering-redirect";
function buildPayload(type, detail) {
  var mbox = detail.mbox,
      error = detail.error,
      url = detail.url,
      responseTokens = detail.responseTokens,
      execution = detail.execution;
  var tracking = createTracking(getSessionId, getDeviceId);
  var payload = { type: type, tracking: tracking };
  if (!isNil(mbox)) {
    payload.mbox = mbox;
  }
  if (!isNil(error)) {
    payload.error = error;
  }
  if (!isNil(url)) {
    payload.url = url;
  }
  if (!isEmpty(responseTokens)) {
    payload.responseTokens = responseTokens;
  }
  if (!isEmpty(execution)) {
    payload.execution = execution;
  }
  return payload;
}
function notifyLibraryLoaded() {
  var payload = buildPayload(LIBRARY_LOADED, {});
  notify(index, index$1, LIBRARY_LOADED, payload);
}
function notifyRequestStart(detail) {
  var payload = buildPayload(REQUEST_START, detail);
  notify(index, index$1, REQUEST_START, payload);
}
function notifyRequestSucceeded(detail, redirect) {
  var payload = buildPayload(REQUEST_SUCCEEDED$1, detail);
  payload.redirect = redirect;
  notify(index, index$1, REQUEST_SUCCEEDED$1, payload);
}
function notifyRequestFailed(detail) {
  var payload = buildPayload(REQUEST_FAILED$1, detail);
  notify(index, index$1, REQUEST_FAILED$1, payload);
}
function notifyRenderingStart(detail) {
  var payload = buildPayload(CONTENT_RENDERING_START, detail);
  notify(index, index$1, CONTENT_RENDERING_START, payload);
}
function notifyRenderingSucceeded(detail) {
  var payload = buildPayload(CONTENT_RENDERING_SUCCEEDED, detail);
  notify(index, index$1, CONTENT_RENDERING_SUCCEEDED, payload);
}
function notifyRenderingFailed(detail) {
  var payload = buildPayload(CONTENT_RENDERING_FAILED, detail);
  notify(index, index$1, CONTENT_RENDERING_FAILED, payload);
}
function notifyRenderingNoOffers(detail) {
  var payload = buildPayload(CONTENT_RENDERING_NO_OFFERS, detail);
  notify(index, index$1, CONTENT_RENDERING_NO_OFFERS, payload);
}
function notifyRenderingRedirect(detail) {
  var payload = buildPayload(CONTENT_RENDERING_REDIRECT, detail);
  notify(index, index$1, CONTENT_RENDERING_REDIRECT, payload);
}

var Promise$1 = index$8;
var getPromise = function getPromise(url, script) {
  return new Promise$1(function (resolve, reject) {
    if ('onload' in script) {
      script.onload = function () {
        resolve(script);
      };
      script.onerror = function () {
        reject(new Error('Failed to load script ' + url));
      };
    } else if ('readyState' in script) {
      script.onreadystatechange = function () {
        var rs = script.readyState;
        if (rs === 'loaded' || rs === 'complete') {
          script.onreadystatechange = null;
          resolve(script);
        }
      };
    }
  });
};
var index$9 = function index(url) {
  var script = document.createElement('script');
  script.src = url;
  script.async = true;
  var promise = getPromise(url, script);
  document.getElementsByTagName('head')[0].appendChild(script);
  return promise;
};

function E() {
}
E.prototype = {
  on: function on(name, callback, ctx) {
    var e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });
    return this;
  },
  once: function once(name, callback, ctx) {
    var self = this;
    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function emit(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function off(name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];
    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
      }
    }
    liveEvents.length ? e[name] = liveEvents : delete e[name];
    return this;
  }
};
var index$10 = E;

function create$1() {
  return new index$10();
}
function publishOn(eventBus, name, args) {
  eventBus.emit(name, args);
}
function subscribeTo(eventBus, name, func) {
  eventBus.on(name, func);
}
function subscribeOnceTo(eventBus, name, func) {
  eventBus.once(name, func);
}
function unsubscribeFrom(eventBus, name) {
  eventBus.off(name);
}

var EVENT_BUS = create$1();
function publish(name, args) {
  publishOn(EVENT_BUS, name, args);
}
function subscribe(name, func) {
  subscribeTo(EVENT_BUS, name, func);
}
function subscribeOnce(name, func) {
  subscribeOnceTo(EVENT_BUS, name, func);
}
function unsubscribe(name) {
  unsubscribeFrom(EVENT_BUS, name);
}

var $ = (function (window) {
  var Zepto = function () {
    var undefined,
        key,
        $,
        classList,
        emptyArray = [],
        _concat = emptyArray.concat,
        _filter = emptyArray.filter,
        _slice = emptyArray.slice,
        document = window.document,
        elementDisplay = {},
        classCache = {},
        cssNumber = {
      "column-count": 1,
      columns: 1,
      "font-weight": 1,
      "line-height": 1,
      opacity: 1,
      "z-index": 1,
      zoom: 1
    },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,
    methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"],
        adjacencyOperators = ["after", "prepend", "before", "append"],
        table = document.createElement("table"),
        tableRow = document.createElement("tr"),
        containers = {
      tr: document.createElement("tbody"),
      tbody: table,
      thead: table,
      tfoot: table,
      td: tableRow,
      th: tableRow,
      "*": document.createElement("div")
    },
        readyRE = /complete|loaded|interactive/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize,
        uniq,
        tempParent = document.createElement("div"),
        propMap = {
      tabindex: "tabIndex",
      readonly: "readOnly",
      'for': "htmlFor",
      'class': "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },
        isArray = Array.isArray || function (object) {
      return object instanceof Array;
    };
    zepto.matches = function (element, selector) {
      if (!selector || !element || element.nodeType !== 1) return false;
      var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
      if (matchesSelector) return matchesSelector.call(element, selector);
      var match,
          parent = element.parentNode,
          temp = !parent;
      if (temp) (parent = tempParent).appendChild(element);
      match = ~zepto.qsa(parent, selector).indexOf(element);
      temp && tempParent.removeChild(element);
      return match;
    };
    function type(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    }
    function isFunction(value) {
      return type(value) == "function";
    }
    function isWindow(obj) {
      return obj != null && obj == obj.window;
    }
    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }
    function isObject(obj) {
      return type(obj) == "object";
    }
    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }
    function likeArray(obj) {
      var length = !!obj && "length" in obj && obj.length,
          type = $.type(obj);
      return "function" != type && !isWindow(obj) && ("array" == type || length === 0 || typeof length == "number" && length > 0 && length - 1 in obj);
    }
    function compact(array) {
      return _filter.call(array, function (item) {
        return item != null;
      });
    }
    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    camelize = function camelize(str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : "";
      });
    };
    function dasherize(str) {
      return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    }
    uniq = function uniq(array) {
      return _filter.call(array, function (item, idx) {
        return array.indexOf(item) == idx;
      });
    };
    function classRE(name) {
      return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
    }
    function maybeAddPx(name, value) {
      return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
    }
    function defaultDisplay(nodeName) {
      var element, display;
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, "").getPropertyValue("display");
        element.parentNode.removeChild(element);
        display == "none" && (display = "block");
        elementDisplay[nodeName] = display;
      }
      return elementDisplay[nodeName];
    }
    function _children(element) {
      return "children" in element ? _slice.call(element.children) : $.map(element.childNodes, function (node) {
        if (node.nodeType == 1) return node;
      });
    }
    function Z(dom, selector) {
      var i,
          len = dom ? dom.length : 0;
      for (i = 0; i < len; i++) {
        this[i] = dom[i];
      }this.length = len;
      this.selector = selector || "";
    }
    zepto.fragment = function (html, name, properties) {
      var dom, nodes, container;
      if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
      if (!dom) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = "*";
        container = containers[name];
        container.innerHTML = "" + html;
        dom = $.each(_slice.call(container.childNodes), function () {
          container.removeChild(this);
        });
      }
      if (isPlainObject(properties)) {
        nodes = $(dom);
        $.each(properties, function (key, value) {
          if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
        });
      }
      return dom;
    };
    zepto.Z = function (dom, selector) {
      return new Z(dom, selector);
    };
    zepto.isZ = function (object) {
      return object instanceof zepto.Z;
    };
    zepto.init = function (selector, context) {
      var dom;
      if (!selector) return zepto.Z();else if (typeof selector == "string") {
        selector = selector.trim();
        if (selector[0] == "<" && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null;else if (context !== undefined)
          return $(context).find(selector);
        else dom = zepto.qsa(document, selector);
      } else if (isFunction(selector))
        return $(document).ready(selector);else if (zepto.isZ(selector))
        return selector;else {
        if (isArray(selector)) dom = compact(selector);else if (isObject(selector))
          dom = [selector], selector = null;else if (fragmentRE.test(selector))
          dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;else if (context !== undefined)
          return $(context).find(selector);
        else dom = zepto.qsa(document, selector);
      }
      return zepto.Z(dom, selector);
    };
    $ = function $(selector, context) {
      return zepto.init(selector, context);
    };
    function extend(target, source, deep) {
      for (key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
          if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
          extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
      }
    }
    $.extend = function (target) {
      var deep,
          args = _slice.call(arguments, 1);
      if (typeof target == "boolean") {
        deep = target;
        target = args.shift();
      }
      args.forEach(function (arg) {
        extend(target, arg, deep);
      });
      return target;
    };
    zepto.qsa = function (element, selector) {
      var found,
          maybeID = selector[0] == "#",
          maybeClass = !maybeID && selector[0] == ".",
          nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
      isSimple = simpleSelectorRE.test(nameOnly);
      return element.getElementById && isSimple && maybeID
      ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : _slice.call(isSimple && !maybeID && element.getElementsByClassName
      ? maybeClass ? element.getElementsByClassName(nameOnly)
      : element.getElementsByTagName(selector)
      : element.querySelectorAll(selector)
      );
    };
    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector);
    }
    $.contains = document.documentElement.contains ? function (parent, node) {
      return parent !== node && parent.contains(node);
    } : function (parent, node) {
      while (node && (node = node.parentNode)) {
        if (node === parent) return true;
      }return false;
    };
    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    function setAttribute(node, name, value) {
      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    }
    function className(node, value) {
      var klass = node.className || "",
          svg = klass && klass.baseVal !== undefined;
      if (value === undefined) return svg ? klass.baseVal : klass;
      svg ? klass.baseVal = value : node.className = value;
    }
    function deserializeValue(value) {
      try {
        return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
      } catch (e) {
        return value;
      }
    }
    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;
    $.isEmptyObject = function (obj) {
      var name;
      for (name in obj) {
        return false;
      }return true;
    };
    $.isNumeric = function (val) {
      var num = Number(val),
          type = typeof val === "undefined" ? "undefined" : _typeof(val);
      return val != null && type != "boolean" && (type != "string" || val.length) && !isNaN(num) && isFinite(num) || false;
    };
    $.inArray = function (elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i);
    };
    $.camelCase = camelize;
    $.trim = function (str) {
      return str == null ? "" : String.prototype.trim.call(str);
    };
    $.uuid = 0;
    $.support = {};
    $.expr = {};
    $.noop = function () {};
    $.map = function (elements, callback) {
      var value,
          values = [],
          i,
          key;
      if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i);
        if (value != null) values.push(value);
      } else for (key in elements) {
        value = callback(elements[key], key);
        if (value != null) values.push(value);
      }
      return flatten(values);
    };
    $.each = function (elements, callback) {
      var i, key;
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) {
          if (callback.call(elements[i], i, elements[i]) === false) return elements;
        }
      } else {
        for (key in elements) {
          if (callback.call(elements[key], key, elements[key]) === false) return elements;
        }
      }
      return elements;
    };
    $.grep = function (elements, callback) {
      return _filter.call(elements, callback);
    };
    if (window.JSON) $.parseJSON = JSON.parse;
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    });
    $.fn = {
      constructor: zepto.Z,
      length: 0,
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      splice: emptyArray.splice,
      indexOf: emptyArray.indexOf,
      concat: function concat() {
        var i,
            value,
            args = [];
        for (i = 0; i < arguments.length; i++) {
          value = arguments[i];
          args[i] = zepto.isZ(value) ? value.toArray() : value;
        }
        return _concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
      },
      map: function map(fn) {
        return $($.map(this, function (el, i) {
          return fn.call(el, i, el);
        }));
      },
      slice: function slice() {
        return $(_slice.apply(this, arguments));
      },
      ready: function ready(callback) {
        if (readyRE.test(document.readyState) && document.body) callback($);else document.addEventListener("DOMContentLoaded", function () {
          callback($);
        }, false);
        return this;
      },
      get: function get$$1(idx) {
        return idx === undefined ? _slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
      },
      toArray: function toArray$$1() {
        return this.get();
      },
      size: function size() {
        return this.length;
      },
      remove: function remove() {
        return this.each(function () {
          if (this.parentNode != null) this.parentNode.removeChild(this);
        });
      },
      each: function each(callback) {
        var len = this.length,
            idx = 0,
            el;
        while (idx < len) {
          el = this[idx];
          if (callback.call(el, idx, el) === false) {
            break;
          }
          idx++;
        }
        return this;
      },
      filter: function filter(selector) {
        if (isFunction(selector)) return this.not(this.not(selector));
        return $(_filter.call(this, function (element) {
          return zepto.matches(element, selector);
        }));
      },
      add: function add(selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      is: function is(selector) {
        return this.length > 0 && zepto.matches(this[0], selector);
      },
      not: function not(selector) {
        var nodes = [];
        if (isFunction(selector) && selector.call !== undefined) this.each(function (idx) {
          if (!selector.call(this, idx)) nodes.push(this);
        });else {
          var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? _slice.call(selector) : $(selector);
          this.forEach(function (el) {
            if (excludes.indexOf(el) < 0) nodes.push(el);
          });
        }
        return $(nodes);
      },
      has: function has(selector) {
        return this.filter(function () {
          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
        });
      },
      eq: function eq(idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
      },
      first: function first() {
        var el = this[0];
        return el && !isObject(el) ? el : $(el);
      },
      last: function last() {
        var el = this[this.length - 1];
        return el && !isObject(el) ? el : $(el);
      },
      find: function find(selector) {
        var result,
            $this = this;
        if (!selector) result = $();else if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) == "object") result = $(selector).filter(function () {
          var node = this;
          return emptyArray.some.call($this, function (parent) {
            return $.contains(parent, node);
          });
        });else if (this.length == 1) result = $(zepto.qsa(this[0], selector));else result = this.map(function () {
          return zepto.qsa(this, selector);
        });
        return result;
      },
      closest: function closest(selector, context) {
        var nodes = [],
            collection = (typeof selector === "undefined" ? "undefined" : _typeof(selector)) == "object" && $(selector);
        this.each(function (_, node) {
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
            node = node !== context && !isDocument(node) && node.parentNode;
          }if (node && nodes.indexOf(node) < 0) nodes.push(node);
        });
        return $(nodes);
      },
      parents: function parents(selector) {
        var ancestors = [],
            nodes = this;
        while (nodes.length > 0) {
          nodes = $.map(nodes, function (node) {
            if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
              ancestors.push(node);
              return node;
            }
          });
        }return filtered(ancestors, selector);
      },
      parent: function parent(selector) {
        return filtered(uniq(this.pluck("parentNode")), selector);
      },
      children: function children(selector) {
        return filtered(this.map(function () {
          return _children(this);
        }), selector);
      },
      contents: function contents() {
        return this.map(function () {
          return this.contentDocument || _slice.call(this.childNodes);
        });
      },
      siblings: function siblings(selector) {
        return filtered(this.map(function (i, el) {
          return _filter.call(_children(el.parentNode), function (child) {
            return child !== el;
          });
        }), selector);
      },
      empty: function empty() {
        return this.each(function () {
          this.innerHTML = "";
        });
      },
      pluck: function pluck(property) {
        return $.map(this, function (el) {
          return el[property];
        });
      },
      show: function show() {
        return this.each(function () {
          this.style.display == "none" && (this.style.display = "");
          if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
        });
      },
      replaceWith: function replaceWith(newContent) {
        return this.before(newContent).remove();
      },
      wrap: function wrap(structure) {
        var func = isFunction(structure);
        if (this[0] && !func) var dom = $(structure).get(0),
            clone = dom.parentNode || this.length > 1;
        return this.each(function (index) {
          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
        });
      },
      wrapAll: function wrapAll(structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure));
          var children;
          while ((children = structure.children()).length) {
            structure = children.first();
          }$(structure).append(this);
        }
        return this;
      },
      wrapInner: function wrapInner(structure) {
        var func = isFunction(structure);
        return this.each(function (index) {
          var self = $(this),
              contents = self.contents(),
              dom = func ? structure.call(this, index) : structure;
          contents.length ? contents.wrapAll(dom) : self.append(dom);
        });
      },
      unwrap: function unwrap() {
        this.parent().each(function () {
          $(this).replaceWith($(this).children());
        });
        return this;
      },
      clone: function clone() {
        return this.map(function () {
          return this.cloneNode(true);
        });
      },
      hide: function hide() {
        return this.css("display", "none");
      },
      toggle: function toggle(setting) {
        return this.each(function () {
          var el = $(this);
          (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
        });
      },
      prev: function prev(selector) {
        return $(this.pluck("previousElementSibling")).filter(selector || "*");
      },
      next: function next(selector) {
        return $(this.pluck("nextElementSibling")).filter(selector || "*");
      },
      html: function html(_html) {
        return 0 in arguments ? this.each(function (idx) {
          var originHtml = this.innerHTML;
          $(this).empty().append(funcArg(this, _html, idx, originHtml));
        }) : 0 in this ? this[0].innerHTML : null;
      },
      text: function text(_text) {
        return 0 in arguments ? this.each(function (idx) {
          var newText = funcArg(this, _text, idx, this.textContent);
          this.textContent = newText == null ? "" : "" + newText;
        }) : 0 in this ? this.pluck("textContent").join("") : null;
      },
      attr: function attr(name, value) {
        var result;
        return typeof name == "string" && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined : this.each(function (idx) {
          if (this.nodeType !== 1) return;
          if (isObject(name)) for (key in name) {
            setAttribute(this, key, name[key]);
          } else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
        });
      },
      removeAttr: function removeAttr(name) {
        return this.each(function () {
          this.nodeType === 1 && name.split(" ").forEach(function (attribute) {
            setAttribute(this, attribute);
          }, this);
        });
      },
      prop: function prop(name, value) {
        name = propMap[name] || name;
        return 1 in arguments ? this.each(function (idx) {
          this[name] = funcArg(this, value, idx, this[name]);
        }) : this[0] && this[0][name];
      },
      removeProp: function removeProp(name) {
        name = propMap[name] || name;
        return this.each(function () {
          delete this[name];
        });
      },
      data: function data(name, value) {
        var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();
        var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
        return data !== null ? deserializeValue(data) : undefined;
      },
      val: function val(value) {
        if (0 in arguments) {
          if (value == null) value = "";
          return this.each(function (idx) {
            this.value = funcArg(this, value, idx, this.value);
          });
        } else {
          return this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function () {
            return this.selected;
          }).pluck("value") : this[0].value);
        }
      },
      offset: function offset(coordinates) {
        if (coordinates) return this.each(function (index) {
          var $this = $(this),
              coords = funcArg(this, coordinates, index, $this.offset()),
              parentOffset = $this.offsetParent().offset(),
              props = {
            top: coords.top - parentOffset.top,
            left: coords.left - parentOffset.left
          };
          if ($this.css("position") == "static") props["position"] = "relative";
          $this.css(props);
        });
        if (!this.length) return null;
        if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) return { top: 0, left: 0 };
        var obj = this[0].getBoundingClientRect();
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height)
        };
      },
      css: function css(property, value) {
        if (arguments.length < 2) {
          var element = this[0];
          if (typeof property == "string") {
            if (!element) return;
            return element.style[camelize(property)] || getComputedStyle(element, "").getPropertyValue(property);
          } else if (isArray(property)) {
            if (!element) return;
            var props = {};
            var computedStyle = getComputedStyle(element, "");
            $.each(property, function (_, prop) {
              props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
            });
            return props;
          }
        }
        var css = "";
        if (type(property) == "string") {
          if (!value && value !== 0) this.each(function () {
            this.style.removeProperty(dasherize(property));
          });else css = dasherize(property) + ":" + maybeAddPx(property, value);
        } else {
          for (key in property) {
            if (!property[key] && property[key] !== 0) this.each(function () {
              this.style.removeProperty(dasherize(key));
            });else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
          }
        }
        return this.each(function () {
          this.style.cssText += ";" + css;
        });
      },
      index: function index(element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
      },
      hasClass: function hasClass(name) {
        if (!name) return false;
        return emptyArray.some.call(this, function (el) {
          return this.test(className(el));
        }, classRE(name));
      },
      addClass: function addClass(name) {
        if (!name) return this;
        return this.each(function (idx) {
          if (!("className" in this)) return;
          classList = [];
          var cls = className(this),
              newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach(function (klass) {
            if (!$(this).hasClass(klass)) classList.push(klass);
          }, this);
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
        });
      },
      removeClass: function removeClass(name) {
        return this.each(function (idx) {
          if (!("className" in this)) return;
          if (name === undefined) return className(this, "");
          classList = className(this);
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
            classList = classList.replace(classRE(klass), " ");
          });
          className(this, classList.trim());
        });
      },
      toggleClass: function toggleClass(name, when) {
        if (!name) return this;
        return this.each(function (idx) {
          var $this = $(this),
              names = funcArg(this, name, idx, className(this));
          names.split(/\s+/g).forEach(function (klass) {
            (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
          });
        });
      },
      scrollTop: function scrollTop(value) {
        if (!this.length) return;
        var hasScrollTop = "scrollTop" in this[0];
        if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
        return this.each(hasScrollTop ? function () {
          this.scrollTop = value;
        } : function () {
          this.scrollTo(this.scrollX, value);
        });
      },
      scrollLeft: function scrollLeft(value) {
        if (!this.length) return;
        var hasScrollLeft = "scrollLeft" in this[0];
        if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
        return this.each(hasScrollLeft ? function () {
          this.scrollLeft = value;
        } : function () {
          this.scrollTo(value, this.scrollY);
        });
      },
      position: function position() {
        if (!this.length) return;
        var elem = this[0],
        offsetParent = this.offsetParent(),
        offset = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();
        offset.top -= parseFloat($(elem).css("margin-top")) || 0;
        offset.left -= parseFloat($(elem).css("margin-left")) || 0;
        parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
        parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        };
      },
      offsetParent: function offsetParent() {
        return this.map(function () {
          var parent = this.offsetParent || document.body;
          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") {
            parent = parent.offsetParent;
          }return parent;
        });
      }
    };
    $.fn.detach = $.fn.remove;
    ["width", "height"].forEach(function (dimension) {
      var dimensionProperty = dimension.replace(/./, function (m) {
        return m[0].toUpperCase();
      });
      $.fn[dimension] = function (value) {
        var offset,
            el = this[0];
        if (value === undefined) return isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
          el = $(this);
          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
        });
      };
    });
    function traverseNode(node, fun) {
      fun(node);
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
        traverseNode(node.childNodes[i], fun);
      }
    }
    adjacencyOperators.forEach(function (operator, operatorIndex) {
      var inside = operatorIndex % 2;
      $.fn[operator] = function () {
        var argType,
            nodes = $.map(arguments, function (arg) {
          var arr = [];
          argType = type(arg);
          if (argType == "array") {
            arg.forEach(function (el) {
              if (el.nodeType !== undefined) return arr.push(el);else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
              arr = arr.concat(zepto.fragment(el));
            });
            return arr;
          }
          return argType == "object" || arg == null ? arg : zepto.fragment(arg);
        }),
            parent,
            copyByClone = this.length > 1;
        if (nodes.length < 1) return this;
        return this.each(function (_, target) {
          parent = inside ? target : target.parentNode;
          target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
          var parentInDocument = $.contains(document.documentElement, parent);
          var SCRIPT_TYPES = /^(text|application)\/(javascript|ecmascript)$/;
          nodes.forEach(function (node) {
            if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();
            parent.insertBefore(node, target);
            if (parentInDocument) traverseNode(node, function (el) {
              if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || SCRIPT_TYPES.test(el.type.toLowerCase())) && !el.src) {
                var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
                target["eval"].call(target, el.innerHTML);
              }
            });
          });
        });
      };
      $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function (html) {
        $(html)[operator](this);
        return this;
      };
    });
    zepto.Z.prototype = Z.prototype = $.fn;
    zepto.uniq = uniq;
    zepto.deserializeValue = deserializeValue;
    $.zepto = zepto;
    return $;
  }();
  (function ($) {
    var _zid = 1,
        undefined,
        slice = Array.prototype.slice,
        isFunction = $.isFunction,
        isString = function isString(obj) {
      return typeof obj == "string";
    },
        handlers = {},
        specialEvents = {},
        focusinSupported = "onfocusin" in window,
        focus = { focus: "focusin", blur: "focusout" },
        hover = { mouseenter: "mouseover", mouseleave: "mouseout" };
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
    function zid(element) {
      return element._zid || (element._zid = _zid++);
    }
    function findHandlers(element, event, fn, selector) {
      event = parse(event);
      if (event.ns) var matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function (handler) {
        return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
      });
    }
    function parse(event) {
      var parts = ("" + event).split(".");
      return {
        e: parts[0],
        ns: parts.slice(1).sort().join(" ")
      };
    }
    function matcherFor(ns) {
      return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
    }
    function eventCapture(handler, captureSetting) {
      return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
    }
    function realEvent(type) {
      return hover[type] || focusinSupported && focus[type] || type;
    }
    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element),
          set$$1 = handlers[id] || (handlers[id] = []);
      events.split(/\s/).forEach(function (event) {
        if (event == "ready") return $(document).ready(fn);
        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector;
        if (handler.e in hover) fn = function fn(e) {
          var related = e.relatedTarget;
          if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
        };
        handler.del = delegator;
        var callback = delegator || fn;
        handler.proxy = function (e) {
          e = compatible(e);
          if (e.isImmediatePropagationStopped()) return;
          e.data = data;
          var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
          if (result === false) e.preventDefault(), e.stopPropagation();
          return result;
        };
        handler.i = set$$1.length;
        set$$1.push(handler);
        if ("addEventListener" in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    }
    function remove(element, events, fn, selector, capture) {
      var id = zid(element);
      (events || "").split(/\s/).forEach(function (event) {
        findHandlers(element, event, fn, selector).forEach(function (handler) {
          delete handlers[id][handler.i];
          if ("removeEventListener" in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        });
      });
    }
    $.event = { add: add, remove: remove };
    $.proxy = function (fn, context) {
      var args = 2 in arguments && slice.call(arguments, 2);
      if (isFunction(fn)) {
        var proxyFn = function proxyFn() {
          return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
        };
        proxyFn._zid = zid(fn);
        return proxyFn;
      } else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn);
          return $.proxy.apply(null, args);
        } else {
          return $.proxy(fn[context], fn);
        }
      } else {
        throw new TypeError("expected function");
      }
    };
    $.fn.bind = function (event, data, callback) {
      return this.on(event, data, callback);
    };
    $.fn.unbind = function (event, callback) {
      return this.off(event, callback);
    };
    $.fn.one = function (event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1);
    };
    var returnTrue = function returnTrue() {
      return true;
    },
        returnFalse = function returnFalse() {
      return false;
    },
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
        eventMethods = {
      preventDefault: "isDefaultPrevented",
      stopImmediatePropagation: "isImmediatePropagationStopped",
      stopPropagation: "isPropagationStopped"
    };
    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event);
        $.each(eventMethods, function (name, predicate) {
          var sourceMethod = source[name];
          event[name] = function () {
            this[predicate] = returnTrue;
            return sourceMethod && sourceMethod.apply(source, arguments);
          };
          event[predicate] = returnFalse;
        });
        try {
          event.timeStamp || (event.timeStamp = new Date().getTime());
        } catch (ignored) {}
        if (source.defaultPrevented !== undefined ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
      }
      return event;
    }
    function createProxy(event) {
      var key,
          proxy = { originalEvent: event };
      for (key in event) {
        if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
      }return compatible(proxy, event);
    }
    $.fn.delegate = function (selector, event, callback) {
      return this.on(event, selector, callback);
    };
    $.fn.undelegate = function (selector, event, callback) {
      return this.off(event, selector, callback);
    };
    $.fn.live = function (event, callback) {
      $(document.body).delegate(this.selector, event, callback);
      return this;
    };
    $.fn.die = function (event, callback) {
      $(document.body).undelegate(this.selector, event, callback);
      return this;
    };
    $.fn.on = function (event, selector, data, callback, one) {
      var autoRemove,
          delegator,
          $this = this;
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.on(type, selector, data, fn, one);
        });
        return $this;
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined;
      if (callback === undefined || data === false) callback = data, data = undefined;
      if (callback === false) callback = returnFalse;
      return $this.each(function (_, element) {
        if (one) autoRemove = function autoRemove(e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments);
        };
        if (selector) delegator = function delegator(e) {
          var evt,
              match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
          }
        };
        add(element, event, callback, data, selector, delegator || autoRemove);
      });
    };
    $.fn.off = function (event, selector, callback) {
      var $this = this;
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.off(type, selector, fn);
        });
        return $this;
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined;
      if (callback === false) callback = returnFalse;
      return $this.each(function () {
        remove(this, event, callback, selector);
      });
    };
    $.fn.trigger = function (event, args) {
      event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
      event._args = args;
      return this.each(function () {
        if (event.type in focus && typeof this[event.type] == "function") this[event.type]();else if ("dispatchEvent" in this)
          this.dispatchEvent(event);else $(this).triggerHandler(event, args);
      });
    };
    $.fn.triggerHandler = function (event, args) {
      var e, result;
      this.each(function (i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event);
        e._args = args;
        e.target = element;
        $.each(findHandlers(element, event.type || event), function (i, handler) {
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false;
        });
      });
      return result;
    };
    ("focusin focusout focus blur load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select keydown keypress keyup error").split(" ").forEach(function (event) {
      $.fn[event] = function (callback) {
        return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
      };
    });
    $.Event = function (type, props) {
      if (!isString(type)) props = type, type = props.type;
      var event = document.createEvent(specialEvents[type] || "Events"),
          bubbles = true;
      if (props) for (var name in props) {
        name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
      }event.initEvent(type, bubbles, true);
      return compatible(event);
    };
  })(Zepto);
  (function () {
    try {
      getComputedStyle(undefined);
    } catch (e) {
      var nativeGetComputedStyle = getComputedStyle;
      window.getComputedStyle = function (element, pseudoElement) {
        try {
          return nativeGetComputedStyle(element, pseudoElement);
        } catch (e) {
          return null;
        }
      };
    }
  })();
  (function ($) {
    var zepto = $.zepto,
        oldQsa = zepto.qsa,
        childRe = /^\s*>/,
        classTag = "Zepto" + +new Date();
    zepto.qsa = function (node, selector) {
      var sel = selector,
          nodes,
          taggedParent;
      try {
        if (!sel) sel = "*";else if (childRe.test(sel))
          taggedParent = $(node).addClass(classTag), sel = "." + classTag + " " + sel;
        nodes = oldQsa(node, sel);
      } catch (e) {
        throw e;
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag);
      }
      return nodes;
    };
  })(Zepto);
  return Zepto;
})(window);

var EQ_START = ":eq(";
var EQ_END = ")";
var EQ_LENGTH = EQ_START.length;
var DIGIT_IN_SELECTOR_PATTERN = /((\.|#)(-)?\d{1})/g;
function createPair(match) {
  var first$$1 = match.charAt(0);
  var second = match.charAt(1);
  var third = match.charAt(2);
  var result = { key: match };
  if (second === "-") {
    result.val = "" + first$$1 + second + "\\3" + third + " ";
  } else {
    result.val = first$$1 + "\\3" + second + " ";
  }
  return result;
}
function escapeDigitsInSelector(selector) {
  var matches = selector.match(DIGIT_IN_SELECTOR_PATTERN);
  if (isEmpty(matches)) {
    return selector;
  }
  var pairs = map(createPair, matches);
  return reduce(function (acc, pair) {
    return acc.replace(pair.key, pair.val);
  }, selector, pairs);
}
function parseSelector(selector) {
  var result = [];
  var sel = trim(selector);
  var currentIndex = sel.indexOf(EQ_START);
  var head = void 0;
  var tail = void 0;
  var eq = void 0;
  var index = void 0;
  while (currentIndex !== -1) {
    head = trim(sel.substring(0, currentIndex));
    tail = trim(sel.substring(currentIndex));
    index = tail.indexOf(EQ_END);
    eq = trim(tail.substring(EQ_LENGTH, index));
    sel = trim(tail.substring(index + 1));
    currentIndex = sel.indexOf(EQ_START);
    if (head && eq) {
      result.push({ sel: head, eq: Number(eq) });
    }
  }
  if (sel) {
    result.push({ sel: sel });
  }
  return result;
}
function select(selector) {
  if (isElement(selector)) {
    return $(selector);
  }
  if (!isString(selector)) {
    return $(selector);
  }
  var selectorAsString = escapeDigitsInSelector(selector);
  if (selectorAsString.indexOf(EQ_START) === -1) {
    return $(selectorAsString);
  }
  var parts = parseSelector(selectorAsString);
  return reduce(function (acc, part) {
    var sel = part.sel,
        eq = part.eq;
    acc = acc.find(sel);
    if (isNumber(eq)) {
      acc = acc.eq(eq);
    }
    return acc;
  }, $(index$1), parts);
}
function exists$2(selector) {
  return select(selector).length > 0;
}
function fragment(content) {
  return $("<" + DIV_TAG + "/>").append(content);
}
function wrap(content) {
  return $(content);
}
function prev(selector) {
  return select(selector).prev();
}
function next(selector) {
  return select(selector).next();
}
function parent(selector) {
  return select(selector).parent();
}
function is(query, selector) {
  return select(selector).is(query);
}
function find(query, selector) {
  return select(selector).find(query);
}
function children(selector) {
  return select(selector).children();
}

var LOAD_ERROR = "Unable to load target-vec.js";
var LOAD_AUTHORING = "Loading target-vec.js";
var NAMESPACE = "_AT";
var EDITOR = "clickHandlerForExperienceEditor";
var CURRENT_VIEW = "currentView";
function initNamespace(win) {
  win[NAMESPACE] = win[NAMESPACE] || {};
  win[NAMESPACE].querySelectorAll = select;
}
function handleViewStart(win, options) {
  var viewName = options[VIEW_NAME];
  win[NAMESPACE][CURRENT_VIEW] = viewName;
}
function setupClickHandler(win, doc) {
  doc.addEventListener(CLICK, function (event) {
    if (isFunction(win[NAMESPACE][EDITOR])) {
      win[NAMESPACE][EDITOR](event);
    }
  }, true);
}
function initAuthoringCode(win, doc, config) {
  if (!isAuthoringEnabled()) {
    return;
  }
  initNamespace(win);
  subscribe(VIEW_START, function (options) {
    return handleViewStart(win, options);
  });
  var authoringScriptUrl = config[AUTHORING_SCRIPT_URL];
  var success = function success() {
    return setupClickHandler(win, doc);
  };
  var error = function error() {
    return logWarn(LOAD_ERROR);
  };
  logDebug(LOAD_AUTHORING);
  index$9(authoringScriptUrl).then(success)['catch'](error);
}

function remove(selector) {
  return select(selector).empty().remove();
}
function after(content, selector) {
  return select(selector).after(content);
}
function before(content, selector) {
  return select(selector).before(content);
}
function append(content, selector) {
  return select(selector).append(content);
}
function prepend(content, selector) {
  return select(selector).prepend(content);
}
function setHtml(content, selector) {
  return select(selector).html(content);
}
function getHtml(selector) {
  return select(selector).html();
}
function setText(content, selector) {
  return select(selector).text(content);
}

var STYLE_PREFIX = "at-";
var BODY_STYLE_ID = "at-body-style";
var BODY_STYLE_ID_SELECTOR = "#" + BODY_STYLE_ID;
function createStyleMarkup(id, content) {
  return "<" + STYLE_TAG + " " + ID + "=\"" + id + "\" " + CLASS + "=\"" + FLICKER_CONTROL_CLASS + "\">" + content + "</" + STYLE_TAG + ">";
}
function createActionStyle(styleDef, selector) {
  var id = STYLE_PREFIX + hash(selector);
  var style = selector + " {" + styleDef + "}";
  return createStyleMarkup(id, style);
}
function addHidingSnippet(config) {
  var bodyHidingEnabled = config[BODY_HIDING_ENABLED];
  if (bodyHidingEnabled !== true) {
    return;
  }
  if (exists$2(BODY_STYLE_ID_SELECTOR)) {
    return;
  }
  var bodyHiddenStyle = config[BODY_HIDDEN_STYLE];
  append(createStyleMarkup(BODY_STYLE_ID, bodyHiddenStyle), HEAD_TAG);
}
function removeHidingSnippet(config) {
  var bodyHidingEnabled = config[BODY_HIDING_ENABLED];
  if (bodyHidingEnabled !== true) {
    return;
  }
  if (!exists$2(BODY_STYLE_ID_SELECTOR)) {
    return;
  }
  remove(BODY_STYLE_ID_SELECTOR);
}
function addActionHidings(config, selectors) {
  if (isEmpty(selectors)) {
    return;
  }
  var styleDef = config[DEFAULT_CONTENT_HIDDEN_STYLE];
  var buildStyle = function buildStyle(selector) {
    return createActionStyle(styleDef, selector);
  };
  var content = join("\n", map(buildStyle, selectors));
  append(content, HEAD_TAG);
}

function injectHidingSnippetStyle() {
  addHidingSnippet(getConfig());
}
function removeHidingSnippetStyle() {
  removeHidingSnippet(getConfig());
}
function injectActionHidingStyles(selectors) {
  addActionHidings(getConfig(), selectors);
}
function removeActionHidingStyle(selector) {
  var id = STYLE_PREFIX + hash(selector);
  remove("#" + id);
}

var stringifyQueryString$1 = index$6.stringify;
var POST = "POST";
var NETWORK_ERROR = "Network request failed";
var REQUEST_TIMEOUT = "Request timed out";
function createUrl(scheme, host, path, queryParams) {
  var query = stringifyQueryString$1(queryParams);
  return scheme + '//' + host + path + '?' + query;
}
function addOnload(xhr, resolve, reject) {
  xhr.onload = function () {
    var status = xhr.status === 1223 ? 204 : xhr.status;
    if (status < 100 || status > 599) {
      reject(new Error(NETWORK_ERROR));
      return;
    }
    var response = JSON.parse(xhr.responseText);
    var headers = xhr.getAllResponseHeaders();
    resolve({ status: status, headers: headers, response: response });
  };
  return xhr;
}
function addOnerror(xhr, reject) {
  xhr.onerror = function () {
    reject(new Error(NETWORK_ERROR));
  };
  return xhr;
}
function addOntimeout(xhr, timeout, reject) {
  xhr.timeout = timeout;
  xhr.ontimeout = function () {
    reject(new Error(REQUEST_TIMEOUT));
  };
  return xhr;
}
function addHeaders(xhr, headers) {
  var keys = Object.keys(headers || {});
  keys.forEach(function (key) {
    var values = headers[key];
    if (!Array.isArray(values)) {
      return;
    }
    values.forEach(function (value) {
      xhr.setRequestHeader(key, value);
    });
  });
  return xhr;
}
var ApiClient = function () {
  function ApiClient() {
    classCallCheck(this, ApiClient);
  }
  createClass(ApiClient, [{
    key: 'paramToString',
    value: function paramToString(param) {
      if (param == undefined || param == null) {
        return '';
      }
      if (param instanceof Date) {
        return param.toJSON();
      }
      return param.toString();
    }
  }, {
    key: 'normalizeParams',
    value: function normalizeParams(params) {
      var newParams = {};
      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
          var value = params[key];
          newParams[key] = this.paramToString(value);
        }
      }
      return newParams;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(response, returnType) {
      if (response == null || returnType == null) {
        return null;
      }
      return ApiClient.convertToType(response, returnType);
    }
  }, {
    key: 'callApi',
    value: function callApi(scheme, host, path, timeout, async, queryParams, headerParams, postBody, returnType) {
      var _this = this;
      return new index$8(function (resolve, reject) {
        var url = createUrl(scheme, host, path, queryParams);
        var xhr = new index.XMLHttpRequest();
        xhr = addOnload(xhr, resolve, reject);
        xhr = addOnerror(xhr, reject);
        xhr.open(POST, url, async);
        xhr.withCredentials = true;
        xhr = addHeaders(xhr, headerParams);
        if (async) {
          xhr = addOntimeout(xhr, timeout, reject);
        }
        xhr.send(JSON.stringify(postBody));
      }).then(function (xhrResponse) {
        var response = xhrResponse.response;
        var status = response.status,
            message = response.message;
        if (status !== undefined && message !== undefined) {
          throw new Error(message);
        }
        return _this.deserialize(response, returnType);
      });
    }
  }], [{
    key: 'parseDate',
    value: function parseDate(str) {
      return new Date(str);
    }
  }, {
    key: 'convertToType',
    value: function convertToType(data, type) {
      if (data === null || data === undefined) return data;
      switch (type) {
        case 'Boolean':
          return Boolean(data);
        case 'Integer':
          return parseInt(data, 10);
        case 'Number':
          return parseFloat(data);
        case 'String':
          return String(data);
        case 'Date':
          return ApiClient.parseDate(String(data));
        default:
          if (type === Object) {
            return data;
          } else if (typeof type === 'function') {
            return type.constructFromObject(data);
          } else if (Array.isArray(type)) {
            var itemType = type[0];
            return data.map(function (item) {
              return ApiClient.convertToType(item, itemType);
            });
          } else if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
            var keyType, valueType;
            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }
            var result = {};
            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = ApiClient.convertToType(k, keyType);
                var value = ApiClient.convertToType(data[k], valueType);
                result[key] = value;
              }
            }
            return result;
          } else {
            return data;
          }
      }
    }
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj, itemType) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (data.hasOwnProperty(i)) obj[i] = ApiClient.convertToType(data[i], itemType);
        }
      } else {
        for (var k in data) {
          if (data.hasOwnProperty(k)) obj[k] = ApiClient.convertToType(data[k], itemType);
        }
      }
    }
  }]);
  return ApiClient;
}();
var Address = function () {
  function Address() {
    classCallCheck(this, Address);
    Address.initialize(this);
  }
  createClass(Address, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Address();
        if (data.hasOwnProperty('url')) {
          obj.url = ApiClient.convertToType(data['url'], 'String');
        }
        if (data.hasOwnProperty('referringUrl')) {
          obj.referringUrl = ApiClient.convertToType(data['referringUrl'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Address;
}();
Address.prototype.url = undefined;
Address.prototype.referringUrl = undefined;
var AnalyticsPayload = function () {
  function AnalyticsPayload() {
    classCallCheck(this, AnalyticsPayload);
    AnalyticsPayload.initialize(this);
  }
  createClass(AnalyticsPayload, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AnalyticsPayload();
        if (data.hasOwnProperty('pe')) {
          obj.pe = ApiClient.convertToType(data['pe'], 'String');
        }
        if (data.hasOwnProperty('tnta')) {
          obj.tnta = ApiClient.convertToType(data['tnta'], 'String');
        }
      }
      return obj;
    }
  }]);
  return AnalyticsPayload;
}();
AnalyticsPayload.prototype.pe = undefined;
AnalyticsPayload.prototype.tnta = undefined;
var LoggingType = function () {
  function LoggingType() {
    classCallCheck(this, LoggingType);
    this["server_side"] = "server_side";
    this["client_side"] = "client_side";
  }
  createClass(LoggingType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return LoggingType;
}();
var AnalyticsRequest = function () {
  function AnalyticsRequest() {
    classCallCheck(this, AnalyticsRequest);
    AnalyticsRequest.initialize(this);
  }
  createClass(AnalyticsRequest, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AnalyticsRequest();
        if (data.hasOwnProperty('supplementalDataId')) {
          obj.supplementalDataId = ApiClient.convertToType(data['supplementalDataId'], 'String');
        }
        if (data.hasOwnProperty('logging')) {
          obj.logging = LoggingType.constructFromObject(data['logging']);
        }
        if (data.hasOwnProperty('trackingServer')) {
          obj.trackingServer = ApiClient.convertToType(data['trackingServer'], 'String');
        }
        if (data.hasOwnProperty('trackingServerSecure')) {
          obj.trackingServerSecure = ApiClient.convertToType(data['trackingServerSecure'], 'String');
        }
      }
      return obj;
    }
  }]);
  return AnalyticsRequest;
}();
AnalyticsRequest.prototype.supplementalDataId = undefined;
AnalyticsRequest.prototype.logging = undefined;
AnalyticsRequest.prototype.trackingServer = undefined;
AnalyticsRequest.prototype.trackingServerSecure = undefined;
var AnalyticsResponse = function () {
  function AnalyticsResponse() {
    classCallCheck(this, AnalyticsResponse);
    AnalyticsResponse.initialize(this);
  }
  createClass(AnalyticsResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AnalyticsResponse();
        if (data.hasOwnProperty('payload')) {
          obj.payload = AnalyticsPayload.constructFromObject(data['payload']);
        }
      }
      return obj;
    }
  }]);
  return AnalyticsResponse;
}();
AnalyticsResponse.prototype.payload = undefined;
var Application = function () {
  function Application() {
    classCallCheck(this, Application);
    Application.initialize(this);
  }
  createClass(Application, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Application();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'String');
        }
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('version')) {
          obj.version = ApiClient.convertToType(data['version'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Application;
}();
Application.prototype.id = undefined;
Application.prototype.name = undefined;
Application.prototype.version = undefined;
var AudienceManager = function () {
  function AudienceManager() {
    classCallCheck(this, AudienceManager);
    AudienceManager.initialize(this);
  }
  createClass(AudienceManager, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AudienceManager();
        if (data.hasOwnProperty('locationHint')) {
          obj.locationHint = ApiClient.convertToType(data['locationHint'], 'Number');
        }
        if (data.hasOwnProperty('blob')) {
          obj.blob = ApiClient.convertToType(data['blob'], 'String');
        }
      }
      return obj;
    }
  }]);
  return AudienceManager;
}();
AudienceManager.prototype.locationHint = undefined;
AudienceManager.prototype.blob = undefined;
var AuthenticatedState = function () {
  function AuthenticatedState() {
    classCallCheck(this, AuthenticatedState);
    this["unknown"] = "unknown";
    this["authenticated"] = "authenticated";
    this["logged_out"] = "logged_out";
  }
  createClass(AuthenticatedState, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return AuthenticatedState;
}();
var Browser = function () {
  function Browser() {
    classCallCheck(this, Browser);
    Browser.initialize(this);
  }
  createClass(Browser, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Browser();
        if (data.hasOwnProperty('host')) {
          obj.host = ApiClient.convertToType(data['host'], 'String');
        }
        if (data.hasOwnProperty('webGLRenderer')) {
          obj.webGLRenderer = ApiClient.convertToType(data['webGLRenderer'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Browser;
}();
Browser.prototype.host = undefined;
Browser.prototype.webGLRenderer = undefined;
var ChannelType = function () {
  function ChannelType() {
    classCallCheck(this, ChannelType);
    this["mobile"] = "mobile";
    this["web"] = "web";
  }
  createClass(ChannelType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return ChannelType;
}();
var Geo = function () {
  function Geo() {
    classCallCheck(this, Geo);
    Geo.initialize(this);
  }
  createClass(Geo, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Geo();
        if (data.hasOwnProperty('latitude')) {
          obj.latitude = ApiClient.convertToType(data['latitude'], 'Number');
        }
        if (data.hasOwnProperty('longitude')) {
          obj.longitude = ApiClient.convertToType(data['longitude'], 'Number');
        }
      }
      return obj;
    }
  }]);
  return Geo;
}();
Geo.prototype.latitude = undefined;
Geo.prototype.longitude = undefined;
var DeviceType = function () {
  function DeviceType() {
    classCallCheck(this, DeviceType);
    this["phone"] = "phone";
    this["tablet"] = "tablet";
  }
  createClass(DeviceType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return DeviceType;
}();
var MobilePlatformType = function () {
  function MobilePlatformType() {
    classCallCheck(this, MobilePlatformType);
    this["android"] = "android";
    this["ios"] = "ios";
  }
  createClass(MobilePlatformType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return MobilePlatformType;
}();
var MobilePlatform = function () {
  function MobilePlatform() {
    classCallCheck(this, MobilePlatform);
    MobilePlatform.initialize(this);
  }
  createClass(MobilePlatform, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MobilePlatform();
        if (data.hasOwnProperty('deviceName')) {
          obj.deviceName = ApiClient.convertToType(data['deviceName'], 'String');
        }
        if (data.hasOwnProperty('deviceType')) {
          obj.deviceType = DeviceType.constructFromObject(data['deviceType']);
        }
        if (data.hasOwnProperty('platformType')) {
          obj.platformType = MobilePlatformType.constructFromObject(data['platformType']);
        }
        if (data.hasOwnProperty('version')) {
          obj.version = ApiClient.convertToType(data['version'], 'String');
        }
      }
      return obj;
    }
  }]);
  return MobilePlatform;
}();
MobilePlatform.prototype.deviceName = undefined;
MobilePlatform.prototype.deviceType = undefined;
MobilePlatform.prototype.platformType = undefined;
MobilePlatform.prototype.version = undefined;
var ScreenOrientationType = function () {
  function ScreenOrientationType() {
    classCallCheck(this, ScreenOrientationType);
    this["portrait"] = "portrait";
    this["landscape"] = "landscape";
  }
  createClass(ScreenOrientationType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return ScreenOrientationType;
}();
var Screen = function () {
  function Screen() {
    classCallCheck(this, Screen);
    Screen.initialize(this);
  }
  createClass(Screen, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Screen();
        if (data.hasOwnProperty('width')) {
          obj.width = ApiClient.convertToType(data['width'], 'Number');
        }
        if (data.hasOwnProperty('height')) {
          obj.height = ApiClient.convertToType(data['height'], 'Number');
        }
        if (data.hasOwnProperty('colorDepth')) {
          obj.colorDepth = ApiClient.convertToType(data['colorDepth'], 'Number');
        }
        if (data.hasOwnProperty('pixelRatio')) {
          obj.pixelRatio = ApiClient.convertToType(data['pixelRatio'], 'Number');
        }
        if (data.hasOwnProperty('orientation')) {
          obj.orientation = ScreenOrientationType.constructFromObject(data['orientation']);
        }
      }
      return obj;
    }
  }]);
  return Screen;
}();
Screen.prototype.width = undefined;
Screen.prototype.height = undefined;
Screen.prototype.colorDepth = undefined;
Screen.prototype.pixelRatio = undefined;
Screen.prototype.orientation = undefined;
var Window = function () {
  function Window() {
    classCallCheck(this, Window);
    Window.initialize(this);
  }
  createClass(Window, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Window();
        if (data.hasOwnProperty('width')) {
          obj.width = ApiClient.convertToType(data['width'], 'Number');
        }
        if (data.hasOwnProperty('height')) {
          obj.height = ApiClient.convertToType(data['height'], 'Number');
        }
      }
      return obj;
    }
  }]);
  return Window;
}();
Window.prototype.width = undefined;
Window.prototype.height = undefined;
var Context = function () {
  function Context() {
    classCallCheck(this, Context);
    Context.initialize(this);
  }
  createClass(Context, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Context();
        if (data.hasOwnProperty('userAgent')) {
          obj.userAgent = ApiClient.convertToType(data['userAgent'], 'String');
        }
        if (data.hasOwnProperty('timeOffsetInMinutes')) {
          obj.timeOffsetInMinutes = ApiClient.convertToType(data['timeOffsetInMinutes'], 'Number');
        }
        if (data.hasOwnProperty('channel')) {
          obj.channel = ChannelType.constructFromObject(data['channel']);
        }
        if (data.hasOwnProperty('mobilePlatform')) {
          obj.mobilePlatform = MobilePlatform.constructFromObject(data['mobilePlatform']);
        }
        if (data.hasOwnProperty('application')) {
          obj.application = Application.constructFromObject(data['application']);
        }
        if (data.hasOwnProperty('screen')) {
          obj.screen = Screen.constructFromObject(data['screen']);
        }
        if (data.hasOwnProperty('window')) {
          obj.window = Window.constructFromObject(data['window']);
        }
        if (data.hasOwnProperty('browser')) {
          obj.browser = Browser.constructFromObject(data['browser']);
        }
        if (data.hasOwnProperty('address')) {
          obj.address = Address.constructFromObject(data['address']);
        }
        if (data.hasOwnProperty('geo')) {
          obj.geo = Geo.constructFromObject(data['geo']);
        }
      }
      return obj;
    }
  }]);
  return Context;
}();
Context.prototype.userAgent = undefined;
Context.prototype.timeOffsetInMinutes = undefined;
Context.prototype.channel = undefined;
Context.prototype.mobilePlatform = undefined;
Context.prototype.application = undefined;
Context.prototype.screen = undefined;
Context.prototype.window = undefined;
Context.prototype.browser = undefined;
Context.prototype.address = undefined;
Context.prototype.geo = undefined;
var CustomerId = function () {
  function CustomerId() {
    classCallCheck(this, CustomerId);
    CustomerId.initialize(this);
  }
  createClass(CustomerId, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CustomerId();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'String');
        }
        if (data.hasOwnProperty('integrationCode')) {
          obj.integrationCode = ApiClient.convertToType(data['integrationCode'], 'String');
        }
        if (data.hasOwnProperty('authenticatedState')) {
          obj.authenticatedState = AuthenticatedState.constructFromObject(data['authenticatedState']);
        }
      }
      return obj;
    }
  }]);
  return CustomerId;
}();
CustomerId.prototype.id = undefined;
CustomerId.prototype.integrationCode = undefined;
CustomerId.prototype.authenticatedState = undefined;
var Order = function () {
  function Order() {
    classCallCheck(this, Order);
    Order.initialize(this);
  }
  createClass(Order, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Order();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'String');
        }
        if (data.hasOwnProperty('total')) {
          obj.total = ApiClient.convertToType(data['total'], 'Number');
        }
        if (data.hasOwnProperty('purchasedProductIds')) {
          obj.purchasedProductIds = ApiClient.convertToType(data['purchasedProductIds'], ['String']);
        }
      }
      return obj;
    }
  }]);
  return Order;
}();
Order.prototype.id = undefined;
Order.prototype.total = undefined;
Order.prototype.purchasedProductIds = undefined;
var Parameters = function () {
  function Parameters() {
    classCallCheck(this, Parameters);
    Parameters.initialize(this);
  }
  createClass(Parameters, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Parameters();
        ApiClient.constructFromObject(data, obj, 'String');
      }
      return obj;
    }
  }]);
  return Parameters;
}();
var Product = function () {
  function Product() {
    classCallCheck(this, Product);
    Product.initialize(this);
  }
  createClass(Product, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Product();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'String');
        }
        if (data.hasOwnProperty('categoryId')) {
          obj.categoryId = ApiClient.convertToType(data['categoryId'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Product;
}();
Product.prototype.id = undefined;
Product.prototype.categoryId = undefined;
var RequestDetails = function () {
  function RequestDetails() {
    classCallCheck(this, RequestDetails);
    RequestDetails.initialize(this);
  }
  createClass(RequestDetails, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RequestDetails();
        if (data.hasOwnProperty('address')) {
          obj.address = Address.constructFromObject(data['address']);
        }
        if (data.hasOwnProperty('parameters')) {
          obj.parameters = Parameters.constructFromObject(data['parameters']);
        }
        if (data.hasOwnProperty('profileParameters')) {
          obj.profileParameters = Parameters.constructFromObject(data['profileParameters']);
        }
        if (data.hasOwnProperty('order')) {
          obj.order = Order.constructFromObject(data['order']);
        }
        if (data.hasOwnProperty('product')) {
          obj.product = Product.constructFromObject(data['product']);
        }
      }
      return obj;
    }
  }]);
  return RequestDetails;
}();
RequestDetails.prototype.address = undefined;
RequestDetails.prototype.parameters = undefined;
RequestDetails.prototype.profileParameters = undefined;
RequestDetails.prototype.order = undefined;
RequestDetails.prototype.product = undefined;
var MboxRequest = function () {
  function MboxRequest() {
    classCallCheck(this, MboxRequest);
    RequestDetails.initialize(this);
    MboxRequest.initialize(this);
  }
  createClass(MboxRequest, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MboxRequest();
        RequestDetails.constructFromObject(data, obj);
        if (data.hasOwnProperty('index')) {
          obj.index = ApiClient.convertToType(data['index'], 'Number');
        }
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
      }
      return obj;
    }
  }]);
  return MboxRequest;
}();
MboxRequest.prototype.index = undefined;
MboxRequest.prototype.name = undefined;
RequestDetails.prototype.address = undefined;
RequestDetails.prototype.parameters = undefined;
RequestDetails.prototype.profileParameters = undefined;
RequestDetails.prototype.order = undefined;
RequestDetails.prototype.product = undefined;
var ExecuteRequest = function () {
  function ExecuteRequest() {
    classCallCheck(this, ExecuteRequest);
    ExecuteRequest.initialize(this);
  }
  createClass(ExecuteRequest, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ExecuteRequest();
        if (data.hasOwnProperty('pageLoad')) {
          obj.pageLoad = RequestDetails.constructFromObject(data['pageLoad']);
        }
        if (data.hasOwnProperty('mboxes')) {
          obj.mboxes = ApiClient.convertToType(data['mboxes'], [MboxRequest]);
        }
      }
      return obj;
    }
  }]);
  return ExecuteRequest;
}();
ExecuteRequest.prototype.pageLoad = undefined;
ExecuteRequest.prototype.mboxes = undefined;
var ExperienceCloud = function () {
  function ExperienceCloud() {
    classCallCheck(this, ExperienceCloud);
    ExperienceCloud.initialize(this);
  }
  createClass(ExperienceCloud, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ExperienceCloud();
        if (data.hasOwnProperty('audienceManager')) {
          obj.audienceManager = AudienceManager.constructFromObject(data['audienceManager']);
        }
        if (data.hasOwnProperty('analytics')) {
          obj.analytics = AnalyticsRequest.constructFromObject(data['analytics']);
        }
      }
      return obj;
    }
  }]);
  return ExperienceCloud;
}();
ExperienceCloud.prototype.audienceManager = undefined;
ExperienceCloud.prototype.analytics = undefined;
var MetricType = function () {
  function MetricType() {
    classCallCheck(this, MetricType);
    this["click"] = "click";
    this["display"] = "display";
  }
  createClass(MetricType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return MetricType;
}();
var NotificationMbox = function () {
  function NotificationMbox() {
    classCallCheck(this, NotificationMbox);
    NotificationMbox.initialize(this);
  }
  createClass(NotificationMbox, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NotificationMbox();
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('state')) {
          obj.state = ApiClient.convertToType(data['state'], 'String');
        }
      }
      return obj;
    }
  }]);
  return NotificationMbox;
}();
NotificationMbox.prototype.name = undefined;
NotificationMbox.prototype.state = undefined;
var NotificationView = function () {
  function NotificationView() {
    classCallCheck(this, NotificationView);
    NotificationView.initialize(this);
  }
  createClass(NotificationView, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NotificationView();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'Number');
        }
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('key')) {
          obj.key = ApiClient.convertToType(data['key'], 'String');
        }
        if (data.hasOwnProperty('state')) {
          obj.state = ApiClient.convertToType(data['state'], 'String');
        }
      }
      return obj;
    }
  }]);
  return NotificationView;
}();
NotificationView.prototype.id = undefined;
NotificationView.prototype.name = undefined;
NotificationView.prototype.key = undefined;
NotificationView.prototype.state = undefined;
var Notification = function () {
  function Notification() {
    classCallCheck(this, Notification);
    RequestDetails.initialize(this);
    Notification.initialize(this);
  }
  createClass(Notification, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Notification();
        RequestDetails.constructFromObject(data, obj);
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'String');
        }
        if (data.hasOwnProperty('impressionId')) {
          obj.impressionId = ApiClient.convertToType(data['impressionId'], 'String');
        }
        if (data.hasOwnProperty('type')) {
          obj.type = MetricType.constructFromObject(data['type']);
        }
        if (data.hasOwnProperty('timestamp')) {
          obj.timestamp = ApiClient.convertToType(data['timestamp'], 'Number');
        }
        if (data.hasOwnProperty('tokens')) {
          obj.tokens = ApiClient.convertToType(data['tokens'], ['String']);
        }
        if (data.hasOwnProperty('mbox')) {
          obj.mbox = NotificationMbox.constructFromObject(data['mbox']);
        }
        if (data.hasOwnProperty('view')) {
          obj.view = NotificationView.constructFromObject(data['view']);
        }
      }
      return obj;
    }
  }]);
  return Notification;
}();
Notification.prototype.id = undefined;
Notification.prototype.impressionId = undefined;
Notification.prototype.type = undefined;
Notification.prototype.timestamp = undefined;
Notification.prototype.tokens = undefined;
Notification.prototype.mbox = undefined;
Notification.prototype.view = undefined;
RequestDetails.prototype.address = undefined;
RequestDetails.prototype.parameters = undefined;
RequestDetails.prototype.profileParameters = undefined;
RequestDetails.prototype.order = undefined;
RequestDetails.prototype.product = undefined;
var PrefetchRequest = function () {
  function PrefetchRequest() {
    classCallCheck(this, PrefetchRequest);
    PrefetchRequest.initialize(this);
  }
  createClass(PrefetchRequest, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PrefetchRequest();
        if (data.hasOwnProperty('views')) {
          obj.views = ApiClient.convertToType(data['views'], [RequestDetails]);
        }
        if (data.hasOwnProperty('mboxes')) {
          obj.mboxes = ApiClient.convertToType(data['mboxes'], [MboxRequest]);
        }
      }
      return obj;
    }
  }]);
  return PrefetchRequest;
}();
PrefetchRequest.prototype.views = undefined;
PrefetchRequest.prototype.mboxes = undefined;
var Property = function () {
  function Property() {
    classCallCheck(this, Property);
    Property.initialize(this);
  }
  createClass(Property, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Property();
        if (data.hasOwnProperty('token')) {
          obj.token = ApiClient.convertToType(data['token'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Property;
}();
Property.prototype.token = undefined;
var QAModePreviewIndex = function () {
  function QAModePreviewIndex() {
    classCallCheck(this, QAModePreviewIndex);
    QAModePreviewIndex.initialize(this);
  }
  createClass(QAModePreviewIndex, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new QAModePreviewIndex();
        if (data.hasOwnProperty('activityIndex')) {
          obj.activityIndex = ApiClient.convertToType(data['activityIndex'], 'Number');
        }
        if (data.hasOwnProperty('experienceIndex')) {
          obj.experienceIndex = ApiClient.convertToType(data['experienceIndex'], 'Number');
        }
      }
      return obj;
    }
  }]);
  return QAModePreviewIndex;
}();
QAModePreviewIndex.prototype.activityIndex = undefined;
QAModePreviewIndex.prototype.experienceIndex = undefined;
var QAMode = function () {
  function QAMode() {
    classCallCheck(this, QAMode);
    QAMode.initialize(this);
  }
  createClass(QAMode, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new QAMode();
        if (data.hasOwnProperty('token')) {
          obj.token = ApiClient.convertToType(data['token'], 'String');
        }
        if (data.hasOwnProperty('listedActivitiesOnly')) {
          obj.listedActivitiesOnly = ApiClient.convertToType(data['listedActivitiesOnly'], 'Boolean');
        }
        if (data.hasOwnProperty('evaluateAsTrueAudienceIds')) {
          obj.evaluateAsTrueAudienceIds = ApiClient.convertToType(data['evaluateAsTrueAudienceIds'], ['Number']);
        }
        if (data.hasOwnProperty('evaluateAsFalseAudienceIds')) {
          obj.evaluateAsFalseAudienceIds = ApiClient.convertToType(data['evaluateAsFalseAudienceIds'], ['Number']);
        }
        if (data.hasOwnProperty('previewIndexes')) {
          obj.previewIndexes = ApiClient.convertToType(data['previewIndexes'], [QAModePreviewIndex]);
        }
      }
      return obj;
    }
  }]);
  return QAMode;
}();
QAMode.prototype.token = undefined;
QAMode.prototype.listedActivitiesOnly = undefined;
QAMode.prototype.evaluateAsTrueAudienceIds = undefined;
QAMode.prototype.evaluateAsFalseAudienceIds = undefined;
QAMode.prototype.previewIndexes = undefined;
var Trace = function () {
  function Trace() {
    classCallCheck(this, Trace);
    Trace.initialize(this);
  }
  createClass(Trace, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Trace();
        if (data.hasOwnProperty('authorizationToken')) {
          obj.authorizationToken = ApiClient.convertToType(data['authorizationToken'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Trace;
}();
Trace.prototype.authorizationToken = undefined;
var VisitorId = function () {
  function VisitorId() {
    classCallCheck(this, VisitorId);
    VisitorId.initialize(this);
  }
  createClass(VisitorId, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new VisitorId();
        if (data.hasOwnProperty('tntId')) {
          obj.tntId = ApiClient.convertToType(data['tntId'], 'String');
        }
        if (data.hasOwnProperty('thirdPartyId')) {
          obj.thirdPartyId = ApiClient.convertToType(data['thirdPartyId'], 'String');
        }
        if (data.hasOwnProperty('marketingCloudVisitorId')) {
          obj.marketingCloudVisitorId = ApiClient.convertToType(data['marketingCloudVisitorId'], 'String');
        }
        if (data.hasOwnProperty('customerIds')) {
          obj.customerIds = ApiClient.convertToType(data['customerIds'], [CustomerId]);
        }
      }
      return obj;
    }
  }]);
  return VisitorId;
}();
VisitorId.prototype.tntId = undefined;
VisitorId.prototype.thirdPartyId = undefined;
VisitorId.prototype.marketingCloudVisitorId = undefined;
VisitorId.prototype.customerIds = undefined;
var DeliveryRequest = function () {
  function DeliveryRequest() {
    classCallCheck(this, DeliveryRequest);
    DeliveryRequest.initialize(this);
  }
  createClass(DeliveryRequest, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DeliveryRequest();
        if (data.hasOwnProperty('requestId')) {
          obj.requestId = ApiClient.convertToType(data['requestId'], 'String');
        }
        if (data.hasOwnProperty('impressionId')) {
          obj.impressionId = ApiClient.convertToType(data['impressionId'], 'String');
        }
        if (data.hasOwnProperty('id')) {
          obj.id = VisitorId.constructFromObject(data['id']);
        }
        if (data.hasOwnProperty('environmentId')) {
          obj.environmentId = ApiClient.convertToType(data['environmentId'], 'Number');
        }
        if (data.hasOwnProperty('property')) {
          obj.property = Property.constructFromObject(data['property']);
        }
        if (data.hasOwnProperty('trace')) {
          obj.trace = Trace.constructFromObject(data['trace']);
        }
        if (data.hasOwnProperty('context')) {
          obj.context = Context.constructFromObject(data['context']);
        }
        if (data.hasOwnProperty('experienceCloud')) {
          obj.experienceCloud = ExperienceCloud.constructFromObject(data['experienceCloud']);
        }
        if (data.hasOwnProperty('execute')) {
          obj.execute = ExecuteRequest.constructFromObject(data['execute']);
        }
        if (data.hasOwnProperty('prefetch')) {
          obj.prefetch = PrefetchRequest.constructFromObject(data['prefetch']);
        }
        if (data.hasOwnProperty('notifications')) {
          obj.notifications = ApiClient.convertToType(data['notifications'], [Notification]);
        }
        if (data.hasOwnProperty('qaMode')) {
          obj.qaMode = QAMode.constructFromObject(data['qaMode']);
        }
      }
      return obj;
    }
  }]);
  return DeliveryRequest;
}();
DeliveryRequest.prototype.requestId = undefined;
DeliveryRequest.prototype.impressionId = undefined;
DeliveryRequest.prototype.id = undefined;
DeliveryRequest.prototype.environmentId = undefined;
DeliveryRequest.prototype.property = undefined;
DeliveryRequest.prototype.trace = undefined;
DeliveryRequest.prototype.context = undefined;
DeliveryRequest.prototype.experienceCloud = undefined;
DeliveryRequest.prototype.execute = undefined;
DeliveryRequest.prototype.prefetch = undefined;
DeliveryRequest.prototype.notifications = undefined;
DeliveryRequest.prototype.qaMode = undefined;
var Metric = function () {
  function Metric() {
    classCallCheck(this, Metric);
    Metric.initialize(this);
  }
  createClass(Metric, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Metric();
        if (data.hasOwnProperty('type')) {
          obj.type = MetricType.constructFromObject(data['type']);
        }
        if (data.hasOwnProperty('selector')) {
          obj.selector = ApiClient.convertToType(data['selector'], 'String');
        }
        if (data.hasOwnProperty('eventToken')) {
          obj.eventToken = ApiClient.convertToType(data['eventToken'], 'String');
        }
      }
      return obj;
    }
  }]);
  return Metric;
}();
Metric.prototype.type = undefined;
Metric.prototype.selector = undefined;
Metric.prototype.eventToken = undefined;
var OptionType = function () {
  function OptionType() {
    classCallCheck(this, OptionType);
    this["html"] = "html";
    this["json"] = "json";
    this["redirect"] = "redirect";
    this["dynamic"] = "dynamic";
    this["actions"] = "actions";
  }
  createClass(OptionType, null, [{
    key: 'constructFromObject',
    value: function constructFromObject(object) {
      return object;
    }
  }]);
  return OptionType;
}();
var ResponseTokens = function () {
  function ResponseTokens() {
    classCallCheck(this, ResponseTokens);
    ResponseTokens.initialize(this);
  }
  createClass(ResponseTokens, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ResponseTokens();
        ApiClient.constructFromObject(data, obj, 'Object');
      }
      return obj;
    }
  }]);
  return ResponseTokens;
}();
var Option = function () {
  function Option() {
    classCallCheck(this, Option);
    Option.initialize(this);
  }
  createClass(Option, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Option();
        if (data.hasOwnProperty('type')) {
          obj.type = OptionType.constructFromObject(data['type']);
        }
        if (data.hasOwnProperty('content')) {
          obj.content = ApiClient.convertToType(data['content'], Object);
        }
        if (data.hasOwnProperty('eventToken')) {
          obj.eventToken = ApiClient.convertToType(data['eventToken'], 'String');
        }
        if (data.hasOwnProperty('responseTokens')) {
          obj.responseTokens = ResponseTokens.constructFromObject(data['responseTokens']);
        }
      }
      return obj;
    }
  }]);
  return Option;
}();
Option.prototype.type = undefined;
Option.prototype.content = undefined;
Option.prototype.eventToken = undefined;
Option.prototype.responseTokens = undefined;
var TraceResponse = function () {
  function TraceResponse() {
    classCallCheck(this, TraceResponse);
    TraceResponse.initialize(this);
  }
  createClass(TraceResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new TraceResponse();
        ApiClient.constructFromObject(data, obj, 'Object');
      }
      return obj;
    }
  }]);
  return TraceResponse;
}();
var MboxResponse = function () {
  function MboxResponse() {
    classCallCheck(this, MboxResponse);
    MboxResponse.initialize(this);
  }
  createClass(MboxResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MboxResponse();
        if (data.hasOwnProperty('index')) {
          obj.index = ApiClient.convertToType(data['index'], 'Number');
        }
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('options')) {
          obj.options = ApiClient.convertToType(data['options'], [Option]);
        }
        if (data.hasOwnProperty('metrics')) {
          obj.metrics = ApiClient.convertToType(data['metrics'], [Metric]);
        }
        if (data.hasOwnProperty('analytics')) {
          obj.analytics = AnalyticsResponse.constructFromObject(data['analytics']);
        }
        if (data.hasOwnProperty('trace')) {
          obj.trace = TraceResponse.constructFromObject(data['trace']);
        }
      }
      return obj;
    }
  }]);
  return MboxResponse;
}();
MboxResponse.prototype.index = undefined;
MboxResponse.prototype.name = undefined;
MboxResponse.prototype.options = undefined;
MboxResponse.prototype.metrics = undefined;
MboxResponse.prototype.analytics = undefined;
MboxResponse.prototype.trace = undefined;
var PageLoadResponse = function () {
  function PageLoadResponse() {
    classCallCheck(this, PageLoadResponse);
    PageLoadResponse.initialize(this);
  }
  createClass(PageLoadResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PageLoadResponse();
        if (data.hasOwnProperty('options')) {
          obj.options = ApiClient.convertToType(data['options'], [Option]);
        }
        if (data.hasOwnProperty('metrics')) {
          obj.metrics = ApiClient.convertToType(data['metrics'], [Metric]);
        }
        if (data.hasOwnProperty('analytics')) {
          obj.analytics = AnalyticsResponse.constructFromObject(data['analytics']);
        }
        if (data.hasOwnProperty('trace')) {
          obj.trace = TraceResponse.constructFromObject(data['trace']);
        }
      }
      return obj;
    }
  }]);
  return PageLoadResponse;
}();
PageLoadResponse.prototype.options = undefined;
PageLoadResponse.prototype.metrics = undefined;
PageLoadResponse.prototype.analytics = undefined;
PageLoadResponse.prototype.trace = undefined;
var ExecuteResponse = function () {
  function ExecuteResponse() {
    classCallCheck(this, ExecuteResponse);
    ExecuteResponse.initialize(this);
  }
  createClass(ExecuteResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ExecuteResponse();
        if (data.hasOwnProperty('pageLoad')) {
          obj.pageLoad = PageLoadResponse.constructFromObject(data['pageLoad']);
        }
        if (data.hasOwnProperty('mboxes')) {
          obj.mboxes = ApiClient.convertToType(data['mboxes'], [MboxResponse]);
        }
      }
      return obj;
    }
  }]);
  return ExecuteResponse;
}();
ExecuteResponse.prototype.pageLoad = undefined;
ExecuteResponse.prototype.mboxes = undefined;
var PrefetchMboxResponse = function () {
  function PrefetchMboxResponse() {
    classCallCheck(this, PrefetchMboxResponse);
    MboxResponse.initialize(this);
    PrefetchMboxResponse.initialize(this);
  }
  createClass(PrefetchMboxResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PrefetchMboxResponse();
        MboxResponse.constructFromObject(data, obj);
        if (data.hasOwnProperty('state')) {
          obj.state = ApiClient.convertToType(data['state'], 'String');
        }
      }
      return obj;
    }
  }]);
  return PrefetchMboxResponse;
}();
PrefetchMboxResponse.prototype.state = undefined;
MboxResponse.prototype.index = undefined;
MboxResponse.prototype.name = undefined;
MboxResponse.prototype.options = undefined;
MboxResponse.prototype.metrics = undefined;
MboxResponse.prototype.analytics = undefined;
MboxResponse.prototype.trace = undefined;
var View = function () {
  function View() {
    classCallCheck(this, View);
    View.initialize(this);
  }
  createClass(View, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new View();
        if (data.hasOwnProperty('id')) {
          obj.id = ApiClient.convertToType(data['id'], 'Number');
        }
        if (data.hasOwnProperty('name')) {
          obj.name = ApiClient.convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('key')) {
          obj.key = ApiClient.convertToType(data['key'], 'String');
        }
        if (data.hasOwnProperty('options')) {
          obj.options = ApiClient.convertToType(data['options'], [Option]);
        }
        if (data.hasOwnProperty('metrics')) {
          obj.metrics = ApiClient.convertToType(data['metrics'], [Metric]);
        }
        if (data.hasOwnProperty('analytics')) {
          obj.analytics = AnalyticsResponse.constructFromObject(data['analytics']);
        }
        if (data.hasOwnProperty('state')) {
          obj.state = ApiClient.convertToType(data['state'], 'String');
        }
        if (data.hasOwnProperty('trace')) {
          obj.trace = TraceResponse.constructFromObject(data['trace']);
        }
      }
      return obj;
    }
  }]);
  return View;
}();
View.prototype.id = undefined;
View.prototype.name = undefined;
View.prototype.key = undefined;
View.prototype.options = undefined;
View.prototype.metrics = undefined;
View.prototype.analytics = undefined;
View.prototype.state = undefined;
View.prototype.trace = undefined;
var PrefetchResponse = function () {
  function PrefetchResponse() {
    classCallCheck(this, PrefetchResponse);
    PrefetchResponse.initialize(this);
  }
  createClass(PrefetchResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PrefetchResponse();
        if (data.hasOwnProperty('views')) {
          obj.views = ApiClient.convertToType(data['views'], [View]);
        }
        if (data.hasOwnProperty('mboxes')) {
          obj.mboxes = ApiClient.convertToType(data['mboxes'], [PrefetchMboxResponse]);
        }
        if (data.hasOwnProperty('metrics')) {
          obj.metrics = ApiClient.convertToType(data['metrics'], [Metric]);
        }
      }
      return obj;
    }
  }]);
  return PrefetchResponse;
}();
PrefetchResponse.prototype.views = undefined;
PrefetchResponse.prototype.mboxes = undefined;
PrefetchResponse.prototype.metrics = undefined;
var DeliveryResponse = function () {
  function DeliveryResponse() {
    classCallCheck(this, DeliveryResponse);
    DeliveryResponse.initialize(this);
  }
  createClass(DeliveryResponse, null, [{
    key: 'initialize',
    value: function initialize(obj) {}
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DeliveryResponse();
        if (data.hasOwnProperty('requestId')) {
          obj.requestId = ApiClient.convertToType(data['requestId'], 'String');
        }
        if (data.hasOwnProperty('id')) {
          obj.id = VisitorId.constructFromObject(data['id']);
        }
        if (data.hasOwnProperty('client')) {
          obj.client = ApiClient.convertToType(data['client'], 'String');
        }
        if (data.hasOwnProperty('edgeHost')) {
          obj.edgeHost = ApiClient.convertToType(data['edgeHost'], 'String');
        }
        if (data.hasOwnProperty('execute')) {
          obj.execute = ExecuteResponse.constructFromObject(data['execute']);
        }
        if (data.hasOwnProperty('prefetch')) {
          obj.prefetch = PrefetchResponse.constructFromObject(data['prefetch']);
        }
      }
      return obj;
    }
  }]);
  return DeliveryResponse;
}();
DeliveryResponse.prototype.requestId = undefined;
DeliveryResponse.prototype.id = undefined;
DeliveryResponse.prototype.client = undefined;
DeliveryResponse.prototype.edgeHost = undefined;
DeliveryResponse.prototype.execute = undefined;
DeliveryResponse.prototype.prefetch = undefined;
var UnexpectedError = function () {
  function UnexpectedError(status, message) {
    classCallCheck(this, UnexpectedError);
    UnexpectedError.initialize(this, status, message);
  }
  createClass(UnexpectedError, null, [{
    key: 'initialize',
    value: function initialize(obj, status, message) {
      obj['status'] = status;
      obj['message'] = message;
    }
  }, {
    key: 'constructFromObject',
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UnexpectedError();
        if (data.hasOwnProperty('status')) {
          obj.status = ApiClient.convertToType(data['status'], 'Number');
        }
        if (data.hasOwnProperty('message')) {
          obj.message = ApiClient.convertToType(data['message'], 'String');
        }
      }
      return obj;
    }
  }]);
  return UnexpectedError;
}();
UnexpectedError.prototype.status = undefined;
UnexpectedError.prototype.message = undefined;
var TargetDeliveryApi = function () {
  function TargetDeliveryApi(apiClient) {
    classCallCheck(this, TargetDeliveryApi);
    this.apiClient = apiClient || ApiClient.instance;
  }
  createClass(TargetDeliveryApi, [{
    key: 'executeWithHttpInfo',
    value: function executeWithHttpInfo(client, sessionId, deliveryRequest, opts) {
      opts = opts || {};
      var postBody = deliveryRequest;
      if (client === undefined || client === null) {
        throw new Error("Missing the required parameter 'client' when calling execute");
      }
      if (sessionId === undefined || sessionId === null) {
        throw new Error("Missing the required parameter 'sessionId' when calling execute");
      }
      if (deliveryRequest === undefined || deliveryRequest === null) {
        throw new Error("Missing the required parameter 'deliveryRequest' when calling execute");
      }
      var scheme = opts['scheme'];
      var host = opts['host'];
      var path = opts['path'];
      var timeout = opts['timeout'];
      var async = opts['async'];
      var queryParams = index$3({}, {
        'client': client,
        'sessionId': sessionId
      }, opts['query'] || {});
      var headerParams = index$3({}, opts['headers']);
      var returnType = DeliveryResponse;
      return this.apiClient.callApi(scheme, host, path, timeout, async, queryParams, headerParams, postBody, returnType);
    }
  }, {
    key: 'execute',
    value: function execute(client, sessionId, deliveryRequest, opts) {
      return this.executeWithHttpInfo(client, sessionId, deliveryRequest, opts);
    }
  }]);
  return TargetDeliveryApi;
}();

var QA_MODE_COOKIE = "at_qa_mode";
var PREVIEW_TOKEN = "at_preview_token";
var PREVIEW_INDEX = "at_preview_index";
var ACTIVITIES_ONLY = "at_preview_listed_activities_only";
var TRUE_AUDIENCE_IDS = "at_preview_evaluate_as_true_audience_ids";
var FALSE_AUDIENCE_IDS = "at_preview_evaluate_as_false_audience_ids";
var UNDERSCORE = "_";
var notNull = function notNull(v) {
  return !isNil(v);
};
function toNumber(value) {
  return parseInt(value, 10);
}
function getIndex(value) {
  var result = toNumber(value);
  return isNaN(result) ? null : result;
}
function extractAudienceIds(value) {
  return split(UNDERSCORE, value);
}
function parsePreviewIndex(value) {
  var pair = split(UNDERSCORE, value);
  var activityIndex = getIndex(pair[0]);
  if (isNil(activityIndex)) {
    return null;
  }
  var result = new QAModePreviewIndex();
  result.activityIndex = activityIndex;
  var experienceIndex = getIndex(pair[1]);
  if (!isNil(experienceIndex)) {
    result.experienceIndex = experienceIndex;
  }
  return result;
}
function parsePreviewIndexes(values) {
  return filter(notNull, map(parsePreviewIndex, values));
}
function extractPreviewIndexes(value) {
  if (isArray(value)) {
    return parsePreviewIndexes(value);
  }
  return parsePreviewIndexes([value]);
}
function extractQaMode(queryString) {
  var query = parseQueryString(queryString);
  var token = query[PREVIEW_TOKEN];
  if (isBlank(token)) {
    return null;
  }
  var result = new QAMode();
  result.token = token;
  var listedActivitiesOnly = query[ACTIVITIES_ONLY];
  if (isNotBlank(listedActivitiesOnly) && listedActivitiesOnly === TRUE) {
    result.listedActivitiesOnly = true;
  }
  var trueAudiences = query[TRUE_AUDIENCE_IDS];
  if (isNotBlank(trueAudiences)) {
    result.evaluateAsTrueAudienceIds = extractAudienceIds(trueAudiences);
  }
  var falseAudiences = query[FALSE_AUDIENCE_IDS];
  if (isNotBlank(falseAudiences)) {
    result.evaluateAsFalseAudienceIds = extractAudienceIds(falseAudiences);
  }
  var previewIndexes = query[PREVIEW_INDEX];
  if (isEmpty(previewIndexes)) {
    return result;
  }
  result.previewIndexes = extractPreviewIndexes(previewIndexes);
  return result;
}
function initQaMode(win) {
  var result = extractQaMode(win.location.search);
  if (isNil(result)) {
    return;
  }
  var expires = new Date(now() + 1.86e6);
  setCookie(QA_MODE_COOKIE, JSON.stringify(result), { expires: expires });
}
function getQaMode() {
  var result = getCookie(QA_MODE_COOKIE);
  if (isBlank(result)) {
    return {};
  }
  try {
    return JSON.parse(result);
  } catch (e) {
    return {};
  }
}

var CURRENT_VIEW$1 = null;
function setCurrentView(options) {
  CURRENT_VIEW$1 = options;
}
function getCurrentView() {
  return CURRENT_VIEW$1;
}

var storage = {};
function setItem(key, value) {
  storage[key] = value;
}
function getItem(key) {
  return storage[key];
}

function saveView(view) {
  var viewName = view.name.toLowerCase();
  var views = getItem(VIEWS) || {};
  views[viewName] = view;
  setItem(VIEWS, views);
}
function findView(key) {
  var viewName = key.toLowerCase();
  var views = getItem(VIEWS) || {};
  return views[viewName];
}
function getView(options) {
  if (isNil(options)) {
    return null;
  }
  var viewName = options.viewName,
      page = options.page;
  var view = findView(viewName);
  if (isNil(view)) {
    return null;
  }
  var result = index$3({}, view);
  result.page = page;
  return result;
}
function hasSavedViews() {
  var views = getItem(VIEWS) || {};
  return !isEmpty(views);
}
function persistViews(views) {
  if (isEmpty(views)) {
    return;
  }
  forEach(saveView, views);
}

function addClass(cssClass, selector) {
  return select(selector).addClass(cssClass);
}
function hasClass(cssClass, selector) {
  return select(selector).hasClass(cssClass);
}
function setCss(style, selector) {
  return select(selector).css(style);
}

var prop = function prop(key) {
  return function (obj) {
    return obj[key];
  };
};
var not = function not(pred) {
  return function (val) {
    return !pred(val);
  };
};
var notNil = not(isNil);
var filterBy = function filterBy(pred) {
  return function (coll) {
    return filter(pred, coll);
  };
};
var isError = function isError(val) {
  return val.status === ERROR;
};
var isActions = function isActions(val) {
  return val.type === ACTIONS;
};
var isRedirect = function isRedirect(val) {
  return val.type === REDIRECT;
};
var filterNotNil = filterBy(notNil);
var selectOptions = prop(OPTIONS);
var selectContent = prop(CONTENT);
var selectResponseTokens = prop(RESPONSE_TOKENS);
var hasName = function hasName(val) {
  return isNotBlank(val.name);
};
var isValidMbox = function isValidMbox(val) {
  return isObject(val) && hasName(val);
};
var isValidView = function isValidView(val) {
  return isObject(val) && hasName(val);
};
var hasSelector = function hasSelector(val) {
  return isNotBlank(val.selector);
};
var selectData = prop(DATA);
var hasData = flow([selectData, notNil]);
function createSuccess(type, data) {
  return { status: SUCCESS, type: type, data: data };
}
function createError(type, data) {
  return { status: ERROR, type: type, data: data };
}

function hasDeviceId(res) {
  var id = res.id;
  return isObject(id) && isNotBlank(id.tntId);
}
function saveDeviceId(setDeviceId, response) {
  if (hasDeviceId(response)) {
    setDeviceId(response.id.tntId);
  }
  return response;
}

function saveEdgeCluster(setEdgeCluster, response) {
  if (hasDeviceId(response)) {
    var id = response.id;
    var tntId = id.tntId;
    setEdgeCluster(tntId);
  }
  setEdgeCluster(null);
  return response;
}

var SDID_PARAM = "adobe_mc_sdid";
function getRedirectUriParams(uri) {
  var result = uri.queryKey;
  var param = result[SDID_PARAM];
  if (!isString(param)) {
    return result;
  }
  if (isBlank(param)) {
    return result;
  }
  var nowInSeconds = Math.round(now() / 1000);
  result[SDID_PARAM] = param.replace(/\|TS=\d+/, "|TS=" + nowInSeconds);
  return result;
}
function getUriParams(uri) {
  return uri.queryKey;
}
function createUrlInternal(url, params, uriParamsFunc) {
  var parsedUri = parseUri(url);
  var protocol = parsedUri.protocol;
  var host = parsedUri.host;
  var path = parsedUri.path;
  var port = parsedUri.port === "" ? "" : ":" + parsedUri.port;
  var anchor = isBlank(parsedUri.anchor) ? "" : "#" + parsedUri.anchor;
  var uriParams = uriParamsFunc(parsedUri);
  var queryString = stringifyQueryString(index$3({}, uriParams, params));
  var query = isBlank(queryString) ? "" : "?" + queryString;
  return protocol + "://" + host + port + path + query + anchor;
}
function createRedirectUrl(url, params) {
  return createUrlInternal(url, params, getRedirectUriParams);
}
function createUrl$1(url, params) {
  return createUrlInternal(url, params, getUriParams);
}

function createRedirectOption(option) {
  var url = option.content;
  if (isBlank(url)) {
    logDebug(EMPTY_URL, option);
    return resolve(null);
  }
  var result = index$3({}, option);
  result.content = createRedirectUrl(url, {});
  return resolve(result);
}

var NETWORK_ERROR$1 = "Network request failed";
var REQUEST_TIMEOUT$1 = "Request timed out";
var URL_REQUIRED = "URL is required";
var GET = "GET";
var POST$1 = "POST";
var METHOD = "method";
var URL$1 = "url";
var HEADERS = "headers";
var DATA$1 = "data";
var CREDENTIALS = "credentials";
var TIMEOUT$1 = "timeout";
var ASYNC = "async";
function throwError(message) {
  throw new Error(message);
}
function processOptions(options) {
  var method = options[METHOD] || GET;
  var url = options[URL$1] || throwError(URL_REQUIRED);
  var headers = options[HEADERS] || {};
  var data = options[DATA$1] || null;
  var credentials = options[CREDENTIALS] || false;
  var timeout$$1 = options[TIMEOUT$1] || 3000;
  var async = isNil(options[ASYNC]) ? true : options[ASYNC] === true;
  var result = {};
  result[METHOD] = method;
  result[URL$1] = url;
  result[HEADERS] = headers;
  result[DATA$1] = data;
  result[CREDENTIALS] = credentials;
  result[TIMEOUT$1] = timeout$$1;
  result[ASYNC] = async;
  return result;
}
function addOnload$1(xhr, resolve$$1, reject$$1) {
  xhr.onload = function () {
    var status = xhr.status === 1223 ? 204 : xhr.status;
    if (status < 100 || status > 599) {
      reject$$1(new Error(NETWORK_ERROR$1));
      return;
    }
    var response = xhr.responseText;
    var headers = xhr.getAllResponseHeaders();
    var result = { status: status, headers: headers, response: response };
    resolve$$1(result);
  };
  return xhr;
}
function addOnerror$1(xhr, reject$$1) {
  xhr.onerror = function () {
    reject$$1(new Error(NETWORK_ERROR$1));
  };
  return xhr;
}
function addOntimeout$1(xhr, timeout$$1, reject$$1) {
  xhr.timeout = timeout$$1;
  xhr.ontimeout = function () {
    reject$$1(new Error(REQUEST_TIMEOUT$1));
  };
  return xhr;
}
function addCredentials(xhr, credentials) {
  if (credentials === true) {
    xhr.withCredentials = credentials;
  }
  return xhr;
}
function addHeaders$1(xhr, headers) {
  forEach(function (value, key) {
    forEach(function (v) {
      return xhr.setRequestHeader(key, v);
    }, value);
  }, headers);
  return xhr;
}
function createXhrPromise(win, opts) {
  var options = processOptions(opts);
  var method = options[METHOD];
  var url = options[URL$1];
  var headers = options[HEADERS];
  var data = options[DATA$1];
  var credentials = options[CREDENTIALS];
  var timeout$$1 = options[TIMEOUT$1];
  var async = options[ASYNC];
  return create(function (resolve$$1, reject$$1) {
    var xhr = new win.XMLHttpRequest();
    xhr = addOnload$1(xhr, resolve$$1, reject$$1);
    xhr = addOnerror$1(xhr, reject$$1);
    xhr.open(method, url, async);
    xhr = addCredentials(xhr, credentials);
    xhr = addHeaders$1(xhr, headers);
    if (async) {
      xhr = addOntimeout$1(xhr, timeout$$1, reject$$1);
    }
    xhr.send(data);
  });
}

function xhr(options) {
  return createXhrPromise(index, options);
}

function createOptions(url, params, timeout) {
  var result = {};
  result[METHOD] = GET;
  result[URL$1] = createUrl$1(url, params);
  result[TIMEOUT$1] = timeout;
  return result;
}
function isSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}
function createOption(res) {
  var status = res.status;
  if (!isSuccess(status)) {
    return null;
  }
  var content = res.response;
  if (isBlank(content)) {
    return null;
  }
  var result = {};
  result.type = HTML;
  result.content = content;
  return result;
}
function createHtmlOption(option) {
  var content = option.content;
  var config = getConfig();
  var timeout = config[TIMEOUT$1];
  return xhr(createOptions(content, {}, timeout)).then(createOption)['catch'](function () {
    return null;
  });
}

var CLICK_TRACK_PATTERN = /CLKTRK#(\S+)/;
var CLICK_TRACK_REPLACE_PATTERN = /CLKTRK#(\S+)\s/;
function getClickTrackNodeId(action) {
  var selector = action[SELECTOR];
  if (isBlank(selector)) {
    return "";
  }
  var result = CLICK_TRACK_PATTERN.exec(selector);
  if (isEmpty(result) || result.length !== 2) {
    return "";
  }
  return result[1];
}
function getContent(id, content) {
  var div = document.createElement(DIV_TAG);
  div.innerHTML = content;
  var firstElement = div.firstElementChild;
  if (isNil(firstElement)) {
    return content;
  }
  firstElement.id = id;
  return firstElement.outerHTML;
}
function processClickTrackId(action) {
  var content = action[CONTENT];
  var nodeId = getClickTrackNodeId(action);
  if (isBlank(nodeId) || isBlank(content)) {
    return action;
  }
  var selector = action[SELECTOR];
  action[SELECTOR] = selector.replace(CLICK_TRACK_REPLACE_PATTERN, "");
  action[CONTENT] = getContent(nodeId, content);
  return action;
}

var notNull$1 = function notNull(val) {
  return !isNil(val);
};
function hasSelectors(action) {
  var selector = action.selector,
      cssSelector = action.cssSelector;
  return !isNil(selector) && !isNil(cssSelector);
}
function setHtml$1(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function setText$1(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function appendHtml(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function prependHtml(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function replaceHtml(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function insertBefore(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function insertAfter(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var result = processClickTrackId(action);
  var content = result[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, result);
    return null;
  }
  return result;
}
function customCode(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_CONTENT, action);
    return null;
  }
  return action;
}
function setAttribute(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isObject(content)) {
    logDebug(EMPTY_ATTRIBUTE, action);
    return null;
  }
  return action;
}
function setImageSource(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isString(content)) {
    logDebug(EMPTY_IMAGE_URL, action);
    return null;
  }
  return action;
}
function setStyle(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isObject(content)) {
    logDebug(EMPTY_PROPERTY, action);
    return null;
  }
  return action;
}
function resize(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isObject(content)) {
    logDebug(EMPTY_SIZES, action);
    return null;
  }
  return action;
}
function move(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isObject(content)) {
    logDebug(EMPTY_COORDINATES, action);
    return null;
  }
  return action;
}
function remove$1(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  return action;
}
function rearrange(action) {
  if (!hasSelectors(action)) {
    return null;
  }
  var content = action[CONTENT];
  if (!isObject(content)) {
    logDebug(EMPTY_REARRANGE, action);
    return null;
  }
  return action;
}
function redirect(action) {
  var content = action.content;
  if (isBlank(content)) {
    logDebug(EMPTY_URL, action);
    return null;
  }
  action.content = createRedirectUrl(content, {});
  return action;
}
function addId(action) {
  var result = index$3({}, action);
  result.id = uuid();
  return result;
}
function processAction(action) {
  var type = action[TYPE];
  if (isBlank(type)) {
    return null;
  }
  var processedAction = addId(action);
  switch (type) {
    case SET_HTML:
      return setHtml$1(processedAction);
    case SET_TEXT:
      return setText$1(processedAction);
    case APPEND_HTML:
      return appendHtml(processedAction);
    case PREPEND_HTML:
      return prependHtml(processedAction);
    case REPLACE_HTML:
      return replaceHtml(processedAction);
    case INSERT_BEFORE:
      return insertBefore(processedAction);
    case INSERT_AFTER:
      return insertAfter(processedAction);
    case CUSTOM_CODE:
      return customCode(processedAction);
    case SET_ATTRIBUTE:
      return setAttribute(processedAction);
    case SET_IMAGE_SOURCE:
      return setImageSource(processedAction);
    case SET_STYLE:
      return setStyle(processedAction);
    case RESIZE:
      return resize(processedAction);
    case MOVE:
      return move(processedAction);
    case REMOVE:
      return remove$1(processedAction);
    case REARRANGE:
      return rearrange(processedAction);
    case REDIRECT:
      return redirect(processedAction);
    default:
      return null;
  }
}
function createActionsOption(option) {
  var actions = option[CONTENT];
  if (!isArray(actions)) {
    return resolve(null);
  }
  if (isEmpty(actions)) {
    return resolve(null);
  }
  var processedActions = filter(notNull$1, map(processAction, actions));
  if (isEmpty(processedActions)) {
    return resolve(null);
  }
  var result = index$3({}, option);
  result.content = processedActions;
  return resolve(result);
}

function addTraceIfExists() {
  var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var trace = item.trace;
  if (!isEmpty(trace)) {
    addServerTrace(trace);
  }
}
function handleTraces(httpContext) {
  var response = httpContext.response;
  var _response$execute = response.execute,
      execute = _response$execute === undefined ? {} : _response$execute,
      _response$prefetch = response.prefetch,
      prefetch = _response$prefetch === undefined ? {} : _response$prefetch;
  var _execute$pageLoad = execute.pageLoad,
      pageLoad = _execute$pageLoad === undefined ? {} : _execute$pageLoad,
      _execute$mboxes = execute.mboxes,
      mboxes = _execute$mboxes === undefined ? [] : _execute$mboxes;
  var _prefetch$mboxes = prefetch.mboxes,
      prefetchMboxes = _prefetch$mboxes === undefined ? [] : _prefetch$mboxes,
      _prefetch$views = prefetch.views,
      views = _prefetch$views === undefined ? [] : _prefetch$views;
  addTraceIfExists(pageLoad);
  forEach(addTraceIfExists, mboxes);
  forEach(addTraceIfExists, prefetchMboxes);
  forEach(addTraceIfExists, views);
  return httpContext;
}
function isValidOption(option) {
  if (isEmpty(option)) {
    return false;
  }
  var type = option.type;
  if (isBlank(type)) {
    return false;
  }
  var content = option.content;
  if (isString(content)) {
    return true;
  }
  if (isObject(content)) {
    return true;
  }
  if (isArray(content)) {
    return true;
  }
  return false;
}
function isValidEventTokenOption(option) {
  if (!isValidOption(option)) {
    return false;
  }
  var eventToken = option.eventToken;
  if (isBlank(eventToken)) {
    return false;
  }
  return true;
}
function isValidMetric(metric) {
  if (isEmpty(metric)) {
    return false;
  }
  var type = metric.type;
  if (isBlank(type)) {
    return false;
  }
  var eventToken = metric.eventToken;
  if (isBlank(eventToken)) {
    return false;
  }
  return true;
}
function isValidSelectorMetric(metric) {
  if (!isValidMetric(metric)) {
    return false;
  }
  var selector = metric.selector;
  if (isBlank(selector)) {
    return false;
  }
  return true;
}
function processOption(option) {
  var type = option.type;
  switch (type) {
    case REDIRECT:
      return createRedirectOption(option);
    case DYNAMIC:
      return createHtmlOption(option);
    case ACTIONS:
      return createActionsOption(option);
    default:
      return resolve(option);
  }
}
function processOptions$1(options, predicate) {
  if (!isArray(options)) {
    return resolve([]);
  }
  if (isEmpty(options)) {
    return resolve([]);
  }
  var validOptions = filter(predicate, options);
  if (isEmpty(validOptions)) {
    return resolve([]);
  }
  var optionsPromises = map(function (opt) {
    return processOption(opt);
  }, validOptions);
  return all(optionsPromises).then(filterNotNil);
}
function processMetrics(metrics, predicate) {
  if (!isArray(metrics)) {
    return resolve([]);
  }
  if (isEmpty(metrics)) {
    return resolve([]);
  }
  return resolve(filter(predicate, metrics));
}
function createOptionsMetricsPair(arr) {
  var options = arr[0];
  var metrics = arr[1];
  var hasOptions = !isEmpty(options);
  var hasMetrics = !isEmpty(metrics);
  if (!hasOptions && !hasMetrics) {
    return null;
  }
  var result = {};
  if (hasOptions) {
    result.options = options;
  }
  if (hasMetrics) {
    result.metrics = metrics;
  }
  return result;
}
function processPageLoad(httpContext) {
  var response = httpContext.response;
  var execute = response.execute;
  if (!isObject(execute)) {
    return resolve(null);
  }
  var pageLoad = execute.pageLoad;
  if (!isObject(pageLoad)) {
    return resolve(null);
  }
  var options = pageLoad.options,
      metrics = pageLoad.metrics;
  return all([processOptions$1(options, isValidOption), processMetrics(metrics, isValidSelectorMetric)]).then(createOptionsMetricsPair);
}
function processExecuteMbox(item) {
  var name = item.name,
      options = item.options,
      metrics = item.metrics;
  return all([processOptions$1(options, isValidOption), processMetrics(metrics)]).then(createOptionsMetricsPair).then(function (result) {
    if (isNil(result)) {
      return null;
    }
    result.name = name;
    return result;
  });
}
function processExecuteMboxes(httpContext) {
  var response = httpContext.response;
  var execute = response.execute;
  if (!isObject(execute)) {
    return resolve([]);
  }
  var mboxes = execute.mboxes;
  if (!isArray(mboxes) || isEmpty(mboxes)) {
    return resolve([]);
  }
  var validMboxes = filter(isValidMbox, mboxes);
  return all(map(processExecuteMbox, validMboxes)).then(filterNotNil);
}
function sameMbox(mbox, index, name) {
  return mbox.index === index && mbox.name === name;
}
function getRequestMbox(request, index, name) {
  var _request$prefetch = request.prefetch,
      prefetch = _request$prefetch === undefined ? {} : _request$prefetch;
  var _prefetch$mboxes2 = prefetch.mboxes,
      mboxes = _prefetch$mboxes2 === undefined ? [] : _prefetch$mboxes2;
  if (isEmpty(mboxes)) {
    return null;
  }
  return first(filter(function (item) {
    return sameMbox(item, index, name);
  }, mboxes));
}
function processPrefetchMbox(request, item) {
  var index = item.index,
      name = item.name,
      state = item.state,
      options = item.options,
      metrics = item.metrics;
  if (isNil(index)) {
    return resolve(null);
  }
  if (isBlank(name)) {
    return resolve(null);
  }
  var requestMbox = getRequestMbox(request, index, name);
  return all([processOptions$1(options, isValidOption), processMetrics(metrics)]).then(createOptionsMetricsPair).then(function (result) {
    if (isNil(result)) {
      return null;
    }
    result.name = name;
    result.state = state;
    if (isNil(requestMbox)) {
      return result;
    }
    result.parameters = requestMbox.parameters;
    result.profileParameters = requestMbox.profileParameters;
    result.order = requestMbox.order;
    result.product = requestMbox.product;
    return result;
  });
}
function processPrefetchMboxes(httpContext) {
  var request = httpContext.request,
      response = httpContext.response;
  var prefetch = response.prefetch;
  if (!isObject(prefetch)) {
    return resolve([]);
  }
  var mboxes = prefetch.mboxes;
  if (!isArray(mboxes) || isEmpty(mboxes)) {
    return resolve([]);
  }
  var validMboxes = filter(isValidMbox, mboxes);
  var process = function process(item) {
    return processPrefetchMbox(request, item);
  };
  return all(map(process, validMboxes)).then(filterNotNil);
}
function getRequestView(request) {
  var _request$prefetch2 = request.prefetch,
      prefetch = _request$prefetch2 === undefined ? {} : _request$prefetch2;
  var _prefetch$views2 = prefetch.views,
      views = _prefetch$views2 === undefined ? [] : _prefetch$views2;
  if (isEmpty(views)) {
    return null;
  }
  return views[0];
}
function processView(request, view) {
  var name = view.name,
      state = view.state,
      options = view.options,
      metrics = view.metrics;
  if (isBlank(name)) {
    return resolve(null);
  }
  var requestView = getRequestView(request);
  return all([processOptions$1(options, isValidEventTokenOption), processMetrics(metrics, isValidSelectorMetric)]).then(createOptionsMetricsPair).then(function (result) {
    if (isNil(result)) {
      return null;
    }
    result.name = name;
    result.state = state;
    if (isNil(requestView)) {
      return result;
    }
    result.parameters = requestView.parameters;
    result.profileParameters = requestView.profileParameters;
    result.order = requestView.order;
    result.product = requestView.product;
    return result;
  });
}
function processPrefetchViews(httpContext) {
  var request = httpContext.request,
      response = httpContext.response;
  var prefetch = response.prefetch;
  if (!isObject(prefetch)) {
    return resolve([]);
  }
  var views = prefetch.views;
  if (!isArray(views) || isEmpty(views)) {
    return resolve([]);
  }
  var validViews = filter(isValidView, views);
  var process = function process(view) {
    return processView(request, view);
  };
  return all(map(process, validViews)).then(filterNotNil);
}
function processPrefetchMetrics(httpContext) {
  var response = httpContext.response;
  var prefetch = response.prefetch;
  if (!isObject(prefetch)) {
    return resolve([]);
  }
  var metrics = prefetch.metrics;
  return processMetrics(metrics, isValidSelectorMetric);
}
function getResponseTokensFromOptions(value) {
  var options = value.options;
  if (!isArray(options)) {
    return [];
  }
  if (isEmpty(options)) {
    return [];
  }
  return filterNotNil(map(selectResponseTokens, options));
}
function getResponseTokens(response) {
  var execute = response.execute || {};
  var prefetch = response.prefetch || {};
  var pageLoad = execute.pageLoad || {};
  var mboxes = execute.mboxes || [];
  var prefetchMboxes = prefetch.mboxes || [];
  var views = prefetch.views || [];
  var pageLoadTokens = getResponseTokensFromOptions(pageLoad);
  var mboxesTokens = flatten(map(getResponseTokensFromOptions, mboxes));
  var prefetchMboxesTokens = flatten(map(getResponseTokensFromOptions, prefetchMboxes));
  var viewsTokens = flatten(map(getResponseTokensFromOptions, views));
  return flatten([pageLoadTokens, mboxesTokens, prefetchMboxesTokens, viewsTokens]);
}
function getRedirect(response) {
  var execute = response.execute || {};
  var pageLoad = execute.pageLoad || {};
  var mboxes = execute.mboxes || [];
  var pageLoadOpts = selectOptions(pageLoad) || [];
  var mboxesOpts = flatten(map(selectOptions, mboxes));
  var options = flatten([pageLoadOpts, mboxesOpts]);
  var actions = flatten(map(selectContent, filter(isActions, options)));
  var redirectOptions = filter(isRedirect, options);
  var redirectActions = filter(isRedirect, actions);
  var redirects = redirectOptions.concat(redirectActions);
  var result = {};
  if (isEmpty(redirects)) {
    return result;
  }
  var redirect = redirects[0];
  var url = redirect.content;
  if (isBlank(url)) {
    return result;
  }
  result.url = url;
  return result;
}
function createResponseContext(arr) {
  var pageLoad = arr[0];
  var mboxes = arr[1];
  var prefetchMboxes = arr[2];
  var views = arr[3];
  var metrics = arr[4];
  var result = {};
  var execute = {};
  if (isObject(pageLoad)) {
    execute.pageLoad = pageLoad;
  }
  if (!isEmpty(mboxes)) {
    execute.mboxes = mboxes;
  }
  var prefetch = {};
  if (!isEmpty(prefetchMboxes)) {
    prefetch.mboxes = prefetchMboxes;
  }
  if (!isEmpty(views)) {
    prefetch.views = views;
  }
  if (!isEmpty(metrics)) {
    prefetch.metrics = metrics;
  }
  if (!isEmpty(execute)) {
    result.execute = execute;
  }
  if (!isEmpty(prefetch)) {
    result.prefetch = prefetch;
  }
  return result;
}
function processResponse(httpContext) {
  var handleDeviceId = function handleDeviceId(context) {
    saveDeviceId(setDeviceId, context.response);
    return context;
  };
  var handleEdgeCluster = function handleEdgeCluster(context) {
    saveEdgeCluster(setEdgeCluster, context.response);
    return context;
  };
  var context = flow([handleTraces, handleDeviceId, handleEdgeCluster])(httpContext);
  var pageLoad = processPageLoad(context);
  var mboxes = processExecuteMboxes(context);
  var prefetchMboxes = processPrefetchMboxes(context);
  var views = processPrefetchViews(context);
  var metrics = processPrefetchMetrics(context);
  return all([pageLoad, mboxes, prefetchMboxes, views, metrics]).then(createResponseContext);
}

var STATE = {};
var LOCKED = "l";
var MISSING = "m";
var FAILED = "f";
var IN_PROGRESS = "p";
function remove$2(array, value) {
  var i = 0;
  var index = -1;
  var length = array.length;
  while (i < length) {
    var currentValue = array[i];
    if (currentValue.id === value.id) {
      index = i;
      break;
    }
    i += 1;
  }
  if (index !== -1) {
    array.splice(index, 1);
  }
}
function tryLockTask(taskId) {
  STATE[taskId] = STATE[taskId] || {};
  if (STATE[taskId][LOCKED]) {
    return false;
  }
  STATE[taskId][LOCKED] = true;
  return true;
}
function unlockTask(taskId) {
  if (STATE[taskId]) {
    STATE[taskId][LOCKED] = false;
  }
}
function getActions(taskId, type) {
  STATE[taskId] = STATE[taskId] || {};
  return STATE[taskId][type] || [];
}
function saveActions(taskId, type, actions) {
  STATE[taskId] = STATE[taskId] || {};
  STATE[taskId][type] = actions;
}
function removeActions(taskId) {
  delete STATE[taskId];
}
function saveAction(taskId, type, action) {
  STATE[taskId] = STATE[taskId] || {};
  STATE[taskId][type] = STATE[taskId][type] || [];
  STATE[taskId][type].push(action);
}
function removeAction(taskId, type, action) {
  STATE[taskId] = STATE[taskId] || {};
  STATE[taskId][type] = STATE[taskId][type] || [];
  remove$2(STATE[taskId][type], action);
}

var MUTATION_OBSERVER = "MutationObserver";
var MO_CONFIG = { childList: true, subtree: true };
var MO_OBJECT = index[MUTATION_OBSERVER];
var TASKS = {};
var MO_INSTANCE = null;
function handleMutations() {
  forEach(function (value) {
    return value();
  }, TASKS);
}
function startObservingIfRequired() {
  if (!isNil(MO_INSTANCE)) {
    return;
  }
  MO_INSTANCE = new MO_OBJECT(handleMutations);
  MO_INSTANCE.observe(index$1, MO_CONFIG);
}
function isSupported() {
  return !isNil(MO_OBJECT);
}
function startTicker(taskId, task) {
  TASKS[taskId] = task;
  task();
  startObservingIfRequired();
}
function stopTicker(taskId) {
  delete TASKS[taskId];
  if (isNil(MO_INSTANCE)) {
    return;
  }
  if (!isEmpty(TASKS)) {
    return;
  }
  MO_INSTANCE.disconnect();
  MO_INSTANCE = null;
}

var DELAY = 1000;
var VISIBILITY_STATE = "visibilityState";
var VISIBLE = "visible";
var TASKS$1 = {};
function runner(callback) {
  if (index$1[VISIBILITY_STATE] === VISIBLE) {
    index.requestAnimationFrame(callback);
    return;
  }
  delay(callback, DELAY);
}
function tick() {
  if (isEmpty(TASKS$1)) {
    return;
  }
  var handler = function handler() {
    forEach(function (value) {
      return value();
    }, TASKS$1);
    tick();
  };
  runner(handler);
}
function startTicker$1(taskId, task) {
  TASKS$1[taskId] = task;
  task();
  tick();
}
function stopTicker$1(taskId) {
  delete TASKS$1[taskId];
}

function startTicker$2(taskId, task) {
  if (isSupported()) {
    startTicker(taskId, task);
    return;
  }
  startTicker$1(taskId, task);
}
function stopTicker$2(taskId) {
  if (isSupported()) {
    stopTicker(taskId);
    return;
  }
  stopTicker$1(taskId);
}

function getAttr(name, selector) {
  return select(selector).attr(name);
}
function setAttr(name, value, selector) {
  return select(selector).attr(name, value);
}
function removeAttr(name, selector) {
  return select(selector).removeAttr(name);
}
function copyAttr(from, to, selector) {
  var value = getAttr(from, selector);
  if (isNotBlank(value)) {
    removeAttr(from, selector);
    setAttr(to, value, selector);
  }
}
function hasAttr(name, selector) {
  return isNotBlank(getAttr(name, selector));
}

function getDataSrc(item) {
  return getAttr(DATA_SRC, item);
}
function hasDataSrc(item) {
  return hasAttr(DATA_SRC, item);
}
function disableImages(html) {
  forEach(function (item) {
    return copyAttr(SRC, DATA_SRC, item);
  }, toArray$1(find(IMAGE_TAG, html)));
  return html;
}
function enableImages(html) {
  forEach(function (item) {
    return copyAttr(DATA_SRC, SRC, item);
  }, toArray$1(find(IMAGE_TAG, html)));
  return html;
}
function loadImage(src) {
  logDebug(LOADING_IMAGE, src);
  return getAttr(SRC, setAttr(SRC, src, wrap("<" + IMAGE_TAG + "/>")));
}
function loadImages(html) {
  var elements = filter(hasDataSrc, toArray$1(find(IMAGE_TAG, html)));
  if (isEmpty(elements)) {
    return html;
  }
  forEach(loadImage, map(getDataSrc, elements));
  return html;
}
function renderImages(html) {
  return flow([disableImages, loadImages, enableImages])(html);
}

function getUrl(item) {
  var src = getAttr(SRC, item);
  return isNotBlank(src) ? src : null;
}
function getScriptsUrls(html) {
  return filter(isNotBlank, map(getUrl, toArray$1(find(SCRIPT, html))));
}
function loadScripts(urls) {
  return reduce(function (acc, url) {
    return acc.then(function () {
      logDebug(REMOTE_SCRIPT, url);
      addClientTrace({ remoteScript: url });
      return index$9(url);
    });
  }, resolve(), urls);
}
function handleRenderingSuccess(action) {
  return action;
}
function handleRenderingError(action, error) {
  logWarn(UNEXPECTED_ERROR, error);
  addClientTrace({ action: action, error: error });
  return action;
}
function renderHtml(renderFunc, action) {
  var container = select(action[SELECTOR]);
  var html = renderImages(fragment(action[CONTENT]));
  var urls = getScriptsUrls(html);
  var result = void 0;
  try {
    result = resolve(renderFunc(container, html));
  } catch (err) {
    return reject(handleRenderingError(action, err));
  }
  if (isEmpty(urls)) {
    return result.then(function () {
      return handleRenderingSuccess(action);
    })['catch'](function (error) {
      return handleRenderingError(action, error);
    });
  }
  return result.then(function () {
    return loadScripts(urls);
  }).then(function () {
    return handleRenderingSuccess(action);
  })['catch'](function (error) {
    return handleRenderingError(action, error);
  });
}

var HEAD_TAGS_SELECTOR = SCRIPT_TAG + "," + LINK_TAG + "," + STYLE_TAG;
function getHeadContent(content) {
  var container = fragment(content);
  var result = reduce(function (acc, elem) {
    acc.push(getHtml(fragment(elem)));
    return acc;
  }, [], toArray$1(find(HEAD_TAGS_SELECTOR, container)));
  return join("", result);
}
function preprocessAction(action) {
  var result = index$3({}, action);
  var content = result[CONTENT];
  if (isBlank(content)) {
    return result;
  }
  var container = select(result[SELECTOR]);
  if (!is(HEAD_TAG, container)) {
    return result;
  }
  result[TYPE] = APPEND_HTML;
  result[CONTENT] = getHeadContent(content);
  return result;
}
function addPxIfRequired(value) {
  var hasPx = value.indexOf("px") === value.length - 2;
  return hasPx ? value : value + "px";
}
function setHtmlRenderFunc(container, html) {
  return setHtml(getHtml(html), container);
}
function setHtml$2(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(setHtmlRenderFunc, action);
}
function setText$2(action) {
  var container = select(action[SELECTOR]);
  var content = action[CONTENT];
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  setText(content, container);
  return resolve(action);
}
function appendHtmlRenderFunc(container, html) {
  return append(getHtml(html), container);
}
function appendHtml$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(appendHtmlRenderFunc, action);
}
function prependHtmlRenderFunc(container, html) {
  return prepend(getHtml(html), container);
}
function prependHtml$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(prependHtmlRenderFunc, action);
}
function replaceHtmlRenderFunc(container, html) {
  var parentContainer = parent(container);
  remove(before(getHtml(html), container));
  return parentContainer;
}
function replaceHtml$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(replaceHtmlRenderFunc, action);
}
function insertBeforeRenderFunc(container, html) {
  return prev(before(getHtml(html), container));
}
function insertBefore$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(insertBeforeRenderFunc, action);
}
function insertAfterRenderFunc(container, html) {
  return next(after(getHtml(html), container));
}
function insertAfter$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(insertAfterRenderFunc, action);
}
function customCodeRenderFunc(container, html) {
  return parent(before(getHtml(html), container));
}
function customCode$1(action) {
  logDebug(ACTION_RENDERING, action);
  return renderHtml(customCodeRenderFunc, action);
}
function setImageSource$1(action) {
  var content = action[CONTENT];
  var container = select(action[SELECTOR]);
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  removeAttr(SRC, container);
  setAttr(SRC, loadImage(content), container);
  return resolve(action);
}
function setAttribute$1(action) {
  var content = action[CONTENT];
  var container = select(action[SELECTOR]);
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  forEach(function (value, key) {
    return setAttr(key, value, container);
  }, content);
  return resolve(action);
}
function setCssWithPriority(container, style, priority) {
  forEach(function (elem) {
    forEach(function (value, key) {
      return elem.style.setProperty(key, value, priority);
    }, style);
  }, toArray$1(container));
}
function setStyle$1(action) {
  var container = select(action[SELECTOR]);
  var content = action[CONTENT];
  var priority = content[PRIORITY];
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  if (isBlank(priority)) {
    setCss(content, container);
  } else {
    setCssWithPriority(container, content, priority);
  }
  return resolve(action);
}
function resize$1(action) {
  var container = select(action[SELECTOR]);
  var content = action[CONTENT];
  content[WIDTH] = addPxIfRequired(content[WIDTH]);
  content[HEIGHT] = addPxIfRequired(content[HEIGHT]);
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  setCss(content, container);
  return resolve(action);
}
function move$1(action) {
  var container = select(action[SELECTOR]);
  var content = action[CONTENT];
  content[LEFT] = addPxIfRequired(content[LEFT]);
  content[TOP] = addPxIfRequired(content[TOP]);
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  setCss(content, container);
  return resolve(action);
}
function remove$3(action) {
  var container = select(action[SELECTOR]);
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  remove(container);
  return resolve(action);
}
function rearrange$1(action) {
  var container = select(action[SELECTOR]);
  var content = action[CONTENT];
  var from = content[FROM];
  var to = content[TO];
  var elements = toArray$1(children(container));
  var elemFrom = elements[from];
  var elemTo = elements[to];
  if (!exists$2(elemFrom) || !exists$2(elemTo)) {
    logDebug(REARRANGE_MISSING, action);
    return reject(action);
  }
  logDebug(ACTION_RENDERING, action);
  addClientTrace({ action: action });
  if (from < to) {
    after(elemFrom, elemTo);
  } else {
    before(elemFrom, elemTo);
  }
  return resolve(action);
}
function executeRenderAction(action) {
  var processedAction = preprocessAction(action);
  var type = processedAction[TYPE];
  switch (type) {
    case SET_HTML:
      return setHtml$2(processedAction);
    case SET_TEXT:
      return setText$2(processedAction);
    case APPEND_HTML:
      return appendHtml$1(processedAction);
    case PREPEND_HTML:
      return prependHtml$1(processedAction);
    case REPLACE_HTML:
      return replaceHtml$1(processedAction);
    case INSERT_BEFORE:
      return insertBefore$1(processedAction);
    case INSERT_AFTER:
      return insertAfter$1(processedAction);
    case CUSTOM_CODE:
      return customCode$1(processedAction);
    case SET_ATTRIBUTE:
      return setAttribute$1(processedAction);
    case SET_IMAGE_SOURCE:
      return setImageSource$1(processedAction);
    case SET_STYLE:
      return setStyle$1(processedAction);
    case RESIZE:
      return resize$1(processedAction);
    case MOVE:
      return move$1(processedAction);
    case REMOVE:
      return remove$3(processedAction);
    case REARRANGE:
      return rearrange$1(processedAction);
    default:
      return resolve(processedAction);
  }
}

var ACTION_CSS_PREFIX = "at-action-";
function isClickTracking(action) {
  return action[TYPE] === TRACK_CLICK || action[TYPE] === SIGNAL_CLICK;
}
function hasValidSelector(action) {
  var selector = action[SELECTOR];
  return isNotBlank(selector) || isElement(selector);
}
function markAsRendered(action) {
  var id = action[ID];
  if (isBlank(id)) {
    return;
  }
  if (!hasValidSelector(action)) {
    return;
  }
  var cssClass = "" + ACTION_CSS_PREFIX + id;
  var selector = action[SELECTOR];
  addClass(cssClass, selector);
}
function removeActionCssHiding(action) {
  var cssSelector = action[CSS_SELECTOR];
  if (isBlank(cssSelector)) {
    return;
  }
  removeActionHidingStyle(cssSelector);
}
function displayAction(action) {
  if (!hasValidSelector(action)) {
    removeActionCssHiding(action);
    return;
  }
  var selector = action[SELECTOR];
  if (isClickTracking(action)) {
    addClass(CLICK_TRACKING_CSS_CLASS, selector);
    return;
  }
  addClass(MARKER_CSS_CLASS, selector);
  removeActionCssHiding(action);
}
function displayActions(actions) {
  forEach(displayAction, actions);
}
function handleComplete(taskId, resolve$$1, reject$$1) {
  var missingActions = getActions(taskId, MISSING);
  var failedActions = getActions(taskId, FAILED);
  var actions = missingActions.concat(failedActions);
  removeActions(taskId);
  if (!isEmpty(actions)) {
    displayActions(actions);
    reject$$1(actions);
    return;
  }
  resolve$$1();
}
function shouldRender(action) {
  var id = action[ID];
  if (isBlank(id)) {
    return true;
  }
  var type = action[TYPE];
  if (type === CUSTOM_CODE) {
    return action[PAGE];
  }
  var cssClass = "" + ACTION_CSS_PREFIX + id;
  var selector = action[SELECTOR];
  return !hasClass(cssClass, selector);
}
function isRenderingComplete(taskId) {
  var missingActions = getActions(taskId, MISSING);
  var inProgressActions = getActions(taskId, IN_PROGRESS);
  return isEmpty(missingActions) && isEmpty(inProgressActions);
}
function renderAction(taskId, action) {
  var renderCompleteEvent = RENDER_COMPLETE_EVENT + "-" + taskId;
  if (!shouldRender(action)) {
    displayAction(action);
    removeAction(taskId, IN_PROGRESS, action);
    if (isRenderingComplete(taskId)) {
      publish(renderCompleteEvent);
    }
    return;
  }
  executeRenderAction(action).then(function () {
    logDebug(ACTION_RENDERED, action);
    addClientTrace({ action: action });
    markAsRendered(action);
    displayAction(action);
    removeAction(taskId, IN_PROGRESS, action);
    if (isRenderingComplete(taskId)) {
      publish(renderCompleteEvent);
    }
  })['catch'](function (error) {
    logWarn(UNEXPECTED_ERROR, error);
    addClientTrace({ action: action, error: error });
    displayAction(action);
    removeAction(taskId, IN_PROGRESS, action);
    saveAction(taskId, FAILED, action);
    if (isRenderingComplete(taskId)) {
      publish(renderCompleteEvent);
    }
  });
}
function startTimer(taskId, selectorsPollingTimeout) {
  var timeoutEvent = TIMEOUT_EVENT + "-" + taskId;
  delay(function () {
    return publish(timeoutEvent);
  }, selectorsPollingTimeout);
}
function applyActions(taskId, resolve$$1, reject$$1) {
  var tickEvent = TICK_EVENT + "-" + taskId;
  var timeoutEvent = TIMEOUT_EVENT + "-" + taskId;
  var renderCompleteEvent = RENDER_COMPLETE_EVENT + "-" + taskId;
  subscribe(tickEvent, function () {
    if (!tryLockTask(taskId)) {
      return;
    }
    if (isRenderingComplete(taskId)) {
      publish(renderCompleteEvent);
      unlockTask(taskId);
      return;
    }
    var actions = getActions(taskId, MISSING);
    var missingActions = [];
    forEach(function (action) {
      if (exists$2(action[SELECTOR])) {
        saveAction(taskId, IN_PROGRESS, action);
        renderAction(taskId, action);
        return;
      }
      missingActions.push(action);
    }, actions);
    saveActions(taskId, MISSING, missingActions);
    unlockTask(taskId);
  });
  subscribeOnce(renderCompleteEvent, function () {
    stopTicker$2(taskId);
    unsubscribe(tickEvent);
    unsubscribe(timeoutEvent);
    handleComplete(taskId, resolve$$1, reject$$1);
  });
  subscribeOnce(timeoutEvent, function () {
    stopTicker$2(taskId);
    unsubscribe(tickEvent);
    unsubscribe(renderCompleteEvent);
    handleComplete(taskId, resolve$$1, reject$$1);
  });
  startTicker$2(taskId, function () {
    return publish(tickEvent);
  });
}
function executeRenderActions(actions) {
  var config = getConfig();
  var selectorsPollingTimeout = config[SELECTORS_POLLING_TIMEOUT];
  var taskId = uuid();
  startTimer(taskId, selectorsPollingTimeout);
  saveActions(taskId, MISSING, actions);
  return create(function (resolve$$1, reject$$1) {
    return applyActions(taskId, resolve$$1, reject$$1);
  });
}

function listen(type, func, selector) {
  return select(selector).on(type, func);
}

var METRIC_ELEMENT_NOT_FOUND = "metric element not found";
function startTimer$1(taskId, selectorsPollingTimeout) {
  delay(function () {
    return publish(TIMEOUT_EVENT + "-" + taskId);
  }, selectorsPollingTimeout);
}
function applyMetric(taskId, metric, resolve$$1, reject$$1) {
  var tickEvent = TICK_EVENT + "-" + taskId;
  var timeoutEvent = TIMEOUT_EVENT + "-" + taskId;
  var renderCompleteEvent = RENDER_COMPLETE_EVENT + "-" + taskId;
  subscribe(tickEvent, function () {
    var selector = metric[SELECTOR];
    if (!exists$2(selector)) {
      return;
    }
    publish(renderCompleteEvent);
  });
  subscribeOnce(renderCompleteEvent, function () {
    stopTicker$2(taskId);
    unsubscribe(tickEvent);
    unsubscribe(timeoutEvent);
    addClientTrace({ metric: metric });
    resolve$$1(metric);
  });
  subscribeOnce(timeoutEvent, function () {
    stopTicker$2(taskId);
    unsubscribe(tickEvent);
    unsubscribe(renderCompleteEvent);
    logWarn(METRIC_ELEMENT_NOT_FOUND, metric);
    addClientTrace({ metric: metric, message: METRIC_ELEMENT_NOT_FOUND });
    reject$$1(metric);
  });
  startTicker$2(taskId, function () {
    return publish(tickEvent);
  });
}
function executeMetric(metric) {
  var config = getConfig();
  var selectorsPollingTimeout = config[SELECTORS_POLLING_TIMEOUT];
  var taskId = uuid();
  startTimer$1(taskId, selectorsPollingTimeout);
  return create(function (resolve$$1, reject$$1) {
    applyMetric(taskId, metric, resolve$$1, reject$$1);
  });
}

function isPair(pair) {
  return !isEmpty(pair) && pair.length === 2 && isNotBlank(pair[0]);
}
function createPair$1(param) {
  var index = param.indexOf("=");
  if (index === -1) {
    return [];
  }
  return [param.substr(0, index), param.substr(index + 1)];
}
function objectToParamsInternal(obj, ks, result, keyFunc) {
  forEach(function (value, key) {
    if (isObject(value)) {
      ks.push(key);
      objectToParamsInternal(value, ks, result, keyFunc);
      ks.pop();
    } else if (isEmpty(ks)) {
      result[keyFunc(key)] = value;
    } else {
      result[keyFunc(join(".", ks.concat(key)))] = value;
    }
  }, obj);
}
function queryStringToParams(queryString) {
  return filter(function (value, key) {
    return isNotBlank(key);
  }, parseQueryString(queryString));
}
function arrayToParams(array) {
  var pairs = reduce(function (acc, param) {
    acc.push(createPair$1(param));
    return acc;
  }, [], filter(isNotBlank, array));
  return reduce(function (acc, pair) {
    acc[decode$2(trim(pair[0]))] = decode$2(trim(pair[1]));
    return acc;
  }, {}, filter(isPair, pairs));
}
function objectToParams(object, keyFunc) {
  var result = {};
  if (isNil(keyFunc)) {
    objectToParamsInternal(object, [], result, identity);
  } else {
    objectToParamsInternal(object, [], result, keyFunc);
  }
  return result;
}
function functionToParams(func) {
  if (!isFunction(func)) {
    return {};
  }
  var params = null;
  try {
    params = func();
  } catch (_ignore) {
    return {};
  }
  if (isNil(params)) {
    return {};
  }
  if (isArray(params)) {
    return arrayToParams(params);
  }
  if (isString(params) && isNotBlank(params)) {
    return queryStringToParams(params);
  }
  if (isObject(params)) {
    return objectToParams(params);
  }
  return {};
}

function getParamsAll(mboxParams) {
  return index$3({}, mboxParams, functionToParams(index.targetPageParamsAll));
}
function getParams(globalMboxParams) {
  return index$3({}, globalMboxParams, functionToParams(index.targetPageParams));
}
function getTargetPageParams(mbox) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var mboxParams = config[MBOX_PARAMS];
  var globalMboxParams = config[GLOBAL_MBOX_PARAMS];
  if (globalMbox !== mbox) {
    return getParamsAll(mboxParams || {});
  }
  return index$3(getParamsAll(mboxParams || {}), getParams(globalMboxParams || {}));
}

function getWebGLRendererInternal() {
  var canvas = index$1.createElement("canvas");
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (isNil(gl)) {
    return null;
  }
  var glInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (isNil(glInfo)) {
    return null;
  }
  var result = gl.getParameter(glInfo.UNMASKED_RENDERER_WEBGL);
  if (isNil(result)) {
    return null;
  }
  return result;
}
var WEB_GL_RENDERER_INTERNAL = getWebGLRendererInternal();
function getPixelRatio() {
  var ratio = index.devicePixelRatio;
  if (!isNil(ratio)) {
    return ratio;
  }
  ratio = 1;
  var screen = index.screen;
  var systemXDPI = screen.systemXDPI,
      logicalXDPI = screen.logicalXDPI;
  if (!isNil(systemXDPI) && !isNil(logicalXDPI) && systemXDPI > logicalXDPI) {
    ratio = systemXDPI / logicalXDPI;
  }
  return ratio;
}
function getScreenOrientation() {
  var screen = index.screen;
  var orientation = screen.orientation,
      width = screen.width,
      height = screen.height;
  if (isNil(orientation)) {
    return width > height ? "landscape" : "portrait";
  }
  if (isNil(orientation.type)) {
    return null;
  }
  var parts = split("-", orientation.type);
  if (isEmpty(parts)) {
    return null;
  }
  var result = parts[0];
  if (!isNil(result)) {
    return result;
  }
  return null;
}
function getWebGLRenderer() {
  return WEB_GL_RENDERER_INTERNAL;
}

var PROFILE_PREFIX = "profile.";
var THIRD_PARTY_ID = "mbox3rdPartyId";
var PROPERTY_TOKEN = "at_property";
var ORDER_ID = "orderId";
var ORDER_TOTAL = "orderTotal";
var PRODUCT_PURCHASED_ID = "productPurchasedId";
var PRODUCT_ID = "productId";
var CATEGORY_ID = "categoryId";
function isThirdPartyId(param) {
  return param === THIRD_PARTY_ID;
}
function isProfileParam(param) {
  return param.indexOf(PROFILE_PREFIX) !== -1;
}
function isPropertyToken(param) {
  return param === PROPERTY_TOKEN;
}
function isOrderId(param) {
  return param === ORDER_ID;
}
function isOrderTotal(param) {
  return param === ORDER_TOTAL;
}
function isProductPurchasedId(param) {
  return param === PRODUCT_PURCHASED_ID;
}
function isProductId(param) {
  return param === PRODUCT_ID;
}
function isCategoryId(param) {
  return param === CATEGORY_ID;
}
function isSpecialParam(param) {
  return isProfileParam(param) || isThirdPartyId(param) || isPropertyToken(param) || isOrderId(param) || isOrderTotal(param) || isProductPurchasedId(param) || isProductId(param) || isCategoryId(param);
}
function extractProfileParam(param) {
  return param.substring(PROFILE_PREFIX.length);
}
function getThirdPartyId(parameters) {
  return parameters[THIRD_PARTY_ID];
}
function getPropertyToken(params) {
  return params[PROPERTY_TOKEN];
}
function getOrderId(params) {
  return params[ORDER_ID];
}
function getOrderTotal(params) {
  return params[ORDER_TOTAL];
}
function getPurchasedProductIds(params) {
  var value = params[PRODUCT_PURCHASED_ID];
  var result = map(trim, split(",", value));
  return filter(isNotBlank, result);
}
function getProductId(params) {
  return params[PRODUCT_ID];
}
function getCategoryId(params) {
  return params[CATEGORY_ID];
}
function getParams$1(params) {
  return reduce(function (acc, value, key) {
    if (isSpecialParam(key)) {
      return acc;
    }
    acc[key] = isNil(value) ? "" : value;
    return acc;
  }, {}, params);
}
function getProfileParams(params) {
  return reduce(function (acc, value, key) {
    if (!isProfileParam(key)) {
      return acc;
    }
    var profileKey = extractProfileParam(key);
    if (isBlank(profileKey)) {
      return acc;
    }
    acc[profileKey] = isNil(value) ? "" : value;
    return acc;
  }, {}, params);
}
function getOptionsParams(mbox, options) {
  var params = isObject(options.params) ? options.params : {};
  return index$3({}, getTargetPageParams(mbox), params);
}

var VISITOR = "Visitor";
var GET_INSTANCE_METHOD = "getInstance";
var IS_ALLOWED_METHOD = "isAllowed";
function getInstance(win, imsOrgId, sdidParamExpiry) {
  if (isBlank(imsOrgId)) {
    return null;
  }
  if (isNil(win[VISITOR])) {
    return null;
  }
  if (!isFunction(win[VISITOR][GET_INSTANCE_METHOD])) {
    return null;
  }
  var visitor = win[VISITOR][GET_INSTANCE_METHOD](imsOrgId, {
    sdidParamExpiry: sdidParamExpiry
  });
  if (isObject(visitor) && isFunction(visitor[IS_ALLOWED_METHOD]) && visitor[IS_ALLOWED_METHOD]()) {
    return visitor;
  }
  return null;
}

var OPTOUT_MESSAGE = "Disabled due to optout";
var MID_METHOD = "getMarketingCloudVisitorID";
var AAMB_METHOD = "getAudienceManagerBlob";
var AID_METHOD = "getAnalyticsVisitorID";
var AAMLH_METHOD = "getAudienceManagerLocationHint";
var OPTOUT_METHOD = "isOptedOut";
var OPTOUT_PROP = "OptOut";
var MCAAMB = "MCAAMB";
var MCAAMLH = "MCAAMLH";
var MCAID = "MCAID";
var MCMID = "MCMID";
var MCOPTOUT = "MCOPTOUT";
var SDID_METHOD = "getSupplementalDataID";
var CIDS_METHOD = "getCustomerIDs";
var TRACK_SERVER_PROP = "trackingServer";
var TRACK_SERVER_SECURE_PROP = TRACK_SERVER_PROP + "Secure";
function hasId(value) {
  return !isNil(value[ID]);
}
function hasAuthState(value) {
  return !isNil(value[AUTH_STATE]);
}
function getAuthenticatedState(value) {
  switch (value) {
    case 0:
      return "unknown";
    case 1:
      return "authenticated";
    case 2:
      return "logged_out";
    default:
      return "unknown";
  }
}
function isCustomerId(value) {
  return hasId(value) || hasAuthState(value);
}
function getCustomerIds(visitor) {
  if (isNil(visitor)) {
    return [];
  }
  if (!isFunction(visitor[CIDS_METHOD])) {
    return [];
  }
  var customerIds = visitor[CIDS_METHOD]();
  if (!isObject(customerIds)) {
    return [];
  }
  return reduce(function (acc, value, key) {
    var item = {};
    item[INTEGRATION_CODE] = key;
    if (hasId(value)) {
      item[ID] = value[ID];
    }
    if (hasAuthState(value)) {
      item[AUTHENTICATED_STATE] = getAuthenticatedState(value[AUTH_STATE]);
    }
    acc.push(item);
    return acc;
  }, [], filter(isCustomerId, customerIds));
}
function getSdid(visitor, consumerId) {
  if (isNil(visitor)) {
    return null;
  }
  if (!isFunction(visitor[SDID_METHOD])) {
    return null;
  }
  return visitor[SDID_METHOD](consumerId);
}
function collectParams(arr) {
  return reduce(function (acc, value) {
    return index$3(acc, value);
  }, {}, arr);
}
function shouldUseOptout(win, visitor, optoutEnabled) {
  return optoutEnabled && isFunction(visitor[OPTOUT_METHOD]) && !isNil(win[VISITOR][OPTOUT_PROP]);
}
function createPair$2(key, value) {
  var result = {};
  result[key] = value;
  return result;
}
function getInstanceProperty(visitor, property) {
  if (isNil(visitor)) {
    return null;
  }
  var result = visitor[property];
  if (isNil(result)) {
    return null;
  }
  return result;
}

var TIMEOUT_MESSAGE = "Visitor API requests timed out";
var ERROR_MESSAGE = "Visitor API requests error";
function getVisitorOptout(win, visitor, optoutEnabled) {
  if (!shouldUseOptout(win, visitor, optoutEnabled)) {
    return resolve(createPair$2(MCOPTOUT, false));
  }
  return create(function (res) {
    visitor[OPTOUT_METHOD](function (optout) {
      return res(createPair$2(MCOPTOUT, optout));
    }, win[VISITOR][OPTOUT_PROP].GLOBAL, true);
  });
}
function executeRequest(visitor, method, key) {
  if (!isFunction(visitor[method])) {
    return resolve({});
  }
  return create(function (res) {
    visitor[method](function (value) {
      return res(createPair$2(key, value));
    }, true);
  });
}
function executeRequests(win, visitor, optoutEnabled) {
  var requests = [executeRequest(visitor, MID_METHOD, MCMID), executeRequest(visitor, AAMB_METHOD, MCAAMB), executeRequest(visitor, AID_METHOD, MCAID), executeRequest(visitor, AAMLH_METHOD, MCAAMLH), getVisitorOptout(win, visitor, optoutEnabled)];
  return all(requests).then(collectParams);
}
function handleError(error) {
  logDebug(ERROR_MESSAGE, error);
  return {};
}
function getAsyncValues(win, visitor, visitorApiTimeout, optoutEnabled) {
  if (isNil(visitor)) {
    return resolve({});
  }
  var requests = executeRequests(win, visitor, optoutEnabled);
  return timeout(requests, visitorApiTimeout, TIMEOUT_MESSAGE)['catch'](handleError);
}

function getSyncVisitorOptout(win, visitor, optoutEnabled) {
  if (!shouldUseOptout(win, visitor, optoutEnabled)) {
    return createPair$2(MCOPTOUT, false);
  }
  var optout = visitor[OPTOUT_METHOD](null, win[VISITOR][OPTOUT_PROP].GLOBAL);
  return createPair$2(MCOPTOUT, optout);
}
function executeSyncRequest(visitor, method, key) {
  if (!isFunction(visitor[method])) {
    return {};
  }
  return createPair$2(key, visitor[method]());
}
function executeSyncRequests(win, visitor, optoutEnabled) {
  var requests = [executeSyncRequest(visitor, MID_METHOD, MCMID), executeSyncRequest(visitor, AAMB_METHOD, MCAAMB), executeSyncRequest(visitor, AID_METHOD, MCAID), executeSyncRequest(visitor, AAMLH_METHOD, MCAAMLH), getSyncVisitorOptout(win, visitor, optoutEnabled)];
  return collectParams(requests);
}
function getSyncValues(win, visitor, optoutEnabled) {
  if (isNil(visitor)) {
    return {};
  }
  return executeSyncRequests(win, visitor, optoutEnabled);
}

function getVisitorInstance() {
  var config = getConfig();
  var imsOrgId = config[IMS_ORG_ID];
  var sdidParamExpiry = config[SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT];
  return getInstance(index, imsOrgId, sdidParamExpiry);
}
function getAsyncVisitorValues() {
  var visitor = getVisitorInstance();
  var config = getConfig();
  var visitorApiTimeout = config[VISITOR_API_TIMEOUT];
  var optoutEnabled = config[OPTOUT_ENABLED];
  return getAsyncValues(index, visitor, visitorApiTimeout, optoutEnabled);
}
function getSyncVisitorValues() {
  var visitor = getVisitorInstance();
  var config = getConfig();
  var optoutEnabled = config[OPTOUT_ENABLED];
  return getSyncValues(index, visitor, optoutEnabled);
}
function getCustomerIdsVisitorValues() {
  return getCustomerIds(getVisitorInstance());
}
function getSdidVisitorValue(consumerId) {
  return getSdid(getVisitorInstance(), consumerId);
}
function getVisitorProperty(property) {
  return getInstanceProperty(getVisitorInstance(), property);
}

var LOG_PREFIX = "Data provider";
var TIMED_OUT = "timed out";
var MAX_TIMEOUT = 2000;
function areDataProvidersPresent(win) {
  var globalSettings = win[GLOBAL_SETTINGS];
  if (isNil(globalSettings)) {
    return false;
  }
  var dataProviders = globalSettings[DATA_PROVIDERS];
  if (!isArray(dataProviders) || isEmpty(dataProviders)) {
    return false;
  }
  return true;
}
function isValidDataProvider(dataProvider) {
  var name = dataProvider[NAME];
  if (!isString(name) || isEmpty(name)) {
    return false;
  }
  var version = dataProvider[VERSION];
  if (!isString(version) || isEmpty(version)) {
    return false;
  }
  var wait = dataProvider[TIMEOUT];
  if (!isNil(wait) && !isNumber(wait)) {
    return false;
  }
  var provider = dataProvider[PROVIDER];
  if (!isFunction(provider)) {
    return false;
  }
  return true;
}
function createPromise(provider) {
  return create(function (success, error) {
    provider(function (err, params) {
      if (!isNil(err)) {
        error(err);
        return;
      }
      success(params);
    });
  });
}
function createTrace(nameKey, name, versionKey, version, resKey, res) {
  var dataProviderTrace = {};
  dataProviderTrace[nameKey] = name;
  dataProviderTrace[versionKey] = version;
  dataProviderTrace[resKey] = res;
  var result = {};
  result[DATA_PROVIDER] = dataProviderTrace;
  return result;
}
function convertToPromise(dataProvider) {
  var name = dataProvider[NAME];
  var version = dataProvider[VERSION];
  var wait = dataProvider[TIMEOUT] || MAX_TIMEOUT;
  var provider = dataProvider[PROVIDER];
  var promise = createPromise(provider);
  return timeout(promise, wait, TIMED_OUT).then(function (params) {
    var trace = createTrace(NAME, name, VERSION, version, PARAMS, params);
    logDebug(LOG_PREFIX, SUCCESS, trace);
    addClientTrace(trace);
    return params;
  })['catch'](function (error) {
    var trace = createTrace(NAME, name, VERSION, version, ERROR, error);
    logDebug(LOG_PREFIX, ERROR, trace);
    addClientTrace(trace);
    return {};
  });
}
function collectParams$1(arr) {
  var result = reduce(function (acc, value) {
    return index$3(acc, value);
  }, {}, arr);
  setItem(DATA_PROVIDERS, result);
  return result;
}
function executeAsyncDataProviders(win) {
  if (!areDataProvidersPresent(win)) {
    return resolve({});
  }
  var dataProviders = win[GLOBAL_SETTINGS][DATA_PROVIDERS];
  var validProviders = filter(isValidDataProvider, dataProviders);
  return all(map(convertToPromise, validProviders)).then(collectParams$1);
}
function executeSyncDataProviders() {
  var result = getItem(DATA_PROVIDERS);
  if (isNil(result)) {
    return {};
  }
  return result;
}

function getAsyncDataProvidersParameters() {
  return executeAsyncDataProviders(index);
}
function getSyncDataProvidersParameters() {
  return executeSyncDataProviders(index);
}

var TOKEN_PARAM = "authorization";
var TOKEN_COOKIE = "mboxDebugTools";
function getTokenFromQueryString(win) {
  var location = win.location;
  var search = location.search;
  var params = parseQueryString(search);
  var result = params[TOKEN_PARAM];
  if (isBlank(result)) {
    return null;
  }
  return result;
}
function getTokenFromCookie() {
  var result = getCookie(TOKEN_COOKIE);
  if (isBlank(result)) {
    return null;
  }
  return result;
}
function getTraceToken() {
  var param = getTokenFromQueryString(index);
  var cookie = getTokenFromCookie();
  return param || cookie;
}

var WEB_CHANNEL = "web";
var EDGE_SERVER_PREFIX = "mboxedge";
var notEmpty = function notEmpty(val) {
  return !isEmpty(val);
};
function throwIfOptout(values) {
  var optout = values[MCOPTOUT];
  if (optout) {
    throw new Error(OPTOUT_MESSAGE);
  }
  return values;
}
function getAsyncThirdPartyData() {
  var visitorValues = getAsyncVisitorValues();
  var dataProvidersParams = getAsyncDataProvidersParameters();
  return all([visitorValues.then(throwIfOptout), dataProvidersParams]);
}
function getSyncThirdPartyData() {
  var visitorValues = getSyncVisitorValues();
  var dataProvidersParams = getSyncDataProvidersParameters();
  return [visitorValues, dataProvidersParams];
}
function getAllParams(dataProvidersParams, params) {
  return index$3({}, dataProvidersParams, params);
}
function getTimeOffset() {
  return -new Date().getTimezoneOffset();
}
function createChannel() {
  return ChannelType.constructFromObject(WEB_CHANNEL);
}
function createScreenOrientation() {
  var orientation = getScreenOrientation();
  return ScreenOrientationType.constructFromObject(orientation);
}
function createScreen() {
  var screen = index.screen;
  var result = new Screen();
  result.width = screen.width;
  result.height = screen.height;
  result.orientation = createScreenOrientation();
  result.colorDepth = screen.colorDepth;
  result.pixelRatio = getPixelRatio();
  return result;
}
function createWindow() {
  var documentElement = index$1.documentElement;
  var result = new Window();
  result.width = documentElement.clientWidth;
  result.height = documentElement.clientHeight;
  return result;
}
function createBrowser() {
  var location = index.location;
  var result = new Browser();
  result.host = location.hostname;
  result.webGLRenderer = getWebGLRenderer();
  return result;
}
function createAddress() {
  var location = index.location;
  var result = new Address();
  result.url = location.href;
  result.referringUrl = index$1.referrer;
  return result;
}
function createContext(context) {
  if (!isNil(context) && context.channel === WEB_CHANNEL) {
    return context;
  }
  var result = new Context();
  result.userAgent = index.navigator.userAgent;
  result.timeOffsetInMinutes = getTimeOffset();
  result.channel = createChannel();
  result.screen = createScreen();
  result.window = createWindow();
  result.browser = createBrowser();
  result.address = createAddress();
  return result;
}
function createAudienceManager(audienceManager, visitorValues) {
  if (!isNil(audienceManager)) {
    return audienceManager;
  }
  var result = new AudienceManager();
  if (isEmpty(visitorValues)) {
    return result;
  }
  var locationHint = visitorValues[MCAAMLH];
  var locationHintNumber = parseInt(locationHint, 10);
  if (!isNaN(locationHintNumber)) {
    result.locationHint = locationHintNumber;
  }
  var blob = visitorValues[MCAAMB];
  if (isNotBlank(blob)) {
    result.blob = blob;
  }
  return result;
}
function createCustomerIds(customerIdsValues) {
  return map(function (e) {
    return CustomerId.constructFromObject(e);
  }, customerIdsValues);
}
function createVisitorId(id, deviceId, thirdPartyId, visitorValues, customerIdsValues) {
  var result = new VisitorId();
  if (isNotBlank(deviceId)) {
    result.tntId = deviceId;
  }
  if (isNotBlank(thirdPartyId)) {
    result.thirdPartyId = thirdPartyId;
  }
  if (isNotBlank(id.thirdPartyId)) {
    result.thirdPartyId = id.thirdPartyId;
  }
  var mid = visitorValues[MCMID];
  if (isNotBlank(mid)) {
    result.marketingCloudVisitorId = mid;
  }
  if (isNotBlank(id.marketingCloudVisitorId)) {
    result.marketingCloudVisitorId = id.marketingCloudVisitorId;
  }
  if (!isEmpty(id.customerIds)) {
    result.customerIds = id.customerIds;
    return result;
  }
  if (!isEmpty(customerIdsValues)) {
    result.customerIds = createCustomerIds(customerIdsValues);
  }
  return result;
}
function createExperienceCloud(experienceCloud, visitorValues) {
  var result = new ExperienceCloud();
  var audienceManager = createAudienceManager(experienceCloud.audienceManager, visitorValues);
  if (!isEmpty(audienceManager)) {
    result.audienceManager = audienceManager;
  }
  if (!isEmpty(experienceCloud.analytics)) {
    result.analytics = experienceCloud.analytics;
  }
  return result;
}
function createProperty(property) {
  if (!isNil(property) && isNotBlank(property.token)) {
    return property;
  }
  var result = new Property();
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var params = getTargetPageParams(globalMbox);
  var token = getPropertyToken(params);
  if (isNotBlank(token)) {
    result.token = token;
  }
  return result;
}
function createTrace$1(trace) {
  if (!isNil(trace) && isNotBlank(trace.authorizationToken)) {
    return trace;
  }
  var result = new Trace();
  var authorizationToken = getTraceToken();
  if (isNotBlank(authorizationToken)) {
    result.authorizationToken = authorizationToken;
  }
  return result;
}
function createQaMode(qaMode) {
  if (!isNil(qaMode)) {
    return qaMode;
  }
  return getQaMode();
}
function createOrder(params) {
  var result = new Order();
  var orderId = getOrderId(params);
  if (!isNil(orderId)) {
    result.id = orderId;
  }
  var orderTotal = getOrderTotal(params);
  var orderTotalNumber = parseFloat(orderTotal);
  if (!isNaN(orderTotalNumber)) {
    result.total = orderTotalNumber;
  }
  var purchasedProductIds = getPurchasedProductIds(params);
  if (!isEmpty(purchasedProductIds)) {
    result.purchasedProductIds = purchasedProductIds;
  }
  return result;
}
function createProduct(params) {
  var result = new Product();
  var productId = getProductId(params);
  if (!isNil(productId)) {
    result.id = productId;
  }
  var categoryId = getCategoryId(params);
  if (!isNil(categoryId)) {
    result.categoryId = categoryId;
  }
  return result;
}
function createRequestDetails(item, allParams) {
  var result = new RequestDetails();
  var params = index$3({}, getParams$1(allParams), item.parameters || {});
  var profileParams = index$3({}, getProfileParams(allParams), item.profileParameters || {});
  var order = index$3({}, createOrder(allParams), item.order || {});
  var product = index$3({}, createProduct(allParams), item.product || {});
  if (!isEmpty(params)) {
    result.parameters = params;
  }
  if (!isEmpty(profileParams)) {
    result.profileParameters = profileParams;
  }
  if (!isEmpty(order)) {
    result.order = order;
  }
  if (!isEmpty(product)) {
    result.product = product;
  }
  return result;
}
function createMboxRequestDetails(item, allParams) {
  var index$$1 = item.index,
      name = item.name,
      address = item.address;
  var result = createRequestDetails(item, allParams);
  if (!isNil(index$$1)) {
    result.index = index$$1;
  }
  if (isNotBlank(name)) {
    result.name = name;
  }
  if (!isEmpty(address)) {
    result.address = address;
  }
  return result;
}
function createViewRequestDetails(item, allParams) {
  var name = item.name,
      address = item.address;
  var result = createRequestDetails(item, allParams);
  if (isNotBlank(name)) {
    result.name = name;
  }
  if (!isEmpty(address)) {
    result.address = address;
  }
  return result;
}
function createExecute(request, allParams) {
  var _request$execute = request.execute,
      execute = _request$execute === undefined ? {} : _request$execute;
  var result = new ExecuteRequest();
  if (isEmpty(execute)) {
    return result;
  }
  var pageLoad = execute.pageLoad;
  if (!isNil(pageLoad)) {
    result.pageLoad = createRequestDetails(pageLoad, allParams);
  }
  var mboxes = execute.mboxes;
  if (!isNil(mboxes) && isArray(mboxes) && !isEmpty(mboxes)) {
    var temp = filter(notEmpty, map(function (e) {
      return createMboxRequestDetails(e, allParams);
    }, mboxes));
    if (!isEmpty(temp)) {
      result.mboxes = temp;
    }
  }
  return result;
}
function createPrefetch(request, allParams) {
  var _request$prefetch = request.prefetch,
      prefetch = _request$prefetch === undefined ? {} : _request$prefetch;
  var result = new PrefetchRequest();
  if (isEmpty(prefetch)) {
    return result;
  }
  var mboxes = prefetch.mboxes;
  if (!isNil(mboxes) && isArray(mboxes) && !isEmpty(mboxes)) {
    result.mboxes = map(function (e) {
      return createMboxRequestDetails(e, allParams);
    }, mboxes);
  }
  var views = prefetch.views;
  if (!isNil(views) && isArray(views) && !isEmpty(views)) {
    result.views = map(function (e) {
      return createViewRequestDetails(e, allParams);
    }, views);
  }
  return result;
}
function createTemplateRequest(request, visitorValues, allParams) {
  var deviceId = getDeviceId();
  var thirdPartyId = getThirdPartyId(allParams);
  var customerIdsValues = getCustomerIdsVisitorValues();
  var visitorId = createVisitorId(request.id || {}, deviceId, thirdPartyId, visitorValues, customerIdsValues);
  var property = createProperty(request.property);
  var experienceCloud = createExperienceCloud(request.experienceCloud || {}, visitorValues);
  var trace = createTrace$1(request.trace);
  var qaMode = createQaMode(request.qaMode);
  var result = {};
  result.requestId = uuid();
  result.context = createContext(request.context);
  if (!isEmpty(visitorId)) {
    result.id = visitorId;
  }
  if (!isEmpty(property)) {
    result.property = property;
  }
  if (!isEmpty(trace)) {
    result.trace = trace;
  }
  if (!isEmpty(experienceCloud)) {
    result.experienceCloud = experienceCloud;
  }
  if (!isEmpty(qaMode)) {
    result.qaMode = qaMode;
  }
  return result;
}
function createDeliveryRequest(request, templateRequest, allParams) {
  var execute = createExecute(request, allParams);
  var prefetch = createPrefetch(request, allParams);
  var result = DeliveryRequest.constructFromObject(templateRequest);
  if (!isEmpty(execute)) {
    result.execute = execute;
  }
  if (!isEmpty(prefetch)) {
    result.prefetch = prefetch;
  }
  return result;
}
function createAnalytics(consumerId, request) {
  var sdid = getSdidVisitorValue(consumerId);
  var server = getVisitorProperty(TRACK_SERVER_PROP);
  var serverSecure = getVisitorProperty(TRACK_SERVER_SECURE_PROP);
  var _request$experienceCl = request.experienceCloud,
      experienceCloud = _request$experienceCl === undefined ? {} : _request$experienceCl;
  var _experienceCloud$anal = experienceCloud.analytics,
      analytics = _experienceCloud$anal === undefined ? {} : _experienceCloud$anal;
  var supplementalDataId = analytics.supplementalDataId,
      trackingServer = analytics.trackingServer,
      trackingServerSecure = analytics.trackingServerSecure;
  var result = {};
  if (!isNil(supplementalDataId)) {
    result.supplementalDataId = supplementalDataId;
  }
  if (isNotBlank(sdid)) {
    result.supplementalDataId = sdid;
  }
  if (!isNil(trackingServer)) {
    result.trackingServer = trackingServer;
  }
  if (isNotBlank(server)) {
    result.trackingServer = server;
  }
  if (!isNil(trackingServerSecure)) {
    result.trackingServerSecure = trackingServerSecure;
  }
  if (isNotBlank(serverSecure)) {
    result.trackingServerSecure = serverSecure;
  }
  if (isEmpty(result)) {
    return null;
  }
  return result;
}
function createAsyncDeliveryRequest(request, params) {
  return getAsyncThirdPartyData().then(function (arr) {
    var visitorValues = arr[0];
    var dataProvidersParams = arr[1];
    var allParams = getAllParams(dataProvidersParams, params);
    var templateRequest = createTemplateRequest(request, visitorValues, allParams);
    return createDeliveryRequest(request, templateRequest, allParams);
  });
}
function createSyncDeliveryRequest(request, params) {
  var arr = getSyncThirdPartyData();
  var visitorValues = arr[0];
  var dataProvidersParams = arr[1];
  var allParams = getAllParams(dataProvidersParams, params);
  var templateRequest = createTemplateRequest(request, visitorValues, allParams);
  return createDeliveryRequest(request, templateRequest, allParams);
}
function getTimeout(config, timeout$$1) {
  if (!isNumber(timeout$$1)) {
    return config[TIMEOUT];
  }
  if (timeout$$1 < 0) {
    return config[TIMEOUT];
  }
  return timeout$$1;
}
function getServerDomain(config) {
  var client = config[CLIENT_CODE];
  var serverDomain = config[SERVER_DOMAIN];
  var overrideMboxEdgeServer = config[OVERRIDE_MBOX_EDGE_SERVER];
  if (!overrideMboxEdgeServer) {
    return serverDomain;
  }
  var cluster = getEdgeCluster();
  if (isBlank(cluster)) {
    return serverDomain;
  }
  return serverDomain.replace(client, "" + EDGE_SERVER_PREFIX + cluster);
}
function creatRequestOptions(config, requestTimeout) {
  var headers = {};
  headers[CONTENT_TYPE] = [TEXT_PLAIN];
  var timeout$$1 = getTimeout(config, requestTimeout);
  var client = config[CLIENT_CODE];
  var sessionId = getSessionId();
  var version = config[VERSION];
  var result = { client: client, sessionId: sessionId };
  result.query = { version: version };
  result.scheme = config[SCHEME];
  result.host = getServerDomain(config);
  result.path = config[ENDPOINT];
  result.headers = headers;
  result.timeout = timeout$$1;
  result.async = true;
  return result;
}
function createRequestUrl(options) {
  var client = options.client,
      sessionId = options.sessionId,
      query = options.query,
      scheme = options.scheme,
      host = options.host,
      path = options.path;
  var version = query.version;
  var queryString = stringifyQueryString({ client: client, sessionId: sessionId, version: version });
  return scheme + "//" + host + path + "?" + queryString;
}
function executeRequest$1(request, requestTimeout) {
  var config = getConfig();
  var apiClient = new ApiClient();
  var targetClient = new TargetDeliveryApi(apiClient);
  var options = creatRequestOptions(config, requestTimeout);
  var client = options.client,
      sessionId = options.sessionId;
  logDebug(REQUEST, request);
  addClientTrace({ request: request });
  return targetClient.execute(client, sessionId, request, options).then(function (response) {
    logDebug(RESPONSE, response);
    addClientTrace({ response: response });
    return { request: request, response: response };
  });
}

var NAVIGATOR = "navigator";
var SEND_BEACON = "sendBeacon";
function executeSendBeacon(win, url, data) {
  return win[NAVIGATOR][SEND_BEACON](url, data);
}
function executeSyncXhr(http, url, data) {
  var headers = {};
  headers[CONTENT_TYPE] = [TEXT_PLAIN];
  var options = {};
  options[METHOD] = POST$1;
  options[URL$1] = url;
  options[DATA$1] = data;
  options[CREDENTIALS] = true;
  options[ASYNC] = false;
  options[HEADERS] = headers;
  try {
    http(options);
  } catch (error) {
    return false;
  }
  return true;
}
function isBeaconSupported(win) {
  return NAVIGATOR in win && SEND_BEACON in win[NAVIGATOR];
}
function sendBeacon(url, data) {
  if (isBeaconSupported(index)) {
    return executeSendBeacon(index, url, data);
  }
  return executeSyncXhr(xhr, url, data);
}

var SEND_BEACON_SUCCESS = "Beacon data sent";
var SEND_BEACON_ERROR = "Beacon data sent failed";
var VIEW_TRIGGERED = "View triggered notification";
var VIEW_RENDERED = "View rendered notification";
var MBOXES_RENDERED = "Mboxes rendered notification";
var EVENT_HANDLER = "Event handler notification";
var MBOX_EVENT_HANDLER = "Mbox event handler notification";
var VIEW_EVENT_HANDLER = "View event handler notification";
var PREFETCH_MBOXES = "prefetchMboxes";
var RENDERED = "rendered";
var TRIGGERED = "triggered";
function createNotificationRequest(consumerId, params, notifications) {
  var analytics = createAnalytics(consumerId, {});
  var request = {};
  if (!isEmpty(analytics)) {
    var experienceCloud = {};
    experienceCloud.analytics = analytics;
    request.experienceCloud = experienceCloud;
  }
  var result = createSyncDeliveryRequest(request, params);
  result.notifications = notifications;
  return result;
}
function createNotification(item, type, tokens) {
  var id = uuid();
  var timestamp = now();
  var parameters = item.parameters,
      profileParameters = item.profileParameters,
      order = item.order,
      product = item.product;
  var result = {
    id: id,
    type: type,
    timestamp: timestamp,
    parameters: parameters,
    profileParameters: profileParameters,
    order: order,
    product: product
  };
  if (isEmpty(tokens)) {
    return result;
  }
  result.tokens = tokens;
  return result;
}
function createMboxNotification(mbox, type, tokens) {
  var name = mbox.name,
      state = mbox.state;
  var notification = createNotification(mbox, type, tokens);
  notification.mbox = { name: name, state: state };
  return notification;
}
function createViewNotification(view, type, tokens) {
  var name = view.name,
      state = view.state;
  var notification = createNotification(view, type, tokens);
  notification.view = { name: name, state: state };
  return notification;
}
function executeBeaconNotification(request) {
  var config = getConfig();
  var requestOptions = creatRequestOptions(config);
  var url = createRequestUrl(requestOptions);
  var data = JSON.stringify(request);
  if (sendBeacon(url, data)) {
    logDebug(SEND_BEACON_SUCCESS, url, request);
    return true;
  }
  logWarn(SEND_BEACON_ERROR, url, request);
  return false;
}
function sendEventNotification(source, type, token) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var params = getTargetPageParams(globalMbox);
  var requestDetails = createRequestDetails({}, params);
  var notification = createNotification(requestDetails, type, [token]);
  var request = createNotificationRequest(globalMbox, params, [notification]);
  logDebug(EVENT_HANDLER, source, notification);
  addClientTrace({ source: source, event: type, request: request });
  executeBeaconNotification(request);
}
function sendMboxEventNotification(name, type, token) {
  var params = getTargetPageParams(name);
  var requestDetails = createRequestDetails({}, params);
  var notification = createNotification(requestDetails, type, [token]);
  notification.mbox = { name: name };
  var request = createNotificationRequest(name, params, [notification]);
  logDebug(MBOX_EVENT_HANDLER, name, notification);
  addClientTrace({ mbox: name, event: type, request: request });
  executeBeaconNotification(request);
}
function sendMboxesRenderedNotifications(items) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var notifications = [];
  var type = DISPLAY_EVENT;
  forEach(function (item) {
    var mbox = item.mbox,
        data = item.data;
    if (isNil(data)) {
      return;
    }
    var _data$eventTokens = data.eventTokens,
        eventTokens = _data$eventTokens === undefined ? [] : _data$eventTokens;
    if (isEmpty(eventTokens)) {
      return;
    }
    notifications.push(createMboxNotification(mbox, type, eventTokens));
  }, items);
  if (isEmpty(notifications)) {
    return;
  }
  var request = createNotificationRequest(globalMbox, {}, notifications);
  logDebug(MBOXES_RENDERED, notifications);
  addClientTrace({
    source: PREFETCH_MBOXES,
    event: RENDERED,
    request: request
  });
  executeBeaconNotification(request);
}
function sendViewEventNotification(name, type, token) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var params = getTargetPageParams(globalMbox);
  var requestDetails = createRequestDetails({}, params);
  var notification = createNotification(requestDetails, type, [token]);
  notification.view = { name: name };
  var request = createNotificationRequest(name, params, [notification]);
  logDebug(VIEW_EVENT_HANDLER, name, notification);
  addClientTrace({ view: name, event: type, request: request });
  executeBeaconNotification(request);
}
function sendViewTriggeredNotifications(name) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var params = getTargetPageParams(globalMbox);
  var requestDetails = createRequestDetails({}, params);
  var notification = createNotification(requestDetails, DISPLAY_EVENT, []);
  notification.view = { name: name };
  var request = createNotificationRequest(name, params, [notification]);
  logDebug(VIEW_TRIGGERED, name);
  addClientTrace({
    view: name,
    event: TRIGGERED,
    request: request
  });
  executeRequest$1(request).then(logDebug)['catch'](logWarn);
}
function sendViewRenderedNotifications(item) {
  if (isNil(item)) {
    return;
  }
  var view = item.view,
      _item$data = item.data,
      data = _item$data === undefined ? {} : _item$data;
  var _data$eventTokens2 = data.eventTokens,
      eventTokens = _data$eventTokens2 === undefined ? [] : _data$eventTokens2;
  if (isEmpty(eventTokens)) {
    return;
  }
  var name = view.name;
  var persistedView = findView(name);
  if (isNil(persistedView)) {
    return;
  }
  var notification = createViewNotification(persistedView, DISPLAY_EVENT, eventTokens);
  var request = createNotificationRequest(name, {}, [notification]);
  logDebug(VIEW_RENDERED, name, eventTokens);
  addClientTrace({
    view: name,
    event: RENDERED,
    request: request
  });
  executeRequest$1(request).then(logDebug)['catch'](logWarn);
}

var PAGE_LOAD$1 = "pageLoadMetrics";
var PREFETCH$1 = "prefetchMetrics";
var selectMetrics = prop(METRICS);
var createMetricSuccess = function createMetricSuccess() {
  return createSuccess(METRIC);
};
var createMetricError = function createMetricError(error) {
  return createError(METRIC, error);
};
function decorateElementIfRequired(type, selector) {
  if (type !== CLICK) {
    return;
  }
  addClass(CLICK_TRACKING_CSS_CLASS, selector);
}
function attachEventHandler(source, metric) {
  var type = metric.type,
      selector = metric.selector,
      eventToken = metric.eventToken;
  var handler = function handler() {
    return sendEventNotification(source, type, eventToken);
  };
  decorateElementIfRequired(type, selector);
  listen(type, handler, selector);
}
function attachMboxEventHandler(mboxName, metric) {
  var type = metric.type,
      selector = metric.selector,
      eventToken = metric.eventToken;
  var handler = function handler() {
    return sendMboxEventNotification(mboxName, type, eventToken);
  };
  decorateElementIfRequired(type, selector);
  listen(type, handler, selector);
}
function attachViewEventHandler(viewName, metric) {
  var type = metric.type,
      selector = metric.selector,
      eventToken = metric.eventToken;
  var handler = function handler() {
    return sendViewEventNotification(viewName, type, eventToken);
  };
  decorateElementIfRequired(type, selector);
  listen(type, handler, selector);
}
function executeMetrics(source, metrics) {
  return all(map(executeMetric, metrics)).then(function (arr) {
    forEach(function (metric) {
      return attachEventHandler(source, metric);
    }, arr);
    return createMetricSuccess();
  })['catch'](createMetricError);
}
function executeMboxMetrics(mbox) {
  var name = mbox.name;
  var metrics = selectMetrics(mbox);
  return all(map(executeMetric, metrics)).then(function (arr) {
    forEach(function (metric) {
      return attachMboxEventHandler(name, metric);
    }, arr);
    return createMetricSuccess();
  })['catch'](createMetricError);
}
function executeViewMetrics(view) {
  var name = view.name;
  var metrics = selectMetrics(view);
  return all(map(executeMetric, metrics)).then(function (arr) {
    forEach(function (metric) {
      return attachViewEventHandler(name, metric);
    }, arr);
    return createMetricSuccess();
  })['catch'](createMetricError);
}
function executePageLoadMetrics(pageLoad) {
  return executeMetrics(PAGE_LOAD$1, selectMetrics(pageLoad));
}
function executePrefetchMetrics(prefetch) {
  return executeMetrics(PREFETCH$1, selectMetrics(prefetch));
}

var selectContent$1 = prop(CONTENT);
var selectCssSelector = prop(CSS_SELECTOR);
var createRenderSuccess = function createRenderSuccess(eventToken) {
  return createSuccess(RENDER, eventToken);
};
var createRenderError = function createRenderError(error) {
  return createError(RENDER, error);
};
var hasNonErrorData = function hasNonErrorData(val) {
  return not(isError)(val) && hasData(val);
};
function hideActions(actions) {
  var items = map(selectCssSelector, actions);
  injectActionHidingStyles(filterNotNil(items));
}
function extractActions(item) {
  var options = filter(isActions, selectOptions(item));
  return flatten(map(selectContent$1, options));
}
function addPageToActions(actions, page) {
  return map(function (e) {
    var result = index$3({}, e);
    result.page = page;
    return result;
  }, actions);
}
function executeRendering(option, page) {
  var eventToken = option.eventToken,
      content = option.content;
  var actions = addPageToActions(content, page);
  return executeRenderActions(actions).then(function () {
    return createRenderSuccess(eventToken);
  })['catch'](createRenderError);
}
function renderOptions(func, item) {
  return map(func, filter(isActions, selectOptions(item)));
}
function postExecuteRendering(key, item, values) {
  var result = defineProperty({ status: SUCCESS }, key, item);
  var errors = map(selectData, filter(isError, values));
  var data = {};
  if (!isEmpty(errors)) {
    result.status = ERROR;
    data.errors = errors;
  }
  if (!isEmpty(data)) {
    result.data = data;
  }
  return result;
}
function postPrefetchRendering(key, item, values) {
  var result = defineProperty({ status: SUCCESS }, key, item);
  var errors = map(selectData, filter(isError, values));
  var eventTokens = map(selectData, filter(hasNonErrorData, values));
  var data = {};
  if (!isEmpty(errors)) {
    result.status = ERROR;
    data.errors = errors;
  }
  if (!isEmpty(eventTokens)) {
    data.eventTokens = eventTokens;
  }
  if (!isEmpty(data)) {
    result.data = data;
  }
  return result;
}
function renderExecuteItem(item, postRenderingFunc, metricsFunc) {
  var render = function render(opt) {
    return executeRendering(opt, true);
  };
  var options = renderOptions(render, item);
  return all(options).then(postRenderingFunc).then(function (result) {
    metricsFunc(item);
    return result;
  });
}
function renderPrefetchItem(key, item, page, metricsFunc) {
  var render = function render(opt) {
    return executeRendering(opt, page);
  };
  var options = renderOptions(render, item);
  return all(options).then(function (arr) {
    return postPrefetchRendering(key, item, arr);
  }).then(function (result) {
    metricsFunc(item);
    return result;
  });
}
function renderMbox(mbox) {
  var postRenderingFunc = function postRenderingFunc(arr) {
    return postExecuteRendering(MBOX, mbox, arr);
  };
  return renderExecuteItem(mbox, postRenderingFunc, executeMboxMetrics);
}
function renderPrefetchMbox(mbox) {
  return renderPrefetchItem(MBOX, mbox, true, executeMboxMetrics);
}
function hideOptions(item) {
  var actions = extractActions(item);
  hideActions(actions);
}
function renderPageLoad(pageLoad) {
  var postRenderingFunc = function postRenderingFunc(arr) {
    return postExecuteRendering(PAGE_LOAD, pageLoad, arr);
  };
  return renderExecuteItem(pageLoad, postRenderingFunc, executePageLoadMetrics);
}
function renderMboxes(mboxes) {
  return all(map(renderMbox, mboxes));
}
function renderPrefetchMboxes(mboxes) {
  return all(map(renderPrefetchMbox, mboxes));
}
function renderPrefetchMetrics(prefetch) {
  var metrics = [executePrefetchMetrics(prefetch)];
  return all(metrics).then(postExecuteRendering);
}
function renderView(view) {
  var page = view.page;
  return renderPrefetchItem(VIEW, view, page, executeViewMetrics);
}

function redirect$1(option) {
  return {
    type: REDIRECT,
    content: option.url
  };
}
function setContent(action) {
  var result = {};
  result.type = SET_HTML;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setText$3(action) {
  var result = {};
  result.type = SET_TEXT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function appendContent(action) {
  var result = {};
  result.type = APPEND_HTML;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function prependContent(action) {
  var result = {};
  result.type = PREPEND_HTML;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function replaceContent(action) {
  var result = {};
  result.type = REPLACE_HTML;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function insertBefore$2(action) {
  var result = {};
  result.type = INSERT_BEFORE;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function insertAfter$2(action) {
  var result = {};
  result.type = INSERT_AFTER;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function customCode$2(action) {
  var result = {};
  result.type = CUSTOM_CODE;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setAttribute$2(action) {
  var result = {};
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  if (action.attribute === SRC) {
    result.type = SET_IMAGE_SOURCE;
    result.content = action.value;
    return result;
  }
  result.type = SET_ATTRIBUTE;
  var content = {};
  content[action.attribute] = action.value;
  result.content = content;
  return result;
}
function setStyle$2(action) {
  var _action$style = action.style,
      style = _action$style === undefined ? {} : _action$style;
  var result = {};
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  if (!isNil(style.left) && !isNil(style.top)) {
    result.type = MOVE;
    result.content = style;
    return result;
  }
  if (!isNil(style.width) && !isNil(style.height)) {
    result.type = RESIZE;
    result.content = style;
    return result;
  }
  result.type = SET_STYLE;
  result.content = style;
  return result;
}
function remove$4(action) {
  var result = {};
  result.type = REMOVE;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function rearrange$2(action) {
  var content = {};
  content.from = action.from;
  content.to = action.to;
  var result = {};
  result.type = REARRANGE;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  result.content = content;
  return result;
}
function hasSelectors$1(action) {
  return isNotBlank(action.selector) && isNotBlank(action.cssSelector);
}
function createPageLoad(items) {
  var result = {};
  if (isEmpty(items)) {
    return result;
  }
  var options = [];
  var metrics = [];
  var actions = [];
  forEach(function (item) {
    var type = item.action;
    switch (type) {
      case SET_CONTENT:
        if (hasSelectors$1(item)) {
          actions.push(setContent(item));
        } else {
          options.push({ type: HTML, content: item.content });
        }
        break;
      case SET_JSON:
        if (!isEmpty(item.content)) {
          forEach(function (e) {
            return options.push({ type: JSON$1, content: e });
          }, item.content);
        }
        break;
      case SET_TEXT:
        actions.push(setText$3(item));
        break;
      case APPEND_CONTENT:
        actions.push(appendContent(item));
        break;
      case PREPEND_CONTENT:
        actions.push(prependContent(item));
        break;
      case REPLACE_CONTENT:
        actions.push(replaceContent(item));
        break;
      case INSERT_BEFORE:
        actions.push(insertBefore$2(item));
        break;
      case INSERT_AFTER:
        actions.push(insertAfter$2(item));
        break;
      case CUSTOM_CODE:
        actions.push(customCode$2(item));
        break;
      case SET_ATTRIBUTE:
        actions.push(setAttribute$2(item));
        break;
      case SET_STYLE:
        actions.push(setStyle$2(item));
        break;
      case REMOVE:
        actions.push(remove$4(item));
        break;
      case REARRANGE:
        actions.push(rearrange$2(item));
        break;
      case REDIRECT:
        options.push(redirect$1(item));
        break;
      case TRACK_CLICK:
        metrics.push({
          type: CLICK,
          selector: item.selector,
          eventToken: item.clickTrackId
        });
        break;
      default:
        break;
    }
  }, items);
  var pageLoad = {};
  var hasActions = !isEmpty(actions);
  if (hasActions) {
    options.push({ type: ACTIONS, content: actions });
  }
  var hasOptions = !isEmpty(options);
  if (hasOptions) {
    pageLoad.options = options;
  }
  var hasMetrics = !isEmpty(metrics);
  if (hasMetrics) {
    pageLoad.metrics = metrics;
  }
  if (isEmpty(pageLoad)) {
    return result;
  }
  var execute = {};
  execute.pageLoad = pageLoad;
  result.execute = execute;
  return result;
}
function createMboxes(name, items) {
  var result = {};
  if (isEmpty(items)) {
    return result;
  }
  var options = [];
  var metrics = [];
  forEach(function (item) {
    var type = item.action;
    switch (type) {
      case SET_CONTENT:
        options.push({ type: HTML, content: item.content });
        break;
      case SET_JSON:
        if (!isEmpty(item.content)) {
          forEach(function (e) {
            return options.push({ type: JSON$1, content: e });
          }, item.content);
        }
        break;
      case REDIRECT:
        options.push(redirect$1(item));
        break;
      case SIGNAL_CLICK:
        metrics.push({
          type: CLICK,
          eventToken: item.clickTrackId
        });
        break;
      default:
        break;
    }
  }, items);
  var mbox = { name: name };
  var hasOptions = !isEmpty(options);
  if (hasOptions) {
    mbox.options = options;
  }
  var hasMetrics = !isEmpty(metrics);
  if (hasMetrics) {
    mbox.metrics = metrics;
  }
  if (isEmpty(mbox)) {
    return result;
  }
  var execute = {};
  var mboxes = [mbox];
  execute.mboxes = mboxes;
  result.execute = execute;
  return result;
}
function convertToContext(mbox, items, pageLoadEnabled) {
  if (pageLoadEnabled) {
    return createPageLoad(items);
  }
  return createMboxes(mbox, items);
}

var PAGE_LOAD_RENDERING_FAILED = "Page load rendering failed";
var MBOXES_RENDERING_FAILED = "Mboxes rendering failed";
var VIEW_RENDERING_FAILED = "View rendering failed";
var PREFETCH_RENDERING_FAILED = "Prefetch rendering failed";
var hasErrors = function hasErrors(items) {
  return !isEmpty(filter(isError, items));
};
function getPageLoadData(pageLoad) {
  var status = pageLoad.status,
      data = pageLoad.data;
  var result = { status: status, pageLoad: true };
  if (!isNil(data)) {
    result.data = data;
  }
  return result;
}
function getMboxData(item) {
  var status = item.status,
      mbox = item.mbox,
      data = item.data;
  var name = mbox.name;
  var result = { status: status, mbox: name };
  if (!isNil(data)) {
    result.data = data;
  }
  return result;
}
function getViewData(item) {
  var status = item.status,
      view = item.view,
      data = item.data;
  var name = view.name;
  var result = { status: status, view: name };
  if (!isNil(data)) {
    result.data = data;
  }
  return result;
}
function getPrefetchMetricsData(prefetchMetrics) {
  var status = prefetchMetrics.status,
      data = prefetchMetrics.data;
  var result = { status: status, prefetchMetrics: true };
  if (!isNil(data)) {
    result.data = data;
  }
  return result;
}
function handlePageLoad(pageLoad) {
  if (isNil(pageLoad)) {
    return [null];
  }
  var result = map(getPageLoadData, [pageLoad]);
  if (hasErrors(result)) {
    logWarn(PAGE_LOAD_RENDERING_FAILED, pageLoad);
  }
  return result;
}
function handleMboxes(mboxes) {
  if (isNil(mboxes)) {
    return [null];
  }
  var result = map(getMboxData, mboxes);
  if (hasErrors(result)) {
    logWarn(MBOXES_RENDERING_FAILED, mboxes);
  }
  return result;
}
function handlePrefetchMboxes(mboxes) {
  var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sendMboxesRenderedNotifications;
  if (isNil(mboxes)) {
    return [null];
  }
  var result = map(getMboxData, mboxes);
  if (hasErrors(result)) {
    logWarn(MBOXES_RENDERING_FAILED, mboxes);
  }
  func(mboxes);
  return result;
}
function handleView(item) {
  var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sendViewRenderedNotifications;
  if (isNil(item)) {
    return [null];
  }
  var result = map(getViewData, [item]);
  if (hasErrors(result)) {
    logWarn(VIEW_RENDERING_FAILED, item);
  }
  var view = item.view;
  if (!view.page) {
    return result;
  }
  func(item);
  return result;
}
function handlePrefetchMetrics(prefetchMetrics) {
  if (isNil(prefetchMetrics)) {
    return [null];
  }
  var result = map(getPrefetchMetricsData, [prefetchMetrics]);
  if (hasErrors(result)) {
    logWarn(PREFETCH_RENDERING_FAILED, prefetchMetrics);
  }
  return result;
}
function handleRenderingSuccess$1(values) {
  var results = flatten([handlePageLoad(values[0]), handleMboxes(values[1]), handlePrefetchMboxes(values[2]), handleView(values[3]), handlePrefetchMetrics(values[4])]);
  var nonNull = filter(notNil, results);
  var errors = filter(isError, nonNull);
  if (!isEmpty(errors)) {
    return reject(errors);
  }
  return resolve(nonNull);
}
function handleRenderingError$1(err) {
  return reject(err);
}

function processOptions$2(selector, item) {
  if (isEmpty(item)) {
    return;
  }
  var options = item.options;
  if (isEmpty(options)) {
    return;
  }
  forEach(function (option) {
    if (option.type !== HTML) {
      return;
    }
    var type = SET_HTML;
    var content = option.content;
    option.type = ACTIONS;
    option.content = [{ type: type, selector: selector, content: content }];
  }, options);
}
function processMetrics$1(selector, item) {
  var metrics = item.metrics;
  if (isEmpty(metrics)) {
    return;
  }
  var name = item.name;
  forEach(function (metric) {
    metric.name = name;
    metric.selector = metric.selector || selector;
  }, metrics);
}
function createRenderingContext(selector, context) {
  var result = index$3({}, context);
  var _result$execute = result.execute,
      execute = _result$execute === undefined ? {} : _result$execute,
      _result$prefetch = result.prefetch,
      prefetch = _result$prefetch === undefined ? {} : _result$prefetch;
  var _execute$pageLoad = execute.pageLoad,
      pageLoad = _execute$pageLoad === undefined ? {} : _execute$pageLoad,
      _execute$mboxes = execute.mboxes,
      mboxes = _execute$mboxes === undefined ? [] : _execute$mboxes;
  var _prefetch$mboxes = prefetch.mboxes,
      prefetchMboxes = _prefetch$mboxes === undefined ? [] : _prefetch$mboxes;
  processOptions$2(selector, pageLoad);
  forEach(function (elem) {
    return processOptions$2(selector, elem);
  }, mboxes);
  forEach(function (elem) {
    return processMetrics$1(selector, elem);
  }, mboxes);
  forEach(function (elem) {
    return processOptions$2(selector, elem);
  }, prefetchMboxes);
  forEach(function (elem) {
    return processMetrics$1(selector, elem);
  }, prefetchMboxes);
  return result;
}
function renderContext(context) {
  var promises = [];
  var _context$execute = context.execute,
      execute = _context$execute === undefined ? {} : _context$execute;
  var _execute$pageLoad2 = execute.pageLoad,
      pageLoad = _execute$pageLoad2 === undefined ? {} : _execute$pageLoad2,
      _execute$mboxes2 = execute.mboxes,
      mboxes = _execute$mboxes2 === undefined ? [] : _execute$mboxes2;
  if (!isEmpty(pageLoad)) {
    hideOptions(pageLoad);
    promises.push(renderPageLoad(pageLoad));
  } else {
    promises.push(resolve(null));
  }
  if (isArray(mboxes) && !isEmpty(mboxes)) {
    promises.push(renderMboxes(mboxes));
  } else {
    promises.push(resolve(null));
  }
  var _context$prefetch = context.prefetch,
      prefetch = _context$prefetch === undefined ? {} : _context$prefetch;
  var _prefetch$mboxes2 = prefetch.mboxes,
      prefetchMboxes = _prefetch$mboxes2 === undefined ? [] : _prefetch$mboxes2,
      _prefetch$metrics = prefetch.metrics,
      metrics = _prefetch$metrics === undefined ? [] : _prefetch$metrics;
  var hasPrefetch = !isEmpty(prefetch);
  if (isArray(prefetchMboxes) && !isEmpty(prefetchMboxes)) {
    promises.push(renderPrefetchMboxes(prefetchMboxes));
  } else {
    promises.push(resolve(null));
  }
  if (hasPrefetch) {
    persistViews(prefetch.views);
  }
  var currentView = getCurrentView();
  if (!isNil(currentView)) {
    var view = getView(currentView);
    if (!isNil(view)) {
      hideOptions(view);
      promises.push(renderView(view));
    } else {
      promises.push(resolve(null));
    }
  } else {
    promises.push(resolve(null));
  }
  if (isArray(metrics) && !isEmpty(metrics)) {
    promises.push(renderPrefetchMetrics(prefetch));
  } else {
    promises.push(resolve(null));
  }
  publish(OPTION_HIDDEN_EVENT);
  return all(promises).then(handleRenderingSuccess$1)['catch'](handleRenderingError$1);
}
function executeRedirect(win, url) {
  delay(function () {
    return win.location.replace(url);
  });
}
function retrieveSelector(selector) {
  if (isNotBlank(selector)) {
    return selector;
  }
  if (isElement(selector)) {
    return selector;
  }
  return HEAD_TAG;
}
function showElement(selector) {
  addClass(MARKER_CSS_CLASS, selector);
}
function executeApplyOffer(options) {
  var mbox = options.mbox,
      selector = options.selector,
      actions = options.offer;
  var config = getConfig();
  var pageLoadEnabled = mbox === config[GLOBAL_MBOX_NAME];
  if (isEmpty(actions)) {
    logDebug(NO_ACTIONS);
    showElement(selector);
    publish(NO_OFFERS_EVENT);
    notifyRenderingNoOffers({ mbox: mbox });
    return;
  }
  var context = convertToContext(mbox, actions, pageLoadEnabled);
  var renderingContext = createRenderingContext(selector, context);
  var redirect = getRedirect(renderingContext);
  if (!isEmpty(redirect)) {
    var url = redirect.url;
    logDebug(REDIRECT_ACTION, redirect);
    notifyRenderingRedirect({ url: url });
    executeRedirect(index, url);
    return;
  }
  notifyRenderingStart({ mbox: mbox });
  renderContext(renderingContext).then(function (execution) {
    if (isEmpty(execution)) {
      return;
    }
    notifyRenderingSucceeded({ mbox: mbox, execution: execution });
  })['catch'](function (error) {
    return notifyRenderingFailed({ error: error });
  });
}
function executeApplyOffers(options) {
  var selector = options.selector,
      response = options.response;
  if (isEmpty(response)) {
    logDebug(NO_ACTIONS);
    showElement(selector);
    publish(NO_OFFERS_EVENT);
    notifyRenderingNoOffers({});
    return resolve();
  }
  var renderingContext = createRenderingContext(selector, response);
  var redirect = getRedirect(renderingContext);
  if (!isEmpty(redirect)) {
    var url = redirect.url;
    logDebug(REDIRECT_ACTION, redirect);
    notifyRenderingRedirect({ url: url });
    executeRedirect(index, url);
    return resolve();
  }
  notifyRenderingStart({});
  return renderContext(renderingContext).then(function (execution) {
    if (isEmpty(execution)) {
      return;
    }
    notifyRenderingSucceeded({ execution: execution });
  })['catch'](function (error) {
    return notifyRenderingFailed({ error: error });
  });
}

var TRIGGER_VIEW = "[triggerView()]";
function getTriggerViewOptions(viewName, opts) {
  var result = {};
  result.viewName = viewName;
  result.page = true;
  if (!isEmpty(opts)) {
    result.page = !!opts.page;
  }
  return result;
}
function handleTriggeredView(options) {
  setCurrentView(options);
  if (!hasSavedViews()) {
    logDebug(VIEW_DELIVERY_NO_SAVED);
    return;
  }
  var currentView = getCurrentView();
  var viewName = currentView.viewName;
  var view = getView(currentView);
  if (isNil(view)) {
    sendViewTriggeredNotifications(viewName);
    return;
  }
  var response = { prefetch: { views: [view] } };
  executeApplyOffers({ selector: HEAD_TAG, response: response })['catch'](function (err) {
    return logWarn(RENDERING_VIEW_FAILED, err);
  });
}
function triggerView(value, opts) {
  if (!isString(value) || isBlank(value)) {
    logWarn(TRIGGER_VIEW, VIEW_NAME_ERROR, value);
    addClientTrace({
      source: TRIGGER_VIEW,
      view: value,
      error: VIEW_NAME_ERROR
    });
    return;
  }
  var viewName = value.toLowerCase();
  var options = getTriggerViewOptions(viewName, opts);
  logDebug(TRIGGER_VIEW, viewName, options);
  addClientTrace({ source: TRIGGER_VIEW, view: viewName, options: options });
  publish(VIEW_START, options);
}

function handleRequestSuccess(response) {
  var responseTokens = getResponseTokens(response);
  var redirect = getRedirect(response);
  var hasRedirect = !isEmpty(redirect);
  var payload = {};
  if (!isEmpty(responseTokens)) {
    payload.responseTokens = responseTokens;
  }
  logDebug(REQUEST_SUCCEEDED, response);
  notifyRequestSucceeded(payload, hasRedirect);
  return resolve(response);
}
function handleMboxRequestSuccess(mbox, response) {
  var responseTokens = getResponseTokens(response);
  var redirect = getRedirect(response);
  var hasRedirect = isObject(redirect);
  var payload = { mbox: mbox };
  if (!isEmpty(responseTokens)) {
    payload.responseTokens = responseTokens;
  }
  logDebug(REQUEST_SUCCEEDED, response);
  notifyRequestSucceeded(payload, hasRedirect);
  return resolve(response);
}
function handleRequestError(error) {
  logWarn(REQUEST_FAILED, error);
  notifyRequestFailed({ error: error });
  return reject(error);
}
function handleMboxRequestError(mbox, error) {
  logWarn(REQUEST_FAILED, error);
  notifyRequestFailed({ mbox: mbox, error: error });
  return reject(error);
}
function executeGetOffer(options) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var mbox = options.mbox,
      timeout$$1 = options.timeout;
  var params = getOptionsParams(mbox, options);
  var successFunc = function successFunc(response) {
    return handleMboxRequestSuccess(mbox, response);
  };
  var errorFunc = function errorFunc(error) {
    return handleMboxRequestError(mbox, error);
  };
  var payload = {};
  var execute = {};
  if (mbox === globalMbox) {
    execute.pageLoad = {};
  } else {
    execute.mboxes = [{ index: 0, name: mbox }];
  }
  payload.execute = execute;
  var analytics = createAnalytics(mbox, payload);
  if (!isEmpty(analytics)) {
    var experienceCloud = {};
    experienceCloud.analytics = analytics;
    payload.experienceCloud = experienceCloud;
  }
  notifyRequestStart({ mbox: mbox });
  return createAsyncDeliveryRequest(payload, params).then(function (request) {
    return executeRequest$1(request, timeout$$1);
  }).then(processResponse).then(successFunc)['catch'](errorFunc);
}
function executeGetOffers(options) {
  var config = getConfig();
  var globalMbox = config[GLOBAL_MBOX_NAME];
  var _options$consumerId = options.consumerId,
      consumerId = _options$consumerId === undefined ? globalMbox : _options$consumerId,
      request = options.request,
      timeout$$1 = options.timeout;
  var params = getOptionsParams(globalMbox, {});
  var analytics = createAnalytics(consumerId, request);
  var successFunc = function successFunc(response) {
    return handleRequestSuccess(response);
  };
  var errorFunc = function errorFunc(error) {
    return handleRequestError(error);
  };
  if (!isEmpty(analytics)) {
    var experienceCloud = request.experienceCloud || {};
    experienceCloud.analytics = analytics;
    request.experienceCloud = experienceCloud;
  }
  notifyRequestStart({});
  return createAsyncDeliveryRequest(request, params).then(function (deliveryRequest) {
    return executeRequest$1(deliveryRequest, timeout$$1);
  }).then(processResponse).then(successFunc)['catch'](errorFunc);
}

var INIT = "[page-init]";
var EVENT = "event";
function handleHidingSnippetRemoval(evt) {
  subscribe(evt, function () {
    logDebug(INIT, EVENT, evt);
    addClientTrace({ source: INIT, event: evt });
    removeHidingSnippetStyle();
    unsubscribe(evt);
  });
}
function handleError$1(error) {
  logWarn(INIT, VIEW_DELIVERY_ERROR, error);
  addClientTrace({ source: INIT, error: error });
  publish(DELIVERY_FAILED_EVENT);
}
function handleSuccess(response) {
  logDebug(INIT, RESPONSE, response);
  addClientTrace({ source: INIT, response: response });
  executeApplyOffers({ selector: HEAD_TAG, response: response })['catch'](handleError$1);
}
function initDelivery() {
  if (!isDeliveryEnabled()) {
    logWarn(INIT, DELIVERY_DISABLED);
    addClientTrace({ source: INIT, error: DELIVERY_DISABLED });
    return;
  }
  initQaMode(index);
  subscribe(VIEW_START, function (options) {
    return handleTriggeredView(options);
  });
  var config = getConfig();
  var pageLoadEnabled = config[PAGE_LOAD_ENABLED];
  var viewsEnabled = config[VIEWS_ENABLED];
  if (!pageLoadEnabled && !viewsEnabled) {
    logDebug(INIT, PAGE_LOAD_DISABLED);
    addClientTrace({ source: INIT, error: PAGE_LOAD_DISABLED });
    return;
  }
  handleHidingSnippetRemoval(DELIVERY_FAILED_EVENT);
  handleHidingSnippetRemoval(OPTION_HIDDEN_EVENT);
  handleHidingSnippetRemoval(NO_OFFERS_EVENT);
  injectHidingSnippetStyle();
  var request = {};
  if (pageLoadEnabled) {
    var execute = {};
    execute.pageLoad = {};
    request.execute = execute;
  }
  if (viewsEnabled) {
    var prefetch = {};
    prefetch.views = [{}];
    request.prefetch = prefetch;
  }
  var timeout = config[TIMEOUT];
  logDebug(INIT, REQUEST, request);
  addClientTrace({ source: INIT, request: request });
  executeGetOffers({ request: request, timeout: timeout }).then(handleSuccess)['catch'](handleError$1);
}

function createValid() {
  var result = {};
  result[VALID] = true;
  return result;
}
function createInvalid(error) {
  var result = {};
  result[VALID] = false;
  result[ERROR] = error;
  return result;
}
function validateMbox(mbox) {
  if (isBlank(mbox)) {
    return createInvalid(MBOX_REQUIRED);
  }
  if (mbox.length > MBOX_LENGTH) {
    return createInvalid(MBOX_TOO_LONG);
  }
  return createValid();
}
function validateGetOfferOptions(options) {
  if (!isObject(options)) {
    return createInvalid(OPTIONS_REQUIRED);
  }
  var mbox = options[MBOX];
  var mboxValidation = validateMbox(mbox);
  if (!mboxValidation[VALID]) {
    return mboxValidation;
  }
  if (!isFunction(options[SUCCESS])) {
    return createInvalid(SUCCESS_REQUIRED);
  }
  if (!isFunction(options[ERROR])) {
    return createInvalid(ERROR_REQUIRED);
  }
  return createValid();
}
function validateGetOffersOptions(options) {
  if (!isObject(options)) {
    return createInvalid(OPTIONS_REQUIRED);
  }
  var request = options.request;
  if (!isObject(request)) {
    return createInvalid(REQUEST_REQUIRED);
  }
  var execute = request.execute,
      prefetch = request.prefetch;
  if (!isObject(execute) && !isObject(prefetch)) {
    return createInvalid(EXECUTE_OR_PREFETCH_REQUIRED);
  }
  return createValid();
}
function validateApplyOfferOptions(options) {
  if (!isObject(options)) {
    return createInvalid(OPTIONS_REQUIRED);
  }
  var mbox = options[MBOX];
  var mboxValidation = validateMbox(mbox);
  if (!mboxValidation[VALID]) {
    return mboxValidation;
  }
  var offer = options[OFFER];
  if (!isArray(offer)) {
    return createInvalid(OFFER_REQUIRED);
  }
  return createValid();
}
function validateApplyOffersOptions(options) {
  if (!isObject(options)) {
    return createInvalid(OPTIONS_REQUIRED);
  }
  var response = options.response;
  if (!isObject(response)) {
    return createInvalid(RESPONE_REQUIRED);
  }
  return createValid();
}
function validateTrackEventOptions(options) {
  if (!isObject(options)) {
    return createInvalid(OPTIONS_REQUIRED);
  }
  var mbox = options[MBOX];
  var mboxValidation = validateMbox(mbox);
  if (!mboxValidation[VALID]) {
    return mboxValidation;
  }
  return createValid();
}

function redirect$2(option) {
  return {
    action: REDIRECT,
    url: option.content
  };
}
function setHtml$3(action) {
  var result = {};
  result.action = SET_CONTENT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setText$4(action) {
  var result = {};
  result.action = SET_TEXT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function appendHtml$2(action) {
  var result = {};
  result.action = APPEND_CONTENT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function prependHtml$2(action) {
  var result = {};
  result.action = PREPEND_CONTENT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function replaceHtml$2(action) {
  var result = {};
  result.action = REPLACE_CONTENT;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function insertBefore$3(action) {
  var result = {};
  result.action = INSERT_BEFORE;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function insertAfter$3(action) {
  var result = {};
  result.action = INSERT_AFTER;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function customCode$3(action) {
  var result = {};
  result.action = CUSTOM_CODE;
  result.content = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setAttribute$3(action) {
  var attribute = keys(action.content)[0];
  var result = {};
  result.action = SET_ATTRIBUTE;
  result.attribute = attribute;
  result.value = action.content[attribute];
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setImageSource$2(action) {
  var result = {};
  result.action = SET_ATTRIBUTE;
  result.attribute = SRC;
  result.value = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function setStyle$3(action) {
  var result = {};
  result.action = SET_STYLE;
  result.style = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function resize$2(action) {
  var result = {};
  result.action = SET_STYLE;
  result.style = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function move$2(action) {
  var result = {};
  result.action = SET_STYLE;
  result.style = action.content;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function remove$5(action) {
  var result = {};
  result.action = REMOVE;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function rearrange$3(action) {
  var result = {};
  result.action = REARRANGE;
  result.from = action.content.from;
  result.to = action.content.to;
  result.selector = action.selector;
  result.cssSelector = action.cssSelector;
  return result;
}
function processActions(actions) {
  var result = [];
  forEach(function (action) {
    var type = action.type;
    switch (type) {
      case SET_HTML:
        result.push(setHtml$3(action));
        break;
      case SET_TEXT:
        result.push(setText$4(action));
        break;
      case APPEND_HTML:
        result.push(appendHtml$2(action));
        break;
      case PREPEND_HTML:
        result.push(prependHtml$2(action));
        break;
      case REPLACE_HTML:
        result.push(replaceHtml$2(action));
        break;
      case INSERT_BEFORE:
        result.push(insertBefore$3(action));
        break;
      case INSERT_AFTER:
        result.push(insertAfter$3(action));
        break;
      case CUSTOM_CODE:
        result.push(customCode$3(action));
        break;
      case SET_ATTRIBUTE:
        result.push(setAttribute$3(action));
        break;
      case SET_IMAGE_SOURCE:
        result.push(setImageSource$2(action));
        break;
      case SET_STYLE:
        result.push(setStyle$3(action));
        break;
      case RESIZE:
        result.push(resize$2(action));
        break;
      case MOVE:
        result.push(move$2(action));
        break;
      case REMOVE:
        result.push(remove$5(action));
        break;
      case REARRANGE:
        result.push(rearrange$3(action));
        break;
      case REDIRECT:
        result.push(redirect$2(action));
        break;
      default:
        break;
    }
  }, actions);
  return result;
}
function processMetrics$2(metrics) {
  if (isEmpty(metrics)) {
    return [];
  }
  var result = [];
  forEach(function (m) {
    if (m.type !== CLICK) {
      return;
    }
    if (hasSelector(m)) {
      result.push({
        action: TRACK_CLICK,
        selector: m.selector,
        clickTrackId: m.eventToken
      });
    } else {
      result.push({
        action: SIGNAL_CLICK,
        clickTrackId: m.eventToken
      });
    }
  }, metrics);
  return result;
}
function processItem(item) {
  if (isEmpty(item)) {
    return [];
  }
  var htmls = [];
  var jsons = [];
  var actions = [];
  var _item$options = item.options,
      options = _item$options === undefined ? [] : _item$options,
      _item$metrics = item.metrics,
      metrics = _item$metrics === undefined ? [] : _item$metrics;
  forEach(function (option) {
    var type = option.type;
    switch (type) {
      case HTML:
        htmls.push(option.content);
        break;
      case JSON$1:
        jsons.push(option.content);
        break;
      case REDIRECT:
        actions.push(redirect$2(option));
        break;
      case ACTIONS:
        actions.push.apply(actions, processActions(option.content));
        break;
      default:
        break;
    }
  }, options);
  if (!isEmpty(htmls)) {
    actions.push({ action: SET_CONTENT, content: htmls.join("") });
  }
  if (!isEmpty(jsons)) {
    actions.push({ action: SET_JSON, content: jsons });
  }
  var clickActions = processMetrics$2(metrics);
  if (!isEmpty(clickActions)) {
    actions.push.apply(actions, clickActions);
  }
  return actions;
}
function convertToActions(response) {
  var _response$execute = response.execute,
      execute = _response$execute === undefined ? {} : _response$execute;
  var _execute$pageLoad = execute.pageLoad,
      pageLoad = _execute$pageLoad === undefined ? {} : _execute$pageLoad;
  var _execute$mboxes = execute.mboxes,
      mboxes = _execute$mboxes === undefined ? [] : _execute$mboxes;
  var result = [];
  result.push.apply(result, processItem(pageLoad));
  result.push.apply(result, flatten(map(processItem, mboxes)));
  return result;
}

var GET_OFFER = "[getOffer()]";
function handleRequestSuccess$1(options, response) {
  var actions = convertToActions(response);
  options[SUCCESS](actions);
}
function handleRequestError$1(options, error) {
  var status = error[STATUS] || UNKNOWN;
  options[ERROR](status, error);
}
function getOffer(options) {
  var validationResult = validateGetOfferOptions(options);
  var error = validationResult[ERROR];
  if (!validationResult[VALID]) {
    logWarn(GET_OFFER, error);
    addClientTrace({ source: GET_OFFER, options: options, error: error });
    return;
  }
  if (!isDeliveryEnabled()) {
    delay(options[ERROR](WARNING, DELIVERY_DISABLED));
    addClientTrace({
      source: GET_OFFER,
      options: options,
      error: DELIVERY_DISABLED
    });
    logWarn(DELIVERY_DISABLED);
    return;
  }
  var successFunc = function successFunc(response) {
    return handleRequestSuccess$1(options, response);
  };
  var errorFunc = function errorFunc(err) {
    return handleRequestError$1(options, err);
  };
  logDebug(GET_OFFER, options);
  addClientTrace({ source: GET_OFFER, options: options });
  executeGetOffer(options).then(successFunc)['catch'](errorFunc);
}

var GET_OFFERS = "[getOffers()]";
function getOffers(options) {
  var validationResult = validateGetOffersOptions(options);
  var error = validationResult[ERROR];
  if (!validationResult[VALID]) {
    logWarn(GET_OFFERS, error);
    addClientTrace({ source: GET_OFFERS, options: options, error: error });
    return reject(validationResult);
  }
  if (!isDeliveryEnabled()) {
    logWarn(DELIVERY_DISABLED);
    addClientTrace({
      source: GET_OFFERS,
      options: options,
      error: DELIVERY_DISABLED
    });
    return reject(new Error(DELIVERY_DISABLED));
  }
  logDebug(GET_OFFERS, options);
  addClientTrace({ source: GET_OFFERS, options: options });
  return executeGetOffers(options);
}

var APPLY_OFFER = "[applyOffer()]";
function applyOffer(options) {
  var selector = retrieveSelector(options.selector);
  var validationResult = validateApplyOfferOptions(options);
  var error = validationResult[ERROR];
  if (!validationResult[VALID]) {
    logWarn(APPLY_OFFER, options, error);
    addClientTrace({ source: APPLY_OFFER, options: options, error: error });
    showElement(selector);
    return;
  }
  if (!isDeliveryEnabled()) {
    logWarn(APPLY_OFFER, DELIVERY_DISABLED);
    addClientTrace({ source: APPLY_OFFER, options: options, error: DELIVERY_DISABLED });
    showElement(selector);
    return;
  }
  options.selector = selector;
  logDebug(APPLY_OFFER, options);
  addClientTrace({ source: APPLY_OFFER, options: options });
  executeApplyOffer(options);
}

var APPLY_OFFERS = "[applyOffers()]";
function applyOffers(options) {
  var selector = retrieveSelector(options.selector);
  var validationResult = validateApplyOffersOptions(options);
  var error = validationResult[ERROR];
  if (!validationResult[VALID]) {
    logWarn(APPLY_OFFERS, options, error);
    addClientTrace({ source: APPLY_OFFERS, options: options, error: error });
    showElement(selector);
    return reject(validationResult);
  }
  if (!isDeliveryEnabled()) {
    logWarn(APPLY_OFFERS, DELIVERY_DISABLED);
    addClientTrace({
      source: APPLY_OFFERS,
      options: options,
      error: DELIVERY_DISABLED
    });
    showElement(selector);
    return reject(new Error(DELIVERY_DISABLED));
  }
  options.selector = selector;
  logDebug(APPLY_OFFERS, options);
  addClientTrace({ source: APPLY_OFFERS, options: options });
  return executeApplyOffers(options);
}

var TRACK_EVENT = "[trackEvent()]";
function normalizeOptions(config, options) {
  var mbox = options[MBOX];
  var result = index$3({}, options);
  result[PARAMS] = getOptionsParams(mbox, options);
  result[TIMEOUT] = getTimeout(config, options[TIMEOUT]);
  result[SUCCESS] = isFunction(options[SUCCESS]) ? options[SUCCESS] : noop;
  result[ERROR] = isFunction(options[ERROR]) ? options[ERROR] : noop;
  return result;
}
function shouldTrackBySelector(options) {
  var type = options[TYPE];
  var selector = options[SELECTOR];
  return isNotBlank(type) && (isNotBlank(selector) || isElement(selector));
}
function trackImmediate(options) {
  var mbox = options.mbox;
  var params = getOptionsParams(mbox, options);
  var type = DISPLAY_EVENT;
  var requestDetails = createRequestDetails({}, params);
  var notification = createNotification(requestDetails, type, []);
  notification.mbox = { name: mbox };
  var request = createNotificationRequest(mbox, params, [notification]);
  if (executeBeaconNotification(request)) {
    logDebug(TRACK_EVENT_SUCCESS, options);
    options[SUCCESS]();
    return;
  }
  logWarn(TRACK_EVENT_ERROR, options);
  options[ERROR](UNKNOWN, TRACK_EVENT_ERROR);
}
function handleEvent(options) {
  trackImmediate(options);
  return !options.preventDefault;
}
function trackBySelector(options) {
  var selector = options[SELECTOR];
  var type = options[TYPE];
  var elements = toArray$1(select(selector));
  var onEvent = function onEvent() {
    return handleEvent(options);
  };
  forEach(function (element) {
    return listen(type, onEvent, element);
  }, elements);
}
function trackEvent(opts) {
  var validationResult = validateTrackEventOptions(opts);
  var error = validationResult[ERROR];
  if (!validationResult[VALID]) {
    logWarn(TRACK_EVENT, error);
    addClientTrace({ source: TRACK_EVENT, options: opts, error: error });
    return;
  }
  var config = getConfig();
  var options = normalizeOptions(config, opts);
  if (!isDeliveryEnabled()) {
    logWarn(TRACK_EVENT, DELIVERY_DISABLED);
    delay(options[ERROR](WARNING, DELIVERY_DISABLED));
    addClientTrace({
      source: TRACK_EVENT,
      options: opts,
      error: DELIVERY_DISABLED
    });
    return;
  }
  logDebug(TRACK_EVENT, options);
  addClientTrace({ source: TRACK_EVENT, options: options });
  if (shouldTrackBySelector(options)) {
    trackBySelector(options);
    return;
  }
  trackImmediate(options);
}

var COMMON_MBOX_WARN = "function has been deprecated. Please use getOffer() and applyOffer() functions instead.";
var REGISTER_EXTENSION_WARN = "adobe.target.registerExtension() function has been deprecated. Please review the documentation for alternatives.";
var MBOX_CREATE_WARN = "mboxCreate() " + COMMON_MBOX_WARN;
var MBOX_DEFINE_WARN = "mboxDefine() " + COMMON_MBOX_WARN;
var MBOX_UPDATE_WARN = "mboxUpdate() " + COMMON_MBOX_WARN;
function registerExtension() {
  logWarn(REGISTER_EXTENSION_WARN, arguments);
}
function mboxCreate() {
  logWarn(MBOX_CREATE_WARN, arguments);
}
function mboxDefine() {
  logWarn(MBOX_DEFINE_WARN, arguments);
}
function mboxUpdate() {
  logWarn(MBOX_UPDATE_WARN, arguments);
}

function overridePublicApi(win) {
  var noop = function noop() {};
  var noopPromise = function noopPromise() {
    return resolve();
  };
  win.adobe = win.adobe || {};
  win.adobe.target = {
    VERSION: "",
    event: {},
    getOffer: noop,
    getOffers: noopPromise,
    applyOffer: noop,
    applyOffers: noopPromise,
    trackEvent: noop,
    triggerView: noop,
    registerExtension: noop,
    init: noop
  };
  win.mboxCreate = noop;
  win.mboxDefine = noop;
  win.mboxUpdate = noop;
}
function init(win, doc, settings) {
  if (win.adobe && win.adobe.target && typeof win.adobe.target.getOffer !== "undefined") {
    logWarn(ALREADY_INITIALIZED);
    return;
  }
  initConfig(settings);
  var config = getConfig();
  var version = config[VERSION];
  win.adobe.target.VERSION = version;
  win.adobe.target.event = {
    LIBRARY_LOADED: LIBRARY_LOADED,
    REQUEST_START: REQUEST_START,
    REQUEST_SUCCEEDED: REQUEST_SUCCEEDED$1,
    REQUEST_FAILED: REQUEST_FAILED$1,
    CONTENT_RENDERING_START: CONTENT_RENDERING_START,
    CONTENT_RENDERING_SUCCEEDED: CONTENT_RENDERING_SUCCEEDED,
    CONTENT_RENDERING_FAILED: CONTENT_RENDERING_FAILED,
    CONTENT_RENDERING_NO_OFFERS: CONTENT_RENDERING_NO_OFFERS,
    CONTENT_RENDERING_REDIRECT: CONTENT_RENDERING_REDIRECT
  };
  if (!config[ENABLED]) {
    overridePublicApi(win);
    logWarn(DELIVERY_DISABLED);
    return;
  }
  if (isDeliveryEnabled()) {
    initTraces();
  }
  initAuthoringCode(win, doc, config);
  initDelivery();
  win.adobe.target.getOffer = getOffer;
  win.adobe.target.getOffers = getOffers;
  win.adobe.target.applyOffer = applyOffer;
  win.adobe.target.applyOffers = applyOffers;
  win.adobe.target.trackEvent = trackEvent;
  win.adobe.target.triggerView = triggerView;
  win.adobe.target.registerExtension = registerExtension;
  win.mboxCreate = mboxCreate;
  win.mboxDefine = mboxDefine;
  win.mboxUpdate = mboxUpdate;
  notifyLibraryLoaded();
}
var bootstrap = {
  init: init
};

return bootstrap;

}());
window.adobe.target.init(window,document,{"clientCode":"japacperf8","imsOrgId":"C3E23FE452A536D60A490D45@AdobeOrg","serverDomain":"japacperf8.tt.omtrdc.net","cookieDomain":"xdex.github.io","timeout":7000,"globalMboxName":"target-global-mbox","version":"2.0.1","defaultContentHiddenStyle":"visibility:hidden;","defaultContentVisibleStyle":"visibility:visible;","bodyHiddenStyle":"body{opacity:0!important}","bodyHidingEnabled":true,"deviceIdLifetime":63244800000,"sessionIdLifetime":1860000,"selectorsPollingTimeout":5000,"visitorApiTimeout":2000,"overrideMboxEdgeServer":true,"overrideMboxEdgeServerTimeout":1860000,"optoutEnabled":false,"secureOnly":false,"supplementalDataIdParamTimeout":30,"authoringScriptUrl":"//cdn.tt.omtrdc.net/cdn/target-vec.js","urlSizeLimit":2048,"endpoint":"/rest/v1/delivery","pageLoadEnabled":true,"viewsEnabled":true});
//No custom JavaScript