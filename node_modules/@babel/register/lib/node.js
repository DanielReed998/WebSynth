"use strict";

exports.__esModule = true;
exports.revert = revert;
exports.default = register;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _sourceMapSupport = _interopRequireDefault(require("source-map-support"));

var registerCache = _interopRequireWildcard(require("./cache"));

var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));

var babel = _interopRequireWildcard(require("@babel/core"));

var _pirates = require("pirates");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maps = {};
var transformOpts = {};
var piratesRevert = null;

function installSourceMapSupport() {
  _sourceMapSupport.default.install({
    handleUncaughtExceptions: false,
    environment: "node",
    retrieveSourceMap: function retrieveSourceMap(source) {
      var map = maps && maps[source];

      if (map) {
        return {
          url: null,
          map: map
        };
      } else {
        return null;
      }
    }
  });
}

var cache;

function mtime(filename) {
  return +_fs.default.statSync(filename).mtime;
}

function compile(code, filename) {
  var opts = new babel.OptionManager().init(Object.assign({
    sourceRoot: _path.default.dirname(filename)
  }, (0, _cloneDeep.default)(transformOpts), {
    filename: filename
  }));
  if (opts === null) return code;
  var cacheKey = JSON.stringify(opts) + ":" + babel.version;
  var env = babel.getEnv(false);
  if (env) cacheKey += ":" + env;

  if (cache) {
    var cached = cache[cacheKey];

    if (cached && cached.mtime === mtime(filename)) {
      return cached.code;
    }
  }

  var result = babel.transform(code, Object.assign({}, opts, {
    sourceMaps: opts.sourceMaps === undefined ? "both" : opts.sourceMaps,
    ast: false
  }));

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  if (result.map) {
    if (Object.keys(maps).length === 0) {
      installSourceMapSupport();
    }

    maps[filename] = result.map;
  }

  return result.code;
}

function hookExtensions(exts) {
  if (piratesRevert) piratesRevert();
  piratesRevert = (0, _pirates.addHook)(compile, {
    exts: exts,
    ignoreNodeModules: false
  });
}

function revert() {
  if (piratesRevert) piratesRevert();
  delete require.cache[require.resolve(__filename)];
}

register({
  extensions: babel.DEFAULT_EXTENSIONS
});

function register(opts) {
  if (opts === void 0) {
    opts = {};
  }

  opts = Object.assign({}, opts);
  if (opts.extensions) hookExtensions(opts.extensions);

  if (opts.cache === false && cache) {
    registerCache.clear();
    cache = null;
  } else if (opts.cache !== false && !cache) {
    registerCache.load();
    cache = registerCache.get();
  }

  delete opts.extensions;
  delete opts.cache;
  Object.assign(transformOpts, opts);

  if (!transformOpts.ignore && !transformOpts.only) {
    transformOpts.only = [new RegExp("^" + (0, _escapeRegExp.default)(process.cwd()), "i")];
    transformOpts.ignore = [new RegExp("^" + (0, _escapeRegExp.default)(process.cwd()) + "(?:" + _path.default.sep + ".*)?" + (0, _escapeRegExp.default)(_path.default.sep + "node_modules" + _path.default.sep), "i")];
  }
}