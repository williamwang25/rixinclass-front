"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const common_vendor = require("../../common/vendor.js");
require("../../router/config.js");
const http_tools_enum = require("../../http/tools/enum.js");
const http_http = require("../../http/http.js");
const undefStr = "undefined";
const PromiseCls = Promise;
const promiseResolve = (value) => PromiseCls.resolve(value);
const promiseReject = (value) => PromiseCls.reject(value);
const ObjectCls = Object;
const RegExpCls = RegExp;
const undefinedValue = void 0;
const nullValue = null;
const trueValue = true;
const falseValue = false;
const promiseThen = (promise, onFulfilled, onrejected) => promise.then(onFulfilled, onrejected);
const promiseCatch = (promise, onrejected) => promise.catch(onrejected);
const promiseFinally = (promise, onfinally) => promise.finally(onfinally);
const JSONStringify = (value, replacer, space) => JSON.stringify(value, replacer, space);
const JSONParse = (value) => JSON.parse(value);
const setTimeoutFn = (fn, delay = 0) => setTimeout(fn, delay);
const clearTimeoutTimer = (timer) => clearTimeout(timer);
const objectKeys = (obj) => ObjectCls.keys(obj);
const objectValues = (obj) => ObjectCls.values(obj);
const forEach = (ary, fn) => ary.forEach(fn);
const pushItem = (ary, ...item) => ary.push(...item);
const mapItem = (ary, callbackfn) => ary.map(callbackfn);
const filterItem = (ary, predicate) => ary.filter(predicate);
const splice = (ary, start, deleteCount = 0, ...items) => ary.splice(start, deleteCount, ...items);
const len = (data) => data.length;
const isArray = (arg) => Array.isArray(arg);
const deleteAttr = (arg, attr) => delete arg[attr];
const typeOf = (arg) => typeof arg;
const includes = (ary, target) => ary.includes(target);
const isSSR = typeof window === undefStr && (typeof process !== undefStr ? !process.browser : typeof Deno !== undefStr);
const MEMORY = "memory";
const STORAGE_RESTORE = "restore";
const noop = () => {
};
const $self = (arg) => arg;
const isFn = (arg) => typeOf(arg) === "function";
const isNumber = (arg) => typeOf(arg) === "number" && !Number.isNaN(arg);
const isString = (arg) => typeOf(arg) === "string";
const globalToString = (arg) => ObjectCls.prototype.toString.call(arg);
const isPlainObject = (arg) => globalToString(arg) === "[object Object]";
const instanceOf = (arg, cls) => arg instanceof cls;
const getTime = (date) => date ? date.getTime() : Date.now();
const getContext = (methodInstance) => methodInstance.context;
const getConfig = (methodInstance) => methodInstance.config;
const getContextOptions = (alovaInstance2) => alovaInstance2.options;
const getOptions = (methodInstance) => getContextOptions(getContext(methodInstance));
const key = (methodInstance) => {
  const { params, headers } = getConfig(methodInstance);
  return JSONStringify([methodInstance.type, methodInstance.url, params, methodInstance.data, headers]);
};
const getMethodInternalKey = (methodInstance) => methodInstance.key;
const getHandlerMethod = (methodHandler, assert, args = []) => {
  const methodInstance = isFn(methodHandler) ? methodHandler(...args) : methodHandler;
  assert(!!methodInstance.key, "hook handler must be a method instance or a function that returns method instance");
  return methodInstance;
};
const isSpecialRequestBody = (data) => {
  const dataTypeString = globalToString(data);
  return /^\[object (Blob|FormData|ReadableStream|URLSearchParams)\]$/i.test(dataTypeString) || instanceOf(data, ArrayBuffer);
};
const objAssign = (target, ...sources) => ObjectCls.assign(target, ...sources);
const omit = (obj, ...keys) => {
  const result = {};
  for (const key2 in obj) {
    if (!keys.includes(key2)) {
      result[key2] = obj[key2];
    }
  }
  return result;
};
function usePromise() {
  let retResolve;
  let retReject;
  const promise = new Promise((resolve, reject) => {
    retResolve = resolve;
    retReject = reject;
  });
  return { promise, resolve: retResolve, reject: retReject };
}
const getLocalCacheConfigParam = (methodInstance) => {
  const { cacheFor } = getConfig(methodInstance);
  const getCacheExpireTs = (cacheExpire) => isNumber(cacheExpire) ? getTime() + cacheExpire : getTime(cacheExpire || undefinedValue);
  let cacheMode = MEMORY;
  let expire = () => 0;
  let store = falseValue;
  let tag = undefinedValue;
  const controlled = isFn(cacheFor);
  if (!controlled) {
    let expireColumn = cacheFor;
    if (isPlainObject(cacheFor)) {
      const { mode = MEMORY, expire: expire2, tag: configTag } = cacheFor || {};
      cacheMode = mode;
      store = mode === STORAGE_RESTORE;
      tag = configTag ? configTag.toString() : undefinedValue;
      expireColumn = expire2;
    }
    expire = (mode) => getCacheExpireTs(isFn(expireColumn) ? expireColumn({ method: methodInstance, mode }) : expireColumn);
  }
  return {
    f: cacheFor,
    c: controlled,
    e: expire,
    m: cacheMode,
    s: store,
    t: tag
  };
};
const newInstance = (Cls, ...args) => new Cls(...args);
const sloughConfig = (config, args = []) => isFn(config) ? config(...args) : config;
const sloughFunction = (arg, defaultFn) => isFn(arg) ? arg : ![falseValue, nullValue].includes(arg) ? defaultFn : noop;
const createSyncOnceRunner = (delay = 0) => {
  let timer = undefinedValue;
  return (fn) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeoutFn(fn, delay);
  };
};
const cacheKeyPrefix = "$a.";
const buildNamespacedCacheKey = (namespace, key2) => cacheKeyPrefix + namespace + key2;
const buildCompletedURL = (baseURL, url, params) => {
  const startsWithPrefix = /^https?:\/\//i.test(url);
  if (!startsWithPrefix) {
    baseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    if (url !== "") {
      url = url.startsWith("/") ? url : `/${url}`;
    }
  }
  const completeURL = startsWithPrefix ? url : baseURL + url;
  const paramsStr = isString(params) ? params : mapItem(filterItem(objectKeys(params), (key2) => params[key2] !== undefinedValue), (key2) => `${key2}=${params[key2]}`).join("&");
  return paramsStr ? +completeURL.includes("?") ? `${completeURL}&${paramsStr}` : `${completeURL}?${paramsStr}` : completeURL;
};
const deepClone = (obj) => {
  if (isArray(obj)) {
    return mapItem(obj, deepClone);
  }
  if (isPlainObject(obj) && obj.constructor === ObjectCls) {
    const clone = {};
    forEach(objectKeys(obj), (key2) => {
      clone[key2] = deepClone(obj[key2]);
    });
    return clone;
  }
  return obj;
};
class AlovaError extends Error {
  constructor(prefix, message, errorCode) {
    super(message + (errorCode ? `

For detailed: https://alova.js.org/error#${errorCode}` : ""));
    this.name = `[alova${prefix ? `/${prefix}` : ""}]`;
  }
}
const createAssert = (prefix = "") => (expression, message, errorCode) => {
  if (!expression) {
    throw newInstance(AlovaError, prefix, message, errorCode);
  }
};
const bridgeObject = JSON.parse;
const injectReferingObject = () => bridgeObject.bridgeData || {};
const createEventManager = () => {
  const eventMap = {};
  return {
    eventMap,
    on(type, handler) {
      const eventTypeItem = eventMap[type] = eventMap[type] || [];
      pushItem(eventTypeItem, handler);
      return () => {
        eventMap[type] = filterItem(eventTypeItem, (item) => item !== handler);
      };
    },
    off(type, handler) {
      const handlers = eventMap[type];
      if (!handlers) {
        return;
      }
      if (handler) {
        const index = handlers.indexOf(handler);
        index > -1 && handlers.splice(index, 1);
      } else {
        delete eventMap[type];
      }
    },
    emit(type, event) {
      const handlers = eventMap[type] || [];
      return mapItem(handlers, (handler) => handler(event));
    }
  };
};
class FrameworkReadableState {
  constructor(state, key2, dehydrate, exportState) {
    this.s = state;
    this.k = key2;
    this.$dhy = dehydrate;
    this.$exp = exportState;
  }
  get v() {
    return this.$dhy(this.s);
  }
  get e() {
    return this.$exp(this.s);
  }
}
class FrameworkState extends FrameworkReadableState {
  constructor(state, key2, dehydrate, exportState, update) {
    super(state, key2, dehydrate, exportState);
    this.$upd = update;
  }
  set v(newValue) {
    this.$upd(this.s, newValue);
  }
  get v() {
    return this.$dhy(this.s);
  }
}
let globalConfigMap = {
  autoHitCache: "global",
  ssr: isSSR
};
const titleStyle = "color: black; font-size: 12px; font-weight: bolder";
var defaultCacheLogger = (response, methodInstance, cacheMode, tag) => {
  const cole = console;
  const log = (...args) => console.log(...args);
  const { url } = methodInstance;
  const isRestoreMode = cacheMode === STORAGE_RESTORE;
  const hdStyle = "\x1B[42m%s\x1B[49m";
  const labelStyle = "\x1B[32m%s\x1B[39m";
  const startSep = ` [HitCache]${url} `;
  const endSepFn = () => Array(len(startSep) + 1).join("^");
  if (globalConfigMap.ssr) {
    log(hdStyle, startSep);
    log(labelStyle, " Cache ", response);
    log(labelStyle, " Mode  ", cacheMode);
    isRestoreMode && log(labelStyle, " Tag   ", tag);
    log(labelStyle, endSepFn());
  } else {
    cole.groupCollapsed ? cole.groupCollapsed("%cHitCache", "padding: 2px 6px; background: #c4fcd3; color: #53b56d;", url) : log(hdStyle, startSep);
    log("%c[Cache]", titleStyle, response);
    log("%c[Mode]", titleStyle, cacheMode);
    isRestoreMode && log("%c[Tag]", titleStyle, tag);
    log("%c[Method]", titleStyle, methodInstance);
    cole.groupEnd ? cole.groupEnd() : log(labelStyle, endSepFn());
  }
};
const hitSourceStringCacheKey = (key2) => `hss.${key2}`;
const hitSourceRegexpPrefix = "hsr.";
const hitSourceRegexpCacheKey = (regexpStr) => hitSourceRegexpPrefix + regexpStr;
const unifiedHitSourceRegexpCacheKey = "$$hsrs";
const regexpSourceFlagSeparator = "__$<>$__";
const addItem = (obj, item) => {
  obj[item] = 0;
};
const setWithCacheAdapter = (namespace, key2, data, expireTimestamp, cacheAdapter, hitSource, tag) => __async(exports, null, function* () {
  if (expireTimestamp > getTime() && data) {
    const methodCacheKey = buildNamespacedCacheKey(namespace, key2);
    yield cacheAdapter.set(methodCacheKey, filterItem([data, expireTimestamp === Infinity ? undefinedValue : expireTimestamp, tag], Boolean));
    if (hitSource) {
      const hitSourceKeys = {};
      const hitSourceRegexpSources = [];
      forEach(hitSource, (sourceItem) => {
        const isRegexp = instanceOf(sourceItem, RegExpCls);
        const targetHitSourceKey = isRegexp ? sourceItem.source + (sourceItem.flags ? regexpSourceFlagSeparator + sourceItem.flags : "") : sourceItem;
        if (targetHitSourceKey) {
          if (isRegexp && !hitSourceKeys[targetHitSourceKey]) {
            pushItem(hitSourceRegexpSources, targetHitSourceKey);
          }
          addItem(hitSourceKeys, isRegexp ? hitSourceRegexpCacheKey(targetHitSourceKey) : hitSourceStringCacheKey(targetHitSourceKey));
        }
      });
      const promises = mapItem(objectKeys(hitSourceKeys), (hitSourceKey) => __async(exports, null, function* () {
        const targetMethodKeys = (yield cacheAdapter.get(hitSourceKey)) || {};
        addItem(targetMethodKeys, methodCacheKey);
        yield cacheAdapter.set(hitSourceKey, targetMethodKeys);
      }));
      const saveRegexp = () => __async(exports, null, function* () {
        if (len(hitSourceRegexpSources)) {
          const regexpList = (yield cacheAdapter.get(unifiedHitSourceRegexpCacheKey)) || [];
          pushItem(regexpList, ...hitSourceRegexpSources);
          yield cacheAdapter.set(unifiedHitSourceRegexpCacheKey, regexpList);
        }
      });
      yield PromiseCls.all([...promises, saveRegexp()]);
    }
  }
});
const removeWithCacheAdapter = (namespace, key2, cacheAdapter) => __async(exports, null, function* () {
  const methodStoreKey = buildNamespacedCacheKey(namespace, key2);
  yield cacheAdapter.remove(methodStoreKey);
});
const getRawWithCacheAdapter = (namespace, key2, cacheAdapter, tag) => __async(exports, null, function* () {
  const storagedData = yield cacheAdapter.get(buildNamespacedCacheKey(namespace, key2));
  if (storagedData) {
    const [dataUnused, expireTimestamp, storedTag] = storagedData;
    if (storedTag === tag && (!expireTimestamp || expireTimestamp > getTime())) {
      return storagedData;
    }
    yield removeWithCacheAdapter(namespace, key2, cacheAdapter);
  }
});
const getWithCacheAdapter = (namespace, key2, cacheAdapter, tag) => __async(exports, null, function* () {
  const rawData = yield getRawWithCacheAdapter(namespace, key2, cacheAdapter, tag);
  return rawData ? rawData[0] : undefinedValue;
});
const hitTargetCacheWithCacheAdapter = (sourceKey, sourceName, cacheAdapter) => __async(exports, null, function* () {
  const sourceNameStr = `${sourceName}`;
  const sourceTargetKeyMap = {};
  const hitSourceKey = hitSourceStringCacheKey(sourceKey);
  sourceTargetKeyMap[hitSourceKey] = yield cacheAdapter.get(hitSourceKey);
  let unifiedHitSourceRegexpChannel;
  if (sourceName) {
    const hitSourceName = hitSourceStringCacheKey(sourceNameStr);
    sourceTargetKeyMap[hitSourceName] = yield cacheAdapter.get(hitSourceName);
    unifiedHitSourceRegexpChannel = yield cacheAdapter.get(unifiedHitSourceRegexpCacheKey);
    const matchedRegexpStrings = [];
    if (unifiedHitSourceRegexpChannel && len(unifiedHitSourceRegexpChannel)) {
      forEach(unifiedHitSourceRegexpChannel, (regexpStr) => {
        const [source, flag] = regexpStr.split(regexpSourceFlagSeparator);
        if (newInstance(RegExpCls, source, flag).test(sourceNameStr)) {
          pushItem(matchedRegexpStrings, regexpStr);
        }
      });
      yield PromiseCls.all(mapItem(matchedRegexpStrings, (regexpString) => __async(exports, null, function* () {
        const hitSourceRegexpString = hitSourceRegexpCacheKey(regexpString);
        sourceTargetKeyMap[hitSourceRegexpString] = yield cacheAdapter.get(hitSourceRegexpString);
      })));
    }
  }
  const removeWithTargetKey = (targetKey) => __async(exports, null, function* () {
    try {
      yield cacheAdapter.remove(targetKey);
      for (const sourceKey2 in sourceTargetKeyMap) {
        const targetKeys = sourceTargetKeyMap[sourceKey2];
        if (targetKeys) {
          deleteAttr(targetKeys, targetKey);
        }
      }
    } catch (_a) {
    }
  });
  const accessedKeys = {};
  yield PromiseCls.all(mapItem(objectKeys(sourceTargetKeyMap), (sourceKey2) => __async(exports, null, function* () {
    const targetKeys = sourceTargetKeyMap[sourceKey2];
    if (targetKeys) {
      const removingPromises = [];
      for (const key2 in targetKeys) {
        if (!accessedKeys[key2]) {
          addItem(accessedKeys, key2);
          pushItem(removingPromises, removeWithTargetKey(key2));
        }
      }
      yield PromiseCls.all(removingPromises);
    }
  })));
  const unifiedHitSourceRegexpChannelLen = len(unifiedHitSourceRegexpChannel || []);
  yield PromiseCls.all(mapItem(objectKeys(sourceTargetKeyMap), (sourceKey2) => __async(exports, null, function* () {
    const targetKeys = sourceTargetKeyMap[sourceKey2];
    if (targetKeys) {
      if (len(objectKeys(targetKeys))) {
        yield cacheAdapter.set(sourceKey2, targetKeys);
      } else {
        yield cacheAdapter.remove(sourceKey2);
        if (sourceKey2.includes(hitSourceRegexpPrefix) && unifiedHitSourceRegexpChannel) {
          unifiedHitSourceRegexpChannel = filterItem(unifiedHitSourceRegexpChannel, (rawRegexpStr) => hitSourceRegexpCacheKey(rawRegexpStr) !== sourceKey2);
        }
      }
    }
  })));
  if (unifiedHitSourceRegexpChannelLen !== len(unifiedHitSourceRegexpChannel || [])) {
    yield cacheAdapter.set(unifiedHitSourceRegexpCacheKey, unifiedHitSourceRegexpChannel);
  }
});
var cloneMethod = (methodInstance) => {
  const { data, config } = methodInstance;
  const newConfig = __spreadValues({}, config);
  const { headers = {}, params = {} } = newConfig;
  const ctx = getContext(methodInstance);
  newConfig.headers = __spreadValues({}, headers);
  newConfig.params = isString(params) ? params : __spreadValues({}, params);
  const newMethod = newInstance(Method, methodInstance.type, ctx, methodInstance.url, newConfig, data);
  return objAssign(newMethod, __spreadProps(__spreadValues({}, methodInstance), {
    config: newConfig
  }));
};
const queryCache = (_0, ..._1) => __async(exports, [_0, ..._1], function* (matcher, { policy = "all" } = {}) {
  if (matcher && matcher.key) {
    const { id, l1Cache, l2Cache } = getContext(matcher);
    const methodKey = getMethodInternalKey(matcher);
    const { f: cacheFor, c: controlled, s: store, e: expireMilliseconds, t: tag } = getLocalCacheConfigParam(matcher);
    if (controlled) {
      return cacheFor();
    }
    let cachedData = policy !== "l2" ? yield getWithCacheAdapter(id, methodKey, l1Cache) : undefinedValue;
    if (policy === "l2") {
      cachedData = yield getWithCacheAdapter(id, methodKey, l2Cache, tag);
    } else if (policy === "all" && !cachedData) {
      if (store && expireMilliseconds(STORAGE_RESTORE) > getTime()) {
        cachedData = yield getWithCacheAdapter(id, methodKey, l2Cache, tag);
      }
    }
    return cachedData;
  }
});
const hitCacheBySource = (sourceMethod) => __async(exports, null, function* () {
  const { autoHitCache } = globalConfigMap;
  const { l1Cache, l2Cache } = getContext(sourceMethod);
  const sourceKey = getMethodInternalKey(sourceMethod);
  const { name: sourceName } = getConfig(sourceMethod);
  const cacheAdaptersInvolved = {
    global: [...usingL1CacheAdapters, ...usingL2CacheAdapters],
    self: [l1Cache, l2Cache],
    close: []
  }[autoHitCache];
  if (cacheAdaptersInvolved && len(cacheAdaptersInvolved)) {
    yield PromiseCls.all(mapItem(cacheAdaptersInvolved, (involvedCacheAdapter) => hitTargetCacheWithCacheAdapter(sourceKey, sourceName, involvedCacheAdapter)));
  }
});
const adapterReturnMap = {};
function sendRequest(methodInstance, forceRequest) {
  let fromCache = trueValue;
  let requestAdapterCtrlsPromiseResolveFn;
  const requestAdapterCtrlsPromise = newInstance(PromiseCls, (resolve) => {
    requestAdapterCtrlsPromiseResolveFn = resolve;
  });
  const response = () => __async(this, null, function* () {
    const { beforeRequest = noop, responded, requestAdapter: requestAdapter2, cacheLogger } = getOptions(methodInstance);
    const methodKey = getMethodInternalKey(methodInstance);
    const { s: toStorage, t: tag, m: cacheMode, e: expireMilliseconds } = getLocalCacheConfigParam(methodInstance);
    const { id, l1Cache, l2Cache, snapshots } = getContext(methodInstance);
    const { cacheFor } = getConfig(methodInstance);
    const { hitSource: methodHitSource } = methodInstance;
    let cachedResponse = yield isFn(cacheFor) ? cacheFor() : (
      // If it is a forced request, skip the step of getting it from the cache
      // Otherwise, determine whether to use cached data
      forceRequest ? undefinedValue : getWithCacheAdapter(id, methodKey, l1Cache)
    );
    if (cacheMode === STORAGE_RESTORE && !cachedResponse && !forceRequest) {
      const rawL2CacheData = yield getRawWithCacheAdapter(id, methodKey, l2Cache, tag);
      if (rawL2CacheData) {
        const [l2Response, l2ExpireMilliseconds] = rawL2CacheData;
        yield setWithCacheAdapter(id, methodKey, l2Response, l2ExpireMilliseconds, l1Cache, methodHitSource);
        cachedResponse = l2Response;
      }
    }
    const clonedMethod = cloneMethod(methodInstance);
    yield beforeRequest(clonedMethod);
    const { baseURL, url: newUrl, type, data } = clonedMethod;
    const { params = {}, headers = {}, transform = $self, shareRequest } = getConfig(clonedMethod);
    const namespacedAdapterReturnMap = adapterReturnMap[id] = adapterReturnMap[id] || {};
    const requestBody = clonedMethod.data;
    const requestBodyIsSpecial = isSpecialRequestBody(requestBody);
    let requestAdapterCtrls = requestBodyIsSpecial ? undefinedValue : namespacedAdapterReturnMap[methodKey];
    let responseSuccessHandler = $self;
    let responseErrorHandler = undefinedValue;
    let responseCompleteHandler = noop;
    if (isFn(responded)) {
      responseSuccessHandler = responded;
    } else if (isPlainObject(responded)) {
      const { onSuccess: successHandler, onError: errorHandler, onComplete: completeHandler } = responded;
      responseSuccessHandler = isFn(successHandler) ? successHandler : responseSuccessHandler;
      responseErrorHandler = isFn(errorHandler) ? errorHandler : responseErrorHandler;
      responseCompleteHandler = isFn(completeHandler) ? completeHandler : responseCompleteHandler;
    }
    if (cachedResponse !== undefinedValue) {
      requestAdapterCtrlsPromiseResolveFn();
      clonedMethod.fromCache = trueValue;
      sloughFunction(cacheLogger, defaultCacheLogger)(cachedResponse, clonedMethod, cacheMode, tag);
      responseCompleteHandler(clonedMethod);
      return cachedResponse;
    }
    fromCache = falseValue;
    if (!shareRequest || !requestAdapterCtrls) {
      const ctrls = requestAdapter2({
        url: buildCompletedURL(baseURL, newUrl, params),
        type,
        data,
        headers
      }, clonedMethod);
      requestAdapterCtrls = namespacedAdapterReturnMap[methodKey] = ctrls;
    }
    requestAdapterCtrlsPromiseResolveFn(requestAdapterCtrls);
    const handleResponseTask = (_0, _1, ..._2) => __async(this, [_0, _1, ..._2], function* (handlerReturns, responseHeaders, callInSuccess = trueValue) {
      const responseData = yield handlerReturns;
      const transformedData = yield transform(responseData, responseHeaders || {});
      snapshots.save(methodInstance);
      try {
        yield hitCacheBySource(clonedMethod);
      } catch (_a) {
      }
      const toCache = !requestBody || !requestBodyIsSpecial;
      if (toCache && callInSuccess) {
        try {
          yield PromiseCls.all([
            setWithCacheAdapter(id, methodKey, transformedData, expireMilliseconds(MEMORY), l1Cache, methodHitSource),
            toStorage && setWithCacheAdapter(id, methodKey, transformedData, expireMilliseconds(STORAGE_RESTORE), l2Cache, methodHitSource, tag)
          ]);
        } catch (_b) {
        }
      }
      return deepClone(transformedData);
    });
    return promiseFinally(promiseThen(PromiseCls.all([requestAdapterCtrls.response(), requestAdapterCtrls.headers()]), ([rawResponse, rawHeaders]) => {
      deleteAttr(namespacedAdapterReturnMap, methodKey);
      return handleResponseTask(responseSuccessHandler(rawResponse, clonedMethod), rawHeaders);
    }, (error) => {
      deleteAttr(namespacedAdapterReturnMap, methodKey);
      return isFn(responseErrorHandler) ? (
        // When responding to an error, if no error is thrown, the successful response process will be processed, but the data will not be cached.
        handleResponseTask(responseErrorHandler(error, clonedMethod), undefinedValue, falseValue)
      ) : promiseReject(error);
    }), () => {
      responseCompleteHandler(clonedMethod);
    });
  });
  return {
    // request interrupt function
    abort: () => {
      promiseThen(requestAdapterCtrlsPromise, (requestAdapterCtrls) => requestAdapterCtrls && requestAdapterCtrls.abort());
    },
    onDownload: (handler) => {
      promiseThen(requestAdapterCtrlsPromise, (requestAdapterCtrls) => requestAdapterCtrls && requestAdapterCtrls.onDownload && requestAdapterCtrls.onDownload(handler));
    },
    onUpload: (handler) => {
      promiseThen(requestAdapterCtrlsPromise, (requestAdapterCtrls) => requestAdapterCtrls && requestAdapterCtrls.onUpload && requestAdapterCtrls.onUpload(handler));
    },
    response,
    fromCache: () => fromCache
  };
}
const offEventCallback = (offHandler, handlers) => () => {
  const index = handlers.indexOf(offHandler);
  index >= 0 && handlers.splice(index, 1);
};
class Method {
  constructor(type, context, url, config, data) {
    this.dhs = [];
    this.uhs = [];
    this.fromCache = undefinedValue;
    const abortRequest = () => {
      abortRequest.a();
    };
    abortRequest.a = noop;
    type = type.toUpperCase();
    const instance = this;
    const contextOptions = getContextOptions(context);
    instance.abort = abortRequest;
    instance.baseURL = contextOptions.baseURL || "";
    instance.url = url;
    instance.type = type;
    instance.context = context;
    const contextConcatConfig = {};
    const mergedLocalCacheKey = "cacheFor";
    const globalLocalCache = isPlainObject(contextOptions[mergedLocalCacheKey]) ? contextOptions[mergedLocalCacheKey][type] : undefinedValue;
    const hitSource = config && config.hitSource;
    forEach(["timeout", "shareRequest"], (mergedKey) => {
      if (contextOptions[mergedKey] !== undefinedValue) {
        contextConcatConfig[mergedKey] = contextOptions[mergedKey];
      }
    });
    if (globalLocalCache !== undefinedValue) {
      contextConcatConfig[mergedLocalCacheKey] = globalLocalCache;
    }
    if (hitSource) {
      instance.hitSource = mapItem(isArray(hitSource) ? hitSource : [hitSource], (sourceItem) => instanceOf(sourceItem, Method) ? getMethodInternalKey(sourceItem) : sourceItem);
      deleteAttr(config, "hitSource");
    }
    instance.config = __spreadValues(__spreadProps(__spreadValues({}, contextConcatConfig), {
      headers: {},
      params: {}
    }), config || {});
    instance.data = data;
    instance.meta = config ? config.meta : instance.meta;
    instance.key = instance.generateKey();
  }
  /**
   * Bind download progress callback function
   * @param progressHandler Download progress callback function
   * @version 2.17.0
   * @return unbind function
   */
  onDownload(downloadHandler) {
    pushItem(this.dhs, downloadHandler);
    return offEventCallback(downloadHandler, this.dhs);
  }
  /**
   * Bind upload progress callback function
   * @param progressHandler Upload progress callback function
   * @version 2.17.0
   * @return unbind function
   */
  onUpload(uploadHandler) {
    pushItem(this.uhs, uploadHandler);
    return offEventCallback(uploadHandler, this.uhs);
  }
  /**
   * Send a request through a method instance and return a promise object
   */
  send(forceRequest = falseValue) {
    const instance = this;
    const { response, onDownload, onUpload, abort, fromCache } = sendRequest(instance, forceRequest);
    len(instance.dhs) > 0 && onDownload((loaded, total) => forEach(instance.dhs, (handler) => handler({ loaded, total })));
    len(instance.uhs) > 0 && onUpload((loaded, total) => forEach(instance.uhs, (handler) => handler({ loaded, total })));
    instance.abort.a = abort;
    instance.fromCache = undefinedValue;
    instance.promise = promiseThen(response(), (r) => {
      instance.fromCache = fromCache();
      return r;
    });
    return instance.promise;
  }
  /**
   * Set the method name, if there is already a name it will be overwritten
   * @param name method name
   */
  setName(name) {
    getConfig(this).name = name;
  }
  generateKey() {
    return key(this);
  }
  /**
   * Bind callbacks for resolve and/or reject Promise
   * @param onfulfilled The callback to be executed when resolving the Promise
   * @param onrejected The callback to be executed when the Promise is rejected
   * @returns Returns a Promise for executing any callbacks
   */
  then(onfulfilled, onrejected) {
    return promiseThen(this.send(), onfulfilled, onrejected);
  }
  /**
   * Bind a callback only for reject Promise
   * @param onrejected The callback to be executed when the Promise is rejected
   * @returns Returns a Promise that completes the callback
   */
  catch(onrejected) {
    return promiseCatch(this.send(), onrejected);
  }
  /**
   * Bind a callback that is called when the Promise is resolved (resolve or reject)
   * @param onfinally Callback executed when Promise is resolved (resolve or reject).
   * @return Returns a Promise that completes the callback.
   */
  finally(onfinally) {
    return promiseFinally(this.send(), onfinally);
  }
}
const myAssert = createAssert();
const EVENT_SUCCESS_KEY = "success";
const memoryAdapter = () => {
  let l1Cache = {};
  const l1CacheEmitter = createEventManager();
  const adapter = {
    set(key2, value) {
      l1Cache[key2] = value;
      l1CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "set", key: key2, value, container: l1Cache });
    },
    get: (key2) => {
      const value = l1Cache[key2];
      l1CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "get", key: key2, value, container: l1Cache });
      return value;
    },
    remove(key2) {
      deleteAttr(l1Cache, key2);
      l1CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "remove", key: key2, container: l1Cache });
    },
    clear: () => {
      l1Cache = {};
      l1CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "clear", key: "", container: l1Cache });
    },
    emitter: l1CacheEmitter
  };
  return adapter;
};
const localStorageAdapter = () => {
  const l2CacheEmitter = createEventManager();
  const instance = localStorage;
  const adapter = {
    set: (key2, value) => {
      instance.setItem(key2, JSONStringify(value));
      l2CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "set", key: key2, value, container: instance });
    },
    get: (key2) => {
      const data = instance.getItem(key2);
      const value = data ? JSONParse(data) : data;
      l2CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "get", key: key2, value, container: instance });
      return value;
    },
    remove: (key2) => {
      instance.removeItem(key2);
      l2CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "remove", key: key2, container: instance });
    },
    clear: () => {
      instance.clear();
      l2CacheEmitter.emit(EVENT_SUCCESS_KEY, { type: "clear", key: "", container: instance });
    },
    emitter: l2CacheEmitter
  };
  return adapter;
};
const placeholderAdapter = () => {
  const l2CacheNotDefinedAssert = () => {
    myAssert(falseValue, "l2Cache is not defined.");
  };
  return {
    set: () => {
      l2CacheNotDefinedAssert();
    },
    get: () => {
      l2CacheNotDefinedAssert();
      return undefinedValue;
    },
    remove: () => {
      l2CacheNotDefinedAssert();
    },
    clear: () => {
    }
  };
};
const SetCls = Set;
class MethodSnapshotContainer {
  constructor(capacity) {
    this.records = {};
    this.occupy = 0;
    myAssert(capacity >= 0, "expected snapshots limit to be >= 0");
    this.capacity = capacity;
  }
  /**
   * Save method instance snapshot
   * @param methodInstance method instance
   */
  save(methodInstance) {
    const { name } = getConfig(methodInstance);
    const { records, occupy, capacity } = this;
    if (name && occupy < capacity) {
      const targetSnapshots = records[name] = records[name] || newInstance(SetCls);
      targetSnapshots.add(methodInstance);
      this.occupy += 1;
    }
  }
  /**
   * Get a Method instance snapshot, which will filter out the corresponding Method instance based on the matcher
   * @param matcher Matching snapshot name, which can be a string or regular expression, or an object with a filter function
   * @returns Array of matched Method instance snapshots
   */
  match(matcher, matchAll = true) {
    let nameString;
    let nameReg;
    let matchHandler;
    let nameMatcher = matcher;
    if (isPlainObject(matcher)) {
      nameMatcher = matcher.name;
      matchHandler = matcher.filter;
    }
    if (instanceOf(nameMatcher, RegExpCls)) {
      nameReg = nameMatcher;
    } else if (isString(nameMatcher)) {
      nameString = nameMatcher;
    }
    const { records } = this;
    let matches = newInstance(SetCls);
    if (nameString) {
      matches = records[nameString] || matches;
    } else if (nameReg) {
      forEach(filterItem(objectKeys(records), (methodName) => nameReg.test(methodName)), (methodName) => {
        records[methodName].forEach((method) => matches.add(method));
      });
    }
    const fromMatchesArray = isFn(matchHandler) ? filterItem([...matches], matchHandler) : [...matches];
    return matchAll ? fromMatchesArray : fromMatchesArray[0];
  }
}
const typeGet = "GET";
const typeHead = "HEAD";
const typePost = "POST";
const typePut = "PUT";
const typePatch = "PATCH";
const typeDelete = "DELETE";
const typeOptions = "OPTIONS";
const defaultAlovaOptions = {
  /**
   * GET requests are cached for 5 minutes (300000 milliseconds) by default, and other requests are not cached by default.
   */
  cacheFor: {
    [typeGet]: 3e5
  },
  /**
   * Share requests default to true
   */
  shareRequest: trueValue,
  /**
   * Number of method snapshots, default is 1000
   */
  snapshots: 1e3
};
let idCount = 0;
class Alova {
  constructor(options) {
    var _a, _b;
    const instance = this;
    instance.id = (options.id || (idCount += 1)).toString();
    instance.l1Cache = options.l1Cache || memoryAdapter();
    instance.l2Cache = options.l2Cache || (typeof localStorage !== "undefined" ? localStorageAdapter() : placeholderAdapter());
    instance.options = __spreadValues(__spreadValues({}, defaultAlovaOptions), options);
    instance.snapshots = newInstance(MethodSnapshotContainer, (_b = (_a = options.snapshots) !== null && _a !== void 0 ? _a : defaultAlovaOptions.snapshots) !== null && _b !== void 0 ? _b : 0);
  }
  Request(config) {
    return newInstance(Method, config.method || typeGet, this, config.url, config, config.data);
  }
  Get(url, config) {
    return newInstance(Method, typeGet, this, url, config);
  }
  Post(url, data, config) {
    return newInstance(Method, typePost, this, url, config, data);
  }
  Delete(url, data, config) {
    return newInstance(Method, typeDelete, this, url, config, data);
  }
  Put(url, data, config) {
    return newInstance(Method, typePut, this, url, config, data);
  }
  Head(url, config) {
    return newInstance(Method, typeHead, this, url, config);
  }
  Patch(url, data, config) {
    return newInstance(Method, typePatch, this, url, config, data);
  }
  Options(url, config) {
    return newInstance(Method, typeOptions, this, url, config);
  }
}
let boundStatesHook = undefinedValue;
const usingL1CacheAdapters = [];
const usingL2CacheAdapters = [];
const createAlova = (options) => {
  const alovaInstance2 = newInstance(Alova, options);
  const newStatesHook = alovaInstance2.options.statesHook;
  if (boundStatesHook && newStatesHook) {
    myAssert(boundStatesHook.name === newStatesHook.name, "expected to use the same `statesHook`");
  }
  boundStatesHook = newStatesHook;
  const { l1Cache, l2Cache } = alovaInstance2;
  !usingL1CacheAdapters.includes(l1Cache) && pushItem(usingL1CacheAdapters, l1Cache);
  !usingL2CacheAdapters.includes(l2Cache) && pushItem(usingL2CacheAdapters, l2Cache);
  return alovaInstance2;
};
const promiseStatesHook = () => {
  myAssert(boundStatesHook, "`statesHook` is not set in alova instance");
  return boundStatesHook;
};
const defaultVisitorMeta = {
  authRole: null
};
const defaultLoginMeta = {
  authRole: "login"
};
const defaultLogoutMeta = {
  authRole: "logout"
};
const defaultRefreshTokenMeta = {
  authRole: "refreshToken"
};
const checkMethodRole = ({ meta }, metaMatches) => {
  if (isPlainObject(meta)) {
    for (const key2 in meta) {
      if (Object.prototype.hasOwnProperty.call(meta, key2)) {
        const matchedMetaItem = metaMatches[key2];
        if (instanceOf(matchedMetaItem, RegExp) ? matchedMetaItem.test(meta[key2]) : meta[key2] === matchedMetaItem) {
          return trueValue;
        }
      }
    }
  }
  return falseValue;
};
const waitForTokenRefreshed = (method, waitingList) => newInstance(PromiseCls, (resolve) => {
  pushItem(waitingList, {
    method,
    resolve
  });
});
const callHandlerIfMatchesMeta = (method, authorizationInterceptor, defaultMeta, response) => {
  if (checkMethodRole(method, (authorizationInterceptor === null || authorizationInterceptor === void 0 ? void 0 : authorizationInterceptor.metaMatches) || defaultMeta)) {
    const handler = isFn(authorizationInterceptor) ? authorizationInterceptor : isPlainObject(authorizationInterceptor) && isFn(authorizationInterceptor.handler) ? authorizationInterceptor.handler : noop;
    return handler(response, method);
  }
};
const refreshTokenIfExpired = (method, waitingList, updateRefreshStatus, handlerParams, refreshToken, tokenRefreshing) => __async(exports, null, function* () {
  const fromResponse = len(handlerParams) >= 2;
  let isExpired = refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.isExpired(...handlerParams);
  if (instanceOf(isExpired, PromiseCls)) {
    isExpired = yield isExpired;
  }
  if (isExpired) {
    try {
      let intentToRefreshToken = trueValue;
      if (fromResponse && tokenRefreshing) {
        intentToRefreshToken = falseValue;
        yield waitForTokenRefreshed(method, waitingList);
      }
      if (intentToRefreshToken) {
        updateRefreshStatus(trueValue);
        yield refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.handler(...handlerParams);
        updateRefreshStatus(falseValue);
        forEach(waitingList, ({ resolve }) => resolve());
      }
      if (fromResponse) {
        const { config } = method;
        const methodTransformData = config.transform;
        config.transform = undefinedValue;
        const resentData = yield method;
        config.transform = methodTransformData;
        return resentData;
      }
    } finally {
      updateRefreshStatus(falseValue);
      splice(waitingList, 0, len(waitingList));
    }
  }
});
const onResponded2Record = (onRespondedHandlers) => {
  let successHandler = undefinedValue;
  let errorHandler = undefinedValue;
  let onCompleteHandler = undefinedValue;
  if (isFn(onRespondedHandlers)) {
    successHandler = onRespondedHandlers;
  } else if (isPlainObject(onRespondedHandlers)) {
    const { onSuccess, onError, onComplete } = onRespondedHandlers;
    successHandler = isFn(onSuccess) ? onSuccess : successHandler;
    errorHandler = isFn(onError) ? onError : errorHandler;
    onCompleteHandler = isFn(onComplete) ? onComplete : onCompleteHandler;
  }
  return {
    onSuccess: successHandler,
    onError: errorHandler,
    onComplete: onCompleteHandler
  };
};
const createServerTokenAuthentication = ({ visitorMeta, login, logout, refreshTokenOnSuccess, refreshTokenOnError, assignToken = noop }) => {
  let tokenRefreshing = falseValue;
  const waitingList = [];
  const onAuthRequired2 = (onBeforeRequest) => (method) => __async(exports, null, function* () {
    const isVisitorRole = checkMethodRole(method, visitorMeta || defaultVisitorMeta);
    const isLoginRole = checkMethodRole(method, (login === null || login === void 0 ? void 0 : login.metaMatches) || defaultLoginMeta);
    if (!isVisitorRole && !isLoginRole && !checkMethodRole(method, (refreshTokenOnSuccess === null || refreshTokenOnSuccess === void 0 ? void 0 : refreshTokenOnSuccess.metaMatches) || defaultRefreshTokenMeta) && !checkMethodRole(method, (refreshTokenOnError === null || refreshTokenOnError === void 0 ? void 0 : refreshTokenOnError.metaMatches) || defaultRefreshTokenMeta)) {
      if (tokenRefreshing) {
        yield waitForTokenRefreshed(method, waitingList);
      }
    }
    if (!isVisitorRole && !isLoginRole) {
      yield assignToken(method);
    }
    return onBeforeRequest === null || onBeforeRequest === void 0 ? void 0 : onBeforeRequest(method);
  });
  const onResponseRefreshToken2 = (onRespondedHandlers) => {
    const respondedRecord = onResponded2Record(onRespondedHandlers);
    return __spreadProps(__spreadValues({}, respondedRecord), {
      onSuccess: (response, method) => __async(exports, null, function* () {
        if (!checkMethodRole(method, visitorMeta || defaultVisitorMeta) && !checkMethodRole(method, (login === null || login === void 0 ? void 0 : login.metaMatches) || defaultLoginMeta) && !checkMethodRole(method, (refreshTokenOnSuccess === null || refreshTokenOnSuccess === void 0 ? void 0 : refreshTokenOnSuccess.metaMatches) || defaultRefreshTokenMeta)) {
          const dataResent = yield refreshTokenIfExpired(method, waitingList, (refreshing) => {
            tokenRefreshing = refreshing;
          }, [response, method], refreshTokenOnSuccess, tokenRefreshing);
          if (dataResent) {
            return dataResent;
          }
        }
        yield callHandlerIfMatchesMeta(method, login, defaultLoginMeta, response);
        yield callHandlerIfMatchesMeta(method, logout, defaultLogoutMeta, response);
        return (respondedRecord.onSuccess || $self)(response, method);
      }),
      onError: (error, method) => __async(exports, null, function* () {
        if (!checkMethodRole(method, visitorMeta || defaultVisitorMeta) && !checkMethodRole(method, (login === null || login === void 0 ? void 0 : login.metaMatches) || defaultLoginMeta) && !checkMethodRole(method, (refreshTokenOnError === null || refreshTokenOnError === void 0 ? void 0 : refreshTokenOnError.metaMatches) || defaultRefreshTokenMeta)) {
          const dataResent = yield refreshTokenIfExpired(method, waitingList, (refreshing) => {
            tokenRefreshing = refreshing;
          }, [error, method], refreshTokenOnError, tokenRefreshing);
          if (dataResent) {
            return dataResent;
          }
        }
        return (respondedRecord.onError || noop)(error, method);
      })
    });
  };
  return {
    waitingList,
    onAuthRequired: onAuthRequired2,
    onResponseRefreshToken: onResponseRefreshToken2
  };
};
const debounce = (fn, delay) => {
  let timer = nullValue;
  return function debounceFn(...args) {
    const bindFn = fn.bind(this, ...args);
    const delayMill = isNumber(delay) ? delay : delay(...args);
    timer && clearTimeoutTimer(timer);
    if (delayMill > 0) {
      timer = setTimeoutFn(bindFn, delayMill);
    } else {
      bindFn();
    }
  };
};
const mapObject = (obj, callback) => {
  const ret = {};
  for (const key2 in obj) {
    ret[key2] = callback(obj[key2], key2, obj);
  }
  return ret;
};
var EnumHookType;
(function(EnumHookType2) {
  EnumHookType2[EnumHookType2["USE_REQUEST"] = 1] = "USE_REQUEST";
  EnumHookType2[EnumHookType2["USE_WATCHER"] = 2] = "USE_WATCHER";
  EnumHookType2[EnumHookType2["USE_FETCHER"] = 3] = "USE_FETCHER";
})(EnumHookType || (EnumHookType = {}));
function statesHookHelper(statesHook2, referingObject = __spreadValues({
  trackedKeys: {},
  bindError: falseValue,
  initialRequest: falseValue
}, injectReferingObject())) {
  const ref = (initialValue) => statesHook2.ref ? statesHook2.ref(initialValue) : { current: initialValue };
  referingObject = ref(referingObject).current;
  const exportState = (state) => (statesHook2.export || $self)(state, referingObject);
  const memorize = (fn) => {
    if (!isFn(statesHook2.memorize)) {
      return fn;
    }
    const memorizedFn = statesHook2.memorize(fn);
    memorizedFn.memorized = trueValue;
    return memorizedFn;
  };
  const { dehydrate } = statesHook2;
  const update = (newValue, state, key2) => newValue !== dehydrate(state, key2, referingObject) && referingObject.trackedKeys[key2] && statesHook2.update(newValue, state, key2, referingObject);
  const mapDeps = (deps) => mapItem(deps, (item) => instanceOf(item, FrameworkReadableState) ? item.e : item);
  const createdStateList = [];
  const depKeys = {};
  return {
    create: (initialValue, key2) => {
      pushItem(createdStateList, key2);
      return newInstance(FrameworkState, statesHook2.create(initialValue, key2, referingObject), key2, (state) => dehydrate(state, key2, referingObject), exportState, (state, newValue) => update(newValue, state, key2));
    },
    computed: (getter, depList, key2) => {
      forEach(depList, (dep) => {
        if (dep.k) {
          depKeys[dep.k] = trueValue;
        }
      });
      return newInstance(FrameworkReadableState, statesHook2.computed(getter, mapDeps(depList), key2, referingObject), key2, (state) => dehydrate(state, key2, referingObject), exportState);
    },
    effectRequest: (effectRequestParams) => statesHook2.effectRequest(effectRequestParams, referingObject),
    ref,
    watch: (source, callback) => statesHook2.watch(mapDeps(source), callback, referingObject),
    onMounted: (callback) => statesHook2.onMounted(callback, referingObject),
    onUnmounted: (callback) => statesHook2.onUnmounted(callback, referingObject),
    memorize,
    /**
     * refering object that sharing some value with this object.
     */
    __referingObj: referingObject,
    /**
     * expose provider for specified use hook.
     * @param object object that contains state proxy, framework state, operating function and event binder.
     * @returns provider component.
     */
    exposeProvider: (object) => {
      const provider = {};
      const originalStatesMap = {};
      const stateKeys = [];
      for (const key2 in object) {
        const value = object[key2];
        const isValueFunction = isFn(value);
        if (isValueFunction && !referingObject.trackedKeys[key2]) {
          provider[key2] = key2.startsWith("on") ? (...args) => {
            value(...args);
            return completedProvider;
          } : value.memorized ? value : memorize(value);
        } else {
          if (!includes(["uploading", "downloading"], key2) && !key2.startsWith("__")) {
            pushItem(stateKeys, key2);
          }
          const isFrameworkState = instanceOf(value, FrameworkReadableState);
          if (isFrameworkState) {
            originalStatesMap[key2] = value.s;
          }
          ObjectCls.defineProperty(provider, key2, {
            get: () => {
              referingObject.trackedKeys[key2] = trueValue;
              return isFrameworkState ? value.e : value;
            },
            // set need to set an function,
            // otherwise it will throw `TypeError: Cannot set property __referingObj of #<Object> which has only a getter` when setting value
            set: noop,
            enumerable: trueValue,
            configurable: trueValue
          });
        }
      }
      const { update: nestedHookUpdate, __proxyState: nestedProxyState } = provider;
      referingObject.trackedKeys = __spreadValues({}, depKeys);
      referingObject.bindError = falseValue;
      const { then: providerThen } = provider;
      const extraProvider = {
        // expose referingObject automatically.
        __referingObj: referingObject,
        // the new updating function that can update the new states and nested hook states.
        update: memorize((newStates) => {
          objectKeys(newStates).forEach((key2) => {
            if (includes(createdStateList, key2)) {
              update(newStates[key2], originalStatesMap[key2], key2);
            } else if (key2 in provider && isFn(nestedHookUpdate)) {
              nestedHookUpdate({
                [key2]: newStates[key2]
              });
            }
          });
        }),
        __proxyState: memorize((key2) => {
          if (includes(createdStateList, key2) && instanceOf(object[key2], FrameworkReadableState)) {
            referingObject.trackedKeys[key2] = trueValue;
            return object[key2];
          }
          return nestedProxyState(key2);
        }),
        /**
         * send and wait for responding with `await`
         * this is always used in `nuxt3` and suspense in vue3
         * @example
         * ```js
         * const { loading, data, error } = await useRequest(...);
         * ```
         */
        then(onfulfilled, onrejected) {
          forEach(stateKeys, (key2) => {
            referingObject.trackedKeys[key2] = trueValue;
          });
          const handleFullfilled = () => {
            deleteAttr(completedProvider, "then");
            onfulfilled(completedProvider);
          };
          isFn(providerThen) ? providerThen(handleFullfilled, onrejected) : handleFullfilled();
        }
      };
      const completedProvider = objAssign(provider, extraProvider);
      return completedProvider;
    },
    /**
     * transform state proxies to object.
     * @param states proxy array of framework states
     * @param filterKey filter key of state proxy
     * @returns an object that contains the states of target form
     */
    objectify: (states, filterKey) => states.reduce((result, item) => {
      result[item.k] = filterKey ? item[filterKey] : item;
      return result;
    }, {}),
    transformState2Proxy: (state, key2) => newInstance(FrameworkState, state, key2, (state2) => dehydrate(state2, key2, referingObject), exportState, (state2, newValue) => update(newValue, state2, key2))
  };
}
const requestHookAssert = createAssert("useRequest");
const watcherHookAssert = createAssert("useWatcher");
const fetcherHookAssert = createAssert("useFetcher");
const coreHookAssert = (hookType) => ({
  [EnumHookType.USE_REQUEST]: requestHookAssert,
  [EnumHookType.USE_WATCHER]: watcherHookAssert,
  [EnumHookType.USE_FETCHER]: fetcherHookAssert
})[hookType];
const assertMethod = (assert, methodInstance) => assert(instanceOf(methodInstance, Method), "expected a method instance.");
const KEY_SUCCESS = "success";
const KEY_ERROR = "error";
const KEY_COMPLETE = "complete";
var createHook = (ht, c, eventManager, ro) => ({
  /** The method instance of the last request */
  m: undefinedValue,
  /** sent method keys */
  rf: {},
  /** frontStates */
  fs: {},
  /** eventManager */
  em: eventManager,
  /** hookType, useRequest=1, useWatcher=2, useFetcher=3 */
  ht,
  /** hook config */
  c,
  /** referingObject */
  ro,
  /** merged states */
  ms: {}
});
class AlovaEventBase {
  constructor(method, args) {
    this.method = method;
    this.args = args;
  }
  clone() {
    return __spreadValues({}, this);
  }
  static spawn(method, args) {
    return newInstance(AlovaEventBase, method, args);
  }
}
class AlovaSuccessEvent extends AlovaEventBase {
  constructor(base, data, fromCache) {
    super(base.method, base.args);
    this.data = data;
    this.fromCache = fromCache;
  }
}
class AlovaErrorEvent extends AlovaEventBase {
  constructor(base, error) {
    super(base.method, base.args);
    this.error = error;
  }
}
class AlovaCompleteEvent extends AlovaEventBase {
  constructor(base, status, data, fromCache, error) {
    super(base.method, base.args);
    this.status = status;
    this.data = data;
    this.fromCache = status === "error" ? false : fromCache;
    this.error = error;
  }
}
const defaultMiddleware = (_, next) => next();
const stateCache = {};
const getStateCache = (namespace, key2) => {
  const cachedState = stateCache[namespace] || {};
  return cachedState[key2] ? Array.from(cachedState[key2]) : [];
};
const setStateCache = (namespace, key2, hookInstance) => {
  const cachedState = stateCache[namespace] = stateCache[namespace] || {};
  if (!cachedState[key2]) {
    cachedState[key2] = newInstance(Set);
  }
  cachedState[key2].add(hookInstance);
};
const removeStateCache = (namespace, key2, hookInstance) => {
  const cachedState = stateCache[namespace];
  const hookSet = cachedState[key2];
  if (cachedState && hookSet) {
    hookInstance ? hookSet.delete(hookInstance) : hookSet.clear();
    if (hookSet.size === 0) {
      deleteAttr(cachedState, key2);
    }
  }
};
function useHookToSendRequest(hookInstance, methodHandler, sendCallingArgs = []) {
  const currentHookAssert = coreHookAssert(hookInstance.ht);
  let methodInstance = getHandlerMethod(methodHandler, currentHookAssert, sendCallingArgs);
  const { fs: frontStates, ht: hookType, c: useHookConfig } = hookInstance;
  const { loading: loadingState, data: dataState, error: errorState } = frontStates;
  const isFetcher = hookType === EnumHookType.USE_FETCHER;
  const { force: forceRequest = falseValue, middleware = defaultMiddleware } = useHookConfig;
  const alovaInstance2 = getContext(methodInstance);
  const { id } = alovaInstance2;
  const methodKey = getMethodInternalKey(methodInstance);
  const { abortLast = trueValue } = useHookConfig;
  const isFirstRequest = !hookInstance.m;
  hookInstance.m = methodInstance;
  return (() => __async(this, null, function* () {
    let removeStates = noop;
    let isNextCalled = falseValue;
    let responseHandlePromise = promiseResolve(undefinedValue);
    let offDownloadEvent = noop;
    let offUploadEvent = noop;
    const cachedResponse = yield queryCache(methodInstance);
    let fromCache = () => !!cachedResponse;
    let controlledLoading = falseValue;
    if (!isFetcher) {
      setStateCache(id, methodKey, hookInstance);
      removeStates = () => removeStateCache(id, methodKey, hookInstance);
    }
    const guardNext = (guardNextConfig) => {
      isNextCalled = trueValue;
      const { force: guardNextForceRequest = forceRequest, method: guardNextReplacingMethod = methodInstance } = guardNextConfig || {};
      const forceRequestFinally = sloughConfig(guardNextForceRequest, [
        newInstance(AlovaEventBase, methodInstance, sendCallingArgs)
      ]);
      const progressUpdater = (stage) => ({ loaded, total }) => {
        frontStates[stage].v = {
          loaded,
          total
        };
      };
      methodInstance = guardNextReplacingMethod;
      hookInstance.rf[methodKey] = removeStates;
      if (!controlledLoading) {
        loadingState.v = !!forceRequestFinally || !cachedResponse;
      }
      const { downloading: enableDownload, uploading: enableUpload } = hookInstance.ro.trackedKeys;
      offDownloadEvent = enableDownload ? methodInstance.onDownload(progressUpdater("downloading")) : offDownloadEvent;
      offUploadEvent = enableUpload ? methodInstance.onUpload(progressUpdater("uploading")) : offUploadEvent;
      responseHandlePromise = methodInstance.send(forceRequestFinally);
      fromCache = () => methodInstance.fromCache || falseValue;
      return responseHandlePromise;
    };
    const commonContext = {
      method: methodInstance,
      cachedResponse,
      config: useHookConfig,
      abort: () => methodInstance.abort()
    };
    const toUpdateResponse = () => hookType !== EnumHookType.USE_WATCHER || !abortLast || hookInstance.m === methodInstance;
    const controlLoading = (control = trueValue) => {
      if (control && isFirstRequest) {
        loadingState.v = falseValue;
      }
      controlledLoading = control;
    };
    const middlewareCompletePromise = isFetcher ? middleware(__spreadProps(__spreadValues({}, commonContext), {
      args: sendCallingArgs,
      fetch: (methodInstance2, ...args) => {
        assertMethod(currentHookAssert, methodInstance2);
        return useHookToSendRequest(hookInstance, methodInstance2, args);
      },
      proxyStates: omit(frontStates, "data"),
      controlLoading
    }), guardNext) : middleware(__spreadProps(__spreadValues({}, commonContext), {
      args: sendCallingArgs,
      send: (...args) => useHookToSendRequest(hookInstance, methodHandler, args),
      proxyStates: frontStates,
      controlLoading
    }), guardNext);
    let finallyResponse = undefinedValue;
    const baseEvent = AlovaEventBase.spawn(methodInstance, sendCallingArgs);
    try {
      const middlewareReturnedData = yield middlewareCompletePromise;
      const afterSuccess = (data) => {
        if (!isFetcher) {
          toUpdateResponse() && (dataState.v = data);
        } else if (hookInstance.c.updateState !== falseValue) {
          forEach(getStateCache(id, methodKey), (hookInstance2) => {
            hookInstance2.fs.data.v = data;
          });
        }
        if (toUpdateResponse()) {
          errorState.v = undefinedValue;
          !controlledLoading && (loadingState.v = falseValue);
          hookInstance.em.emit(KEY_SUCCESS, newInstance(AlovaSuccessEvent, baseEvent, data, fromCache()));
          hookInstance.em.emit(KEY_COMPLETE, newInstance(AlovaCompleteEvent, baseEvent, KEY_SUCCESS, data, fromCache(), undefinedValue));
        }
        return data;
      };
      finallyResponse = // When no data is returned or undefined is returned in the middleware, get the real response data
      // Otherwise, use the returned data and no longer wait for the response promise. At this time, you also need to call the response callback.
      middlewareReturnedData !== undefinedValue ? afterSuccess(middlewareReturnedData) : isNextCalled ? (
        // There are two possibilities when middlewareCompletePromise is resolve
        // 1. The request is normal
        // 2. The request is incorrect, but the error is captured by the middleware function. At this time, the success callback will also be called, that is, afterSuccess(undefinedValue)
        yield promiseThen(responseHandlePromise, afterSuccess, () => afterSuccess(undefinedValue))
      ) : (
        // If is next called is not called, no data is returned
        undefinedValue
      );
      !isNextCalled && !controlledLoading && (loadingState.v = falseValue);
    } catch (error) {
      if (toUpdateResponse()) {
        errorState.v = error;
        !controlledLoading && (loadingState.v = falseValue);
        hookInstance.em.emit(KEY_ERROR, newInstance(AlovaErrorEvent, baseEvent, error));
        hookInstance.em.emit(KEY_COMPLETE, newInstance(AlovaCompleteEvent, baseEvent, KEY_ERROR, undefinedValue, fromCache(), error));
      }
      throw error;
    }
    offDownloadEvent();
    offUploadEvent();
    return finallyResponse;
  }))();
}
const refCurrent = (ref) => ref.current;
function createRequestState(hookType, methodHandler, useHookConfig, initialData, immediate = falseValue, watchingStates, debounceDelay = 0) {
  var _a;
  useHookConfig = __spreadValues({}, useHookConfig);
  let initialLoading = !!immediate;
  let cachedResponse = undefinedValue;
  if (immediate) {
    try {
      const methodInstance = getHandlerMethod(methodHandler, coreHookAssert(hookType));
      const alovaInstance2 = getContext(methodInstance);
      const l1CacheResult = alovaInstance2.l1Cache.get(buildNamespacedCacheKey(alovaInstance2.id, getMethodInternalKey(methodInstance)));
      if (l1CacheResult && !instanceOf(l1CacheResult, PromiseCls)) {
        const [data2, expireTimestamp] = l1CacheResult;
        if (!expireTimestamp || expireTimestamp > getTime()) {
          cachedResponse = data2;
        }
      }
      const forceRequestFinally = sloughConfig((_a = useHookConfig.force) !== null && _a !== void 0 ? _a : falseValue);
      initialLoading = !!forceRequestFinally || !cachedResponse;
    } catch (_b) {
    }
  }
  const { create, effectRequest, ref, objectify, exposeProvider, transformState2Proxy, __referingObj: referingObject } = statesHookHelper(promiseStatesHook(), useHookConfig.__referingObj);
  const progress = {
    total: 0,
    loaded: 0
  };
  const { managedStates = {} } = useHookConfig;
  const managedStatesProxy = mapObject(managedStates, (state, key2) => transformState2Proxy(state, key2));
  const data = create(cachedResponse !== null && cachedResponse !== void 0 ? cachedResponse : isFn(initialData) ? initialData() : initialData, "data");
  const loading = create(initialLoading, "loading");
  const error = create(undefinedValue, "error");
  const downloading = create(__spreadValues({}, progress), "downloading");
  const uploading = create(__spreadValues({}, progress), "uploading");
  const frontStates = objectify([data, loading, error, downloading, uploading]);
  const eventManager = createEventManager();
  const hookInstance = refCurrent(ref(createHook(hookType, useHookConfig, eventManager, referingObject)));
  hookInstance.fs = frontStates;
  hookInstance.em = eventManager;
  hookInstance.c = useHookConfig;
  hookInstance.ms = __spreadValues(__spreadValues({}, frontStates), managedStatesProxy);
  const handleRequest = (handler = methodHandler, sendCallingArgs) => useHookToSendRequest(hookInstance, handler, sendCallingArgs);
  const hookRequestPromiseCallback = ref(undefinedValue);
  const isInitialRequest = ref(falseValue);
  const onceRunner = refCurrent(ref(createSyncOnceRunner()));
  const wrapEffectRequest = (ro = referingObject, handler) => {
    onceRunner(() => {
      if (!globalConfigMap.ssr || refCurrent(hookRequestPromiseCallback)) {
        referingObject.initialRequest = isInitialRequest.current = trueValue;
        promiseThen(handleRequest(handler), () => {
          var _a2;
          (_a2 = refCurrent(hookRequestPromiseCallback)) === null || _a2 === void 0 ? void 0 : _a2.resolve();
        }, (error2) => {
          var _a2;
          if (!ro.bindError && !ro.trackedKeys.error && !refCurrent(hookRequestPromiseCallback)) {
            throw error2;
          }
          (_a2 = refCurrent(hookRequestPromiseCallback)) === null || _a2 === void 0 ? void 0 : _a2.reject(error2);
        });
      }
    });
  };
  ref(debounce((_, ro, handler) => wrapEffectRequest(ro, handler), (changedIndex) => isNumber(changedIndex) ? isArray(debounceDelay) ? debounceDelay[changedIndex] : debounceDelay : 0));
  effectRequest({
    handler: (
      // When `watchingStates` is an array, it indicates the watching states (including an empty array). When it is undefined, it indicates the non-watching state.
      () => wrapEffectRequest(referingObject)
    ),
    removeStates: () => {
      forEach(objectValues(hookInstance.rf), (fn) => fn());
    },
    frontStates: __spreadValues(__spreadValues({}, frontStates), managedStatesProxy),
    watchingStates,
    immediate: immediate !== null && immediate !== void 0 ? immediate : trueValue
  });
  const hookProvider = exposeProvider(__spreadProps(__spreadValues({}, objectify([data, loading, error, downloading, uploading])), {
    abort: () => hookInstance.m && hookInstance.m.abort(),
    /**
     * Manually initiate a request by executing this method
     * @param sendCallingArgs Parameters passed in when calling the send function
     * @param methodInstance method object
     * @param isFetcher Whether to call isFetcher
     * @returns Request promise
     */
    send: (sendCallingArgs, methodInstance) => handleRequest(methodInstance, sendCallingArgs),
    onSuccess(handler) {
      eventManager.on(KEY_SUCCESS, handler);
    },
    onError(handler) {
      referingObject.bindError = trueValue;
      eventManager.on(KEY_ERROR, handler);
    },
    onComplete(handler) {
      eventManager.on(KEY_COMPLETE, handler);
    },
    /**
     * send and wait for responding with `await`
     * this is always used in `nuxt3` and `<suspense>` in vue3
     * @example
     * ```js
     * const { loading, data, error } = await useRequest(...);
     * ```
     */
    then(onfulfilled, onrejected) {
      const { promise, resolve, reject } = usePromise();
      hookRequestPromiseCallback.current = {
        resolve,
        reject
      };
      setTimeoutFn(() => {
        !isInitialRequest.current && resolve();
      }, 10);
      promiseThen(promise, () => {
        onfulfilled(hookProvider);
      }, onrejected);
    }
  }));
  return hookProvider;
}
function useRequest$1(handler, config = {}) {
  const { immediate = trueValue, initialData } = config;
  const props = createRequestState(EnumHookType.USE_REQUEST, handler, config, initialData, !!immediate);
  const { send } = props;
  return objAssign(props, {
    send: (...args) => send(args)
  });
}
var SSEHookReadyState;
(function(SSEHookReadyState2) {
  SSEHookReadyState2[SSEHookReadyState2["CONNECTING"] = 0] = "CONNECTING";
  SSEHookReadyState2[SSEHookReadyState2["OPEN"] = 1] = "OPEN";
  SSEHookReadyState2[SSEHookReadyState2["CLOSED"] = 2] = "CLOSED";
})(SSEHookReadyState || (SSEHookReadyState = {}));
var MessageType;
(function(MessageType2) {
  MessageType2["Open"] = "open";
  MessageType2["Error"] = "error";
  MessageType2["Message"] = "message";
  MessageType2["Close"] = "close";
})(MessageType || (MessageType = {}));
var vue = {
  name: "Vue",
  create: (data) => common_vendor.ref(data),
  dehydrate: (state) => state.value,
  update: (newVal, state) => {
    state.value = newVal;
  },
  effectRequest({ handler, removeStates, immediate, watchingStates }) {
    if (common_vendor.getCurrentInstance()) {
      common_vendor.onUnmounted(removeStates);
    }
    immediate && handler();
    forEach(watchingStates || [], (state, i) => {
      common_vendor.watch(state, () => {
        handler(i);
      }, { deep: trueValue });
    });
  },
  computed: (getter) => common_vendor.computed(getter),
  watch: (states, callback) => {
    common_vendor.watch(states, callback, {
      deep: trueValue
    });
  },
  onMounted: (callback) => {
    if (common_vendor.getCurrentInstance()) {
      common_vendor.onMounted(callback);
    } else {
      setTimeoutFn(callback, 10);
    }
  },
  onUnmounted: (callback) => {
    common_vendor.getCurrentInstance() && common_vendor.onUnmounted(callback);
  }
};
var l2CacheAdapter = {
  get(key2) {
    return common_vendor.index.getStorageSync(key2);
  },
  set(key2, value) {
    common_vendor.index.setStorageSync(key2, value);
  },
  remove(key2) {
    common_vendor.index.removeStorageSync(key2);
  },
  clear() {
    common_vendor.index.clearStorageSync();
  }
};
const requestAdapter = (elements, method) => {
  const { url, data, type, headers: header } = elements;
  let taskInstance;
  let onDownload = noop;
  let onUpload = noop;
  const responsePromise = new Promise((resolve, reject) => {
    const { config: adapterConfig } = method;
    const { requestType, timeout } = adapterConfig;
    if (requestType === "upload") {
      const formData = {};
      const fileData = {};
      if (isPlainObject(data)) {
        Object.keys(data).forEach((key2) => {
          if (["name", "files", "file", "filePath"].includes(key2)) {
            fileData[key2] = data[key2];
          } else {
            formData[key2] = data[key2];
          }
        });
      }
      const uploadTask = taskInstance = common_vendor.index.uploadFile(__spreadProps(__spreadValues(__spreadValues({}, adapterConfig), fileData), {
        name: fileData.name,
        url,
        header,
        formData,
        timeout,
        success: (res) => resolve(res),
        fail: (reason) => reject(new Error(reason.errMsg)),
        complete: noop
      }));
      onUpload = (handler) => {
        uploadTask.onProgressUpdate(({ totalBytesSent, totalBytesExpectedToSend }) => {
          handler(totalBytesSent, totalBytesExpectedToSend);
        });
      };
    } else if (requestType === "download") {
      const downloadTask = taskInstance = common_vendor.index.downloadFile(__spreadProps(__spreadValues({}, adapterConfig), {
        url,
        header,
        timeout,
        success: (res) => resolve(res),
        fail: (reason) => reject(new Error(reason.errMsg)),
        complete: noop
      }));
      onDownload = (handler) => {
        downloadTask.onProgressUpdate(({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          handler(totalBytesWritten, totalBytesExpectedToWrite);
        });
      };
    } else {
      taskInstance = common_vendor.index.request(__spreadProps(__spreadValues({}, adapterConfig), {
        url,
        data,
        header,
        method: type,
        timeout,
        success: (res) => resolve(res),
        fail: (reason) => reject(new Error(reason.errMsg))
      }));
    }
  });
  return {
    response: () => responsePromise,
    headers: () => responsePromise.then((res) => res.header || {}),
    abort: () => {
      taskInstance.abort();
    },
    onDownload,
    onUpload
  };
};
var statesHook = __spreadProps(__spreadValues({}, vue), {
  effectRequest(effectRequestParams, referingObject) {
    const { handler } = effectRequestParams;
    effectRequestParams.handler = (...args) => {
      len(args) > 0 ? handler(...args) : Promise.resolve().then(() => handler(...args));
    };
    return vue.effectRequest(effectRequestParams, referingObject);
  }
});
function AdapterUniapp({ mockRequest } = {}) {
  return {
    statesHook,
    requestAdapter: mockRequest || requestAdapter,
    l2Cache: l2CacheAdapter
  };
}
const API_DOMAINS = {
  DEFAULT: "https://ukw0y1.laf.run",
  SECONDARY: "https://ukw0y1.laf.run"
};
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  // 如果下面拦截不到，请使用 refreshTokenOnSuccess by 群友@琛
  refreshTokenOnError: {
    isExpired: (error) => {
      var _a;
      return ((_a = error.response) == null ? void 0 : _a.status) === http_tools_enum.ResultEnum.Unauthorized;
    },
    handler: () => __async(exports, null, function* () {
    })
  }
});
const alovaInstance = createAlova(__spreadProps(__spreadValues({
  baseURL: API_DOMAINS.DEFAULT
}, AdapterUniapp()), {
  timeout: 5e3,
  statesHook: vue,
  beforeRequest: onAuthRequired((method) => {
    var _a, _b;
    method.config.headers = __spreadValues({
      ContentType: http_tools_enum.ContentTypeEnum.JSON,
      Accept: "application/json, text/plain, */*"
    }, method.config.headers);
    const { config } = method;
    const ignoreAuth = !((_a = config.meta) == null ? void 0 : _a.ignoreAuth);
    console.log("ignoreAuth===>", ignoreAuth);
    if ((_b = config.meta) == null ? void 0 : _b.domain) {
      method.baseURL = config.meta.domain;
      console.log("当前域名", method.baseURL);
    }
  }),
  responded: onResponseRefreshToken((response, method) => {
    var _a;
    const { config } = method;
    const { requestType } = config;
    const {
      statusCode,
      data: rawData,
      errMsg
    } = response;
    if (requestType === "upload" || requestType === "download") {
      return response;
    }
    if (statusCode !== 200) {
      const errorMessage = http_tools_enum.ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`;
      console.error("errorMessage===>", errorMessage);
      common_vendor.index.showToast({
        title: errorMessage,
        icon: "error"
      });
      throw new Error(`${errorMessage}：${errMsg}`);
    }
    const { code, message, data } = rawData;
    if (code !== http_tools_enum.ResultEnum.Success0 && code !== http_tools_enum.ResultEnum.Success200) {
      if (((_a = config.meta) == null ? void 0 : _a.toast) !== false) {
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
      throw new Error(`请求错误[${code}]：${message}`);
    }
    return data;
  })
}));
const http = alovaInstance;
function foo() {
  return http.Get("/foo", {
    params: {
      name: "菲鸽",
      page: 1,
      pageSize: 10
    },
    meta: { domain: API_DOMAINS.SECONDARY }
    // 用于切换请求地址
  });
}
function useScroll({
  fetchData,
  pageSize = 10
}) {
  const list = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const finished = common_vendor.ref(false);
  const error = common_vendor.ref(null);
  const page = common_vendor.ref(1);
  const loadData = () => __async(this, null, function* () {
    if (loading.value || finished.value)
      return;
    loading.value = true;
    error.value = null;
    try {
      const data = yield fetchData(page.value, pageSize);
      if (data.length < pageSize) {
        finished.value = true;
      }
      list.value.push(...data);
      page.value++;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  });
  const refresh = () => __async(this, null, function* () {
    page.value = 1;
    finished.value = false;
    list.value = [];
    yield loadData();
  });
  const loadMore = () => __async(this, null, function* () {
    yield loadData();
  });
  common_vendor.onMounted(() => {
    refresh();
  });
  return {
    list,
    loading,
    finished,
    error,
    refresh,
    loadMore
  };
}
function request(url, options) {
  const requestOptions = __spreadValues({
    url
  }, options);
  if (options.params) {
    requestOptions.query = requestOptions.params;
    delete requestOptions.params;
  }
  if (options.headers) {
    requestOptions.header = options.headers;
    delete requestOptions.headers;
  }
  return http_http.http(requestOptions);
}
function listAllUsingGet(_0) {
  return __async(this, arguments, function* ({
    options
  }) {
    return request("/user/listAll", __spreadValues({
      method: "GET"
    }, options || {}));
  });
}
function infoUsingGet(_0) {
  return __async(this, arguments, function* ({
    options
  }) {
    return request("/user/info", __spreadValues({
      method: "GET"
    }, options || {}));
  });
}
function useRequest(func, options = { immediate: false }) {
  const loading = common_vendor.ref(false);
  const error = common_vendor.ref(false);
  const data = common_vendor.ref(options.initialData);
  const run = (args) => __async(this, null, function* () {
    loading.value = true;
    return func(args).then((res) => {
      data.value = res;
      error.value = false;
      return data.value;
    }).catch((err) => {
      error.value = err;
      throw err;
    }).finally(() => {
      loading.value = false;
    });
  });
  if (options.immediate) {
    run({});
  }
  return { loading, error, data, run };
}
function getFooAPI(name) {
  return __async(this, null, function* () {
    return yield http_http.http.get("/foo", { name });
  });
}
exports.foo = foo;
exports.getFooAPI = getFooAPI;
exports.infoUsingGet = infoUsingGet;
exports.listAllUsingGet = listAllUsingGet;
exports.useRequest = useRequest;
exports.useRequest$1 = useRequest$1;
exports.useScroll = useScroll;
