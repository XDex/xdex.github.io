/**
 * @license
 * at.js 1.1.0 | (c) Adobe Systems Incorporated | All rights reserved
 * zepto.js | (c) 2010-2016 Thomas Fuchs | zeptojs.com/license
 * rx.js | (c) 2015-2016 Netflix, Inc., Microsoft Corp. and contributors | http://www.apache.org/licenses/LICENSE-2.0
 */
(function (exports) {
'use strict';

if (!isStandardMode() || (window.targetGlobalSettings && window.targetGlobalSettings.enabled === false)) {
  overridePublicApi();
  return;
}


var consolePoly = function () {
  (function(undefined) {
    if (!('console' in this)) {
      this.console = this.console || {};
    }
    if (!('log' in this.console)) {
      this.console.log = function log() {};
    }
    if (!('warn' in this.console)) {
      this.console.warn = function warn() {};
    }
    if (Function.prototype.bind) {
      if (typeof this.console.log === 'object') {
        this.console.log = Function.prototype.call.bind(this.console.log, this.console);
      }
      if (typeof this.console.warn === 'object') {
        this.console.warn = Function.prototype.call.bind(this.console.warn, this.console);
      }
    }
  }).call('object' === typeof window && window || 'object' === typeof self && self || {});
};

var CustomEventPoly = function () {
  (function(undefined) {
    if (!((function(global) {
        if (!('Event' in global)) return false;
        if (typeof global.Event === 'function') return true;
        try {
          new Event('click');
          return true;
        } catch(e) {
          return false;
        }
      }(this)))) {
      (function () {
        var unlistenableWindowEvents = {
          click: 1,
          dblclick: 1,
          keyup: 1,
          keypress: 1,
          keydown: 1,
          mousedown: 1,
          mouseup: 1,
          mousemove: 1,
          mouseover: 1,
          mouseenter: 1,
          mouseleave: 1,
          mouseout: 1,
          storage: 1,
          storagecommit: 1,
          textinput: 1
        };
        function indexOf(array, element) {
          var
            index = -1,
            length = array.length;
          while (++index < length) {
            if (index in array && array[index] === element) {
              return index;
            }
          }
          return -1;
        }
        var existingProto = (window.Event && window.Event.prototype) || null;
        window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
          if (!type) {
            throw new Error('Not enough arguments');
          }
          if ('createEvent' in document) {
            var event = document.createEvent('Event');
            var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
            var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
            event.initEvent(type, bubbles, cancelable);
            return event;
          }
          var event = document.createEventObject();
          event.type = type;
          event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
          event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
          return event;
        };
        if (existingProto) {
          Object.defineProperty(window.Event, 'prototype', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: existingProto
          });
        }
        if (!('createEvent' in document)) {
          window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
            var
              element = this,
              type = arguments[0],
              listener = arguments[1];
            if (element === window && type in unlistenableWindowEvents) {
              throw new Error('In IE8 the event: ' + type + ' is not available on the window object.');
            }
            if (!element._events) {
              element._events = {};
            }
            if (!element._events[type]) {
              element._events[type] = function (event) {
                var
                  list = element._events[event.type].list,
                  events = list.slice(),
                  index = -1,
                  length = events.length,
                  eventElement;
                event.preventDefault = function preventDefault() {
                  if (event.cancelable !== false) {
                    event.returnValue = false;
                  }
                };
                event.stopPropagation = function stopPropagation() {
                  event.cancelBubble = true;
                };
                event.stopImmediatePropagation = function stopImmediatePropagation() {
                  event.cancelBubble = true;
                  event.cancelImmediate = true;
                };
                event.currentTarget = element;
                event.relatedTarget = event.fromElement || null;
                event.target = event.target || event.srcElement || element;
                event.timeStamp = new Date().getTime();
                if (event.clientX) {
                  event.pageX = event.clientX + document.documentElement.scrollLeft;
                  event.pageY = event.clientY + document.documentElement.scrollTop;
                }
                while (++index < length && !event.cancelImmediate) {
                  if (index in events) {
                    eventElement = events[index];
                    if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
                      eventElement.call(element, event);
                    }
                  }
                }
              };
              element._events[type].list = [];
              if (element.attachEvent) {
                element.attachEvent('on' + type, element._events[type]);
              }
            }
            element._events[type].list.push(listener);
          };
          window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
            var
              element = this,
              type = arguments[0],
              listener = arguments[1],
              index;
            if (element._events && element._events[type] && element._events[type].list) {
              index = indexOf(element._events[type].list, listener);
              if (index !== -1) {
                element._events[type].list.splice(index, 1);
                if (!element._events[type].list.length) {
                  if (element.detachEvent) {
                    element.detachEvent('on' + type, element._events[type]);
                  }
                  delete element._events[type];
                }
              }
            }
          };
          window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
            if (!arguments.length) {
              throw new Error('Not enough arguments');
            }
            if (!event || typeof event.type !== 'string') {
              throw new Error('DOM Events Exception 0');
            }
            var element = this, type = event.type;
            try {
              if (!event.bubbles) {
                event.cancelBubble = true;
                var cancelBubbleEvent = function (event) {
                  event.cancelBubble = true;
                  (element || window).detachEvent('on' + type, cancelBubbleEvent);
                };
                this.attachEvent('on' + type, cancelBubbleEvent);
              }
              this.fireEvent('on' + type, event);
            } catch (error) {
              event.target = element;
              do {
                event.currentTarget = element;
                if ('_events' in element && typeof element._events[type] === 'function') {
                  element._events[type].call(element, event);
                }
                if (typeof element['on' + type] === 'function') {
                  element['on' + type].call(element, event);
                }
                element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
              } while (element && !event.cancelBubble);
            }
            return true;
          };
          document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
              document.dispatchEvent(new Event('DOMContentLoaded', {
                bubbles: true
              }));
            }
          });
        }
      }());
    }
    if (!('CustomEvent' in this &&
      (typeof this.CustomEvent === 'function' ||
      (this.CustomEvent.toString().indexOf('CustomEventConstructor')>-1)))) {
      this.CustomEvent = function CustomEvent(type, eventInitDict) {
        if (!type) {
          throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
        }
        var event;
        eventInitDict = eventInitDict || {bubbles: false, cancelable: false, detail: null};
        if ('createEvent' in document) {
          try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
          } catch (error) {
            event = document.createEvent('Event');
            event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
            event.detail = eventInitDict.detail;
          }
        } else {
          event = new Event(type, eventInitDict);
          event.detail = eventInitDict && eventInitDict.detail || null;
        }
        return event;
      };
      CustomEvent.prototype = Event.prototype;
    }
  })
    .call('object' === typeof window && window || 'object' === typeof self && self || {});
};

var initPolyfills = function () {
    CustomEventPoly();
};

var WINDOW;
var DOCUMENT;
var DOCUMENT_ELEMENT;
var SCREEN;
var LOCATION;
function initGlobals(win, doc) {
    WINDOW = win;
    DOCUMENT = doc;
    DOCUMENT_ELEMENT = doc.documentElement;
    SCREEN = win.screen;
    LOCATION = doc.location;
}

var SETTINGS_STORE = {};
var DEBUG_SETTINGS;
var ENABLED;
var CLIENT_CODE;
var IMS_ORG_ID;
var SERVER_DOMAIN;
var CROSS_DOMAIN;
var TIMEOUT;
var GLOBAL_MBOX_NAME;
var GLOBAL_MBOX_AUTO_CREATE;
var MBOX_PARAMS;
var GLOBAL_MBOX_PARAMS;
var VERSION;
var DEFAULT_CONTENT_HIDDEN_STYLE;
var DEFAULT_CONTENT_VISIBLE_STYLE;
var BODY_HIDDEN_STYLE;
var BODY_HIDING_ENABLED;
var DEVICE_ID_LIFETIME;
var SESSION_ID_LIFETIME;
var SELECTORS_POLLING_TIMEOUT;
var VISITOR_API_TIMEOUT;
var EDGE_SERVER_OVERRIDE;
var EDGE_SERVER_OVERRIDE_TIMEOUT;
var OPTOUT_ENABLED;
var COOKIE_DOMAIN;
var CROSS_DOMAIN_ENABLED;
var CROSS_DOMAIN_ONLY;
var AUTHORING_SCRIPT_URL = '//cdn.tt.omtrdc.net/cdn/target-vec.js';
var SCHEME;
var SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT;
function initSettings(settings) {
    SETTINGS_STORE = settings;
    DEBUG_SETTINGS = SETTINGS_STORE;
    ENABLED = SETTINGS_STORE.enabled;
    CLIENT_CODE = SETTINGS_STORE.clientCode;
    IMS_ORG_ID = SETTINGS_STORE.imsOrgId;
    SERVER_DOMAIN = SETTINGS_STORE.serverDomain;
    CROSS_DOMAIN = SETTINGS_STORE.crossDomain;
    TIMEOUT = SETTINGS_STORE.timeout;
    GLOBAL_MBOX_NAME = SETTINGS_STORE.globalMboxName;
    GLOBAL_MBOX_AUTO_CREATE = SETTINGS_STORE.globalMboxAutoCreate;
    MBOX_PARAMS = SETTINGS_STORE.mboxParams;
    GLOBAL_MBOX_PARAMS = SETTINGS_STORE.globalMboxParams;
    VERSION = SETTINGS_STORE.version;
    DEFAULT_CONTENT_HIDDEN_STYLE = SETTINGS_STORE.defaultContentHiddenStyle;
    DEFAULT_CONTENT_VISIBLE_STYLE = SETTINGS_STORE.defaultContentVisibleStyle;
    BODY_HIDDEN_STYLE = SETTINGS_STORE.bodyHiddenStyle;
    BODY_HIDING_ENABLED = SETTINGS_STORE.bodyHidingEnabled;
    DEVICE_ID_LIFETIME = SETTINGS_STORE.deviceIdLifetime / 1000;
    SESSION_ID_LIFETIME = SETTINGS_STORE.sessionIdLifetime / 1000;
    SELECTORS_POLLING_TIMEOUT = SETTINGS_STORE.selectorsPollingTimeout;
    VISITOR_API_TIMEOUT = SETTINGS_STORE.visitorApiTimeout;
    EDGE_SERVER_OVERRIDE = SETTINGS_STORE.overrideMboxEdgeServer;
    EDGE_SERVER_OVERRIDE_TIMEOUT = SETTINGS_STORE.overrideMboxEdgeServerTimeout;
    OPTOUT_ENABLED = SETTINGS_STORE.optoutEnabled;
    COOKIE_DOMAIN = SETTINGS_STORE.cookieDomain;
    CROSS_DOMAIN_ENABLED = CROSS_DOMAIN !== 'disabled';
    CROSS_DOMAIN_ONLY = CROSS_DOMAIN === 'x-only';
    SCHEME = SETTINGS_STORE.secureOnly ? 'https:' : '';
    SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT = SETTINGS_STORE.supplementalDataIdParamTimeout;
}

var EMPTY = '';
function noop() {
}
function identity(value) {
    return value;
}
function uuid() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var parts = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
        parts[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    parts[14] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    parts[19] = hexDigits.substr((parts[19] & 0x3) | 0x8, 1);
    parts[8] = parts[13] = parts[18] = parts[23] = EMPTY;
    return parts.join(EMPTY);
}
function delay(func) {
    setTimeout(func, 0);
}
function hash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + ch;
    }
    return hash;
}

var index = (function(window) {
  var Zepto = (function() {
      var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div'),
        propMap = {
          'tabindex': 'tabIndex',
          'readonly': 'readOnly',
          'for': 'htmlFor',
          'class': 'className',
          'maxlength': 'maxLength',
          'cellspacing': 'cellSpacing',
          'cellpadding': 'cellPadding',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'usemap': 'useMap',
          'frameborder': 'frameBorder',
          'contenteditable': 'contentEditable'
        },
        isArray = Array.isArray ||
          function(object){ return object instanceof Array };
      zepto.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.matches || element.webkitMatchesSelector ||
          element.mozMatchesSelector || element.oMatchesSelector ||
          element.matchesSelector;
        if (matchesSelector) return matchesSelector.call(element, selector)
        var match, parent = element.parentNode, temp = !parent;
        if (temp) (parent = tempParent).appendChild(element);
        match = ~zepto.qsa(parent, selector).indexOf(element);
        temp && tempParent.removeChild(element);
        return match
      };
      function type(obj) {
        return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object"
      }
      function isFunction(value) { return type(value) == "function" }
      function isWindow(obj)     { return obj != null && obj == obj.window }
      function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
      function isObject(obj)     { return type(obj) == "object" }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
      }
      function likeArray(obj) {
        var length = !!obj && 'length' in obj && obj.length,
          type = $.type(obj);
        return 'function' != type && !isWindow(obj) && (
            'array' == type || length === 0 ||
            (typeof length == 'number' && length > 0 && (length - 1) in obj)
          )
      }
      function compact(array) { return filter.call(array, function(item){ return item != null }) }
      function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
      camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) };
      function dasherize(str) {
        return str.replace(/::/g, '/')
          .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
          .replace(/([a-z\d])([A-Z])/g, '$1_$2')
          .replace(/_/g, '-')
          .toLowerCase()
      }
      uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) };
      function classRE(name) {
        return name in classCache ?
          classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
      }
      function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
      }
      function defaultDisplay(nodeName) {
        var element, display;
        if (!elementDisplay[nodeName]) {
          element = document.createElement(nodeName);
          document.body.appendChild(element);
          display = getComputedStyle(element, '').getPropertyValue("display");
          element.parentNode.removeChild(element);
          display == "none" && (display = "block");
          elementDisplay[nodeName] = display;
        }
        return elementDisplay[nodeName]
      }
      function children(element) {
        return 'children' in element ?
          slice.call(element.children) :
          $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
      }
      function Z(dom, selector) {
        var i, len = dom ? dom.length : 0;
        for (i = 0; i < len; i++) this[i] = dom[i];
        this.length = len;
        this.selector = selector || '';
      }
      zepto.fragment = function(html, name, properties) {
        var dom, nodes, container;
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
        if (!dom) {
          if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
          if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
          if (!(name in containers)) name = '*';
          container = containers[name];
          container.innerHTML = '' + html;
          dom = $.each(slice.call(container.childNodes), function(){
            container.removeChild(this);
          });
        }
        if (isPlainObject(properties)) {
          nodes = $(dom);
          $.each(properties, function(key, value) {
            if (methodAttributes.indexOf(key) > -1) nodes[key](value);
            else nodes.attr(key, value);
          });
        }
        return dom
      };
      zepto.Z = function(dom, selector) {
        return new Z(dom, selector)
      };
      zepto.isZ = function(object) {
        return object instanceof zepto.Z
      };
      zepto.init = function(selector, context) {
        var dom;
        if (!selector) return zepto.Z()
        else if (typeof selector == 'string') {
          selector = selector.trim();
          if (selector[0] == '<' && fragmentRE.test(selector))
            dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
          else if (context !== undefined) return $(context).find(selector)
          else dom = zepto.qsa(document, selector);
        }
        else if (isFunction(selector)) return $(document).ready(selector)
        else if (zepto.isZ(selector)) return selector
        else {
          if (isArray(selector)) dom = compact(selector);
          else if (isObject(selector))
            dom = [selector], selector = null;
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
          else if (context !== undefined) return $(context).find(selector)
          else dom = zepto.qsa(document, selector);
        }
        return zepto.Z(dom, selector)
      };
      $ = function(selector, context){
        return zepto.init(selector, context)
      };
      function extend(target, source, deep) {
        for (key in source)
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
              target[key] = {};
            if (isArray(source[key]) && !isArray(target[key]))
              target[key] = [];
            extend(target[key], source[key], deep);
          }
          else if (source[key] !== undefined) target[key] = source[key];
      }
      $.extend = function(target){
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
          deep = target;
          target = args.shift();
        }
        args.forEach(function(arg){ extend(target, arg, deep); });
        return target
      };
      zepto.qsa = function(element, selector){
        var found,
          maybeID = selector[0] == '#',
          maybeClass = !maybeID && selector[0] == '.',
          nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
          isSimple = simpleSelectorRE.test(nameOnly);
        return (element.getElementById && isSimple && maybeID) ?
          ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
          (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
            slice.call(
              isSimple && !maybeID && element.getElementsByClassName ?
                maybeClass ? element.getElementsByClassName(nameOnly) :
                  element.getElementsByTagName(selector) :
                element.querySelectorAll(selector)
            )
      };
      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
      }
      $.contains = document.documentElement.contains ?
        function(parent, node) {
          return parent !== node && parent.contains(node)
        } :
        function(parent, node) {
          while (node && (node = node.parentNode))
            if (node === parent) return true
          return false
        };
      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
      }
      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
      }
      function className(node, value){
        var klass = node.className || '',
          svg   = klass && klass.baseVal !== undefined;
        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value);
      }
      function deserializeValue(value) {
        try {
          return value ?
          value == "true" ||
          ( value == "false" ? false :
            value == "null" ? null :
              +value + "" == value ? +value :
                /^[\[\{]/.test(value) ? $.parseJSON(value) :
                  value )
            : value
        } catch(e) {
          return value
        }
      }
      $.type = type;
      $.isFunction = isFunction;
      $.isWindow = isWindow;
      $.isArray = isArray;
      $.isPlainObject = isPlainObject;
      $.isEmptyObject = function(obj) {
        var name;
        for (name in obj) return false
        return true
      };
      $.isNumeric = function(val) {
        var num = Number(val), type = typeof val;
        return val != null && type != 'boolean' &&
          (type != 'string' || val.length) &&
          !isNaN(num) && isFinite(num) || false
      };
      $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
      };
      $.camelCase = camelize;
      $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
      };
      $.uuid = 0;
      $.support = { };
      $.expr = { };
      $.noop = function() {};
      $.map = function(elements, callback){
        var value, values = [], i, key;
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value);
          }
        else
          for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value);
          }
        return flatten(values)
      };
      $.each = function(elements, callback){
        var i, key;
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }
        return elements
      };
      $.grep = function(elements, callback){
        return filter.call(elements, callback)
      };
      if (window.JSON) $.parseJSON = JSON.parse;
      $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
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
        concat: function(){
          var i, value, args = [];
          for (i = 0; i < arguments.length; i++) {
            value = arguments[i];
            args[i] = zepto.isZ(value) ? value.toArray() : value;
          }
          return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
        },
        map: function(fn){
          return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
          return $(slice.apply(this, arguments))
        },
        ready: function(callback){
          if (readyRE.test(document.readyState) && document.body) callback($);
          else document.addEventListener('DOMContentLoaded', function(){ callback($); }, false);
          return this
        },
        get: function(idx){
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
          return this.length
        },
        remove: function(){
          return this.each(function(){
            if (this.parentNode != null)
              this.parentNode.removeChild(this);
          })
        },
        each: function(callback){
          var len = this.length, idx = 0, el;
          while(idx < len) {
            el = this[idx];
            if (callback.call(el, idx, el) === false) {
              break
            }
            idx++;
          }
          return this
        },
        filter: function(selector){
          if (isFunction(selector)) return this.not(this.not(selector))
          return $(filter.call(this, function(element){
            return zepto.matches(element, selector)
          }))
        },
        add: function(selector,context){
          return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
          return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
          var nodes=[];
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function(idx){
              if (!selector.call(this,idx)) nodes.push(this);
            });
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) :
              (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector);
            this.forEach(function(el){
              if (excludes.indexOf(el) < 0) nodes.push(el);
            });
          }
          return $(nodes)
        },
        has: function(selector){
          return this.filter(function(){
            return isObject(selector) ?
              $.contains(this, selector) :
              $(this).find(selector).size()
          })
        },
        eq: function(idx){
          return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
          var el = this[0];
          return el && !isObject(el) ? el : $(el)
        },
        last: function(){
          var el = this[this.length - 1];
          return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
          var result, $this = this;
          if (!selector) result = $();
          else if (typeof selector == 'object')
            result = $(selector).filter(function(){
              var node = this;
              return emptyArray.some.call($this, function(parent){
                return $.contains(parent, node)
              })
            });
          else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
          else result = this.map(function(){ return zepto.qsa(this, selector) });
          return result
        },
        closest: function(selector, context){
          var nodes = [], collection = typeof selector == 'object' && $(selector);
          this.each(function(_, node){
            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
              node = node !== context && !isDocument(node) && node.parentNode;
            if (node && nodes.indexOf(node) < 0) nodes.push(node);
          });
          return $(nodes)
        },
        parents: function(selector){
          var ancestors = [], nodes = this;
          while (nodes.length > 0)
            nodes = $.map(nodes, function(node){
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node);
                return node
              }
            });
          return filtered(ancestors, selector)
        },
        parent: function(selector){
          return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
          return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
          return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
        },
        siblings: function(selector){
          return filtered(this.map(function(i, el){
            return filter.call(children(el.parentNode), function(child){ return child!==el })
          }), selector)
        },
        empty: function(){
          return this.each(function(){ this.innerHTML = ''; })
        },
        pluck: function(property){
          return $.map(this, function(el){ return el[property] })
        },
        show: function(){
          return this.each(function(){
            this.style.display == "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
              this.style.display = defaultDisplay(this.nodeName);
          })
        },
        replaceWith: function(newContent){
          return this.before(newContent).remove()
        },
        wrap: function(structure){
          var func = isFunction(structure);
          if (this[0] && !func)
            var dom   = $(structure).get(0),
              clone = dom.parentNode || this.length > 1;
          return this.each(function(index){
            $(this).wrapAll(
              func ? structure.call(this, index) :
                clone ? dom.cloneNode(true) : dom
            );
          })
        },
        wrapAll: function(structure){
          if (this[0]) {
            $(this[0]).before(structure = $(structure));
            var children;
            while ((children = structure.children()).length) structure = children.first();
            $(structure).append(this);
          }
          return this
        },
        wrapInner: function(structure){
          var func = isFunction(structure);
          return this.each(function(index){
            var self = $(this), contents = self.contents(),
              dom  = func ? structure.call(this, index) : structure;
            contents.length ? contents.wrapAll(dom) : self.append(dom);
          })
        },
        unwrap: function(){
          this.parent().each(function(){
            $(this).replaceWith($(this).children());
          });
          return this
        },
        clone: function(){
          return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
          return this.css("display", "none")
        },
        toggle: function(setting){
          return this.each(function(){
            var el = $(this);(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
          })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
          return 0 in arguments ?
            this.each(function(idx){
              var originHtml = this.innerHTML;
              $(this).empty().append( funcArg(this, html, idx, originHtml) );
            }) :
            (0 in this ? this[0].innerHTML : null)
        },
        text: function(text){
          return 0 in arguments ?
            this.each(function(idx){
              var newText = funcArg(this, text, idx, this.textContent);
              this.textContent = newText == null ? '' : ''+newText;
            }) :
            (0 in this ? this.pluck('textContent').join("") : null)
        },
        attr: function(name, value){
          var result;
          return (typeof name == 'string' && !(1 in arguments)) ?
            (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
            this.each(function(idx){
              if (this.nodeType !== 1) return
              if (isObject(name)) for (key in name) setAttribute(this, key, name[key]);
              else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
            })
        },
        removeAttr: function(name){
          return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
            setAttribute(this, attribute);
          }, this);})
        },
        prop: function(name, value){
          name = propMap[name] || name;
          return (1 in arguments) ?
            this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name]);
            }) :
            (this[0] && this[0][name])
        },
        removeProp: function(name){
          name = propMap[name] || name;
          return this.each(function(){ delete this[name]; })
        },
        data: function(name, value){
          var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();
          var data = (1 in arguments) ?
            this.attr(attrName, value) :
            this.attr(attrName);
          return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
          if (0 in arguments) {
            if (value == null) value = "";
            return this.each(function(idx){
              this.value = funcArg(this, value, idx, this.value);
            })
          } else {
            return this[0] && (this[0].multiple ?
                $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
                this[0].value)
          }
        },
        offset: function(coordinates){
          if (coordinates) return this.each(function(index){
            var $this = $(this),
              coords = funcArg(this, coordinates, index, $this.offset()),
              parentOffset = $this.offsetParent().offset(),
              props = {
                top:  coords.top  - parentOffset.top,
                left: coords.left - parentOffset.left
              };
            if ($this.css('position') == 'static') props['position'] = 'relative';
            $this.css(props);
          })
          if (!this.length) return null
          if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
            return {top: 0, left: 0}
          var obj = this[0].getBoundingClientRect();
          return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          }
        },
        css: function(property, value){
          if (arguments.length < 2) {
            var element = this[0];
            if (typeof property == 'string') {
              if (!element) return
              return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
            } else if (isArray(property)) {
              if (!element) return
              var props = {};
              var computedStyle = getComputedStyle(element, '');
              $.each(property, function(_, prop){
                props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));
              });
              return props
            }
          }
          var css = '';
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)); });
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value);
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)); });
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
          }
          return this.each(function(){ this.style.cssText += ';' + css; })
        },
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
          if (!name) return false
          return emptyArray.some.call(this, function(el){
            return this.test(className(el))
          }, classRE(name))
        },
        addClass: function(name){
          if (!name) return this
          return this.each(function(idx){
            if (!('className' in this)) return
            classList = [];
            var cls = className(this), newName = funcArg(this, name, idx, cls);
            newName.split(/\s+/g).forEach(function(klass){
              if (!$(this).hasClass(klass)) classList.push(klass);
            }, this);
            classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
          })
        },
        removeClass: function(name){
          return this.each(function(idx){
            if (!('className' in this)) return
            if (name === undefined) return className(this, '')
            classList = className(this);
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
              classList = classList.replace(classRE(klass), " ");
            });
            className(this, classList.trim());
          })
        },
        toggleClass: function(name, when){
          if (!name) return this
          return this.each(function(idx){
            var $this = $(this), names = funcArg(this, name, idx, className(this));
            names.split(/\s+/g).forEach(function(klass){
              (when === undefined ? !$this.hasClass(klass) : when) ?
                $this.addClass(klass) : $this.removeClass(klass);
            });
          })
        },
        scrollTop: function(value){
          if (!this.length) return
          var hasScrollTop = 'scrollTop' in this[0];
          if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
          return this.each(hasScrollTop ?
            function(){ this.scrollTop = value; } :
            function(){ this.scrollTo(this.scrollX, value); })
        },
        scrollLeft: function(value){
          if (!this.length) return
          var hasScrollLeft = 'scrollLeft' in this[0];
          if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
          return this.each(hasScrollLeft ?
            function(){ this.scrollLeft = value; } :
            function(){ this.scrollTo(value, this.scrollY); })
        },
        position: function() {
          if (!this.length) return
          var elem = this[0],
            offsetParent = this.offsetParent(),
            offset       = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();
          offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0;
          offset.left -= parseFloat( $(elem).css('margin-left') ) || 0;
          parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0;
          parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0;
          return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
          }
        },
        offsetParent: function() {
          return this.map(function(){
            var parent = this.offsetParent || document.body;
            while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
              parent = parent.offsetParent;
            return parent
          })
        }
      };
      $.fn.detach = $.fn.remove
      ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
          dimension.replace(/./, function(m){ return m[0].toUpperCase() });
        $.fn[dimension] = function(value){
          var offset, el = this[0];
          if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
            isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
          else return this.each(function(idx){
            el = $(this);
            el.css(dimension, funcArg(this, value, idx, el[dimension]()));
          })
        };
      });
      function traverseNode(node, fun) {
        fun(node);
        for (var i = 0, len = node.childNodes.length; i < len; i++)
          traverseNode(node.childNodes[i], fun);
      }
      adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2;
        $.fn[operator] = function(){
          var argType, nodes = $.map(arguments, function(arg) {
              var arr = [];
              argType = type(arg);
              if (argType == "array") {
                arg.forEach(function(el) {
                  if (el.nodeType !== undefined) return arr.push(el)
                  else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
                  arr = arr.concat(zepto.fragment(el));
                });
                return arr
              }
              return argType == "object" || arg == null ?
                arg : zepto.fragment(arg)
            }),
            parent, copyByClone = this.length > 1;
          if (nodes.length < 1) return this
          return this.each(function(_, target){
            parent = inside ? target : target.parentNode;
            target = operatorIndex == 0 ? target.nextSibling :
              operatorIndex == 1 ? target.firstChild :
                operatorIndex == 2 ? target :
                  null;
            var parentInDocument = $.contains(document.documentElement, parent);
            nodes.forEach(function(node){
              if (copyByClone) node = node.cloneNode(true);
              else if (!parent) return $(node).remove()
              parent.insertBefore(node, target);
              if (parentInDocument) traverseNode(node, function(el){
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                  (!el.type || el.type === 'text/javascript') && !el.src){
                  var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
                  target['eval'].call(target, el.innerHTML);
                }
              });
            });
          })
        };
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
          $(html)[operator](this);
          return this
        };
      });
      zepto.Z.prototype = Z.prototype = $.fn;
      zepto.uniq = uniq;
      zepto.deserializeValue = deserializeValue;
      $.zepto = zepto;
      return $
    })();(function($){
    var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
    function zid(element) {
      return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
      event = parse(event);
      if (event.ns) var matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function(handler) {
        return handler
          && (!event.e  || handler.e == event.e)
          && (!event.ns || matcher.test(handler.ns))
          && (!fn       || zid(handler.fn) === zid(fn))
          && (!selector || handler.sel == selector)
      })
    }
    function parse(event) {
      var parts = ('' + event).split('.');
      return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }
    function matcherFor(ns) {
      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }
    function eventCapture(handler, captureSetting) {
      return handler.del &&
        (!focusinSupported && (handler.e in focus)) ||
        !!captureSetting
    }
    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type]) || type
    }
    function add(element, events, fn, data, selector, delegator, capture){
      var id = zid(element), set = (handlers[id] || (handlers[id] = []));
      events.split(/\s/).forEach(function(event){
        if (event == 'ready') return $(document).ready(fn)
        var handler   = parse(event);
        handler.fn    = fn;
        handler.sel   = selector;
        if (handler.e in hover) fn = function(e){
          var related = e.relatedTarget;
          if (!related || (related !== this && !$.contains(this, related)))
            return handler.fn.apply(this, arguments)
        };
        handler.del   = delegator;
        var callback  = delegator || fn;
        handler.proxy = function(e){
          e = compatible(e);
          if (e.isImmediatePropagationStopped()) return
          e.data = data;
          var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
          if (result === false) e.preventDefault(), e.stopPropagation();
          return result
        };
        handler.i = set.length;
        set.push(handler);
        if ('addEventListener' in element)
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    }
    function remove(element, events, fn, selector, capture){
      var id = zid(element);(events || '').split(/\s/).forEach(function(event){
        findHandlers(element, event, fn, selector).forEach(function(handler){
          delete handlers[id][handler.i];
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        });
      });
    }
    $.event = { add: add, remove: remove };
    $.proxy = function(fn, context) {
      var args = (2 in arguments) && slice.call(arguments, 2);
      if (isFunction(fn)) {
        var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) };
        proxyFn._zid = zid(fn);
        return proxyFn
      } else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn);
          return $.proxy.apply(null, args)
        } else {
          return $.proxy(fn[context], fn)
        }
      } else {
        throw new TypeError("expected function")
      }
    };
    $.fn.bind = function(event, data, callback){
      return this.on(event, data, callback)
    };
    $.fn.unbind = function(event, callback){
      return this.off(event, callback)
    };
    $.fn.one = function(event, selector, data, callback){
      return this.on(event, selector, data, callback, 1)
    };
    var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      };
    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event);
        $.each(eventMethods, function(name, predicate) {
          var sourceMethod = source[name];
          event[name] = function(){
            this[predicate] = returnTrue;
            return sourceMethod && sourceMethod.apply(source, arguments)
          };
          event[predicate] = returnFalse;
        });
        try {
          event.timeStamp || (event.timeStamp = Date.now());
        } catch (ignored) { }
        if (source.defaultPrevented !== undefined ? source.defaultPrevented :
            'returnValue' in source ? source.returnValue === false :
            source.getPreventDefault && source.getPreventDefault())
          event.isDefaultPrevented = returnTrue;
      }
      return event
    }
    function createProxy(event) {
      var key, proxy = { originalEvent: event };
      for (key in event)
        if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
      return compatible(proxy, event)
    }
    $.fn.delegate = function(selector, event, callback){
      return this.on(event, selector, callback)
    };
    $.fn.undelegate = function(selector, event, callback){
      return this.off(event, selector, callback)
    };
    $.fn.live = function(event, callback){
      $(document.body).delegate(this.selector, event, callback);
      return this
    };
    $.fn.die = function(event, callback){
      $(document.body).undelegate(this.selector, event, callback);
      return this
    };
    $.fn.on = function(event, selector, data, callback, one){
      var autoRemove, delegator, $this = this;
      if (event && !isString(event)) {
        $.each(event, function(type, fn){
          $this.on(type, selector, data, fn, one);
        });
        return $this
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = data, data = selector, selector = undefined;
      if (callback === undefined || data === false)
        callback = data, data = undefined;
      if (callback === false) callback = returnFalse;
      return $this.each(function(_, element){
        if (one) autoRemove = function(e){
          remove(element, e.type, callback);
          return callback.apply(this, arguments)
        };
        if (selector) delegator = function(e){
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element});
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
          }
        };
        add(element, event, callback, data, selector, delegator || autoRemove);
      })
    };
    $.fn.off = function(event, selector, callback){
      var $this = this;
      if (event && !isString(event)) {
        $.each(event, function(type, fn){
          $this.off(type, selector, fn);
        });
        return $this
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = selector, selector = undefined;
      if (callback === false) callback = returnFalse;
      return $this.each(function(){
        remove(this, event, callback, selector);
      })
    };
    $.fn.trigger = function(event, args){
      event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event);
      event._args = args;
      return this.each(function(){
        if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
        else if ('dispatchEvent' in this) this.dispatchEvent(event);
        else $(this).triggerHandler(event, args);
      })
    };
    $.fn.triggerHandler = function(event, args){
      var e, result;
      this.each(function(i, element){
        e = createProxy(isString(event) ? $.Event(event) : event);
        e._args = args;
        e.target = element;
        $.each(findHandlers(element, event.type || event), function(i, handler){
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false
        });
      });
      return result
    }
    ;('focusin focusout focus blur load resize scroll unload click dblclick '+
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
    'change select keydown keypress keyup error').split(' ').forEach(function(event) {
      $.fn[event] = function(callback) {
        return (0 in arguments) ?
          this.bind(event, callback) :
          this.trigger(event)
      };
    });
    $.Event = function(type, props) {
      if (!isString(type)) props = type, type = props.type;
      var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
      if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
      event.initEvent(type, bubbles, true);
      return compatible(event)
    };
  })(Zepto)
  ;(function($){
    var jsonpID = +new Date(),
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a');
    originAnchor.href = window.location.href;
    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName);
      $(context).trigger(event, data);
      return !event.isDefaultPrevented()
    }
    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }
    $.active = 0;
    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
    }
    function ajaxStop(settings) {
      if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop');
    }
    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context;
      if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
        return false
      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
    }
    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context, status = 'success';
      settings.success.call(context, data, status, xhr);
      if (deferred) deferred.resolveWith(context, [data, status, xhr]);
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
      ajaxComplete(status, xhr, settings);
    }
    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error);
      if (deferred) deferred.rejectWith(context, [xhr, type, error]);
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
      ajaxComplete(type, xhr, settings);
    }
    function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
      ajaxStop(settings);
    }
    function ajaxDataFilter(data, type, settings) {
      if (settings.dataFilter == empty) return data
      var context = settings.context;
      return settings.dataFilter.call(context, data, type)
    }
    function empty() {}
    function ajaxScript(options, deferred){
      if (!('type' in options)) return $.ajax(options)
      var script = document.createElement('script'),
        abort = function(errorType) {
          $(script).triggerHandler('error', errorType || 'abort');
        },
        xhr = { abort: abort }, abortTimeout;
      if (deferred) deferred.promise(xhr);
      $(script).on('load error', function(e, errorType){
        clearTimeout(abortTimeout);
        $(script).off().remove();
        if (e.type == 'error') {
          ajaxError(null, errorType || 'error', xhr, options, deferred);
        } else {
          ajaxSuccess(null, xhr, options, deferred);
        }
      });
      if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort');
        return xhr
      }
      script.src = options.url;
      document.head.appendChild(script);
      if (options.timeout > 0) abortTimeout = setTimeout(function(){
        abort('timeout');
      }, options.timeout);
      return xhr
    }
    $.ajaxJSONP = function(options, deferred){
      if (!('type' in options)) return $.ajax(options)
      var _callbackName = options.jsonpCallback,
        callbackName = ($.isFunction(_callbackName) ?
            _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
        script = document.createElement('script'),
        originalCallback = window[callbackName],
        responseData,
        abort = function(errorType) {
          $(script).triggerHandler('error', errorType || 'abort');
        },
        xhr = { abort: abort }, abortTimeout;
      if (deferred) deferred.promise(xhr);
      $(script).on('load error', function(e, errorType){
        clearTimeout(abortTimeout);
        $(script).off().remove();
        if (e.type == 'error' || !responseData) {
          ajaxError(null, errorType || 'error', xhr, options, deferred);
        } else {
          ajaxSuccess(responseData[0], xhr, options, deferred);
        }
        window[callbackName] = originalCallback;
        if (responseData && $.isFunction(originalCallback))
          originalCallback(responseData[0]);
        originalCallback = responseData = undefined;
      });
      if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort');
        return xhr
      }
      window[callbackName] = function(){
        responseData = arguments;
      };
      script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
      document.head.appendChild(script);
      if (options.timeout > 0) abortTimeout = setTimeout(function(){
        abort('timeout');
      }, options.timeout);
      return xhr
    };
    $.ajaxSettings = {
      type: 'GET',
      beforeSend: empty,
      success: empty,
      error: empty,
      complete: empty,
      context: null,
      global: true,
      xhr: function () {
        return new window.XMLHttpRequest()
      },
      accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json:   jsonType,
        xml:    'application/xml, text/xml',
        html:   htmlType,
        text:   'text/plain'
      },
      crossDomain: false,
      timeout: 0,
      processData: true,
      cache: true,
      dataFilter: empty
    };
    function mimeToDataType(mime) {
      if (mime) mime = mime.split(';', 2)[0];
      return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
            scriptTypeRE.test(mime) ? 'script' :
            xmlTypeRE.test(mime) && 'xml' ) || 'text'
    }
    function appendQuery(url, query) {
      if (query == '') return url
      return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }
    function serializeData(options) {
      if (options.processData && options.data && $.type(options.data) != "string")
        options.data = $.param(options.data, options.traditional);
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
        options.url = appendQuery(options.url, options.data), options.data = undefined;
    }
    $.ajax = function(options){
      var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex;
      for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
      ajaxStart(settings);
      if (!settings.crossDomain) {
        urlAnchor = document.createElement('a');
        urlAnchor.href = settings.url;
        urlAnchor.href = urlAnchor.href;
        settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host);
      }
      if (!settings.url) settings.url = window.location.toString();
      if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
      serializeData(settings);
      var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url);
      if (hasPlaceholder) dataType = 'jsonp';
      if (settings.cache === false || (
          (!options || options.cache !== true) &&
          ('script' == dataType || 'jsonp' == dataType)
        ))
        settings.url = appendQuery(settings.url, '_=' + Date.now());
      if ('jsonp' == dataType) {
        if (!hasPlaceholder)
          settings.url = appendQuery(settings.url,
            settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
        return $.ajaxJSONP(settings, deferred)
      }
      if (settings.crossDomain && 'script' == dataType) {
        return ajaxScript(settings, deferred)
      }
      var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value]; },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout;
      if (deferred) deferred.promise(xhr);
      if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
      setHeader('Accept', mime || '*/*');
      if (mime = settings.mimeType || mime) {
        if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
        xhr.overrideMimeType && xhr.overrideMimeType(mime);
      }
      if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
      if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name]);
      xhr.setRequestHeader = setHeader;
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;
          clearTimeout(abortTimeout);
          var result, error = false;
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
            if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
              result = xhr.response;
            else {
              result = xhr.responseText;
              try {
                result = ajaxDataFilter(result, dataType, settings);
                if (dataType == 'script')    (1,eval)(result);
                else if (dataType == 'xml')  result = xhr.responseXML;
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
              } catch (e) { error = e; }
              if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
            }
            ajaxSuccess(result, xhr, settings, deferred);
          } else {
            ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
          }
        }
      };
      if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort();
        ajaxError(null, 'abort', xhr, settings, deferred);
        return xhr
      }
      var async = 'async' in settings ? settings.async : true;
      xhr.open(settings.type, settings.url, async, settings.username, settings.password);
      if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];
      for (name in headers) nativeSetHeader.apply(xhr, headers[name]);
      if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings, deferred);
      }, settings.timeout);
      xhr.send(settings.data ? settings.data : null);
      return xhr
    };
    function parseArguments(url, data, success, dataType) {
      if ($.isFunction(data)) dataType = success, success = data, data = undefined;
      if (!$.isFunction(success)) dataType = success, success = undefined;
      return {
        url: url
        , data: data
        , success: success
        , dataType: dataType
      }
    }
    $.get = function(                                  ){
      return $.ajax(parseArguments.apply(null, arguments))
    };
    $.post = function(                                  ){
      var options = parseArguments.apply(null, arguments);
      options.type = 'POST';
      return $.ajax(options)
    };
    $.getJSON = function(                        ){
      var options = parseArguments.apply(null, arguments);
      options.dataType = 'json';
      return $.ajax(options)
    };
    $.fn.load = function(url, data, success){
      if (!this.length) return this
      var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success;
      if (parts.length > 1) options.url = parts[0], selector = parts[1];
      options.success = function(response){
        self.html(selector ?
          $('<div>').html(response.replace(rscript, "")).find(selector)
          : response);
        callback && callback.apply(self, arguments);
      };
      $.ajax(options);
      return this
    };
    var escape = encodeURIComponent;
    function serialize(params, obj, traditional, scope){
      var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
      $.each(obj, function(key, value) {
        type = $.type(value);
        if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
        if (!scope && array) params.add(value.name, value.value);
        else if (type == "array" || (!traditional && type == "object"))
          serialize(params, value, traditional, key);
        else params.add(key, value);
      });
    }
    $.param = function(obj, traditional){
      var params = [];
      params.add = function(key, value) {
        if ($.isFunction(value)) value = value();
        if (value == null) value = "";
        this.push(escape(key) + '=' + escape(value));
      };
      serialize(params, obj, traditional);
      return params.join('&').replace(/%20/g, '+')
    };
  })(Zepto)
  ;(function($){
    $.fn.serializeArray = function() {
      var name, type, result = [],
        add = function(value) {
          if (value.forEach) return value.forEach(add)
          result.push({ name: name, value: value });
        };
      if (this[0]) $.each(this[0].elements, function(_, field){
        type = field.type, name = field.name;
        if (name && field.nodeName.toLowerCase() != 'fieldset' &&
          !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
          ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val());
      });
      return result
    };
    $.fn.serialize = function(){
      var result = [];
      this.serializeArray().forEach(function(elm){
        result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
      });
      return result.join('&')
    };
    $.fn.submit = function(callback) {
      if (0 in arguments) this.bind('submit', callback);
      else if (this.length) {
        var event = $.Event('submit');
        this.eq(0).trigger(event);
        if (!event.isDefaultPrevented()) this.get(0).submit();
      }
      return this
    };
  })(Zepto)
  ;(function(){
    try {
      getComputedStyle(undefined);
    } catch(e) {
      var nativeGetComputedStyle = getComputedStyle;
      window.getComputedStyle = function(element, pseudoElement){
        try {
          return nativeGetComputedStyle(element, pseudoElement)
        } catch(e) {
          return null
        }
      };
    }
  })()
  ;(function($){
    var zepto = $.zepto,
      oldQsa = zepto.qsa,
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date());
    zepto.qsa = function(node, selector) {
      var sel = selector,
        nodes,
        taggedParent;
      try {
        if (!sel) sel = '*';
        else if (childRe.test(sel))
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel;
        nodes = oldQsa(node, sel);
      } catch(e) {
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag);
      }
      return nodes
    };
  })(Zepto);
  return Zepto
}(window));

var $ = index;

function isString(value) {
    return $.type(value) === 'string';
}
function isNotBlank(value) {
    return isString(value) && $.trim(value).length > 0;
}
function isBlank(value) {
    return !isString(value) || value.length === 0;
}

function isNumber(value) {
    return $.type(value) === 'number';
}
function isUndefined(value) {
    return $.type(value) === 'undefined';
}
function isArray(value) {
    return $.isArray(value);
}
function isFunction(value) {
    return $.isFunction(value);
}
function isNull(value) {
    return $.type(value) === 'null';
}
function isEmptyObject(value) {
    return $.isEmptyObject(value);
}
function isObject(value) {
    return $.type(value) === 'object';
}
function isElement(object) {
    return object && object.nodeType === 1 && $.type(object) === 'object' && !$.isPlainObject(object);
}

function isEmptyArray(array) {
    return !(isArray(array) && array.length > 0);
}

var DELIVERY_DISABLED = 'Adobe Target content delivery is disabled. Ensure that you can save cookies to your current domain, there is no "mboxDisable" cookie and there is no "mboxDisable" parameter in query string.';
var DELIVERY_DISABLED_NONSTANDARD = 'Adobe Target content delivery is disabled. Update your DOCTYPE to support Standards mode.';
var ALREADY_INITIALIZED = 'Adobe Target has already been initialized.';
var OPTIONS_REQUIRED = 'options argument is required';
var MBOX_REQUIRED = 'mbox option is required';
var MBOX_TOO_LONG = 'mbox option is too long';
var SUCCESS_REQUIRED = 'success option is required';
var ERROR_REQUIRED = 'error option is required';
var OPTOUT = 'Disabled due to optout';
var OFFER_REQUIRED = 'offer option is required';

var MISSING_SELECTORS = 'Actions with missing selectors';
var UNEXPECTED_ERROR = 'Unexpected error';
var ACTIONS_TO_BE_RENDERED = 'actions to be rendered';
var REQUEST_FAILED = 'request failed';
var ACTIONS_RENDERED = 'All actions rendered successfully';
var ACTION_RENDERED = 'Action rendered successfully';
var ACTION_RENDERING = 'Rendering action';
var EMPTY_CONTENT = 'Action has no content';
var EMPTY_ATTRIBUTE = 'Action has no attribute or value';
var EMPTY_PROPERTY = 'Action has no property or value';
var EMPTY_SIZES = 'Action has no height or width';
var EMPTY_COORDINATES = 'Action has no left, top or position';
var EMPTY_REARRANGE = 'Action has no from or to';
var EMPTY_URL = 'Action has no url';
var EMPTY_CLICK_TRACK_ID = 'Action has no click track ID';
var REARRANGE_MISSING = 'Rearrange elements are missing';
var LOADING_IMAGE = 'Loading image';
var TRACK_EVENT_SUCCESS = 'Track event request succeeded';
var TRACK_EVENT_ERROR = 'Track event request failed';
var MBOX_CONTAINER_NOT_FOUND = 'Mbox container not found';
var RENDERING_MBOX = 'Rendering mbox';
var RENDERING_MBOX_FAILED = 'Rendering mbox failed';
var MBOX_DEFINE_ID_MISSING = 'ID is missing';
var NO_ACTIONS = 'No actions to be rendered';
var REDIRECT_ACTION = 'Redirect action';
var FORCE_HEAD = 'default to HEAD';
var CURRENT_SCRIPT_MISSING = 'document.currentScript is missing or not supported';
var HTML_HEAD_EXECUTION = 'executing from HTML HEAD';
var REMOTE_SCRIPT = 'Script load';
var ERROR_UNKNOWN = 'unknown error';

function getMessage(error) {
    if (isObject(error) && isNotBlank(error.error)) {
        return error.error;
    }
    if (!isUndefined(error) && !isNull(error) && isNotBlank(error.message)) {
        return error.message;
    }
    if (isNotBlank(error)) {
        return error;
    }
    return ERROR_UNKNOWN;
}

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
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}
		return true;
	} catch (err) {
		return false;
	}
}
var index$5 = shouldUseNative() ? Object.assign : function (target, source) {
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

var objectAssign = index$5;
function parserForArrayFormat(opts) {
	var result;
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);
				key = key.replace(/\[\d*\]$/, '');
				if (!result) {
					accumulator[key] = value;
					return;
				}
				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}
				accumulator[key][result[1]] = value;
			};
		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');
				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}
				accumulator[key] = [].concat(accumulator[key], value);
			};
		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}
				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}
function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}
	return input;
}
var parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);
	var formatter = parserForArrayFormat(opts);
	var ret = Object.create(null);
	if (typeof str !== 'string') {
		return ret;
	}
	str = str.trim().replace(/^(\?|#|&)/, '');
	if (!str) {
		return ret;
	}
	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;
		val = val === undefined ? null : decodeURIComponent(val);
		formatter(decodeURIComponent(key), val, ret);
	});
	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}
		return result;
	}, Object.create(null));
};

function encode(value) {
    try {
        return encodeURIComponent(value);
    }
    catch (e) {
        return value;
    }
}
function decode(value) {
    try {
        return decodeURIComponent(value);
    }
    catch (e) {
        return value;
    }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function stringifyAttribute(name, value) {
    if (!value) {
        return '';
    }
    var stringified = '; ' + name;
    if (value === true) {
        return stringified;
    }
    return stringified + '=' + value;
}
function stringifyAttributes(attributes) {
    if (typeof attributes.expires === 'number') {
        var expires = new Date();
        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
        attributes.expires = expires;
    }
    return stringifyAttribute('Expires', attributes.expires ? attributes.expires.toUTCString() : '')
        + stringifyAttribute('Domain', attributes.domain)
        + stringifyAttribute('Path', attributes.path)
        + stringifyAttribute('Secure', attributes.secure);
}
function encode$2(name, value, attributes) {
    return encodeURIComponent(name)
        .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
        .replace(/\(/g, '%28').replace(/\)/g, '%29')
        + '=' + encodeURIComponent(value)
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
        + stringifyAttributes(attributes);
}
function parse$1(cookieString) {
    var result = {};
    var cookies = cookieString ? cookieString.split('; ') : [];
    var rdecode = /(%[0-9A-Z]{2})+/g;
    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');
        if (cookie.charAt(0) === '"') {
            cookie = cookie.slice(1, -1);
        }
        try {
            var name_1 = parts[0].replace(rdecode, decodeURIComponent);
            result[name_1] = cookie.replace(rdecode, decodeURIComponent);
        }
        catch (e) {
        }
    }
    return result;
}
function getAll() {
    return parse$1(document.cookie);
}
function get(name) {
    return getAll()[name];
}
var get_1 = get;
function set(name, value, attributes) {
    document.cookie = encode$2(name, value, __assign({ path: '/' }, attributes));
}
var set_1 = set;
function remove(name, attributes) {
    set(name, '', __assign({}, attributes, { expires: -1 }));
}
var remove_1 = remove;

var getCookie = get_1;
var setCookie = set_1;
var removeCookie = remove_1;
function getCookieDomain(domain) {
    var parts = domain.split('.').reverse();
    var len = parts.length;
    if (len >= 3) {
        if (parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|info|biz)$/i)) {
            return parts[2] + '.' + parts[1] + '.' + parts[0];
        }
    }
    if (len === 1) {
        return parts[0];
    }
    return parts[1] + '.' + parts[0];
}

var DEBUG = 'mboxDebug';
var DISABLE = 'mboxDisable';
var AUTHORING = 'mboxEdit';
var MBOX_LENGTH = 250;
var DATA_SRC = 'data-at-src';
var DATA_MBOX_NAME = 'data-at-mbox-name';
var CLICKED_SUFFIX = '-clicked';
var MBOX_CSS_CLASS = 'mboxDefault';
var MBOX_NAME_CLASS_PREFIX = 'mbox-name-';

var CHECK_COOKIE = 'check';
var MASTER_COOKIE = 'mbox';
var DEVICE_ID_COOKIE = 'PC';
var SESSION_ID_COOKIE = 'session';
var EDGE_CLUSTER_COOKIE = 'mboxEdgeCluster';
var DEBUG_COOKIE = DEBUG;
var DISABLE_COOKIE = DISABLE;
var AUTHORING_COOKIE = AUTHORING;

var DEBUG_PARAM = DEBUG;
var DISABLE_PARAM = DISABLE;
var AUTHORING_PARAM = AUTHORING;

var TRUE = 'true';
function isCookieEnabled() {
    setCookie(CHECK_COOKIE, TRUE, { domain: COOKIE_DOMAIN });
    var result = getCookie(CHECK_COOKIE) === TRUE;
    removeCookie(CHECK_COOKIE);
    return result;
}
function isDeliveryDisabled() {
    var cookie = getCookie(DISABLE_COOKIE);
    var params = parse(LOCATION.search);
    return isNotBlank(cookie) || isNotBlank(params[DISABLE_PARAM]);
}
function isDeliveryEnabled() {
    return ENABLED && isCookieEnabled() && !isDeliveryDisabled();
}
function isDebugEnabled() {
    var cookie = getCookie(DEBUG_COOKIE);
    var params = parse(LOCATION.search);
    return isNotBlank(cookie) || isNotBlank(params[DEBUG_PARAM]);
}
function isAuthoringEnabled() {
    var cookie = getCookie(AUTHORING_COOKIE);
    var params = parse(LOCATION.search);
    return isNotBlank(cookie) || isNotBlank(params[AUTHORING_PARAM]);
}

var ADOBE_TARGET_PREFIX = 'AT:';
function logWarn() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    console.warn.apply(console, [].concat.apply([ADOBE_TARGET_PREFIX], params));
}
function logDebug() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    if (isDebugEnabled()) {
        console.log.apply(console, [].concat.apply([ADOBE_TARGET_PREFIX], params));
    }
}

function createSuccess() {
    var result = {};
    result.valid = true;
    return result;
}
function createError(error) {
    var result = {};
    result.valid = false;
    result.error = error;
    return result;
}
function validateMbox(mbox) {
    if (isBlank(mbox)) {
        return createError(MBOX_REQUIRED);
    }
    if (mbox.length > MBOX_LENGTH) {
        return createError(MBOX_TOO_LONG);
    }
    return createSuccess();
}
function validateGetOfferOptions(options) {
    if (!isObject(options)) {
        return createError(OPTIONS_REQUIRED);
    }
    var mbox = options.mbox;
    var mboxValidation = validateMbox(mbox);
    if (!mboxValidation.valid) {
        return mboxValidation;
    }
    if (!isFunction(options.success)) {
        return createError(SUCCESS_REQUIRED);
    }
    if (!isFunction(options.error)) {
        return createError(ERROR_REQUIRED);
    }
    return createSuccess();
}
function validateApplyOfferOptions(options) {
    if (!isObject(options)) {
        return createError(OPTIONS_REQUIRED);
    }
    var offer = options.offer;
    if (!isArray(offer)) {
        return createError(OFFER_REQUIRED);
    }
    return createSuccess();
}
function validateTrackEventOptions(options) {
    if (!isObject(options)) {
        return createError(OPTIONS_REQUIRED);
    }
    var mbox = options.mbox;
    var mboxValidation = validateMbox(mbox);
    if (!mboxValidation.valid) {
        return mboxValidation;
    }
    return createSuccess();
}

function inArray(key, keys) {
    return keys.indexOf(key) !== -1;
}
function keys(object) {
    if ($.isEmptyObject(object)) {
        return [];
    }
    return Object.keys(object);
}
function map(func, array) {
    return $.map(array, func);
}
function filter(func, array) {
    return $.grep(array, func);
}
function flatten(array) {
    return [].concat.apply([], array);
}
function forEach(func, array) {
    $.each(array, function (key, value) {
        func(value, key);
        return true;
    });
}
function merge(base, override) {
    var result = {};
    forEach(function (value, key) { return result[key] = value; }, base);
    forEach(function (value, key) { return result[key] = value; }, override);
    return result;
}
function mergeWithoutKeys(base, override, ignoredKeys) {
    var result = merge({}, base);
    var mergingKeys = keys(override).filter(function (key) { return !inArray(key, ignoredKeys); });
    forEach(function (key) { return result[key] = override[key]; }, mergingKeys);
    return result;
}
function first(arr) {
    return $.isArray(arr) && arr.length > 0 ? arr[0] : null;
}
function some(predicate, arr) {
    var index = -1;
    var length = arr == null ? 0 : arr.length;
    while (++index < length) {
        if (predicate(arr[index], index, arr)) {
            return true;
        }
    }
    return false;
}

var EMPTY$1 = '';
var EQUAL = '=';
var QUESTION_MARK = '?';
var AMPERSAND = '&';
var DOT = '.';
var HASH = '#';
var PIPE = '|';
var UNDERSCORE = '_';
var COMMA = ',';
function trim(value) {
    return $.trim(value);
}

var HEAD = 'head';
var SCRIPT = 'script';
var STYLE = 'style';
var LINK = 'link';
var IMAGE = 'img';
var DIV = 'div';
var ANCHOR = 'a';
var FORM = 'form';

var EQ_START = ':eq(';
var EQ_END = ')';
var EQ_LENGTH = EQ_START.length;
var DIGIT_IN_SELECTOR_PATTERN = /((\.|#)\d{1})/g;
function createPair(match) {
    return {
        key: match,
        val: match.charAt(0) + '\\3' + match.charAt(1) + ' '
    };
}
function escapeDigitsInSelector(selector) {
    var matches = selector.match(DIGIT_IN_SELECTOR_PATTERN);
    if (isEmptyArray(matches)) {
        return selector;
    }
    var pairs = map(createPair, matches);
    var result = selector;
    forEach(function (pair) {
        result = result.replace(pair.key, pair.val);
    }, pairs);
    return result;
}
function parseSelector(selector) {
    var result = [];
    var sel = trim(selector);
    var currentIndex = sel.indexOf(EQ_START);
    var head;
    var tail;
    var eq;
    var index;
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
    var elems = $(DOCUMENT);
    forEach(function (part) {
        var sel = part.sel;
        var eq = part.eq;
        elems = elems.find(sel);
        if (isNumber(eq)) {
            elems = elems.eq(eq);
        }
    }, parts);
    return elems;
}
function exists(selector) {
    return select(selector).length > 0;
}
function remove$1(selector) {
    select(selector).remove();
}

function before(selector, content) {
    select(selector).before(content);
}
function fragment(content) {
    return $("<" + DIV + "/>").append(content);
}
function copyAttr(item, from, to) {
    var element = $(item);
    var attr = element.attr(from);
    if (isNotBlank(attr)) {
        element.removeAttr(from);
        element.attr(to, attr);
    }
}
function hasAttr(item, attr) {
    return isNotBlank($(item).attr(attr));
}

var root = createCommonjsModule(function (module, exports) {
"use strict";
exports.root = (typeof window == 'object' && window.window === window && window
    || typeof self == 'object' && self.self === self && self
    || typeof commonjsGlobal == 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal);
if (!exports.root) {
    throw new Error('RxJS could not find any global context (window, self, global)');
}
});

function isFunction$1(x) {
    return typeof x === 'function';
}
var isFunction_2 = isFunction$1;
var isFunction_1$1 = {
	isFunction: isFunction_2
};

var isArray_1$1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
var isArray$1 = {
	isArray: isArray_1$1
};

function isObject$1(x) {
    return x != null && typeof x === 'object';
}
var isObject_2 = isObject$1;
var isObject_1$1 = {
	isObject: isObject_2
};

var errorObject_1$2 = { e: {} };
var errorObject = {
	errorObject: errorObject_1$2
};

var errorObject_1$1 = errorObject;
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1$1.errorObject.e = e;
        return errorObject_1$1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
var tryCatch_2 = tryCatch;

var tryCatch_1$1 = {
	tryCatch: tryCatch_2
};

var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UnsubscriptionError = (function (_super) {
    __extends$1(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
var UnsubscriptionError_2 = UnsubscriptionError;
var UnsubscriptionError_1$1 = {
	UnsubscriptionError: UnsubscriptionError_2
};

var isArray_1 = isArray$1;
var isObject_1 = isObject_1$1;
var isFunction_1$3 = isFunction_1$1;
var tryCatch_1 = tryCatch_1$1;
var errorObject_1 = errorObject;
var UnsubscriptionError_1 = UnsubscriptionError_1$1;
var Subscription = (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        while (_parent) {
            _parent.remove(this);
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1$3.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function'                  ) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            this._parent = parent;
        }
        else if (!_parents) {
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
var Subscription_2 = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
var Subscription_1$1 = {
	Subscription: Subscription_2
};

var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
var Observer = {
	empty: empty
};

var root_1$2 = root;
var Symbol = root_1$2.root.Symbol;
var $$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') ?
    Symbol['for']('rxSubscriber') : '@@rxSubscriber';
var rxSubscriber = {
	$$rxSubscriber: $$rxSubscriber
};

var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = isFunction_1$1;
var Subscription_1 = Subscription_1$1;
var Observer_1$1 = Observer;
var rxSubscriber_1$1 = rxSubscriber;
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1$1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1$1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1$1.$$rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
var Subscriber_2 = Subscriber;
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (isFunction_1.isFunction(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
            }
            context.unsubscribe = this.unsubscribe.bind(this);
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._complete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._complete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
var Subscriber_1$1 = {
	Subscriber: Subscriber_2
};

var Subscriber_1 = Subscriber_1$1;
var rxSubscriber_1 = rxSubscriber;
var Observer_1 = Observer;
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
var toSubscriber_2 = toSubscriber;
var toSubscriber_1$1 = {
	toSubscriber: toSubscriber_2
};

var root_1$3 = root;
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
var getSymbolObservable_1 = getSymbolObservable;
var $$observable = getSymbolObservable(root_1$3.root);
var observable = {
	getSymbolObservable: getSymbolObservable_1,
	$$observable: $$observable
};

var root_1 = root;
var toSubscriber_1 = toSubscriber_1$1;
var observable_1 = observable;
var Observable = (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable$$1 = new Observable();
        observable$$1.source = this;
        observable$$1.operator = operator;
        return observable$$1;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var subscription = _this.subscribe(function (value) {
                if (subscription) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    Observable.prototype[observable_1.$$observable] = function () {
        return this;
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
var Observable_2 = Observable;
var Observable_1 = {
	Observable: Observable_2
};

var JSON$1 = 'json';
var JSONP = 'jsonp';
var HTML = 'html';
var SCRIPT$1 = 'script';
var TEXT = 'text';

var ANALYTICS_VISITOR_ID_PARAM = 'mboxMCAVID';
var BLOB_PARAM = 'mboxAAMB';
var LOCATION_HINT_PARAM = 'mboxMCGLH';
var MARKETING_CLOUD_VISITOR_ID_PARAM = 'mboxMCGVID';
var SUPPLEMENTAL_DATA_ID_PARAM = 'mboxMCSDID';
var SCREEN_COLOR_DEPTH = 'colorDepth';
var SCREEN_HEIGHT = 'screenHeight';
var SCREEN_WIDTH = 'screenWidth';
var BROWSER_HEIGHT = 'browserHeight';
var BROWSER_TIME_OFFSET = 'browserTimeOffset';
var BROWSER_WIDTH = 'browserWidth';
var CALLBACK_PARAM = 'mboxCallback';
var CLICK_THROUGH_PARAM = 'mboxTarget';
var CLICK_TRACK_ID_PARAM = 'clickTrackId';
var CROSS_DOMAIN_PARAM = 'mboxXDomain';
var COUNT_PARAM = 'mboxCount';
var HOST_PARAM = 'mboxHost';
var MBOX_PARAM = 'mbox';
var PAGE_ID_PARAM = 'mboxPage';
var SESSION_ID_PARAM = 'mboxSession';
var REFERRER_PARAM = 'mboxReferrer';
var TIME_PARAM = 'mboxTime';
var DEVICE_ID_PARAM = 'mboxPC';
var URL_PARAM = 'mboxURL';
var VERSION_PARAM = 'mboxVersion';

var XHR = 'XMLHttpRequest';
var WITH_CREDENTIALS = 'withCredentials';
function isCorsSupported() {
    return XHR in WINDOW && WITH_CREDENTIALS in new WINDOW[XHR]();
}
function decorateOptions(options) {
    if (options.dataType === SCRIPT$1) {
        options.cache = true;
        return options;
    }
    if (options.dataType !== JSON$1) {
        return options;
    }
    if (isCorsSupported()) {
        var xhrFields = {};
        xhrFields[WITH_CREDENTIALS] = true;
        options.xhrFields = xhrFields;
    }
    else {
        options.dataType = JSONP;
        options.jsonp = CALLBACK_PARAM;
    }
    return options;
}
function ajax$1(request) {
    return Observable_2.create(function (observer) {
        var done = false;
        var options = {
            success: function (data) {
                done = true;
                observer.next({ data: data });
                observer.complete();
            },
            error: function (xhr, status, errorThrown) {
                var error = getMessage(errorThrown || status);
                done = true;
                observer.next({ status: status, error: error });
                observer.complete();
            }
        };
        $.ajaxSettings.global = false;
        var xhr = $.ajax(decorateOptions($.extend(true, options, request)));
        return function () {
            if (!done) {
                xhr.abort();
            }
        };
    });
}

function isPair(pair) {
    return !isEmptyArray(pair) && pair.length === 2 && isNotBlank(trim(pair[0]));
}
function createPair$1(param) {
    var index = param.indexOf(EQUAL);
    if (index === -1) {
        return [];
    }
    return [param.substr(0, index), param.substr(index + 1)];
}
function objectToParamsInternal(obj, keys$$1, result, keyFunc) {
    forEach(function (value, key) {
        if (isObject(value)) {
            keys$$1.push(key);
            objectToParamsInternal(value, keys$$1, result, keyFunc);
            keys$$1.pop();
        }
        else if (isEmptyArray(keys$$1)) {
            result[keyFunc(key)] = value;
        }
        else {
            result[keyFunc(keys$$1.concat(key).join(DOT))] = value;
        }
    }, obj);
}
function arrayToParams(array) {
    var result = {};
    var pairs = [];
    var notBlankParams = filter(isNotBlank, array);
    forEach(function (param) { return pairs.push(createPair$1(param)); }, notBlankParams);
    var validPairs = filter(isPair, pairs);
    forEach(function (pair) { return result[decode(trim(pair[0]))] = decode(trim(pair[1])); }, validPairs);
    return result;
}
function queryStringToParams(queryString) {
    var result = {};
    var params = parse(QUESTION_MARK + queryString);
    forEach(function (value, key) {
        if (isNotBlank(key)) {
            result[key] = value;
        }
    }, params);
    return result;
}
function objectToParams(object, keyFunc) {
    var result = {};
    if (isUndefined(keyFunc)) {
        objectToParamsInternal(object, [], result, identity);
    }
    else {
        objectToParamsInternal(object, [], result, keyFunc);
    }
    return result;
}

var PERFORMANCE = 'performance';
var MARK = 'mark';
var MEASURE = 'measure';
function mark(marker) {
    if (isUndefined(WINDOW[PERFORMANCE])) {
        return;
    }
    if (!isFunction(WINDOW[PERFORMANCE][MARK])) {
        return;
    }
    WINDOW[PERFORMANCE][MARK](marker);
}
function measure(name, startMarker, endMarker) {
    if (isUndefined(WINDOW[PERFORMANCE])) {
        return;
    }
    if (!isFunction(WINDOW[PERFORMANCE][MEASURE])) {
        return;
    }
    WINDOW[PERFORMANCE][MEASURE](name, startMarker, endMarker);
}

var ERROR = 'error';
var WARNING = 'warning';
var DISABLED = 'disabled';
var UNKNOWN = 'unknown';

var MARKER_SHOW_BODY = 'mark_adobe_target_show_body';
var MARKER_HIDE_BODY = 'mark_adobe_target_hide_body';
var MARKER_VISITOR_ID_REQUEST_START = 'mark_adobe_target_visitor_id_start_';
var MARKER_VISITOR_ID_REQUEST_END = 'mark_adobe_target_visitor_id_end_';
var MEASURE_VISITOR_ID_REQUEST = 'measure_adobe_target_visitor_id';
var MARKER_TNT_REQUEST_START = 'mark_adobe_target_request_start_';
var MARKER_TNT_REQUEST_END = 'mark_adobe_target_request_end_';
var MEASURE_TNT_REQUEST = 'measure_adobe_target_request';
var MARKER_TNT_RENDER_START = 'mark_adobe_target_render_start_';
var MARKER_TNT_RENDER_END = 'mark_adobe_target_render_end_';
var MEASURE_TNT_RENDER = 'measure_adobe_target_render';

var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$4 = Observable_1;
var EmptyObservable = (function (_super) {
    __extends$3(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1$4.Observable));
var EmptyObservable_2 = EmptyObservable;
var EmptyObservable_1$1 = {
	EmptyObservable: EmptyObservable_2
};

function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
var isPromise_2 = isPromise;
var isPromise_1$1 = {
	isPromise: isPromise_2
};

var root_1$5 = root;
function symbolIteratorPonyfill(root$$1) {
    var Symbol = root$$1.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        var Set_1 = root$$1.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root$$1.Map;
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
var symbolIteratorPonyfill_1 = symbolIteratorPonyfill;
var $$iterator = symbolIteratorPonyfill(root_1$5.root);
var iterator = {
	symbolIteratorPonyfill: symbolIteratorPonyfill_1,
	$$iterator: $$iterator
};

var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$3 = Subscriber_1$1;
var InnerSubscriber = (function (_super) {
    __extends$4(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1$3.Subscriber));
var InnerSubscriber_2 = InnerSubscriber;
var InnerSubscriber_1$1 = {
	InnerSubscriber: InnerSubscriber_2
};

var root_1$4 = root;
var isArray_1$3 = isArray$1;
var isPromise_1 = isPromise_1$1;
var isObject_1$3 = isObject_1$1;
var Observable_1$5 = Observable_1;
var iterator_1 = iterator;
var InnerSubscriber_1 = InnerSubscriber_1$1;
var observable_1$1 = observable;
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1$5.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            return result.subscribe(destination);
        }
    }
    else if (isArray_1$3.isArray(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            root_1$4.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator_1.$$iterator] === 'function') {
        var iterator$$1 = result[iterator_1.$$iterator]();
        do {
            var item = iterator$$1.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable_1$1.$$observable] === 'function') {
        var obs = result[observable_1$1.$$observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1$3.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
var subscribeToResult_2 = subscribeToResult;
var subscribeToResult_1$1 = {
	subscribeToResult: subscribeToResult_2
};

var __extends$5 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$4 = Subscriber_1$1;
var OuterSubscriber = (function (_super) {
    __extends$5(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1$4.Subscriber));
var OuterSubscriber_2 = OuterSubscriber;
var OuterSubscriber_1$1 = {
	OuterSubscriber: OuterSubscriber_2
};

var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$3 = Observable_1;
var EmptyObservable_1 = EmptyObservable_1$1;
var isArray_1$2 = isArray$1;
var subscribeToResult_1 = subscribeToResult_1$1;
var OuterSubscriber_1 = OuterSubscriber_1$1;
var ForkJoinObservable = (function (_super) {
    __extends$2(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
        _super.call(this);
        this.sources = sources;
        this.resultSelector = resultSelector;
    }
    ForkJoinObservable.create = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i - 0] = arguments[_i];
        }
        if (sources === null || arguments.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        var resultSelector = null;
        if (typeof sources[sources.length - 1] === 'function') {
            resultSelector = sources.pop();
        }
        if (sources.length === 1 && isArray_1$2.isArray(sources[0])) {
            sources = sources[0];
        }
        if (sources.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        return new ForkJoinObservable(sources, resultSelector);
    };
    ForkJoinObservable.prototype._subscribe = function (subscriber) {
        return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
    };
    return ForkJoinObservable;
}(Observable_1$3.Observable));
var ForkJoinObservable_2 = ForkJoinObservable;
var ForkJoinSubscriber = (function (_super) {
    __extends$2(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources, resultSelector) {
        _super.call(this, destination);
        this.sources = sources;
        this.resultSelector = resultSelector;
        this.completed = 0;
        this.haveValues = 0;
        var len = sources.length;
        this.total = len;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            var source = sources[i];
            var innerSubscription = subscribeToResult_1.subscribeToResult(this, source, null, i);
            if (innerSubscription) {
                innerSubscription.outerIndex = i;
                this.add(innerSubscription);
            }
        }
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
        var destination = this.destination;
        var _a = this, haveValues = _a.haveValues, resultSelector = _a.resultSelector, values = _a.values;
        var len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            var value = resultSelector ? resultSelector.apply(this, values) : values;
            destination.next(value);
        }
        destination.complete();
    };
    return ForkJoinSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
var ForkJoinObservable_1$1 = {
	ForkJoinObservable: ForkJoinObservable_2
};

var ForkJoinObservable_1 = ForkJoinObservable_1$1;
var forkJoin_1$1 = ForkJoinObservable_1.ForkJoinObservable.create;
var forkJoin$2 = {
	forkJoin: forkJoin_1$1
};

var Observable_1$2 = Observable_1;
var forkJoin_1 = forkJoin$2;
Observable_1$2.Observable.forkJoin = forkJoin_1.forkJoin;

var __extends$7 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$8 = Observable_1;
var ScalarObservable = (function (_super) {
    __extends$7(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done, value = state.value, subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_1$8.Observable));
var ScalarObservable_2 = ScalarObservable;
var ScalarObservable_1$1 = {
	ScalarObservable: ScalarObservable_2
};

function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
var isScheduler_2 = isScheduler;
var isScheduler_1$1 = {
	isScheduler: isScheduler_2
};

var __extends$6 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$7 = Observable_1;
var ScalarObservable_1 = ScalarObservable_1$1;
var EmptyObservable_1$3 = EmptyObservable_1$1;
var isScheduler_1 = isScheduler_1$1;
var ArrayObservable = (function (_super) {
    __extends$6(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable_1$3.EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1$7.Observable));
var ArrayObservable_2 = ArrayObservable;
var ArrayObservable_1$1 = {
	ArrayObservable: ArrayObservable_2
};

var ArrayObservable_1 = ArrayObservable_1$1;
var of_1$1 = ArrayObservable_1.ArrayObservable.of;
var of$2 = {
	of: of_1$1
};

var Observable_1$6 = Observable_1;
var of_1 = of$2;
Observable_1$6.Observable.of = of_1.of;

var __extends$8 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$10 = Observable_1;
var ErrorObservable = (function (_super) {
    __extends$8(ErrorObservable, _super);
    function ErrorObservable(error, scheduler) {
        _super.call(this);
        this.error = error;
        this.scheduler = scheduler;
    }
    ErrorObservable.create = function (error, scheduler) {
        return new ErrorObservable(error, scheduler);
    };
    ErrorObservable.dispatch = function (arg) {
        var error = arg.error, subscriber = arg.subscriber;
        subscriber.error(error);
    };
    ErrorObservable.prototype._subscribe = function (subscriber) {
        var error = this.error;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ErrorObservable.dispatch, 0, {
                error: error, subscriber: subscriber
            });
        }
        else {
            subscriber.error(error);
        }
    };
    return ErrorObservable;
}(Observable_1$10.Observable));
var ErrorObservable_2 = ErrorObservable;
var ErrorObservable_1$1 = {
	ErrorObservable: ErrorObservable_2
};

var ErrorObservable_1 = ErrorObservable_1$1;
var _throw_1 = ErrorObservable_1.ErrorObservable.create;
var _throw$2 = {
	_throw: _throw_1
};

var Observable_1$9 = Observable_1;
var throw_1 = _throw$2;
Observable_1$9.Observable['throw'] = throw_1._throw;

var __extends$9 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$5 = Subscriber_1$1;
function map$3(project, thisArg) {
    if (typeof project !== 'function') {
        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
}
var map_2 = map$3;
var MapOperator = (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
var MapOperator_1 = MapOperator;
var MapSubscriber = (function (_super) {
    __extends$9(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1$5.Subscriber));
var map_1$1 = {
	map: map_2,
	MapOperator: MapOperator_1
};

var Observable_1$11 = Observable_1;
var map_1 = map_1$1;
Observable_1$11.Observable.prototype.map = map_1.map;

var __extends$10 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var subscribeToResult_1$3 = subscribeToResult_1$1;
var OuterSubscriber_1$3 = OuterSubscriber_1$1;
function mergeMap$2(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
        resultSelector = null;
    }
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
}
var mergeMap_2 = mergeMap$2;
var MergeMapOperator = (function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
}());
var MergeMapOperator_1 = MergeMapOperator;
var MergeMapSubscriber = (function (_super) {
    __extends$10(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult_1$3.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1$3.OuterSubscriber));
var MergeMapSubscriber_1 = MergeMapSubscriber;
var mergeMap_1$1 = {
	mergeMap: mergeMap_2,
	MergeMapOperator: MergeMapOperator_1,
	MergeMapSubscriber: MergeMapSubscriber_1
};

var Observable_1$12 = Observable_1;
var mergeMap_1 = mergeMap_1$1;
Observable_1$12.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
Observable_1$12.Observable.prototype.flatMap = mergeMap_1.mergeMap;

var __extends$13 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1$3 = Subscription_1$1;
var Action = (function (_super) {
    __extends$13(Action, _super);
    function Action(scheduler, work) {
        _super.call(this);
    }
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(Subscription_1$3.Subscription));
var Action_2 = Action;
var Action_1$1 = {
	Action: Action_2
};

var __extends$12 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1$6 = root;
var Action_1 = Action_1$1;
var AsyncAction = (function (_super) {
    __extends$12(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        this.state = state;
        this.pending = true;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return root_1$6.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay !== null && this.delay === delay) {
            return id;
        }
        return root_1$6.root.clearInterval(id) && undefined || undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.delay = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
    };
    return AsyncAction;
}(Action_1.Action));
var AsyncAction_2 = AsyncAction;
var AsyncAction_1$1 = {
	AsyncAction: AsyncAction_2
};

var Scheduler = (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
    return Scheduler;
}());
var Scheduler_2 = Scheduler;
var Scheduler_1$1 = {
	Scheduler: Scheduler_2
};

var __extends$14 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Scheduler_1 = Scheduler_1$1;
var AsyncScheduler = (function (_super) {
    __extends$14(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        this.active = false;
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler_1.Scheduler));
var AsyncScheduler_2 = AsyncScheduler;
var AsyncScheduler_1$1 = {
	AsyncScheduler: AsyncScheduler_2
};

var AsyncAction_1 = AsyncAction_1$1;
var AsyncScheduler_1 = AsyncScheduler_1$1;
var async_1$1 = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
var async = {
	async: async_1$1
};

function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
var isDate_2 = isDate;
var isDate_1$1 = {
	isDate: isDate_2
};

var __extends$11 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = async;
var isDate_1 = isDate_1$1;
var OuterSubscriber_1$4 = OuterSubscriber_1$1;
var subscribeToResult_1$4 = subscribeToResult_1$1;
function timeoutWith$2(due, withObservable, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    var absoluteTimeout = isDate_1.isDate(due);
    var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
}
var timeoutWith_2 = timeoutWith$2;
var TimeoutWithOperator = (function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
}());
var TimeoutWithSubscriber = (function (_super) {
    __extends$11(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        _super.call(this);
        this.destination = destination;
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.timeoutSubscription = undefined;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        destination.add(this);
        this.scheduleTimeout();
    }
    Object.defineProperty(TimeoutWithSubscriber.prototype, "previousIndex", {
        get: function () {
            return this._previousIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeoutWithSubscriber.prototype, "hasCompleted", {
        get: function () {
            return this._hasCompleted;
        },
        enumerable: true,
        configurable: true
    });
    TimeoutWithSubscriber.dispatchTimeout = function (state) {
        var source = state.subscriber;
        var currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.handleTimeout();
        }
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var currentIndex = this.index;
        var timeoutState = { subscriber: this, index: currentIndex };
        this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
        this.index++;
        this._previousIndex = currentIndex;
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    };
    TimeoutWithSubscriber.prototype._error = function (err) {
        this.destination.error(err);
        this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype._complete = function () {
        this.destination.complete();
        this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype.handleTimeout = function () {
        if (!this.closed) {
            var withObservable = this.withObservable;
            this.unsubscribe();
            this.destination.add(this.timeoutSubscription = subscribeToResult_1$4.subscribeToResult(this, withObservable));
        }
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber_1$4.OuterSubscriber));
var timeoutWith_1$1 = {
	timeoutWith: timeoutWith_2
};

var Observable_1$13 = Observable_1;
var timeoutWith_1 = timeoutWith_1$1;
Observable_1$13.Observable.prototype.timeoutWith = timeoutWith_1.timeoutWith;

var MBOX_PREFIX = 'mbox';
var MC_PREFIX = 'vst.';
var MC_TRACKING_SERVER = MC_PREFIX + 'trk';
var MC_TRACKING_SERVER_SECURE = MC_PREFIX + 'trks';
var GET_INSTANCE_METHOD = 'getInstance';
var IS_ALLOWED_METHOD = 'isAllowed';
var MARKETING_CLOUD_VISITOR_ID_METHOD = 'getMarketingCloudVisitorID';
var AUDIENCE_MANAGER_BLOB_METHOD = 'getAudienceManagerBlob';
var ANALYTICS_VISITOR_ID_METHOD = 'getAnalyticsVisitorID';
var AUDIENCE_MANAGER_LOCATION_HINT_METHOD = 'getAudienceManagerLocationHint';
var SUPPLEMENTAL_DATA_ID_METHOD = 'getSupplementalDataID';
var IS_OPTED_OUT_METHOD = 'isOptedOut';
var GET_CUSTOMER_IDS_METHOD = 'getCustomerIDs';
var TRACKING_SERVER_PROP = 'trackingServer';
var TRACKING_SERVER_SECURE_PROP = 'trackingServerSecure';
var OPTOUT_PROP = 'OptOut';
var VISITOR_INSTANCE_CONFIG = { sdidParamExpiry: SUPPLEMENTAL_DATA_ID_PARAM_TIMEOUT };
var REQUEST_COUNT$1 = 0;
function shouldUseOptout(visitor) {
    return OPTOUT_ENABLED && isFunction(visitor[IS_OPTED_OUT_METHOD]) && !isUndefined(WINDOW.Visitor[OPTOUT_PROP]);
}
function getMarketingCloudIdOptout(visitor) {
    if (!shouldUseOptout(visitor)) {
        return Observable_2.of(false);
    }
    return Observable_2.create(function (observer) {
        visitor[IS_OPTED_OUT_METHOD](function (optout) {
            observer.next(optout);
            observer.complete();
        }, WINDOW.Visitor[OPTOUT_PROP].GLOBAL, true);
    });
}
function buildKey(key) {
    return MC_PREFIX + key;
}
function getCustomerIdsParameters(visitor) {
    if (!isFunction(visitor[GET_CUSTOMER_IDS_METHOD])) {
        return {};
    }
    var customerIds = visitor[GET_CUSTOMER_IDS_METHOD]();
    if (!isObject(customerIds)) {
        return {};
    }
    return objectToParams(customerIds, buildKey);
}
function getTrackingServersParameters(visitor) {
    var result = {};
    if (isNotBlank(visitor[TRACKING_SERVER_PROP])) {
        result[MC_TRACKING_SERVER] = visitor[TRACKING_SERVER_PROP];
    }
    if (isNotBlank(visitor[TRACKING_SERVER_SECURE_PROP])) {
        result[MC_TRACKING_SERVER_SECURE] = visitor[TRACKING_SERVER_SECURE_PROP];
    }
    return result;
}
function collectParams(visitor, arr) {
    var result = {};
    forEach(function (params) { return forEach(function (value, key) { return result[key] = value; }, params); }, arr);
    forEach(function (value, key) { return result[key] = value; }, getCustomerIdsParameters(visitor));
    forEach(function (value, key) { return result[key] = value; }, getTrackingServersParameters(visitor));
    return result;
}
function executeRequest$1(visitor, method, key) {
    if (!isFunction(visitor[method])) {
        return Observable_2.of({});
    }
    return Observable_2.create(function (observer) {
        visitor[method](function (value) {
            var result = {};
            result[key] = value;
            observer.next(result);
            observer.complete();
        }, true);
    });
}
function executeRequests(visitor) {
    var observables = [
        executeRequest$1(visitor, MARKETING_CLOUD_VISITOR_ID_METHOD, MARKETING_CLOUD_VISITOR_ID_PARAM),
        executeRequest$1(visitor, AUDIENCE_MANAGER_BLOB_METHOD, BLOB_PARAM),
        executeRequest$1(visitor, ANALYTICS_VISITOR_ID_METHOD, ANALYTICS_VISITOR_ID_PARAM),
        executeRequest$1(visitor, AUDIENCE_MANAGER_LOCATION_HINT_METHOD, LOCATION_HINT_PARAM)
    ];
    return Observable_2.forkJoin.apply(Observable_2, observables).map(function (arr) { return collectParams(visitor, arr); });
}
function addSupplementalId(visitor, mbox, params) {
    var supplementalId = getSupplementalDataId(visitor, mbox);
    if (isNotBlank(supplementalId)) {
        params[SUPPLEMENTAL_DATA_ID_PARAM] = supplementalId;
    }
    return params;
}
function createError$2() {
    return { status: ERROR, error: OPTOUT };
}
function wrapVisitorOrThrow(visitor, optout) {
    return optout ? Observable_2['throw'](createError$2()) : Observable_2.of(visitor);
}
function getSupplementalDataId(visitor, mbox) {
    if (!isFunction(visitor[SUPPLEMENTAL_DATA_ID_METHOD])) {
        return EMPTY$1;
    }
    return visitor[SUPPLEMENTAL_DATA_ID_METHOD](MBOX_PREFIX + ":" + CLIENT_CODE + ":" + mbox);
}
function getMarketingCloudIdInstance() {
    if (isBlank(IMS_ORG_ID)) {
        return null;
    }
    if (isUndefined(WINDOW.Visitor)) {
        return null;
    }
    if (isNull(WINDOW.Visitor)) {
        return null;
    }
    if (!isFunction(WINDOW.Visitor[GET_INSTANCE_METHOD])) {
        return null;
    }
    var visitor = WINDOW.Visitor[GET_INSTANCE_METHOD](IMS_ORG_ID, VISITOR_INSTANCE_CONFIG);
    if (isObject(visitor) && isFunction(visitor[IS_ALLOWED_METHOD]) && visitor[IS_ALLOWED_METHOD]()) {
        return visitor;
    }
    return null;
}
function getMarketingCloudIdParameters(mbox) {
    var visitor = getMarketingCloudIdInstance();
    if (isNull(visitor)) {
        return Observable_2.of({});
    }
    var requestCount = ++REQUEST_COUNT$1;
    var start = "" + MARKER_VISITOR_ID_REQUEST_START + requestCount;
    var end = "" + MARKER_VISITOR_ID_REQUEST_END + requestCount;
    var name = MEASURE_VISITOR_ID_REQUEST + ":request:" + requestCount + ":mbox:" + mbox;
    var markRequestStart = function () {
        mark(start);
    };
    var markRequestEnd = function () {
        mark(end);
        measure(name, start, end);
    };
    return Observable_2.of(visitor)
        ['do'](markRequestStart)
        .flatMap(getMarketingCloudIdOptout)
        .flatMap(function (optout) { return wrapVisitorOrThrow(visitor, optout); })
        .flatMap(executeRequests)
        .timeoutWith(VISITOR_API_TIMEOUT, Observable_2.of({}))
        .map(function (params) { return addSupplementalId(visitor, mbox, collectParams(visitor, [params])); })
        ['do'](markRequestEnd);
}

function create(name, value, expires) {
    return {
        name: name,
        value: value,
        expires: expires
    };
}
function serialize(cookie) {
    return [encode(cookie.name), encode(cookie.value), cookie.expires].join(HASH);
}
function deserialize(str) {
    var parts = str.split(HASH);
    if (isEmptyArray(parts) || parts.length < 3) {
        return null;
    }
    if (isNaN(parseInt(parts[2], 10))) {
        return null;
    }
    return create(decode(parts[0]), decode(parts[1]), Number(parts[2]));
}
function getInternalCookies(cookieValue) {
    if (isBlank(cookieValue)) {
        return [];
    }
    return cookieValue.split(PIPE);
}
function getExpires(cookie) {
    return cookie.expires;
}
function getMaxExpires(cookies) {
    var expires = map(getExpires, cookies);
    return Math.max.apply(Math, expires);
}
function readCookies() {
    var cookiesMap = {};
    var masterCookie = getCookie(MASTER_COOKIE);
    var internalCookies = map(deserialize, getInternalCookies(masterCookie));
    var nowInSeconds = Math.ceil(Date.now() / 1000);
    var validCookies = filter(function (cookie) { return isObject(cookie) && nowInSeconds <= cookie.expires; }, internalCookies);
    forEach(function (cookie) { return cookiesMap[cookie.name] = cookie; }, validCookies);
    return cookiesMap;
}
function saveCookies(cookiesMap) {
    var cookies = map(identity, cookiesMap);
    var maxExpires = Math.abs(getMaxExpires(cookies) * 1000 - Date.now());
    var serializedCookies = map(serialize, cookies).join(PIPE);
    var expires = new Date(Date.now() + maxExpires);
    setCookie(MASTER_COOKIE, serializedCookies, { domain: COOKIE_DOMAIN, expires: expires });
}
function setTargetCookie(name, value, expires) {
    if (CROSS_DOMAIN_ONLY) {
        return;
    }
    var cookiesMap = readCookies();
    cookiesMap[name] = create(name, value, Math.ceil(expires + Date.now() / 1000));
    saveCookies(cookiesMap);
}
function getTargetCookie(name) {
    if (CROSS_DOMAIN_ONLY) {
        return EMPTY$1;
    }
    var cookiesMap = readCookies();
    var cookie = cookiesMap[name];
    return isObject(cookie) ? cookie.value : EMPTY$1;
}

function setSessionId(id) {
    setTargetCookie(SESSION_ID_COOKIE, id, SESSION_ID_LIFETIME);
}
function getSessionId() {
    if (CROSS_DOMAIN_ONLY) {
        return uuid();
    }
    var sessionId = getTargetCookie(SESSION_ID_COOKIE);
    if (isBlank(sessionId)) {
        setTargetCookie(SESSION_ID_COOKIE, uuid(), SESSION_ID_LIFETIME);
    }
    return getTargetCookie(SESSION_ID_COOKIE);
}

function extractCluster(id) {
    var parts = id.split(DOT);
    if (parts.length !== 2 || isBlank(parts[1])) {
        return EMPTY$1;
    }
    var nodeDetails = parts[1].split(UNDERSCORE);
    if (nodeDetails.length !== 2 || isBlank(nodeDetails[0])) {
        return EMPTY$1;
    }
    return nodeDetails[0];
}
function saveEdgeCluster(id) {
    if (!EDGE_SERVER_OVERRIDE) {
        return;
    }
    var cluster = extractCluster(id);
    if (isBlank(cluster)) {
        return;
    }
    var expires = new Date(Date.now() + EDGE_SERVER_OVERRIDE_TIMEOUT);
    setCookie(EDGE_CLUSTER_COOKIE, cluster, { domain: COOKIE_DOMAIN, expires: expires });
}
function getDeviceId() {
    return getTargetCookie(DEVICE_ID_COOKIE);
}
function setDeviceId(id) {
    setTargetCookie(DEVICE_ID_COOKIE, id, DEVICE_ID_LIFETIME);
    saveEdgeCluster(id);
}

var PAGE_ID = uuid();
var COUNTER = 1;
function getPageId() {
    return PAGE_ID;
}
function getTime() {
    var now = new Date();
    return now.getTime() - now.getTimezoneOffset() * 60000;
}
function getMboxCount() {
    return COUNTER++;
}
function getPageParameters() {
    var params = {};
    params[SESSION_ID_PARAM] = getSessionId();
    if (!CROSS_DOMAIN_ONLY) {
        params[DEVICE_ID_PARAM] = getDeviceId();
    }
    params[PAGE_ID_PARAM] = getPageId();
    params[VERSION_PARAM] = VERSION;
    params[COUNT_PARAM] = EMPTY$1 + getMboxCount();
    params[TIME_PARAM] = EMPTY$1 + getTime();
    params[HOST_PARAM] = LOCATION.hostname;
    params[URL_PARAM] = LOCATION.href;
    params[REFERRER_PARAM] = DOCUMENT.referrer;
    if (CROSS_DOMAIN_ENABLED) {
        params[CROSS_DOMAIN_PARAM] = CROSS_DOMAIN;
    }
    return params;
}

function getBrowserParameters() {
    var params = {};
    params[BROWSER_HEIGHT] = EMPTY$1 + DOCUMENT_ELEMENT.clientHeight;
    params[BROWSER_WIDTH] = EMPTY$1 + DOCUMENT_ELEMENT.clientWidth;
    params[BROWSER_TIME_OFFSET] = EMPTY$1 + (-new Date().getTimezoneOffset());
    params[SCREEN_HEIGHT] = EMPTY$1 + SCREEN.height;
    params[SCREEN_WIDTH] = EMPTY$1 + SCREEN.width;
    params[SCREEN_COLOR_DEPTH] = EMPTY$1 + SCREEN.colorDepth;
    return params;
}

function functionToParams(func) {
    if (!isFunction(func)) {
        return {};
    }
    var params = null;
    try {
        params = func();
    }
    catch (_ignore) { }
    if (isNull(params)) {
        return {};
    }
    if (isArray(params)) {
        return arrayToParams(params);
    }
    if (isNotBlank(params)) {
        return queryStringToParams(params);
    }
    if (isObject(params)) {
        return objectToParams(params);
    }
    return {};
}
function getTargetPageParamsAllParameters() {
    return merge(GLOBAL_MBOX_PARAMS || {}, functionToParams(WINDOW.targetPageParamsAll));
}
function getTargetPageParamsParameters() {
    return merge(MBOX_PARAMS || {}, functionToParams(WINDOW.targetPageParams));
}
function getTargetPageParameters(name) {
    if (GLOBAL_MBOX_NAME !== name) {
        return getTargetPageParamsAllParameters();
    }
    var anyMboxParameters = getTargetPageParamsAllParameters();
    var globalMboxParameters = getTargetPageParamsParameters();
    return merge(anyMboxParameters, globalMboxParameters);
}

var GET = 'GET';

var EDGE_SERVER_PREFIX = 'mboxedge';
var CLIENT_CODE_VAR = '${clientCode}';
var JSON_ENDPOINT_PATTERN = ['/m2/', CLIENT_CODE_VAR, '/mbox/json'].join(EMPTY$1);
var SCHEME_SEPARATOR = '//';
var REQUEST_COUNT = 0;
function getEdgeCluster() {
    return getCookie(EDGE_CLUSTER_COOKIE);
}
function getServerDomain() {
    if (!EDGE_SERVER_OVERRIDE) {
        return SERVER_DOMAIN;
    }
    var cluster = getEdgeCluster();
    if (isBlank(cluster)) {
        return SERVER_DOMAIN;
    }
    return SERVER_DOMAIN.replace(CLIENT_CODE, [EDGE_SERVER_PREFIX, cluster].join(EMPTY$1));
}
function getPath() {
    return JSON_ENDPOINT_PATTERN.replace(CLIENT_CODE_VAR, CLIENT_CODE);
}
function getUrl() {
    return [SCHEME, SCHEME_SEPARATOR, getServerDomain(), getPath()].join(EMPTY$1);
}
function getData(marketingCloudData, request) {
    var mbox = request.mbox;
    var result = {};
    result[MBOX_PARAM] = mbox;
    result = merge(result, getPageParameters());
    result = merge(result, getBrowserParameters());
    result = merge(result, marketingCloudData);
    result = merge(result, getTargetPageParameters(mbox));
    result = merge(result, request.params);
    return result;
}
function createAjaxOptions(marketingCloudData, request) {
    var result = {};
    result.type = GET;
    result.url = getUrl();
    result.dataType = JSON$1;
    result.data = getData(marketingCloudData, request);
    result.timeout = request.timeout;
    return result;
}
function ajax$$1(request) {
    var mbox = request.mbox;
    var requestCount = ++REQUEST_COUNT;
    var start = "" + MARKER_TNT_REQUEST_START + requestCount;
    var end = "" + MARKER_TNT_REQUEST_END + requestCount;
    var name = MEASURE_TNT_REQUEST + ":request:" + requestCount + ":mbox:" + mbox;
    var markRequestStart = function () {
        mark(start);
    };
    var markRequestEnd = function () {
        mark(end);
        measure(name, start, end);
    };
    return Observable_2.of(mbox)
        .flatMap(getMarketingCloudIdParameters)
        .map(function (marketingCloudData) { return createAjaxOptions(marketingCloudData, request); })
        ['do'](markRequestStart)
        .flatMap(ajax$1)
        ['do'](markRequestEnd);
}

function saveSessionId(response) {
    var id = response.sessionId;
    if (isNotBlank(id)) {
        setSessionId(id);
    }
}

function saveDeviceId(response) {
    var id = response.tntId;
    if (isNotBlank(id)) {
        setDeviceId(id);
    }
}

var TARGET = 'target';
var TRACES = 'traces';
var TRACES_KEY = '___' + TARGET + '_' + TRACES;
function addTrace(trace) {
    if (isUndefined(WINDOW[TRACES_KEY])) {
        WINDOW[TRACES_KEY] = [trace];
        return;
    }
    if (isArray(WINDOW[TRACES_KEY])) {
        WINDOW[TRACES_KEY].push(trace);
    }
}
function saveTrace(response) {
    var trace = response.trace;
    if (isObject(trace)) {
        addTrace(trace);
    }
}

function handleError$1(response) {
    var error = response.error;
    if (isNotBlank(error)) {
        return Observable_2['throw'](createError$1(ERROR, error));
    }
    return Observable_2.of(response);
}

var DISABLED_DURATION = 86400000;
var DISABLED_MESSAGE = '3rd party cookies disabled';
function getDisabledMessage(disabled) {
    var message = disabled.message;
    return isBlank(message) ? DISABLED_MESSAGE : message;
}
function getDisabledDuration(disabled) {
    var duration = disabled.duration;
    return isNumber(duration) ? duration : DISABLED_DURATION;
}
function saveDisabledData(disabled) {
    var message = getDisabledMessage(disabled);
    var expires = new Date(Date.now() + getDisabledDuration(disabled));
    setCookie(DISABLE_COOKIE, message, { domain: COOKIE_DOMAIN, expires: expires });
}
function handleDisabled(response) {
    var disabled = response.disabled;
    if (isObject(disabled)) {
        saveDisabledData(disabled);
        return Observable_2['throw'](createError$1(DISABLED, getDisabledMessage(disabled)));
    }
    return Observable_2.of(response);
}

function isHtml(offer) {
    return isNotBlank(offer.html);
}
function isRedirect(offer) {
    return isNotBlank(offer.redirect);
}
function isActions(offer) {
    return !isEmptyArray(offer.actions);
}
function isDynamic(offer) {
    return isObject(offer.dynamic) && isNotBlank(offer.dynamic.url);
}
function isDefault(offer) {
    return isUndefined(offer.html) && isUndefined(offer.redirect) && isUndefined(offer.actions) &&
        isUndefined(offer.dynamic);
}
function hasClickToken(value) {
    return isNotBlank(value.clickToken);
}
function hasPlugins(offer) {
    return !isEmptyArray(offer.plugins);
}

var SET_CONTENT = 'setContent';
var SET_TEXT = 'setText';
var SET_ATTRIBUTE = 'setAttribute';
var SET_STYLE = 'setStyle';
var REARRANGE = 'rearrange';
var RESIZE = 'resize';
var MOVE = 'move';
var REMOVE = 'remove';
var CUSTOM_CODE = 'customCode';
var APPEND_CONTENT = 'appendContent';
var REDIRECT = 'redirect';
var TRACK_CLICK = 'trackClick';
var SIGNAL_CLICK = 'signalClick';
var INSERT_BEFORE = 'insertBefore';
var INSERT_AFTER = 'insertAfter';
var PREPEND_CONTENT = 'prependContent';
var REPLACE_CONTENT = 'replaceContent';

function createClickToken(offer) {
    if (hasClickToken(offer)) {
        return [{ action: SIGNAL_CLICK, clickTrackId: offer.clickToken }];
    }
    return [];
}

var ACTION = 'action';
var ATTRIBUTE = 'attribute';
var VALUE = 'value';
var ASSET = 'asset';
var CLICK_TRACK_ID = 'clickTrackId';
var CONTENT = 'content';
var CONTENT_TYPE = 'contentType';
var FINAL_HEIGHT = 'finalHeight';
var FINAL_WIDTH = 'finalWidth';
var HEIGHT = 'height';
var WIDTH = 'width';
var FINAL_LEFT_POSITION = 'finalLeftPosition';
var FINAL_TOP_POSITION = 'finalTopPosition';
var LEFT = 'left';
var TOP = 'top';
var POSITION = 'position';
var FROM = 'from';
var TO = 'to';
var URL = 'url';
var INCLUDE_ALL_URL_PARAMETERS = 'includeAllUrlParameters';
var PASS_MBOX_SESSION = 'passMboxSession';
var PROPERTY = 'property';
var PRIORITY = 'priority';
var SELECTOR = 'selector';
var CSS_SELECTOR = 'cssSelector';
var STYLE$1 = 'style';

function getHtml(offer) {
    if (hasPlugins(offer)) {
        return [offer.html].concat(offer.plugins);
    }
    return [offer.html];
}
function createHtml(offers) {
    var htmls = filter(isHtml, offers);
    if (isEmptyArray(htmls)) {
        return Observable_2.of([]);
    }
    var action = {};
    action[ACTION] = SET_CONTENT;
    action[CONTENT] = flatten(map(getHtml, htmls)).join(EMPTY$1);
    return Observable_2.of([action].concat(map(createClickToken, offers)));
}

var ADOBE_MC_REF_PARAM = 'adobe_mc_ref';
var SUPPLEMENTAL_DATA_ID_URL_FUNC = 'appendSupplementalDataIDTo';
var TRUE$1 = 'true';
function addParams(url, params) {
    var urlParts = url.split(HASH);
    var urlHash = urlParts[1];
    var urlWithoutHash = urlParts[0];
    if (params && !~urlWithoutHash.indexOf(params)) {
        if (~urlWithoutHash.indexOf(QUESTION_MARK)) {
            urlWithoutHash += AMPERSAND + params;
        }
        else {
            urlWithoutHash += QUESTION_MARK + params;
        }
    }
    return urlHash ? urlWithoutHash + HASH + urlHash : urlWithoutHash;
}
function buildSessionIdParam() {
    return [SESSION_ID_PARAM, EQUAL, getSessionId()].join(EMPTY$1);
}
function buildReferrerParam(referrer) {
    return [ADOBE_MC_REF_PARAM, EQUAL, encode(referrer)].join(EMPTY$1);
}
function addRedirectParams(url) {
    var referrerParam = buildReferrerParam(DOCUMENT.referrer);
    var result = addParams(url, referrerParam);
    var visitor = getMarketingCloudIdInstance();
    if (isNull(visitor)) {
        return result;
    }
    if (!isFunction(visitor[SUPPLEMENTAL_DATA_ID_URL_FUNC])) {
        return result;
    }
    return visitor[SUPPLEMENTAL_DATA_ID_URL_FUNC](result);
}
function processRedirect(action) {
    var params = String(action[INCLUDE_ALL_URL_PARAMETERS]);
    var session = String(action[PASS_MBOX_SESSION]);
    var query = LOCATION.search.substring(1);
    var url = action[URL];
    if (isBlank(url)) {
        logDebug(EMPTY_URL, action);
        return null;
    }
    if (params && TRUE$1 === params) {
        url = addParams(url, query);
    }
    if (session && TRUE$1 === session) {
        url = addParams(url, buildSessionIdParam());
    }
    var result = mergeWithoutKeys({}, action, [URL, INCLUDE_ALL_URL_PARAMETERS, PASS_MBOX_SESSION]);
    result[URL] = addRedirectParams(url);
    return result;
}

function createRedirect(offer) {
    var action = { action: REDIRECT, url: offer.redirect };
    return Observable_2.of([processRedirect(action)]);
}

function createCustomCode(pluginCode) {
    return { action: CUSTOM_CODE, content: pluginCode };
}
function createPlugins(offer) {
    if (hasPlugins(offer)) {
        return map(createCustomCode, offer.plugins);
    }
    return [];
}

var SRC = 'src';
var ID = 'id';
var HREF = 'href';
var CLASS = 'class';

var CLICK_TRACK_PATTERN = /CLKTRK#(\S+)/;
var CLICK_TRACK_REPLACE_PATTERN = /CLKTRK#(\S+)\s/;
function getClickTrackNodeId(action) {
    var selector = action[SELECTOR];
    if (isBlank(selector)) {
        return EMPTY$1;
    }
    var result = CLICK_TRACK_PATTERN.exec(selector);
    if (isEmptyArray(result)) {
        return EMPTY$1;
    }
    if (result.length !== 2) {
        return EMPTY$1;
    }
    return result[1];
}
function getContent(nodeId, content) {
    var html = fragment(content);
    html.children().first().attr(ID, nodeId);
    return html.html();
}
function processClickTrackId(action) {
    var content = action[CONTENT];
    var nodeId = getClickTrackNodeId(action);
    if (isBlank(nodeId) || isBlank(content)) {
        return merge({}, action);
    }
    var selector = action[SELECTOR];
    var result = mergeWithoutKeys({}, action, [SELECTOR, CONTENT]);
    result[SELECTOR] = selector.replace(CLICK_TRACK_REPLACE_PATTERN, EMPTY$1);
    result[CONTENT] = getContent(nodeId, content);
    return result;
}
function processAsset(action) {
    var keysToIgnore = [];
    var value = action[VALUE];
    if (isBlank(value)) {
        return action;
    }
    var asset = action[ASSET];
    if (isBlank(asset)) {
        keysToIgnore.push(VALUE);
    }
    else {
        keysToIgnore.push(ASSET, VALUE);
    }
    var result = mergeWithoutKeys({}, action, keysToIgnore);
    result[CONTENT] = "<" + IMAGE + " " + SRC + "=\"" + value + "\" />";
    return result;
}

function setContent(action) {
    var result = processClickTrackId(action);
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    var contentType = action[CONTENT_TYPE];
    if (TEXT === contentType) {
        result[ACTION] = SET_TEXT;
    }
    return mergeWithoutKeys({}, result, [CONTENT_TYPE]);
}

function appendContent(action) {
    var result = processClickTrackId(action);
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    return result;
}

function prependContent(action) {
    var result = processClickTrackId(action);
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    return result;
}

function replaceContent(action) {
    var result = processClickTrackId(action);
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    return result;
}

function insertBefore(action) {
    var result = processClickTrackId(processAsset(action));
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    return result;
}

function insertAfter(action) {
    var result = processClickTrackId(processAsset(action));
    var content = result[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, result);
        return null;
    }
    return result;
}

function customCode(action) {
    var content = action[CONTENT];
    if (!isString(content)) {
        logDebug(EMPTY_CONTENT, action);
        return null;
    }
    return action;
}

function setAttribute(action) {
    var attribute = action[ATTRIBUTE];
    var value = action[VALUE];
    if (isBlank(attribute) || isBlank(value)) {
        logDebug(EMPTY_ATTRIBUTE, action);
        return null;
    }
    return action;
}

function setStyle(action) {
    var property = action[PROPERTY];
    var value = action[VALUE];
    if (isBlank(property) || isBlank(value)) {
        logDebug(EMPTY_PROPERTY, action);
        return null;
    }
    var style = {};
    var result = mergeWithoutKeys({}, action, [PROPERTY, VALUE]);
    style[property] = value;
    result[STYLE$1] = style;
    return result;
}

function resize(action) {
    var height = action[FINAL_HEIGHT];
    var width = action[FINAL_WIDTH];
    if (isBlank(height) || isBlank(width)) {
        logDebug(EMPTY_SIZES, action);
        return null;
    }
    var style = {};
    var result = mergeWithoutKeys({}, action, [ACTION, FINAL_HEIGHT, FINAL_WIDTH]);
    style[HEIGHT] = height;
    style[WIDTH] = width;
    result[STYLE$1] = style;
    result[ACTION] = SET_STYLE;
    return result;
}

function move(action) {
    var left = Number(action[FINAL_LEFT_POSITION]);
    var top = Number(action[FINAL_TOP_POSITION]);
    if (isNaN(left) || isNaN(top)) {
        logDebug(EMPTY_COORDINATES, action);
        return null;
    }
    var position = action[POSITION];
    var style = {};
    var result;
    if (isNotBlank(position)) {
        style[POSITION] = position;
        result = mergeWithoutKeys({}, action, [ACTION, FINAL_LEFT_POSITION, FINAL_TOP_POSITION, POSITION]);
    }
    else {
        result = mergeWithoutKeys({}, action, [ACTION, FINAL_LEFT_POSITION, FINAL_TOP_POSITION]);
    }
    style[LEFT] = left;
    style[TOP] = top;
    result[STYLE$1] = style;
    result[ACTION] = SET_STYLE;
    return result;
}

function rearrange(action) {
    var from = Number(action[FROM]);
    var to = Number(action[TO]);
    if (isNaN(from) || isNaN(to)) {
        logDebug(EMPTY_REARRANGE, action);
        return null;
    }
    return action;
}

function redirect(action) {
    return processRedirect(action);
}

function trackClick(action) {
    var clickTrackId = action[CLICK_TRACK_ID];
    if (isBlank(clickTrackId)) {
        logDebug(EMPTY_CLICK_TRACK_ID, action);
        return null;
    }
    return action;
}

function transformAction(action) {
    var type = action[ACTION];
    switch (type) {
        case SET_CONTENT:
            return setContent(action);
        case APPEND_CONTENT:
            return appendContent(action);
        case PREPEND_CONTENT:
            return prependContent(action);
        case REPLACE_CONTENT:
            return replaceContent(action);
        case INSERT_BEFORE:
            return insertBefore(action);
        case INSERT_AFTER:
            return insertAfter(action);
        case CUSTOM_CODE:
            return customCode(action);
        case SET_ATTRIBUTE:
            return setAttribute(action);
        case SET_STYLE:
            return setStyle(action);
        case RESIZE:
            return resize(action);
        case MOVE:
            return move(action);
        case REMOVE:
            return action;
        case REARRANGE:
            return rearrange(action);
        case REDIRECT:
            return redirect(action);
        case TRACK_CLICK:
            return trackClick(action);
        default:
            return null;
    }
}
function processActions(actions) {
    var notNull = function (action) { return !isNull(action); };
    return filter(notNull, map(function (action) { return transformAction(action); }, actions));
}
function createActions(offer) {
    return Observable_2.of([].concat(processActions(offer.actions), createPlugins(offer)));
}

var MBOX_PREFIX$1 = 'mbox';
function getDynamicParams(dynamic) {
    var result = {};
    forEach(function (param) {
        if (isUndefined(result[param.type])) {
            result[param.type] = {};
        }
        result[param.type][param.name] = param.defaultValue;
    }, dynamic.params);
    return result;
}
function getRequestParams(dynamicParams) {
    if (isUndefined(dynamicParams.request)) {
        return {};
    }
    return dynamicParams.request;
}
function isMboxParam(name) {
    return name.indexOf(MBOX_PREFIX$1) !== -1;
}
function getMboxParams(dynamicParams) {
    var mboxParams = {};
    if (isUndefined(dynamicParams.mbox)) {
        return mboxParams;
    }
    forEach(function (value, key) {
        if (isMboxParam(key)) {
            return;
        }
        mboxParams[key] = value;
    }, dynamicParams.mbox);
    return mboxParams;
}
function getParams$1(dynamicRequestParams, requestParams, dynamicMboxParams, mboxParams) {
    var result = {};
    result = merge(result, merge(dynamicRequestParams, requestParams));
    result = merge(result, merge(dynamicMboxParams, mboxParams));
    return result;
}
function createAjaxRequest(url, params, timeout) {
    var result = {};
    result.type = GET;
    result.url = url;
    result.dataType = HTML;
    result.data = params;
    result.timeout = timeout;
    return result;
}
function createAction(response, offer) {
    var action = {};
    action[ACTION] = SET_CONTENT;
    action[CONTENT] = response.data;
    return [action].concat(createClickToken(offer), createPlugins(offer));
}
function createDynamic(request, offer) {
    var dynamic = offer.dynamic;
    var dynamicParams = getDynamicParams(dynamic);
    var dynamicRequestParams = getRequestParams(dynamicParams);
    var dynamicMboxParams = getMboxParams(dynamicParams);
    var requestParams = parse(LOCATION.search);
    var mboxParams = request.params;
    var url = dynamic.url;
    var params = getParams$1(dynamicRequestParams, requestParams, dynamicMboxParams, mboxParams);
    var timeout = request.timeout;
    return Observable_2.of(createAjaxRequest(url, params, timeout))
        .flatMap(ajax$1)
        .map(function (response) { return createAction(response, offer); });
}

function createDefault(offer) {
    return Observable_2.of([].concat(createClickToken(offer), createPlugins(offer)));
}

function getActions(request, offers) {
    var result = [];
    forEach(function (offer) {
        if (isRedirect(offer)) {
            result.push(createRedirect(offer));
            return;
        }
        if (isActions(offer)) {
            result.push(createActions(offer));
            return;
        }
        if (isDynamic(offer)) {
            result.push(createDynamic(request, offer));
            return;
        }
        if (isDefault(offer)) {
            result.push(createDefault(offer));
            return;
        }
    }, offers);
    return result.concat(createHtml(offers));
}
function getResponseTokens(offers) {
    var result = [];
    forEach(function (offer) {
        var tokens = offer.responseTokens;
        if (!isObject(tokens)) {
            return;
        }
        result.push(tokens);
    }, offers);
    return result;
}
function handleOffers(request, response) {
    var offers = response.offers;
    if (!isArray(offers)) {
        return Observable_2.of({ actions: [], responseTokens: [] });
    }
    var actions = getActions(request, offers);
    var responseTokens = getResponseTokens(offers);
    return Observable_2.forkJoin.apply(Observable_2, actions).map(flatten)
        .map(function (actions) { return ({ actions: actions, responseTokens: responseTokens }); });
}

var __extends$15 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$6 = Subscriber_1$1;
function _do$2(nextOrObserver, error, complete) {
    return this.lift(new DoOperator(nextOrObserver, error, complete));
}
var _do_2 = _do$2;
var DoOperator = (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
var DoSubscriber = (function (_super) {
    __extends$15(DoSubscriber, _super);
    function DoSubscriber(destination, nextOrObserver, error, complete) {
        _super.call(this, destination);
        var safeSubscriber = new Subscriber_1$6.Subscriber(nextOrObserver, error, complete);
        safeSubscriber.syncErrorThrowable = true;
        this.add(safeSubscriber);
        this.safeSubscriber = safeSubscriber;
    }
    DoSubscriber.prototype._next = function (value) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.next(value);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.next(value);
        }
    };
    DoSubscriber.prototype._error = function (err) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.error(err);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.error(err);
        }
    };
    DoSubscriber.prototype._complete = function () {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.complete();
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.complete();
        }
    };
    return DoSubscriber;
}(Subscriber_1$6.Subscriber));
var _do_1 = {
	_do: _do_2
};

var Observable_1$14 = Observable_1;
var do_1 = _do_1;
Observable_1$14.Observable.prototype['do'] = do_1._do;
Observable_1$14.Observable.prototype._do = do_1._do;

function transform(request, response) {
    return Observable_2.of(response)
        ['do'](saveSessionId)
        ['do'](saveDeviceId)
        ['do'](saveTrace)
        .flatMap(handleError$1)
        .flatMap(handleDisabled)
        .flatMap(function (response) { return handleOffers(request, response); });
}

var CLICK = 'click';
var SUBMIT = 'submit';

var TAG_NAME = 'tagName';
var HEAD_TAGS_SELECTOR = [SCRIPT, LINK, STYLE].join(COMMA);
function getTagName(element) {
    var tagName = $(element).prop(TAG_NAME);
    return isBlank(tagName) ? EMPTY$1 : tagName.toLowerCase();
}
function createAnchorClickPostProcessing(element) {
    var href = $(element).attr(HREF);
    if (isBlank(href)) {
        return NOOP;
    }
    return function () { return LOCATION.href = href; };
}
function createFormSubmitPostProcessing(element) {
    return function () { return $(element).trigger(SUBMIT); };
}
function processAjaxResponse(response) {
    var result = response.data;
    if (!isObject(result)) {
        return Observable_2.of(response);
    }
    return Observable_2.of(result);
}
var NOOP = function () { };
function getParams(request) {
    var params = request.params;
    return isEmptyObject(params) ? {} : params;
}
function getTimeout(request) {
    var timeout = request.timeout;
    return isNumber(timeout) && timeout >= 0 ? timeout : TIMEOUT;
}
function createError$1(status, error) {
    return { status: status, error: error };
}
function getTrackEventPostProcessing(type, element) {
    var tagName = getTagName(element);
    if (CLICK === type && ANCHOR === tagName) {
        return createAnchorClickPostProcessing(element);
    }
    if (SUBMIT === type && FORM === tagName) {
        return createFormSubmitPostProcessing(element);
    }
    return NOOP;
}
function getContentAcceptedByHead(content) {
    var result = [];
    var html = fragment(content);
    html.find(HEAD_TAGS_SELECTOR).forEach(function (item) {
        result.push(fragment(item).html());
    });
    return result.join(EMPTY$1);
}
function executeRequest(request) {
    return Observable_2.of(request)
        .flatMap(ajax$$1)
        .flatMap(processAjaxResponse)
        .flatMap(function (response) { return transform(request, response); });
}

function fireCustomEvent(eventName, detail) {
    var event = new WINDOW.CustomEvent(eventName, {
        detail: detail
    });
    DOCUMENT.dispatchEvent(event);
}
function createTracking() {
    var sessionId = getSessionId();
    var deviceId = getDeviceId();
    if (isNotBlank(deviceId)) {
        return {
            sessionId: sessionId,
            deviceId: deviceId
        };
    }
    return {
        sessionId: sessionId
    };
}
var REQUEST_SUCCEEDED = 'at-request-succeeded';
var REQUEST_FAILED$1 = 'at-request-failed';
var CONTENT_RENDERING_SUCCEEDED = 'at-content-rendering-succeeded';
var CONTENT_RENDERING_FAILED = 'at-content-rendering-failed';
function notifyRequestSucceeded(detail) {
    var responseTokens = detail.responseTokens;
    var payload = {
        type: REQUEST_SUCCEEDED,
        mbox: detail.mbox,
        tracking: createTracking()
    };
    if (!isEmptyArray(responseTokens)) {
        payload.responseTokens = responseTokens;
    }
    fireCustomEvent(REQUEST_SUCCEEDED, payload);
}
function notifyRequestFailed(detail) {
    fireCustomEvent(REQUEST_FAILED$1, {
        type: REQUEST_FAILED$1,
        mbox: detail.mbox,
        message: detail.message,
        tracking: createTracking()
    });
}
function notifyRenderingSucceeded(detail) {
    fireCustomEvent(CONTENT_RENDERING_SUCCEEDED, {
        type: CONTENT_RENDERING_SUCCEEDED,
        mbox: detail.mbox,
        tracking: createTracking()
    });
}
function notifyRenderingFailed(detail) {
    fireCustomEvent(CONTENT_RENDERING_FAILED, {
        type: CONTENT_RENDERING_FAILED,
        mbox: detail.mbox,
        message: detail.message,
        selectors: detail.selectors,
        tracking: createTracking()
    });
}

var GET_OFFER = '[getOffer()]';
function handleSuccess(options, response) {
    var mbox = options.mbox;
    var actions = response.actions;
    var responseTokens = response.responseTokens;
    logDebug(GET_OFFER, ACTIONS_TO_BE_RENDERED, actions);
    options.success(actions);
    notifyRequestSucceeded({ mbox: mbox, responseTokens: responseTokens });
}
function handleError(options, error) {
    var mbox = options.mbox;
    var status = error.status || UNKNOWN;
    var message = getMessage(error);
    logWarn(GET_OFFER, REQUEST_FAILED, error);
    options.error(status, message);
    notifyRequestFailed({ mbox: mbox, message: message });
}
function createTargetRequest(options) {
    var result = {};
    result.mbox = options.mbox;
    result.params = getParams(options);
    result.timeout = getTimeout(options);
    return result;
}
function getOffer(options) {
    var validationResult = validateGetOfferOptions(options);
    var validationError = validationResult.error;
    if (!validationResult.valid) {
        delay(options.error(WARNING, validationError));
        logWarn(GET_OFFER, validationError);
        return;
    }
    if (!isDeliveryEnabled()) {
        delay(options.error(WARNING, DELIVERY_DISABLED));
        logWarn(DELIVERY_DISABLED);
        return;
    }
    var request = createTargetRequest(options);
    var success = function (actions) { return handleSuccess(options, actions); };
    var error = function (error) { return handleError(options, error); };
    executeRequest(request).subscribe(success, error);
}

var STYLE_PREFIX = 'at-';
var BODY_STYLE_ID = 'at-body-style';
var BODY_STYLE_ID_SELECTOR = "#" + BODY_STYLE_ID;
var MBOX_DEFAULT_STYLE_ID = 'at-mbox-default-style';
var FLICKER_CONTROL_CLASS = 'at-flicker-control';
var MARKER_CSS_CLASS = 'at-element-marker';
function getFirstScript() {
    return $(SCRIPT).eq(0);
}
function createStyleMarkup(id, content) {
    return "<" + STYLE + " " + ID + "=\"" + id + "\" " + CLASS + "=\"" + FLICKER_CONTROL_CLASS + "\">" + content + "</" + STYLE + ">";
}
function showBody() {
    if (BODY_HIDING_ENABLED !== true) {
        return;
    }
    if (!exists(BODY_STYLE_ID_SELECTOR)) {
        return;
    }
    remove$1(BODY_STYLE_ID_SELECTOR);
    mark(MARKER_SHOW_BODY);
}
function hideBody() {
    if (BODY_HIDING_ENABLED !== true) {
        return;
    }
    if (exists(BODY_STYLE_ID_SELECTOR)) {
        return;
    }
    before(getFirstScript(), createStyleMarkup(BODY_STYLE_ID, BODY_HIDDEN_STYLE));
    mark(MARKER_HIDE_BODY);
}
function addFlickerControlStyles(selectors) {
    if (isEmptyArray(selectors)) {
        return;
    }
    forEach(function (selector) {
        var id = STYLE_PREFIX + hash(selector);
        var content = selector + " {" + DEFAULT_CONTENT_HIDDEN_STYLE + "}";
        before(getFirstScript(), createStyleMarkup(id, content));
    }, selectors);
}
function removeFlickerControlStyle(selector) {
    var id = STYLE_PREFIX + hash(selector);
    remove$1("#" + id);
}
function showElement(selector) {
    var element = select(selector);
    element.removeClass(MBOX_CSS_CLASS).addClass(MARKER_CSS_CLASS);
}
function addMboxesStyles() {
    if (!isDeliveryEnabled()) {
        return;
    }
    var head = $(HEAD);
    var mboxDefaultStyle = "." + MBOX_CSS_CLASS + " {" + DEFAULT_CONTENT_HIDDEN_STYLE + "}";
    var elementMarkerStyle = "." + MARKER_CSS_CLASS + " {" + DEFAULT_CONTENT_VISIBLE_STYLE + "}";
    head.append("<" + STYLE + " " + ID + "=\"" + MBOX_DEFAULT_STYLE_ID + "\">" + mboxDefaultStyle + "</" + STYLE + ">");
    head.append("<" + STYLE + ">" + elementMarkerStyle + "</" + STYLE + ">");
}

function getUrl$1(item) {
    var src = $(item).attr(SRC);
    return isNotBlank(src) ? src : null;
}
function getScriptsUrls(html) {
    return filter(isNotBlank, map(getUrl$1, html.find(SCRIPT).get()));
}
function loadScript(src) {
    var request = {};
    request.type = GET;
    request.url = src;
    request.dataType = SCRIPT$1;
    logDebug(REMOTE_SCRIPT, src);
    return ajax$1(request).map(function (_) { return EMPTY$1; });
}

function getDataSrc(item) {
    return $(item).attr(DATA_SRC);
}
function disableImages(html) {
    html.find(IMAGE).forEach(function (item) { return copyAttr(item, SRC, DATA_SRC); });
    return html;
}
function enableImages(html) {
    html.find(IMAGE).forEach(function (item) { return copyAttr(item, DATA_SRC, SRC); });
    return html;
}
function loadImages(html) {
    var hasDataSrc = function (elem) { return hasAttr(elem, DATA_SRC); };
    var elements = filter(hasDataSrc, html.find(IMAGE).get());
    if (isEmptyArray(elements)) {
        return html;
    }
    forEach(loadImage, map(getDataSrc, elements));
    return html;
}
function loadImage(src) {
    logDebug(LOADING_IMAGE, src);
    return $("<" + IMAGE + "/>").attr(SRC, src).attr(SRC);
}
function renderImages(html) {
    return Observable_2.of(html)
        .map(disableImages)
        .map(loadImages)
        .map(enableImages);
}

var __extends$17 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1$7 = root;
var Observable_1$17 = Observable_1;
var PromiseObservable = (function (_super) {
    __extends$17(PromiseObservable, _super);
    function PromiseObservable(promise, scheduler) {
        _super.call(this);
        this.promise = promise;
        this.scheduler = scheduler;
    }
    PromiseObservable.create = function (promise, scheduler) {
        return new PromiseObservable(promise, scheduler);
    };
    PromiseObservable.prototype._subscribe = function (subscriber) {
        var _this = this;
        var promise = this.promise;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    subscriber.next(this.value);
                    subscriber.complete();
                }
            }
            else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                }, function (err) {
                    if (!subscriber.closed) {
                        subscriber.error(err);
                    }
                })
                    .then(null, function (err) {
                    root_1$7.root.setTimeout(function () { throw err; });
                });
            }
        }
        else {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber: subscriber });
                }
            }
            else {
                promise.then(function (value) {
                    _this.value = value;
                    _this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchNext, 0, { value: value, subscriber: subscriber }));
                    }
                }, function (err) {
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchError, 0, { err: err, subscriber: subscriber }));
                    }
                })
                    .then(null, function (err) {
                    root_1$7.root.setTimeout(function () { throw err; });
                });
            }
        }
    };
    return PromiseObservable;
}(Observable_1$17.Observable));
var PromiseObservable_2 = PromiseObservable;
function dispatchNext(arg) {
    var value = arg.value, subscriber = arg.subscriber;
    if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
    }
}
function dispatchError(arg) {
    var err = arg.err, subscriber = arg.subscriber;
    if (!subscriber.closed) {
        subscriber.error(err);
    }
}
var PromiseObservable_1$1 = {
	PromiseObservable: PromiseObservable_2
};

var __extends$18 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1$8 = root;
var Observable_1$18 = Observable_1;
var iterator_1$2 = iterator;
var IteratorObservable = (function (_super) {
    __extends$18(IteratorObservable, _super);
    function IteratorObservable(iterator$$1, scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
        if (iterator$$1 == null) {
            throw new Error('iterator cannot be null.');
        }
        this.iterator = getIterator(iterator$$1);
    }
    IteratorObservable.create = function (iterator$$1, scheduler) {
        return new IteratorObservable(iterator$$1, scheduler);
    };
    IteratorObservable.dispatch = function (state) {
        var index = state.index, hasError = state.hasError, iterator$$1 = state.iterator, subscriber = state.subscriber;
        if (hasError) {
            subscriber.error(state.error);
            return;
        }
        var result = iterator$$1.next();
        if (result.done) {
            subscriber.complete();
            return;
        }
        subscriber.next(result.value);
        state.index = index + 1;
        if (subscriber.closed) {
            if (typeof iterator$$1['return'] === 'function') {
                iterator$$1['return']();
            }
            return;
        }
        this.schedule(state);
    };
    IteratorObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, iterator$$1 = _a.iterator, scheduler = _a.scheduler;
        if (scheduler) {
            return scheduler.schedule(IteratorObservable.dispatch, 0, {
                index: index, iterator: iterator$$1, subscriber: subscriber
            });
        }
        else {
            do {
                var result = iterator$$1.next();
                if (result.done) {
                    subscriber.complete();
                    break;
                }
                else {
                    subscriber.next(result.value);
                }
                if (subscriber.closed) {
                    if (typeof iterator$$1['return'] === 'function') {
                        iterator$$1['return']();
                    }
                    break;
                }
            } while (true);
        }
    };
    return IteratorObservable;
}(Observable_1$18.Observable));
var IteratorObservable_2 = IteratorObservable;
var StringIterator = (function () {
    function StringIterator(str, idx, len) {
        if (idx === void 0) { idx = 0; }
        if (len === void 0) { len = str.length; }
        this.str = str;
        this.idx = idx;
        this.len = len;
    }
    StringIterator.prototype[iterator_1$2.$$iterator] = function () { return (this); };
    StringIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.str.charAt(this.idx++)
        } : {
            done: true,
            value: undefined
        };
    };
    return StringIterator;
}());
var ArrayIterator = (function () {
    function ArrayIterator(arr, idx, len) {
        if (idx === void 0) { idx = 0; }
        if (len === void 0) { len = toLength(arr); }
        this.arr = arr;
        this.idx = idx;
        this.len = len;
    }
    ArrayIterator.prototype[iterator_1$2.$$iterator] = function () { return this; };
    ArrayIterator.prototype.next = function () {
        return this.idx < this.len ? {
            done: false,
            value: this.arr[this.idx++]
        } : {
            done: true,
            value: undefined
        };
    };
    return ArrayIterator;
}());
function getIterator(obj) {
    var i = obj[iterator_1$2.$$iterator];
    if (!i && typeof obj === 'string') {
        return new StringIterator(obj);
    }
    if (!i && obj.length !== undefined) {
        return new ArrayIterator(obj);
    }
    if (!i) {
        throw new TypeError('object is not iterable');
    }
    return obj[iterator_1$2.$$iterator]();
}
var maxSafeInteger = Math.pow(2, 53) - 1;
function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) {
        return 0;
    }
    if (len === 0 || !numberIsFinite(len)) {
        return len;
    }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) {
        return 0;
    }
    if (len > maxSafeInteger) {
        return maxSafeInteger;
    }
    return len;
}
function numberIsFinite(value) {
    return typeof value === 'number' && root_1$8.root.isFinite(value);
}
function sign(value) {
    var valueAsNumber = +value;
    if (valueAsNumber === 0) {
        return valueAsNumber;
    }
    if (isNaN(valueAsNumber)) {
        return valueAsNumber;
    }
    return valueAsNumber < 0 ? -1 : 1;
}
var IteratorObservable_1$1 = {
	IteratorObservable: IteratorObservable_2
};

var __extends$19 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1$19 = Observable_1;
var ScalarObservable_1$3 = ScalarObservable_1$1;
var EmptyObservable_1$4 = EmptyObservable_1$1;
var ArrayLikeObservable = (function (_super) {
    __extends$19(ArrayLikeObservable, _super);
    function ArrayLikeObservable(arrayLike, scheduler) {
        _super.call(this);
        this.arrayLike = arrayLike;
        this.scheduler = scheduler;
        if (!scheduler && arrayLike.length === 1) {
            this._isScalar = true;
            this.value = arrayLike[0];
        }
    }
    ArrayLikeObservable.create = function (arrayLike, scheduler) {
        var length = arrayLike.length;
        if (length === 0) {
            return new EmptyObservable_1$4.EmptyObservable();
        }
        else if (length === 1) {
            return new ScalarObservable_1$3.ScalarObservable(arrayLike[0], scheduler);
        }
        else {
            return new ArrayLikeObservable(arrayLike, scheduler);
        }
    };
    ArrayLikeObservable.dispatch = function (state) {
        var arrayLike = state.arrayLike, index = state.index, length = state.length, subscriber = state.subscriber;
        if (subscriber.closed) {
            return;
        }
        if (index >= length) {
            subscriber.complete();
            return;
        }
        subscriber.next(arrayLike[index]);
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayLikeObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, arrayLike = _a.arrayLike, scheduler = _a.scheduler;
        var length = arrayLike.length;
        if (scheduler) {
            return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
                arrayLike: arrayLike, index: index, length: length, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < length && !subscriber.closed; i++) {
                subscriber.next(arrayLike[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayLikeObservable;
}(Observable_1$19.Observable));
var ArrayLikeObservable_2 = ArrayLikeObservable;
var ArrayLikeObservable_1$1 = {
	ArrayLikeObservable: ArrayLikeObservable_2
};

var Observable_1$20 = Observable_1;
var Notification = (function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype['do'] = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this['do'](nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return Observable_1$20.Observable.of(this.value);
            case 'E':
                return Observable_1$20.Observable['throw'](this.error);
            case 'C':
                return Observable_1$20.Observable.empty();
        }
        throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return this.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return this.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());
var Notification_2 = Notification;
var Notification_1$1 = {
	Notification: Notification_2
};

var __extends$20 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$7 = Subscriber_1$1;
var Notification_1 = Notification_1$1;
function observeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
var observeOn_2 = observeOn;
var ObserveOnOperator = (function () {
    function ObserveOnOperator(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    };
    return ObserveOnOperator;
}());
var ObserveOnOperator_1 = ObserveOnOperator;
var ObserveOnSubscriber = (function (_super) {
    __extends$20(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        _super.call(this, destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification, destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(Notification_1.Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(Notification_1.Notification.createError(err));
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(Notification_1.Notification.createComplete());
    };
    return ObserveOnSubscriber;
}(Subscriber_1$7.Subscriber));
var ObserveOnSubscriber_1 = ObserveOnSubscriber;
var ObserveOnMessage = (function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}());
var ObserveOnMessage_1 = ObserveOnMessage;
var observeOn_1$1 = {
	observeOn: observeOn_2,
	ObserveOnOperator: ObserveOnOperator_1,
	ObserveOnSubscriber: ObserveOnSubscriber_1,
	ObserveOnMessage: ObserveOnMessage_1
};

var __extends$16 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1$4 = isArray$1;
var isPromise_1$3 = isPromise_1$1;
var PromiseObservable_1 = PromiseObservable_1$1;
var IteratorObservable_1 = IteratorObservable_1$1;
var ArrayObservable_1$3 = ArrayObservable_1$1;
var ArrayLikeObservable_1 = ArrayLikeObservable_1$1;
var iterator_1$1 = iterator;
var Observable_1$16 = Observable_1;
var observeOn_1 = observeOn_1$1;
var observable_1$2 = observable;
var isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
var FromObservable = (function (_super) {
    __extends$16(FromObservable, _super);
    function FromObservable(ish, scheduler) {
        _super.call(this, null);
        this.ish = ish;
        this.scheduler = scheduler;
    }
    FromObservable.create = function (ish, scheduler) {
        if (ish != null) {
            if (typeof ish[observable_1$2.$$observable] === 'function') {
                if (ish instanceof Observable_1$16.Observable && !scheduler) {
                    return ish;
                }
                return new FromObservable(ish, scheduler);
            }
            else if (isArray_1$4.isArray(ish)) {
                return new ArrayObservable_1$3.ArrayObservable(ish, scheduler);
            }
            else if (isPromise_1$3.isPromise(ish)) {
                return new PromiseObservable_1.PromiseObservable(ish, scheduler);
            }
            else if (typeof ish[iterator_1$1.$$iterator] === 'function' || typeof ish === 'string') {
                return new IteratorObservable_1.IteratorObservable(ish, scheduler);
            }
            else if (isArrayLike(ish)) {
                return new ArrayLikeObservable_1.ArrayLikeObservable(ish, scheduler);
            }
        }
        throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
    };
    FromObservable.prototype._subscribe = function (subscriber) {
        var ish = this.ish;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            return ish[observable_1$2.$$observable]().subscribe(subscriber);
        }
        else {
            return ish[observable_1$2.$$observable]().subscribe(new observeOn_1.ObserveOnSubscriber(subscriber, scheduler, 0));
        }
    };
    return FromObservable;
}(Observable_1$16.Observable));
var FromObservable_2 = FromObservable;
var FromObservable_1$1 = {
	FromObservable: FromObservable_2
};

var FromObservable_1 = FromObservable_1$1;
var from_1$1 = FromObservable_1.FromObservable.create;
var from$2 = {
	from: from_1$1
};

var Observable_1$15 = Observable_1;
var from_1 = from$2;
Observable_1$15.Observable.from = from_1.from;

var __extends$21 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1$5 = OuterSubscriber_1$1;
var subscribeToResult_1$5 = subscribeToResult_1$1;
function _catch$2(selector) {
    var operator = new CatchOperator(selector);
    var caught = this.lift(operator);
    return (operator.caught = caught);
}
var _catch_2 = _catch$2;
var CatchOperator = (function () {
    function CatchOperator(selector) {
        this.selector = selector;
    }
    CatchOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    };
    return CatchOperator;
}());
var CatchSubscriber = (function (_super) {
    __extends$21(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
        _super.call(this, destination);
        this.selector = selector;
        this.caught = caught;
    }
    CatchSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var result = void 0;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                _super.prototype.error.call(this, err2);
                return;
            }
            this._unsubscribeAndRecycle();
            this.add(subscribeToResult_1$5.subscribeToResult(this, result));
        }
    };
    return CatchSubscriber;
}(OuterSubscriber_1$5.OuterSubscriber));
var _catch_1 = {
	_catch: _catch_2
};

var Observable_1$21 = Observable_1;
var catch_1 = _catch_1;
Observable_1$21.Observable.prototype['catch'] = catch_1._catch;
Observable_1$21.Observable.prototype._catch = catch_1._catch;

var mergeMap_1$3 = mergeMap_1$1;
function concatMap$2(project, resultSelector) {
    return this.lift(new mergeMap_1$3.MergeMapOperator(project, resultSelector, 1));
}
var concatMap_2 = concatMap$2;
var concatMap_1$1 = {
	concatMap: concatMap_2
};

var Observable_1$22 = Observable_1;
var concatMap_1 = concatMap_1$1;
Observable_1$22.Observable.prototype.concatMap = concatMap_1.concatMap;

function executeRemoteScripts(renderFunc, container, html) {
    var scriptsUrls = getScriptsUrls(html);
    var render = function (html) { return renderFunc(container, html); };
    if (isEmptyArray(scriptsUrls)) {
        return Observable_2.of(html)
            .map(render)
            .map(function () { return EMPTY$1; });
    }
    return Observable_2.of(html)
        .map(render)
        .flatMap(function () { return Observable_2.from(scriptsUrls).concatMap(loadScript); });
}
function handleRenderingError(action) {
    return function (error) {
        logDebug(UNEXPECTED_ERROR, error);
        return Observable_2.of(action);
    };
}
function renderHtml(renderFunc, action) {
    var content = action[CONTENT];
    var container = select(action[SELECTOR]);
    var html = fragment(content);
    var renderContent = function (html) { return executeRemoteScripts(renderFunc, container, html); };
    return renderImages(html)
        .flatMap(renderContent)
        .map(function () { return action; })
        ['catch'](handleRenderingError(action));
}

function renderFunc(container, html) {
    return container.html(html.html());
}
function setContent$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc, action);
}

function setText(action) {
    var container = select(action[SELECTOR]);
    var content = action[CONTENT];
    logDebug(ACTION_RENDERING, action);
    container.text(content);
    return Observable_2.of(action);
}

function renderFunc$1(container, html) {
    return container.append(html.html());
}
function appendContent$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$1, action);
}

function renderFunc$2(container, html) {
    return container.prepend(html.html());
}
function prependContent$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$2, action);
}

function renderFunc$3(container, html) {
    var parent = container.parent();
    container.before(html.html()).empty().remove();
    return parent;
}
function replaceContent$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$3, action);
}

function renderFunc$4(container, html) {
    container.before(html.html());
    return container.prev();
}
function insertBefore$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$4, action);
}

function renderFunc$5(container, html) {
    container.after(html.html());
    return container.next();
}
function insertAfter$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$5, action);
}

function renderFunc$6(container, html) {
    return container.before(html.html()).parent();
}
function customCode$1(action) {
    logDebug(ACTION_RENDERING, action);
    return renderHtml(renderFunc$6, action);
}

function shouldHandleImageSrc(container, attribute) {
    return SRC === attribute && container.is(IMAGE);
}
function setImageSrc(container, src) {
    container.removeAttr(SRC);
    container.attr(SRC, loadImage(src));
}
function setAttribute$1(action) {
    var attribute = action[ATTRIBUTE];
    var value = action[VALUE];
    var container = select(action[SELECTOR]);
    logDebug(ACTION_RENDERING, action);
    if (shouldHandleImageSrc(container, attribute)) {
        setImageSrc(container, value);
    }
    else {
        container.attr(attribute, value);
    }
    return Observable_2.of(action);
}

function setCssWithPriority(container, style, priority) {
    container.forEach(function (element) {
        var styleKeys = keys(style);
        forEach(function (key) { return element.style.setProperty(key, style[key], priority); }, styleKeys);
    });
}
function setStyle$1(action) {
    var container = select(action[SELECTOR]);
    var priority = action[PRIORITY];
    logDebug(ACTION_RENDERING, action);
    if (isBlank(priority)) {
        container.css(action[STYLE$1]);
    }
    else {
        setCssWithPriority(container, action[STYLE$1], priority);
    }
    return Observable_2.of(action);
}

function remove$2(action) {
    var container = select(action[SELECTOR]);
    logDebug(ACTION_RENDERING, action);
    container.empty().remove();
    return Observable_2.of(action);
}

function rearrange$1(action) {
    var from = action[FROM];
    var to = action[TO];
    var container = select(action[SELECTOR]);
    var children = container.children();
    var elemFrom = children.eq(from);
    var elemTo = children.eq(to);
    if (!exists(elemFrom) || !exists(elemTo)) {
        logDebug(REARRANGE_MISSING, action);
        return Observable_2.of(action);
    }
    logDebug(ACTION_RENDERING, action);
    if (from < to) {
        elemTo.after(elemFrom);
    }
    else {
        elemTo.before(elemFrom);
    }
    return Observable_2.of(action);
}

function redirect$1(action) {
    var url = action[URL];
    logDebug(ACTION_RENDERING, action);
    LOCATION.replace(url);
    return Observable_2.of(action);
}

var TRACK_EVENT = '[trackEvent()]';
function normalizeOptions(options) {
    var result = merge({}, options);
    result.params = getParams(options);
    result.timeout = getTimeout(options);
    result.success = isFunction(options.success) ? options.success : function () { };
    result.error = isFunction(options.error) ? options.error : function (status, error) { };
    return result;
}
function shouldTrackBySelector(options) {
    return isNotBlank(options.type) && (isNotBlank(options.selector) || isElement(options.selector));
}
function createSuccessCallback(options) {
    return function () {
        logDebug(TRACK_EVENT_SUCCESS, options);
        options.success();
    };
}
function createErrorCallback(options) {
    return function (data) {
        var status = data.status || UNKNOWN;
        var message = getMessage(data);
        logWarn(TRACK_EVENT_ERROR, options, data);
        options.error(status, message);
    };
}
function handleEventSuccess(options, type, element) {
    var handleSuccess = createSuccessCallback(options);
    handleSuccess();
    var handleEventPostProcessing = getTrackEventPostProcessing(type, element);
    handleEventPostProcessing();
}
function handleEventError(options, type, element, data) {
    var handleError = createErrorCallback(options);
    handleError(data);
    var handleEventPostProcessing = getTrackEventPostProcessing(type, element);
    handleEventPostProcessing();
}
function fireRequest(options, success, error) {
    var request = {};
    request.mbox = options.mbox;
    request.params = options.params;
    request.timeout = options.timeout;
    executeRequest(request).subscribe(success, error);
}
function fireEventRequest(options, event) {
    var type = event.type;
    var element = event.currentTarget;
    var success = function () { return handleEventSuccess(options, type, element); };
    var error = function (data) { return handleEventError(options, type, element, data); };
    fireRequest(options, success, error);
    return !options.preventDefault;
}
function addEventListener(options, element) {
    var type = options.type;
    $(element).on(type, function (event) { return fireEventRequest(options, event); });
}
function track(options) {
    var elements = select(options.selector);
    elements.forEach(function (element) { return addEventListener(options, element); });
}
function trackEvent(options) {
    var validationResult = validateTrackEventOptions(options);
    var validationError = validationResult.error;
    options = normalizeOptions(options);
    if (!validationResult.valid) {
        delay(options.error(ERROR, validationError));
        logWarn(TRACK_EVENT, validationError);
        return;
    }
    if (!isDeliveryEnabled()) {
        delay(options.error(WARNING, DELIVERY_DISABLED));
        logWarn(DELIVERY_DISABLED);
        return;
    }
    if (shouldTrackBySelector(options)) {
        track(options);
        return;
    }
    fireRequest(options, createSuccessCallback(options), createErrorCallback(options));
}

function getTrackEventParams(param, id) {
    var params = {};
    params[param] = id;
    return params;
}
function getTrackEventOptions(mbox, selector, params) {
    var options = {};
    options.mbox = mbox + CLICKED_SUFFIX;
    options.type = CLICK;
    options.selector = selector;
    options.params = params;
    return options;
}
function trackClickEvent(action, mbox, param) {
    logDebug(ACTION_RENDERING, action);
    var clickTrackId = action[CLICK_TRACK_ID];
    var selector = action[SELECTOR];
    var params = getTrackEventParams(param, clickTrackId);
    var options = getTrackEventOptions(mbox, selector, params);
    trackEvent(options);
    return Observable_2.of(action);
}

function trackClick$1(mbox, action) {
    return trackClickEvent(action, mbox, CLICK_TRACK_ID_PARAM);
}

function signalClick(mbox, action) {
    return trackClickEvent(action, mbox, CLICK_THROUGH_PARAM);
}

function processHeadSelectorIfExists(action) {
    var content = action[CONTENT];
    if (isBlank(content)) {
        return action;
    }
    var container = select(action[SELECTOR]);
    if (!container.is(HEAD)) {
        return action;
    }
    var result = mergeWithoutKeys({}, action, [ACTION, CONTENT]);
    result[ACTION] = APPEND_CONTENT;
    result[CONTENT] = getContentAcceptedByHead(content);
    return result;
}
function renderAction(mbox, action) {
    var processedAction = processHeadSelectorIfExists(action);
    var type = processedAction[ACTION];
    switch (type) {
        case SET_CONTENT:
            return setContent$1(processedAction);
        case SET_TEXT:
            return setText(processedAction);
        case APPEND_CONTENT:
            return appendContent$1(processedAction);
        case PREPEND_CONTENT:
            return prependContent$1(processedAction);
        case REPLACE_CONTENT:
            return replaceContent$1(processedAction);
        case INSERT_BEFORE:
            return insertBefore$1(processedAction);
        case INSERT_AFTER:
            return insertAfter$1(processedAction);
        case CUSTOM_CODE:
            return customCode$1(processedAction);
        case SET_ATTRIBUTE:
            return setAttribute$1(processedAction);
        case SET_STYLE:
            return setStyle$1(processedAction);
        case REMOVE:
            return remove$2(processedAction);
        case REARRANGE:
            return rearrange$1(processedAction);
        case REDIRECT:
            return redirect$1(processedAction);
        case TRACK_CLICK:
            return trackClick$1(mbox, processedAction);
        case SIGNAL_CLICK:
            return signalClick(mbox, processedAction);
        default:
            return Observable_2.of(processedAction);
    }
}

var root_1$9 = root;
var RequestAnimationFrameDefinition = (function () {
    function RequestAnimationFrameDefinition(root$$1) {
        if (root$$1.requestAnimationFrame) {
            this.cancelAnimationFrame = root$$1.cancelAnimationFrame.bind(root$$1);
            this.requestAnimationFrame = root$$1.requestAnimationFrame.bind(root$$1);
        }
        else if (root$$1.mozRequestAnimationFrame) {
            this.cancelAnimationFrame = root$$1.mozCancelAnimationFrame.bind(root$$1);
            this.requestAnimationFrame = root$$1.mozRequestAnimationFrame.bind(root$$1);
        }
        else if (root$$1.webkitRequestAnimationFrame) {
            this.cancelAnimationFrame = root$$1.webkitCancelAnimationFrame.bind(root$$1);
            this.requestAnimationFrame = root$$1.webkitRequestAnimationFrame.bind(root$$1);
        }
        else if (root$$1.msRequestAnimationFrame) {
            this.cancelAnimationFrame = root$$1.msCancelAnimationFrame.bind(root$$1);
            this.requestAnimationFrame = root$$1.msRequestAnimationFrame.bind(root$$1);
        }
        else if (root$$1.oRequestAnimationFrame) {
            this.cancelAnimationFrame = root$$1.oCancelAnimationFrame.bind(root$$1);
            this.requestAnimationFrame = root$$1.oRequestAnimationFrame.bind(root$$1);
        }
        else {
            this.cancelAnimationFrame = root$$1.clearTimeout.bind(root$$1);
            this.requestAnimationFrame = function (cb) { return root$$1.setTimeout(cb, 1000 / 60); };
        }
    }
    return RequestAnimationFrameDefinition;
}());
var RequestAnimationFrameDefinition_1 = RequestAnimationFrameDefinition;
var AnimationFrame_1$1 = new RequestAnimationFrameDefinition(root_1$9.root);
var AnimationFrame = {
	RequestAnimationFrameDefinition: RequestAnimationFrameDefinition_1,
	AnimationFrame: AnimationFrame_1$1
};

var __extends$22 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncAction_1$3 = AsyncAction_1$1;
var AnimationFrame_1 = AnimationFrame;
var AnimationFrameAction = (function (_super) {
    __extends$22(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = AnimationFrame_1.AnimationFrame.requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            AnimationFrame_1.AnimationFrame.cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    };
    return AnimationFrameAction;
}(AsyncAction_1$3.AsyncAction));
var AnimationFrameAction_2 = AnimationFrameAction;
var AnimationFrameAction_1$1 = {
	AnimationFrameAction: AnimationFrameAction_2
};

var __extends$23 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncScheduler_1$3 = AsyncScheduler_1$1;
var AnimationFrameScheduler = (function (_super) {
    __extends$23(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        _super.apply(this, arguments);
    }
    AnimationFrameScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AnimationFrameScheduler;
}(AsyncScheduler_1$3.AsyncScheduler));
var AnimationFrameScheduler_2 = AnimationFrameScheduler;
var AnimationFrameScheduler_1$1 = {
	AnimationFrameScheduler: AnimationFrameScheduler_2
};

var AnimationFrameAction_1 = AnimationFrameAction_1$1;
var AnimationFrameScheduler_1 = AnimationFrameScheduler_1$1;
var animationFrame_1 = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);

var isArray_1$5 = isArray$1;
function isNumeric(val) {
    return !isArray_1$5.isArray(val) && (val - parseFloat(val) + 1) >= 0;
}
var isNumeric_2 = isNumeric;

var isNumeric_1$1 = {
	isNumeric: isNumeric_2
};

var __extends$24 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isNumeric_1 = isNumeric_1$1;
var Observable_1$24 = Observable_1;
var async_1$2 = async;
var isScheduler_1$3 = isScheduler_1$1;
var isDate_1$3 = isDate_1$1;
var TimerObservable = (function (_super) {
    __extends$24(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        _super.call(this);
        this.period = -1;
        this.dueTime = 0;
        if (isNumeric_1.isNumeric(period)) {
            this.period = Number(period) < 1 && 1 || Number(period);
        }
        else if (isScheduler_1$3.isScheduler(period)) {
            scheduler = period;
        }
        if (!isScheduler_1$3.isScheduler(scheduler)) {
            scheduler = async_1$2.async;
        }
        this.scheduler = scheduler;
        this.dueTime = isDate_1$3.isDate(dueTime) ?
            (+dueTime - this.scheduler.now()) :
            dueTime;
    }
    TimerObservable.create = function (initialDelay, period, scheduler) {
        if (initialDelay === void 0) { initialDelay = 0; }
        return new TimerObservable(initialDelay, period, scheduler);
    };
    TimerObservable.dispatch = function (state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        var action = this;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        action.schedule(state, period);
    };
    TimerObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, period = _a.period, dueTime = _a.dueTime, scheduler = _a.scheduler;
        return scheduler.schedule(TimerObservable.dispatch, dueTime, {
            index: index, period: period, subscriber: subscriber
        });
    };
    return TimerObservable;
}(Observable_1$24.Observable));
var TimerObservable_2 = TimerObservable;
var TimerObservable_1$1 = {
	TimerObservable: TimerObservable_2
};

var TimerObservable_1 = TimerObservable_1$1;
var timer_1$1 = TimerObservable_1.TimerObservable.create;
var timer$2 = {
	timer: timer_1$1
};

var Observable_1$23 = Observable_1;
var timer_1 = timer$2;
Observable_1$23.Observable.timer = timer_1.timer;

var __extends$25 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$8 = Subscriber_1$1;
var EmptyObservable_1$5 = EmptyObservable_1$1;
function repeat$2(count) {
    if (count === void 0) { count = -1; }
    if (count === 0) {
        return new EmptyObservable_1$5.EmptyObservable();
    }
    else if (count < 0) {
        return this.lift(new RepeatOperator(-1, this));
    }
    else {
        return this.lift(new RepeatOperator(count - 1, this));
    }
}
var repeat_2 = repeat$2;
var RepeatOperator = (function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
}());
var RepeatSubscriber = (function (_super) {
    __extends$25(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        _super.call(this, destination);
        this.count = count;
        this.source = source;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(Subscriber_1$8.Subscriber));
var repeat_1$1 = {
	repeat: repeat_2
};

var Observable_1$25 = Observable_1;
var repeat_1 = repeat_1$1;
Observable_1$25.Observable.prototype.repeat = repeat_1.repeat;

var __extends$26 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1$6 = OuterSubscriber_1$1;
var subscribeToResult_1$6 = subscribeToResult_1$1;
function takeUntil$2(notifier) {
    return this.lift(new TakeUntilOperator(notifier));
}
var takeUntil_2 = takeUntil$2;
var TakeUntilOperator = (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
    };
    return TakeUntilOperator;
}());
var TakeUntilSubscriber = (function (_super) {
    __extends$26(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.add(subscribeToResult_1$6.subscribeToResult(this, notifier));
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1$6.OuterSubscriber));
var takeUntil_1$1 = {
	takeUntil: takeUntil_2
};

var Observable_1$26 = Observable_1;
var takeUntil_1 = takeUntil_1$1;
Observable_1$26.Observable.prototype.takeUntil = takeUntil_1.takeUntil;

var __extends$27 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1$9 = Subscriber_1$1;
function takeWhile$2(predicate) {
    return this.lift(new TakeWhileOperator(predicate));
}
var takeWhile_2 = takeWhile$2;
var TakeWhileOperator = (function () {
    function TakeWhileOperator(predicate) {
        this.predicate = predicate;
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    };
    return TakeWhileOperator;
}());
var TakeWhileSubscriber = (function (_super) {
    __extends$27(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.index = 0;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(Subscriber_1$9.Subscriber));
var takeWhile_1$1 = {
	takeWhile: takeWhile_2
};

var Observable_1$27 = Observable_1;
var takeWhile_1 = takeWhile_1$1;
Observable_1$27.Observable.prototype.takeWhile = takeWhile_1.takeWhile;

var APPLY_OFFER = '[applyOffer()]';
var RENDER_COUNT = 0;
var notFound = function (action) { return isUndefined(action.found); };
var isRedirectAction = function (action) { return !isUndefined(action[URL]); };
function getSelector(selector) {
    if (isNotBlank(selector)) {
        return selector;
    }
    if (isElement(selector)) {
        return selector;
    }
    return HEAD;
}
function setSelector(selector, action) {
    if (isUndefined(action[SELECTOR])) {
        action[SELECTOR] = selector;
    }
}
function setActionsSelectors(selector, actions) {
    var addSelector = function (action) { return setSelector(selector, action); };
    forEach(addSelector, actions);
}
function hideActions(actions) {
    var getCssSelector = function (action) { return action[CSS_SELECTOR]; };
    var cssSelectors = filter(isNotBlank, map(getCssSelector, actions));
    addFlickerControlStyles(cssSelectors);
}
function displayAction(action) {
    var selector = action[SELECTOR];
    var cssSelector = action[CSS_SELECTOR];
    if (isNotBlank(selector) || isElement(selector)) {
        showElement(selector);
    }
    if (isNotBlank(cssSelector)) {
        removeFlickerControlStyle(cssSelector);
    }
}
function displayActions(actions) {
    forEach(displayAction, actions);
}
function measureRendering(mbox, renderCount) {
    var start = "" + MARKER_TNT_RENDER_START + renderCount;
    var end = "" + MARKER_TNT_RENDER_END + renderCount;
    var name = MEASURE_TNT_RENDER + ":rendering:" + renderCount + ":mbox:" + mbox;
    mark(end);
    measure(name, start, end);
}
function handleError$2(mbox, renderCount, actions) {
    var getSelector = function (action) { return action[SELECTOR]; };
    var isSelector = function (selector) { return isNotBlank(selector) || isElement(selector); };
    var message = MISSING_SELECTORS;
    var selectors = filter(isSelector, map(getSelector, actions));
    displayActions(actions);
    logWarn(MISSING_SELECTORS, actions);
    notifyRenderingFailed({ mbox: mbox, message: message, selectors: selectors });
    measureRendering(mbox, renderCount);
}
function handleComplete(mbox, renderCount, actions) {
    var notFoundActions = filter(notFound, actions);
    if (!isEmptyArray(notFoundActions)) {
        handleError$2(mbox, renderCount, notFoundActions);
        return;
    }
    logDebug(ACTIONS_RENDERED);
    notifyRenderingSucceeded({ mbox: mbox });
    measureRendering(mbox, renderCount);
}
function renderAndDisplayAction(mbox, action) {
    renderAction(mbox, action)
        .subscribe(function () {
        logDebug(ACTION_RENDERED, action);
        displayAction(action);
    }, function (error) {
        logDebug(UNEXPECTED_ERROR, error);
        displayAction(action);
    });
}
function renderActions(mbox, actions) {
    forEach(function (action) {
        if (!exists(action[SELECTOR])) {
            return;
        }
        renderAndDisplayAction(mbox, action);
        action.found = true;
    }, actions);
}
function applyActions(mbox, actions) {
    var selectorPollingTimer = Observable_2.timer(SELECTORS_POLLING_TIMEOUT);
    var renderCount = ++RENDER_COUNT;
    var start = "" + MARKER_TNT_RENDER_START + renderCount;
    mark(start);
    Observable_2.of(actions, animationFrame_1)
        .repeat()
        .takeUntil(selectorPollingTimer)
        .takeWhile(function (arr) { return some(notFound, arr); })
        .map(function (arr) { return filter(notFound, arr); })
        .subscribe(function (arr) {
        renderActions(mbox, arr);
    }, function () {
        handleComplete(mbox, renderCount, actions);
    }, function () {
        handleComplete(mbox, renderCount, actions);
    });
}
function applyOffer(options) {
    var validationResult = validateApplyOfferOptions(options);
    var validationError = validationResult.error;
    if (!validationResult.valid) {
        logWarn(APPLY_OFFER, validationError);
        showBody();
        return;
    }
    var mbox = isBlank(options.mbox) ? GLOBAL_MBOX_NAME : options.mbox;
    var selector = getSelector(options.selector);
    var mboxValidationResult = validateMbox(mbox);
    var mboxValidationError = mboxValidationResult.error;
    if (!mboxValidationResult.valid) {
        logWarn(APPLY_OFFER, mboxValidationError);
        showElement(selector);
        showBody();
        return;
    }
    if (!isDeliveryEnabled()) {
        logWarn(DELIVERY_DISABLED);
        showElement(selector);
        showBody();
        return;
    }
    var actions = options.offer;
    if (isEmptyArray(actions)) {
        logDebug(APPLY_OFFER, NO_ACTIONS);
        showElement(selector);
        showBody();
        return;
    }
    var redirectAction = first(filter(isRedirectAction, actions));
    if (!isNull(redirectAction)) {
        logDebug(APPLY_OFFER, REDIRECT_ACTION);
        redirect$1(redirectAction);
        return;
    }
    setActionsSelectors(selector, actions);
    hideActions(actions);
    showBody();
    applyActions(mbox, actions);
}

var ADOBE_NAMESPACE = 'adobe';
var TARGET_NAMESPACE = 'target';
var EXTENSION_NAMESPACE = 'ext';
var ONLY_LETTERS_PATTERN = new RegExp('^[a-zA-Z]+$');
var EXPOSED_MODULES = {};
function initExposedModules() {
    EXPOSED_MODULES = {
        logger: {
            log: logDebug,
            error: logWarn
        },
        settings: {
            clientCode: CLIENT_CODE,
            serverDomain: SERVER_DOMAIN,
            timeout: TIMEOUT,
            globalMboxAutoCreate: GLOBAL_MBOX_AUTO_CREATE,
            globalMboxName: GLOBAL_MBOX_NAME
        }
    };
}
function validateOptions(options) {
    if (!isObject(options)) {
        throw new Error('Please provide options');
    }
}
function validateName(name) {
    if (isBlank(name)) {
        throw new Error('Please provide extension name');
    }
    var parts = name.split('.');
    forEach(function (part) {
        if (!ONLY_LETTERS_PATTERN.test(part)) {
            throw new Error('Name space should contain only letters');
        }
    }, parts);
}
function validateModules(modules, exposedModules) {
    if (!isArray(modules)) {
        throw new Error('Please provide an array of dependencies');
    }
    if (modules.length === 0) {
        throw new Error('Please provide an array of dependencies');
    }
    forEach(function (elem) {
        if (isUndefined(exposedModules[elem])) {
            throw new Error(elem + ' module does not exist');
        }
    }, modules);
}
function validateRegister(registerFunc) {
    if (!isFunction(registerFunc)) {
        throw new Error('Please provide extension registration function');
    }
}
function buildNamespace(base, name, value) {
    var parts = name.split('.');
    var length = parts.length;
    for (var i = 0; i < length - 1; i++) {
        var part = parts[i];
        base[part] = base[part] || {};
        base = base[part];
    }
    base[parts[length - 1]] = value;
}
function registerExtension(options) {
    initExposedModules();
    var scope = WINDOW[ADOBE_NAMESPACE][TARGET_NAMESPACE];
    validateOptions(options);
    var name = options.name;
    validateName(options.name);
    var modules = options.modules;
    validateModules(modules, EXPOSED_MODULES);
    var registerFunc = options.register;
    validateRegister(registerFunc);
    scope[EXTENSION_NAMESPACE] = scope[EXTENSION_NAMESPACE] || {};
    var args = [];
    forEach(function (elem) { return args.push(EXPOSED_MODULES[elem]); }, modules);
    buildNamespace(scope[EXTENSION_NAMESPACE], name, registerFunc.apply(void 0, args));
}

var storage = {};
function isPresent(key) {
    return !isEmptyArray(storage[key]);
}
function saveToStorage(key, value) {
    if (isPresent(key)) {
        storage[key].push(value);
    }
    else {
        storage[key] = [value];
    }
}
function findInStorage(key) {
    var values = storage[key];
    return !isEmptyArray(values) ? values : [];
}

function createGetOfferOptions(mbox, params, success, error) {
    var options = {};
    options.mbox = mbox;
    options.params = params;
    options.success = success;
    options.error = error;
    return options;
}
function createApplyOfferOptions(mbox, element, actions) {
    var options = {};
    options.mbox = mbox;
    options.selector = element;
    options.offer = actions;
    return options;
}
function handleSuccess$1(mbox, element, actions, successFunc) {
    var options = createApplyOfferOptions(mbox, element, actions);
    logDebug(RENDERING_MBOX, mbox);
    applyOffer(options);
    successFunc();
}
function handleError$3(mbox, element, status, error, errorFunc) {
    logWarn(RENDERING_MBOX_FAILED, mbox, status, error);
    showElement(element);
    errorFunc();
}
function markMboxDiv(element, mbox) {
    $(element).attr(DATA_MBOX_NAME, mbox).addClass("" + MBOX_NAME_CLASS_PREFIX + mbox);
}
function renderMbox(mbox, params, element, successFunc, errorFunc) {
    var success = function (actions) { return handleSuccess$1(mbox, element, actions, successFunc); };
    var error = function (status, error) { return handleError$3(mbox, element, status, error, errorFunc); };
    var options = createGetOfferOptions(mbox, params, success, error);
    getOffer(options);
}

var scripts;
var loaded;
function getInteractive() {
    return scripts.find(function (script) {
        return script.readyState === 'interactive';
    });
}
function getStack() {
    try {
        throw new Error();
    }
    catch (error) {
        return error.stack;
    }
}
function searchStack(stack, test) {
    var url = /[^@\s\(]+$/gm;
    var location = /(:\d+){1,2}\)?$/;
    var match;
    while (match = url.exec(stack)) {
        match = match.pop();
        var index = match.search(location);
        if (index < 0) {
            continue;
        }
        var result = test(match.slice(0, index));
        if (result) {
            return result;
        }
    }
}
function isCurrent(source) {
    if (source in loaded) {
        return;
    }
    if (isInline(source)) {
        return scripts.last();
    }
    return scripts.find(function (script) {
        return script.src === source
            || script.getAttribute('src') === source;
    });
}
function isInline(source) {
    return document.readyState === 'loading' && location.href === source;
}
function initializeCurrentScript() {
    if (!('currentScript' in DOCUMENT)) {
        scripts = DOCUMENT.getElementsByTagName('script');
        scripts.find = function (callback) {
            for (var i = 0; i < this.length; i++) {
                if (callback(this[i])) {
                    return this[i];
                }
            }
        };
        scripts.last = function () {
            return this[this.length - 1];
        };
        loaded = Object.create(null);
        DOCUMENT.addEventListener('load', function (event) {
            var target = event.target;
            if (target.nodeName.toLowerCase() === 'script') {
                var source = target.src;
                if (source) {
                    loaded[source] = null;
                }
            }
        }, true);
    }
}
function getCurrentScript() {
    if ('currentScript' in DOCUMENT) {
        return DOCUMENT.currentScript;
    }
    return getInteractive() || searchStack(getStack(), isCurrent) || null;
}

var MBOX_CREATE = '[mboxCreate()]';
function getMboxDiv(mbox) {
    var scriptElement = getCurrentScript();
    if (!isElement(scriptElement)) {
        logWarn(MBOX_CREATE, CURRENT_SCRIPT_MISSING);
        return null;
    }
    var script = $(scriptElement);
    if (script.parent().is(HEAD)) {
        logDebug(MBOX_CREATE, HTML_HEAD_EXECUTION, mbox);
        return $(HEAD);
    }
    var node = script.prev();
    var isContainer = node.is(DIV) && node.hasClass(MBOX_CSS_CLASS);
    if (isContainer) {
        return node;
    }
    logDebug(MBOX_CREATE, MBOX_CONTAINER_NOT_FOUND, FORCE_HEAD, mbox);
    return $(HEAD);
}
function mboxCreate(mbox) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!isDeliveryEnabled() && !isAuthoringEnabled()) {
        logWarn(DELIVERY_DISABLED);
        return;
    }
    var validationResult = validateMbox(mbox);
    var validationError = validationResult.error;
    if (!validationResult.valid) {
        logWarn(MBOX_CREATE, validationError);
        return;
    }
    var mboxNode = getMboxDiv(mbox);
    if (isNull(mboxNode)) {
        return;
    }
    var element = mboxNode.get(0);
    markMboxDiv(element, mbox);
    var params = arrayToParams(args);
    saveToStorage(mbox, { mbox: mbox, params: params, element: element });
    logDebug(MBOX_CREATE, mbox, params, element);
    if (isDeliveryEnabled()) {
        renderMbox(mbox, params, element, NOOP, NOOP);
    }
}

var MBOX_DEFINE = '[mboxDefine()]';
function getMboxNode(id, mbox) {
    var mboxNode = $("#" + id);
    if (exists(mboxNode)) {
        return mboxNode;
    }
    logDebug(MBOX_DEFINE, MBOX_CONTAINER_NOT_FOUND, FORCE_HEAD, mbox);
    return $(HEAD);
}
function mboxDefine(id, mbox) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!isDeliveryEnabled() && !isAuthoringEnabled()) {
        logWarn(DELIVERY_DISABLED);
        return;
    }
    if (isBlank(id)) {
        logWarn(MBOX_DEFINE, MBOX_DEFINE_ID_MISSING);
        return;
    }
    var validationResult = validateMbox(mbox);
    var validationError = validationResult.error;
    if (!validationResult.valid) {
        logWarn(MBOX_DEFINE, validationError);
        return;
    }
    var element = getMboxNode(id, mbox).get(0);
    markMboxDiv(element, mbox);
    var params = arrayToParams(args);
    logDebug(MBOX_DEFINE, mbox, params, element);
    saveToStorage(mbox, { mbox: mbox, params: params, element: element });
}

var MBOX_UPDATE = '[mboxUpdate()]';
function mboxUpdate(mbox) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!isDeliveryEnabled()) {
        logWarn(DELIVERY_DISABLED);
        return;
    }
    var validationResult = validateMbox(mbox);
    var validationError = validationResult.error;
    if (!validationResult.valid) {
        logWarn(MBOX_UPDATE, validationError);
        return;
    }
    var params = arrayToParams(args);
    params[PAGE_ID_PARAM] = uuid();
    var render = function (item) { return renderMbox(item.mbox, merge(item.params, params), item.element, NOOP, NOOP); };
    var mboxes = findInStorage(mbox);
    logDebug(MBOX_UPDATE, mboxes);
    forEach(render, mboxes);
}

var LOAD_ERROR = 'Unable to load target-vec.js';
var LOADING = 'Loading target-vec.js';
var NAMESPACE = '_AT';
var EDITOR = 'clickHandlerForExperienceEditor';
function initNamespace() {
    WINDOW[NAMESPACE] = WINDOW[NAMESPACE] || {};
    WINDOW[NAMESPACE].querySelectorAll = select;
}
function setupClickHandler() {
    DOCUMENT.addEventListener(CLICK, function (event) {
        if (isFunction(WINDOW[NAMESPACE][EDITOR])) {
            WINDOW[NAMESPACE][EDITOR](event);
        }
    }, true);
}
function createRequest() {
    var request = {};
    request.type = GET;
    request.url = AUTHORING_SCRIPT_URL;
    request.dataType = SCRIPT$1;
    return request;
}
function executeAuthoringCode() {
    initNamespace();
    if (!isAuthoringEnabled()) {
        return;
    }
    var request = createRequest();
    var success = function (_) { return setupClickHandler(); };
    var error = function (_) { return logWarn(LOAD_ERROR); };
    logDebug(LOADING);
    ajax$1(request).subscribe(success, error);
}

var GLOBAL_MBOX = '[global mbox]';
var NO_AUTO_CREATE = 'auto-create disabled';
var MBOX_BLANK = 'mbox name is blank';
function executeGlobalMbox() {
    if (!isDeliveryEnabled()) {
        logWarn(DELIVERY_DISABLED);
        return;
    }
    if (!GLOBAL_MBOX_AUTO_CREATE) {
        logDebug(GLOBAL_MBOX, NO_AUTO_CREATE);
        return;
    }
    if (isBlank(GLOBAL_MBOX_NAME)) {
        logDebug(GLOBAL_MBOX, MBOX_BLANK);
        return;
    }
    var mbox = GLOBAL_MBOX_NAME;
    var params = {};
    var element = $(HEAD).get(0);
    var show = function () { return showBody(); };
    logDebug(RENDERING_MBOX, GLOBAL_MBOX_NAME);
    hideBody();
    renderMbox(mbox, params, element, NOOP, show);
}

var SETTINGS = 'Settings';
function displaySettingsIfDebug() {
    if (isDebugEnabled()) {
        logDebug(SETTINGS, DEBUG_SETTINGS);
    }
}

function setFromGlobalSettings(settings, targetGlobalSettings, field) {
    if (typeof targetGlobalSettings[field] !== 'undefined') {
        settings[field] = targetGlobalSettings[field];
    }
}
function overrideSettingsIfRequired(settings, targetGlobalSettings) {
    if (settings.enabled) {
        setFromGlobalSettings(settings, targetGlobalSettings, 'enabled');
        setFromGlobalSettings(settings, targetGlobalSettings, 'clientCode');
        setFromGlobalSettings(settings, targetGlobalSettings, 'imsOrgId');
        setFromGlobalSettings(settings, targetGlobalSettings, 'serverDomain');
        setFromGlobalSettings(settings, targetGlobalSettings, 'cookieDomain');
        setFromGlobalSettings(settings, targetGlobalSettings, 'crossDomain');
        setFromGlobalSettings(settings, targetGlobalSettings, 'timeout');
        setFromGlobalSettings(settings, targetGlobalSettings, 'globalMboxAutoCreate');
        setFromGlobalSettings(settings, targetGlobalSettings, 'defaultContentHiddenStyle');
        setFromGlobalSettings(settings, targetGlobalSettings, 'defaultContentVisibleStyle');
        setFromGlobalSettings(settings, targetGlobalSettings, 'bodyHidingEnabled');
        setFromGlobalSettings(settings, targetGlobalSettings, 'bodyHiddenStyle');
        setFromGlobalSettings(settings, targetGlobalSettings, 'selectorsPollingTimeout');
        setFromGlobalSettings(settings, targetGlobalSettings, 'visitorApiTimeout');
        setFromGlobalSettings(settings, targetGlobalSettings, 'overrideMboxEdgeServer');
        setFromGlobalSettings(settings, targetGlobalSettings, 'overrideMboxEdgeServerTimeout');
        setFromGlobalSettings(settings, targetGlobalSettings, 'optoutEnabled');
        setFromGlobalSettings(settings, targetGlobalSettings, 'secureOnly');
        setFromGlobalSettings(settings, targetGlobalSettings, 'supplementalDataIdParamTimeout');
    }
}
function isStandardMode() {
    var doc = document;
    var compatMode = doc.compatMode;
    var documentMode = doc.documentMode;
    var standardMode = compatMode && compatMode === 'CSS1Compat';
    var ie9OrModernBrowser = documentMode ? documentMode >= 9 : true;
    return standardMode && ie9OrModernBrowser;
}
function initGlobalSettings(settings) {
    settings.cookieDomain = getCookieDomain(LOCATION.hostname);
    settings.enabled = isStandardMode();
    overrideSettingsIfRequired(settings, WINDOW.targetGlobalSettings || {});
}

function overridePublicApi() {
    var win = window;
    win.adobe = {
        target: {
            VERSION: '',
            event: {},
            ___bootstrap: noop,
            getOffer: noop,
            applyOffer: noop,
            trackEvent: noop,
            registerExtension: noop
        }
    };
    win.mboxCreate = noop;
    win.mboxDefine = noop;
    win.mboxUpdate = noop;
}
function bootstrap(win, doc, targetSettings) {
    consolePoly();
    if (typeof win.adobe.target.getOffer !== 'undefined') {
        logWarn(ALREADY_INITIALIZED);
        return;
    }
    initGlobals(win, doc);
    initGlobalSettings(targetSettings);
    initSettings(targetSettings);
    win.adobe.target.VERSION = VERSION;
    win.adobe.target.event = {
        REQUEST_SUCCEEDED: REQUEST_SUCCEEDED,
        REQUEST_FAILED: REQUEST_FAILED$1,
        CONTENT_RENDERING_SUCCEEDED: CONTENT_RENDERING_SUCCEEDED,
        CONTENT_RENDERING_FAILED: CONTENT_RENDERING_FAILED
    };
    if (!targetSettings.enabled) {
        overridePublicApi();
        logWarn(DELIVERY_DISABLED_NONSTANDARD);
        return;
    }
    initPolyfills();
    initializeCurrentScript();
    addMboxesStyles();
    executeAuthoringCode();
    executeGlobalMbox();
    displaySettingsIfDebug();
    win.adobe.target.getOffer = getOffer;
    win.adobe.target.applyOffer = applyOffer;
    win.adobe.target.trackEvent = trackEvent;
    win.adobe.target.registerExtension = registerExtension;
    win.mboxCreate = mboxCreate;
    win.mboxDefine = mboxDefine;
    win.mboxUpdate = mboxUpdate;
}
var target = {
    ___bootstrap: bootstrap
};

exports.target = target;

}((window.adobe = window.adobe || {})));

window.adobe.target.___bootstrap(window, document, {
    clientCode: 'mangoApp',
    imsOrgId: '',
    serverDomain: 'mangoApp.tt.omtrdc.net',
    crossDomain: 'disabled',
    timeout: 5000,
    globalMboxName: 'target-global-mbox',
    globalMboxAutoCreate: false,
    version: '1.0.0',
    defaultContentHiddenStyle: 'visibility:hidden;',
    defaultContentVisibleStyle: 'visibility:visible;',
    bodyHiddenStyle: 'body{opacity:0}',
    bodyHidingEnabled: true,
    deviceIdLifetime: 63244800000,
    sessionIdLifetime: 1860000,
    pollingAfterDomReadyTimeout: 180000,
    visitorApiTimeout: 500,
    overrideMboxEdgeServer: false,
    overrideMboxEdgeServerTimeout: 1860000,
    optoutEnabled: false
});
