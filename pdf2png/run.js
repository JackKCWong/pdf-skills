var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/sharp/lib/is.js
var require_is = __commonJS({
  "node_modules/sharp/lib/is.js"(exports2, module2) {
    var defined = (val) => typeof val !== "undefined" && val !== null;
    var object = (val) => typeof val === "object";
    var plainObject = (val) => Object.prototype.toString.call(val) === "[object Object]";
    var fn = (val) => typeof val === "function";
    var bool = (val) => typeof val === "boolean";
    var buffer = (val) => val instanceof Buffer;
    var typedArray = (val) => {
      if (defined(val)) {
        switch (val.constructor) {
          case Uint8Array:
          case Uint8ClampedArray:
          case Int8Array:
          case Uint16Array:
          case Int16Array:
          case Uint32Array:
          case Int32Array:
          case Float32Array:
          case Float64Array:
            return true;
        }
      }
      return false;
    };
    var arrayBuffer = (val) => val instanceof ArrayBuffer;
    var string = (val) => typeof val === "string" && val.length > 0;
    var number = (val) => typeof val === "number" && !Number.isNaN(val);
    var integer = (val) => Number.isInteger(val);
    var inRange = (val, min, max) => val >= min && val <= max;
    var inArray = (val, list) => list.includes(val);
    var invalidParameterError = (name, expected, actual) => new Error(
      `Expected ${expected} for ${name} but received ${actual} of type ${typeof actual}`
    );
    var nativeError = (native, context) => {
      context.message = native.message;
      return context;
    };
    module2.exports = {
      defined,
      object,
      plainObject,
      fn,
      bool,
      buffer,
      typedArray,
      arrayBuffer,
      string,
      number,
      integer,
      inRange,
      inArray,
      invalidParameterError,
      nativeError
    };
  }
});

// node_modules/detect-libc/lib/process.js
var require_process = __commonJS({
  "node_modules/detect-libc/lib/process.js"(exports2, module2) {
    "use strict";
    var isLinux = () => process.platform === "linux";
    var report = null;
    var getReport = () => {
      if (!report) {
        if (isLinux() && process.report) {
          const orig = process.report.excludeNetwork;
          process.report.excludeNetwork = true;
          report = process.report.getReport();
          process.report.excludeNetwork = orig;
        } else {
          report = {};
        }
      }
      return report;
    };
    module2.exports = { isLinux, getReport };
  }
});

// node_modules/detect-libc/lib/filesystem.js
var require_filesystem = __commonJS({
  "node_modules/detect-libc/lib/filesystem.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var LDD_PATH = "/usr/bin/ldd";
    var SELF_PATH = "/proc/self/exe";
    var MAX_LENGTH = 2048;
    var readFileSync = (path) => {
      const fd = fs2.openSync(path, "r");
      const buffer = Buffer.alloc(MAX_LENGTH);
      const bytesRead = fs2.readSync(fd, buffer, 0, MAX_LENGTH, 0);
      fs2.close(fd, () => {
      });
      return buffer.subarray(0, bytesRead);
    };
    var readFile = (path) => new Promise((resolve, reject) => {
      fs2.open(path, "r", (err, fd) => {
        if (err) {
          reject(err);
        } else {
          const buffer = Buffer.alloc(MAX_LENGTH);
          fs2.read(fd, buffer, 0, MAX_LENGTH, 0, (_, bytesRead) => {
            resolve(buffer.subarray(0, bytesRead));
            fs2.close(fd, () => {
            });
          });
        }
      });
    });
    module2.exports = {
      LDD_PATH,
      SELF_PATH,
      readFileSync,
      readFile
    };
  }
});

// node_modules/detect-libc/lib/elf.js
var require_elf = __commonJS({
  "node_modules/detect-libc/lib/elf.js"(exports2, module2) {
    "use strict";
    var interpreterPath = (elf) => {
      if (elf.length < 64) {
        return null;
      }
      if (elf.readUInt32BE(0) !== 2135247942) {
        return null;
      }
      if (elf.readUInt8(4) !== 2) {
        return null;
      }
      if (elf.readUInt8(5) !== 1) {
        return null;
      }
      const offset = elf.readUInt32LE(32);
      const size = elf.readUInt16LE(54);
      const count = elf.readUInt16LE(56);
      for (let i = 0; i < count; i++) {
        const headerOffset = offset + i * size;
        const type = elf.readUInt32LE(headerOffset);
        if (type === 3) {
          const fileOffset = elf.readUInt32LE(headerOffset + 8);
          const fileSize = elf.readUInt32LE(headerOffset + 32);
          return elf.subarray(fileOffset, fileOffset + fileSize).toString().replace(/\0.*$/g, "");
        }
      }
      return null;
    };
    module2.exports = {
      interpreterPath
    };
  }
});

// node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "node_modules/detect-libc/lib/detect-libc.js"(exports2, module2) {
    "use strict";
    var childProcess = require("child_process");
    var { isLinux, getReport } = require_process();
    var { LDD_PATH, SELF_PATH, readFile, readFileSync } = require_filesystem();
    var { interpreterPath } = require_elf();
    var cachedFamilyInterpreter;
    var cachedFamilyFilesystem;
    var cachedVersionFilesystem;
    var command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
    var commandOut = "";
    var safeCommand = () => {
      if (!commandOut) {
        return new Promise((resolve) => {
          childProcess.exec(command, (err, out) => {
            commandOut = err ? " " : out;
            resolve(commandOut);
          });
        });
      }
      return commandOut;
    };
    var safeCommandSync = () => {
      if (!commandOut) {
        try {
          commandOut = childProcess.execSync(command, { encoding: "utf8" });
        } catch (_err) {
          commandOut = " ";
        }
      }
      return commandOut;
    };
    var GLIBC = "glibc";
    var RE_GLIBC_VERSION = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
    var MUSL = "musl";
    var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
    var familyFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return GLIBC;
      }
      if (Array.isArray(report.sharedObjects)) {
        if (report.sharedObjects.some(isFileMusl)) {
          return MUSL;
        }
      }
      return null;
    };
    var familyFromCommand = (out) => {
      const [getconf, ldd1] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return GLIBC;
      }
      if (ldd1 && ldd1.includes(MUSL)) {
        return MUSL;
      }
      return null;
    };
    var familyFromInterpreterPath = (path) => {
      if (path) {
        if (path.includes("/ld-musl-")) {
          return MUSL;
        } else if (path.includes("/ld-linux-")) {
          return GLIBC;
        }
      }
      return null;
    };
    var getFamilyFromLddContent = (content) => {
      content = content.toString();
      if (content.includes("musl")) {
        return MUSL;
      }
      if (content.includes("GNU C Library")) {
        return GLIBC;
      }
      return null;
    };
    var familyFromFilesystem = async () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromFilesystemSync = () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromInterpreter = async () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = await readFile(SELF_PATH);
        const path = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var familyFromInterpreterSync = () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = readFileSync(SELF_PATH);
        const path = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var family = async () => {
      let family2 = null;
      if (isLinux()) {
        family2 = await familyFromInterpreter();
        if (!family2) {
          family2 = await familyFromFilesystem();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = await safeCommand();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var familySync = () => {
      let family2 = null;
      if (isLinux()) {
        family2 = familyFromInterpreterSync();
        if (!family2) {
          family2 = familyFromFilesystemSync();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = safeCommandSync();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
    var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
    var versionFromFilesystem = async () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromFilesystemSync = () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return report.header.glibcVersionRuntime;
      }
      return null;
    };
    var versionSuffix = (s) => s.trim().split(/\s+/)[1];
    var versionFromCommand = (out) => {
      const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return versionSuffix(getconf);
      }
      if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
        return versionSuffix(ldd2);
      }
      return null;
    };
    var version = async () => {
      let version2 = null;
      if (isLinux()) {
        version2 = await versionFromFilesystem();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = await safeCommand();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    var versionSync = () => {
      let version2 = null;
      if (isLinux()) {
        version2 = versionFromFilesystemSync();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = safeCommandSync();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    module2.exports = {
      GLIBC,
      MUSL,
      family,
      familySync,
      isNonGlibcLinux,
      isNonGlibcLinuxSync,
      version,
      versionSync
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports2, module2) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports2, module2) {
    "use strict";
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports2, module2) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// node_modules/sharp/package.json
var require_package = __commonJS({
  "node_modules/sharp/package.json"(exports2, module2) {
    module2.exports = {
      name: "sharp",
      description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
      version: "0.34.5",
      author: "Lovell Fuller <npm@lovell.info>",
      homepage: "https://sharp.pixelplumbing.com",
      contributors: [
        "Pierre Inglebert <pierre.inglebert@gmail.com>",
        "Jonathan Ong <jonathanrichardong@gmail.com>",
        "Chanon Sajjamanochai <chanon.s@gmail.com>",
        "Juliano Julio <julianojulio@gmail.com>",
        "Daniel Gasienica <daniel@gasienica.ch>",
        "Julian Walker <julian@fiftythree.com>",
        "Amit Pitaru <pitaru.amit@gmail.com>",
        "Brandon Aaron <hello.brandon@aaron.sh>",
        "Andreas Lind <andreas@one.com>",
        "Maurus Cuelenaere <mcuelenaere@gmail.com>",
        "Linus Unneb\xE4ck <linus@folkdatorn.se>",
        "Victor Mateevitsi <mvictoras@gmail.com>",
        "Alaric Holloway <alaric.holloway@gmail.com>",
        "Bernhard K. Weisshuhn <bkw@codingforce.com>",
        "Chris Riley <criley@primedia.com>",
        "David Carley <dacarley@gmail.com>",
        "John Tobin <john@limelightmobileinc.com>",
        "Kenton Gray <kentongray@gmail.com>",
        "Felix B\xFCnemann <Felix.Buenemann@gmail.com>",
        "Samy Al Zahrani <samyalzahrany@gmail.com>",
        "Chintan Thakkar <lemnisk8@gmail.com>",
        "F. Orlando Galashan <frulo@gmx.de>",
        "Kleis Auke Wolthuizen <info@kleisauke.nl>",
        "Matt Hirsch <mhirsch@media.mit.edu>",
        "Matthias Thoemmes <thoemmes@gmail.com>",
        "Patrick Paskaris <patrick@paskaris.gr>",
        "J\xE9r\xE9my Lal <kapouer@melix.org>",
        "Rahul Nanwani <r.nanwani@gmail.com>",
        "Alice Monday <alice0meta@gmail.com>",
        "Kristo Jorgenson <kristo.jorgenson@gmail.com>",
        "YvesBos <yves_bos@outlook.com>",
        "Guy Maliar <guy@tailorbrands.com>",
        "Nicolas Coden <nicolas@ncoden.fr>",
        "Matt Parrish <matt.r.parrish@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Matthew McEachen <matthew+github@mceachen.org>",
        "Jarda Kot\u011B\u0161ovec <jarda.kotesovec@gmail.com>",
        "Kenric D'Souza <kenric.dsouza@gmail.com>",
        "Oleh Aleinyk <oleg.aleynik@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Andrea Bianco <andrea.bianco@unibas.ch>",
        "Rik Heywood <rik@rik.org>",
        "Thomas Parisot <hi@oncletom.io>",
        "Nathan Graves <nathanrgraves+github@gmail.com>",
        "Tom Lokhorst <tom@lokhorst.eu>",
        "Espen Hovlandsdal <espen@hovlandsdal.com>",
        "Sylvain Dumont <sylvain.dumont35@gmail.com>",
        "Alun Davies <alun.owain.davies@googlemail.com>",
        "Aidan Hoolachan <ajhoolachan21@gmail.com>",
        "Axel Eirola <axel.eirola@iki.fi>",
        "Freezy <freezy@xbmc.org>",
        "Daiz <taneli.vatanen@gmail.com>",
        "Julian Aubourg <j@ubourg.net>",
        "Keith Belovay <keith@picthrive.com>",
        "Michael B. Klein <mbklein@gmail.com>",
        "Jordan Prudhomme <jordan@raboland.fr>",
        "Ilya Ovdin <iovdin@gmail.com>",
        "Andargor <andargor@yahoo.com>",
        "Paul Neave <paul.neave@gmail.com>",
        "Brendan Kennedy <brenwken@gmail.com>",
        "Brychan Bennett-Odlum <git@brychan.io>",
        "Edward Silverton <e.silverton@gmail.com>",
        "Roman Malieiev <aromaleev@gmail.com>",
        "Tomas Szabo <tomas.szabo@deftomat.com>",
        "Robert O'Rourke <robert@o-rourke.org>",
        "Guillermo Alfonso Varela Chouci\xF1o <guillevch@gmail.com>",
        "Christian Flintrup <chr@gigahost.dk>",
        "Manan Jadhav <manan@motionden.com>",
        "Leon Radley <leon@radley.se>",
        "alza54 <alza54@thiocod.in>",
        "Jacob Smith <jacob@frende.me>",
        "Michael Nutt <michael@nutt.im>",
        "Brad Parham <baparham@gmail.com>",
        "Taneli Vatanen <taneli.vatanen@gmail.com>",
        "Joris Dugu\xE9 <zaruike10@gmail.com>",
        "Chris Banks <christopher.bradley.banks@gmail.com>",
        "Ompal Singh <ompal.hitm09@gmail.com>",
        "Brodan <christopher.hranj@gmail.com>",
        "Ankur Parihar <ankur.github@gmail.com>",
        "Brahim Ait elhaj <brahima@gmail.com>",
        "Mart Jansink <m.jansink@gmail.com>",
        "Lachlan Newman <lachnewman007@gmail.com>",
        "Dennis Beatty <dennis@dcbeatty.com>",
        "Ingvar Stepanyan <me@rreverser.com>",
        "Don Denton <don@happycollision.com>"
      ],
      scripts: {
        build: "node install/build.js",
        install: "node install/check.js || npm run build",
        clean: "rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*",
        test: "npm run lint && npm run test-unit",
        lint: "npm run lint-cpp && npm run lint-js && npm run lint-types",
        "lint-cpp": "cpplint --quiet src/*.h src/*.cc",
        "lint-js": "biome lint",
        "lint-types": "tsd --files ./test/types/sharp.test-d.ts",
        "test-leak": "./test/leak/leak.sh",
        "test-unit": "node --experimental-test-coverage test/unit.mjs",
        "package-from-local-build": "node npm/from-local-build.js",
        "package-release-notes": "node npm/release-notes.js",
        "docs-build": "node docs/build.mjs",
        "docs-serve": "cd docs && npm start",
        "docs-publish": "cd docs && npm run build && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
      },
      type: "commonjs",
      main: "lib/index.js",
      types: "lib/index.d.ts",
      files: [
        "install",
        "lib",
        "src/*.{cc,h,gyp}"
      ],
      repository: {
        type: "git",
        url: "git://github.com/lovell/sharp.git"
      },
      keywords: [
        "jpeg",
        "png",
        "webp",
        "avif",
        "tiff",
        "gif",
        "svg",
        "jp2",
        "dzi",
        "image",
        "resize",
        "thumbnail",
        "crop",
        "embed",
        "libvips",
        "vips"
      ],
      dependencies: {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        semver: "^7.7.3"
      },
      optionalDependencies: {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      },
      devDependencies: {
        "@biomejs/biome": "^2.3.4",
        "@cpplint/cli": "^0.1.0",
        "@emnapi/runtime": "^1.7.0",
        "@img/sharp-libvips-dev": "1.2.4",
        "@img/sharp-libvips-dev-wasm32": "1.2.4",
        "@img/sharp-libvips-win32-arm64": "1.2.4",
        "@img/sharp-libvips-win32-ia32": "1.2.4",
        "@img/sharp-libvips-win32-x64": "1.2.4",
        "@types/node": "*",
        emnapi: "^1.7.0",
        "exif-reader": "^2.0.2",
        "extract-zip": "^2.0.1",
        icc: "^3.0.0",
        "jsdoc-to-markdown": "^9.1.3",
        "node-addon-api": "^8.5.0",
        "node-gyp": "^11.5.0",
        "tar-fs": "^3.1.1",
        tsd: "^0.33.0"
      },
      license: "Apache-2.0",
      engines: {
        node: "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      config: {
        libvips: ">=8.17.3"
      },
      funding: {
        url: "https://opencollective.com/libvips"
      }
    };
  }
});

// node_modules/sharp/lib/libvips.js
var require_libvips = __commonJS({
  "node_modules/sharp/lib/libvips.js"(exports2, module2) {
    var { spawnSync } = require("node:child_process");
    var { createHash } = require("node:crypto");
    var semverCoerce = require_coerce();
    var semverGreaterThanOrEqualTo = require_gte();
    var semverSatisfies = require_satisfies();
    var detectLibc = require_detect_libc();
    var { config, engines, optionalDependencies } = require_package();
    var minimumLibvipsVersionLabelled = process.env.npm_package_config_libvips || config.libvips;
    var minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;
    var prebuiltPlatforms = [
      "darwin-arm64",
      "darwin-x64",
      "linux-arm",
      "linux-arm64",
      "linux-ppc64",
      "linux-riscv64",
      "linux-s390x",
      "linux-x64",
      "linuxmusl-arm64",
      "linuxmusl-x64",
      "win32-arm64",
      "win32-ia32",
      "win32-x64"
    ];
    var spawnSyncOptions = {
      encoding: "utf8",
      shell: true
    };
    var log = (item) => {
      if (item instanceof Error) {
        console.error(`sharp: Installation error: ${item.message}`);
      } else {
        console.log(`sharp: ${item}`);
      }
    };
    var runtimeLibc = () => detectLibc.isNonGlibcLinuxSync() ? detectLibc.familySync() : "";
    var runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;
    var buildPlatformArch = () => {
      if (isEmscripten()) {
        return "wasm32";
      }
      const { npm_config_arch, npm_config_platform, npm_config_libc } = process.env;
      const libc = typeof npm_config_libc === "string" ? npm_config_libc : runtimeLibc();
      return `${npm_config_platform || process.platform}${libc}-${npm_config_arch || process.arch}`;
    };
    var buildSharpLibvipsIncludeDir = () => {
      try {
        return require(`@img/sharp-libvips-dev-${buildPlatformArch()}/include`);
      } catch {
        try {
          return require("@img/sharp-libvips-dev/include");
        } catch {
        }
      }
      return "";
    };
    var buildSharpLibvipsCPlusPlusDir = () => {
      try {
        return require("@img/sharp-libvips-dev/cplusplus");
      } catch {
      }
      return "";
    };
    var buildSharpLibvipsLibDir = () => {
      try {
        return require(`@img/sharp-libvips-dev-${buildPlatformArch()}/lib`);
      } catch {
        try {
          return require(`@img/sharp-libvips-${buildPlatformArch()}/lib`);
        } catch {
        }
      }
      return "";
    };
    var isUnsupportedNodeRuntime = () => {
      if (process.release?.name === "node" && process.versions) {
        if (!semverSatisfies(process.versions.node, engines.node)) {
          return { found: process.versions.node, expected: engines.node };
        }
      }
    };
    var isEmscripten = () => {
      const { CC } = process.env;
      return Boolean(CC?.endsWith("/emcc"));
    };
    var isRosetta = () => {
      if (process.platform === "darwin" && process.arch === "x64") {
        const translated = spawnSync("sysctl sysctl.proc_translated", spawnSyncOptions).stdout;
        return (translated || "").trim() === "sysctl.proc_translated: 1";
      }
      return false;
    };
    var sha512 = (s) => createHash("sha512").update(s).digest("hex");
    var yarnLocator = () => {
      try {
        const identHash = sha512(`imgsharp-libvips-${buildPlatformArch()}`);
        const npmVersion = semverCoerce(optionalDependencies[`@img/sharp-libvips-${buildPlatformArch()}`], {
          includePrerelease: true
        }).version;
        return sha512(`${identHash}npm:${npmVersion}`).slice(0, 10);
      } catch {
      }
      return "";
    };
    var spawnRebuild = () => spawnSync(`node-gyp rebuild --directory=src ${isEmscripten() ? "--nodedir=emscripten" : ""}`, {
      ...spawnSyncOptions,
      stdio: "inherit"
    }).status;
    var globalLibvipsVersion = () => {
      if (process.platform !== "win32") {
        const globalLibvipsVersion2 = spawnSync("pkg-config --modversion vips-cpp", {
          ...spawnSyncOptions,
          env: {
            ...process.env,
            PKG_CONFIG_PATH: pkgConfigPath()
          }
        }).stdout;
        return (globalLibvipsVersion2 || "").trim();
      } else {
        return "";
      }
    };
    var pkgConfigPath = () => {
      if (process.platform !== "win32") {
        const brewPkgConfigPath = spawnSync(
          'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
          spawnSyncOptions
        ).stdout || "";
        return [
          brewPkgConfigPath.trim(),
          process.env.PKG_CONFIG_PATH,
          "/usr/local/lib/pkgconfig",
          "/usr/lib/pkgconfig",
          "/usr/local/libdata/pkgconfig",
          "/usr/libdata/pkgconfig"
        ].filter(Boolean).join(":");
      } else {
        return "";
      }
    };
    var skipSearch = (status, reason, logger) => {
      if (logger) {
        logger(`Detected ${reason}, skipping search for globally-installed libvips`);
      }
      return status;
    };
    var useGlobalLibvips = (logger) => {
      if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
        return skipSearch(false, "SHARP_IGNORE_GLOBAL_LIBVIPS", logger);
      }
      if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === true) {
        return skipSearch(true, "SHARP_FORCE_GLOBAL_LIBVIPS", logger);
      }
      if (isRosetta()) {
        return skipSearch(false, "Rosetta", logger);
      }
      const globalVipsVersion = globalLibvipsVersion();
      return !!globalVipsVersion && semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
    };
    module2.exports = {
      minimumLibvipsVersion,
      prebuiltPlatforms,
      buildPlatformArch,
      buildSharpLibvipsIncludeDir,
      buildSharpLibvipsCPlusPlusDir,
      buildSharpLibvipsLibDir,
      isUnsupportedNodeRuntime,
      runtimePlatformArch,
      log,
      yarnLocator,
      spawnRebuild,
      globalLibvipsVersion,
      pkgConfigPath,
      useGlobalLibvips
    };
  }
});

// node_modules/sharp/lib/sharp.js
var require_sharp = __commonJS({
  "node_modules/sharp/lib/sharp.js"(exports2, module2) {
    var { familySync, versionSync } = require_detect_libc();
    var { runtimePlatformArch, isUnsupportedNodeRuntime, prebuiltPlatforms, minimumLibvipsVersion } = require_libvips();
    var runtimePlatform = runtimePlatformArch();
    var paths = [
      `../src/build/Release/sharp-${runtimePlatform}.node`,
      "../src/build/Release/sharp-wasm32.node",
      `@img/sharp-${runtimePlatform}/sharp.node`,
      "@img/sharp-wasm32/sharp.node"
    ];
    var path;
    var sharp2;
    var errors = [];
    for (path of paths) {
      try {
        sharp2 = require(path);
        break;
      } catch (err) {
        errors.push(err);
      }
    }
    if (sharp2 && path.startsWith("@img/sharp-linux-x64") && !sharp2._isUsingX64V2()) {
      const err = new Error("Prebuilt binaries for linux-x64 require v2 microarchitecture");
      err.code = "Unsupported CPU";
      errors.push(err);
      sharp2 = null;
    }
    if (sharp2) {
      module2.exports = sharp2;
    } else {
      const [isLinux, isMacOs, isWindows] = ["linux", "darwin", "win32"].map((os) => runtimePlatform.startsWith(os));
      const help = [`Could not load the "sharp" module using the ${runtimePlatform} runtime`];
      errors.forEach((err) => {
        if (err.code !== "MODULE_NOT_FOUND") {
          help.push(`${err.code}: ${err.message}`);
        }
      });
      const messages = errors.map((err) => err.message).join(" ");
      help.push("Possible solutions:");
      if (isUnsupportedNodeRuntime()) {
        const { found, expected } = isUnsupportedNodeRuntime();
        help.push(
          "- Please upgrade Node.js:",
          `    Found ${found}`,
          `    Requires ${expected}`
        );
      } else if (prebuiltPlatforms.includes(runtimePlatform)) {
        const [os, cpu] = runtimePlatform.split("-");
        const libc = os.endsWith("musl") ? " --libc=musl" : "";
        help.push(
          "- Ensure optional dependencies can be installed:",
          "    npm install --include=optional sharp",
          "- Ensure your package manager supports multi-platform installation:",
          "    See https://sharp.pixelplumbing.com/install#cross-platform",
          "- Add platform-specific dependencies:",
          `    npm install --os=${os.replace("musl", "")}${libc} --cpu=${cpu} sharp`
        );
      } else {
        help.push(
          `- Manually install libvips >= ${minimumLibvipsVersion}`,
          "- Add experimental WebAssembly-based dependencies:",
          "    npm install --cpu=wasm32 sharp",
          "    npm install @img/sharp-wasm32"
        );
      }
      if (isLinux && /(symbol not found|CXXABI_)/i.test(messages)) {
        try {
          const { config } = require(`@img/sharp-libvips-${runtimePlatform}/package`);
          const libcFound = `${familySync()} ${versionSync()}`;
          const libcRequires = `${config.musl ? "musl" : "glibc"} ${config.musl || config.glibc}`;
          help.push(
            "- Update your OS:",
            `    Found ${libcFound}`,
            `    Requires ${libcRequires}`
          );
        } catch (_errEngines) {
        }
      }
      if (isLinux && /\/snap\/core[0-9]{2}/.test(messages)) {
        help.push(
          "- Remove the Node.js Snap, which does not support native modules",
          "    snap remove node"
        );
      }
      if (isMacOs && /Incompatible library version/.test(messages)) {
        help.push(
          "- Update Homebrew:",
          "    brew update && brew upgrade vips"
        );
      }
      if (errors.some((err) => err.code === "ERR_DLOPEN_DISABLED")) {
        help.push("- Run Node.js without using the --no-addons flag");
      }
      if (isWindows && /The specified procedure could not be found/.test(messages)) {
        help.push(
          "- Using the canvas package on Windows?",
          "    See https://sharp.pixelplumbing.com/install#canvas-and-windows",
          "- Check for outdated versions of sharp in the dependency tree:",
          "    npm ls sharp"
        );
      }
      help.push(
        "- Consult the installation documentation:",
        "    See https://sharp.pixelplumbing.com/install"
      );
      throw new Error(help.join("\n"));
    }
  }
});

// node_modules/sharp/lib/constructor.js
var require_constructor = __commonJS({
  "node_modules/sharp/lib/constructor.js"(exports2, module2) {
    var util = require("node:util");
    var stream = require("node:stream");
    var is = require_is();
    require_sharp();
    var debuglog = util.debuglog("sharp");
    var queueListener = (queueLength) => {
      Sharp.queue.emit("change", queueLength);
    };
    var Sharp = function(input, options) {
      if (arguments.length === 1 && !is.defined(input)) {
        throw new Error("Invalid input");
      }
      if (!(this instanceof Sharp)) {
        return new Sharp(input, options);
      }
      stream.Duplex.call(this);
      this.options = {
        // resize options
        topOffsetPre: -1,
        leftOffsetPre: -1,
        widthPre: -1,
        heightPre: -1,
        topOffsetPost: -1,
        leftOffsetPost: -1,
        widthPost: -1,
        heightPost: -1,
        width: -1,
        height: -1,
        canvas: "crop",
        position: 0,
        resizeBackground: [0, 0, 0, 255],
        angle: 0,
        rotationAngle: 0,
        rotationBackground: [0, 0, 0, 255],
        rotateBefore: false,
        orientBefore: false,
        flip: false,
        flop: false,
        extendTop: 0,
        extendBottom: 0,
        extendLeft: 0,
        extendRight: 0,
        extendBackground: [0, 0, 0, 255],
        extendWith: "background",
        withoutEnlargement: false,
        withoutReduction: false,
        affineMatrix: [],
        affineBackground: [0, 0, 0, 255],
        affineIdx: 0,
        affineIdy: 0,
        affineOdx: 0,
        affineOdy: 0,
        affineInterpolator: this.constructor.interpolators.bilinear,
        kernel: "lanczos3",
        fastShrinkOnLoad: true,
        // operations
        tint: [-1, 0, 0, 0],
        flatten: false,
        flattenBackground: [0, 0, 0],
        unflatten: false,
        negate: false,
        negateAlpha: true,
        medianSize: 0,
        blurSigma: 0,
        precision: "integer",
        minAmpl: 0.2,
        sharpenSigma: 0,
        sharpenM1: 1,
        sharpenM2: 2,
        sharpenX1: 2,
        sharpenY2: 10,
        sharpenY3: 20,
        threshold: 0,
        thresholdGrayscale: true,
        trimBackground: [],
        trimThreshold: -1,
        trimLineArt: false,
        dilateWidth: 0,
        erodeWidth: 0,
        gamma: 0,
        gammaOut: 0,
        greyscale: false,
        normalise: false,
        normaliseLower: 1,
        normaliseUpper: 99,
        claheWidth: 0,
        claheHeight: 0,
        claheMaxSlope: 3,
        brightness: 1,
        saturation: 1,
        hue: 0,
        lightness: 0,
        booleanBufferIn: null,
        booleanFileIn: "",
        joinChannelIn: [],
        extractChannel: -1,
        removeAlpha: false,
        ensureAlpha: -1,
        colourspace: "srgb",
        colourspacePipeline: "last",
        composite: [],
        // output
        fileOut: "",
        formatOut: "input",
        streamOut: false,
        keepMetadata: 0,
        withMetadataOrientation: -1,
        withMetadataDensity: 0,
        withIccProfile: "",
        withExif: {},
        withExifMerge: true,
        withXmp: "",
        resolveWithObject: false,
        loop: -1,
        delay: [],
        // output format
        jpegQuality: 80,
        jpegProgressive: false,
        jpegChromaSubsampling: "4:2:0",
        jpegTrellisQuantisation: false,
        jpegOvershootDeringing: false,
        jpegOptimiseScans: false,
        jpegOptimiseCoding: true,
        jpegQuantisationTable: 0,
        pngProgressive: false,
        pngCompressionLevel: 6,
        pngAdaptiveFiltering: false,
        pngPalette: false,
        pngQuality: 100,
        pngEffort: 7,
        pngBitdepth: 8,
        pngDither: 1,
        jp2Quality: 80,
        jp2TileHeight: 512,
        jp2TileWidth: 512,
        jp2Lossless: false,
        jp2ChromaSubsampling: "4:4:4",
        webpQuality: 80,
        webpAlphaQuality: 100,
        webpLossless: false,
        webpNearLossless: false,
        webpSmartSubsample: false,
        webpSmartDeblock: false,
        webpPreset: "default",
        webpEffort: 4,
        webpMinSize: false,
        webpMixed: false,
        gifBitdepth: 8,
        gifEffort: 7,
        gifDither: 1,
        gifInterFrameMaxError: 0,
        gifInterPaletteMaxError: 3,
        gifKeepDuplicateFrames: false,
        gifReuse: true,
        gifProgressive: false,
        tiffQuality: 80,
        tiffCompression: "jpeg",
        tiffBigtiff: false,
        tiffPredictor: "horizontal",
        tiffPyramid: false,
        tiffMiniswhite: false,
        tiffBitdepth: 8,
        tiffTile: false,
        tiffTileHeight: 256,
        tiffTileWidth: 256,
        tiffXres: 1,
        tiffYres: 1,
        tiffResolutionUnit: "inch",
        heifQuality: 50,
        heifLossless: false,
        heifCompression: "av1",
        heifEffort: 4,
        heifChromaSubsampling: "4:4:4",
        heifBitdepth: 8,
        jxlDistance: 1,
        jxlDecodingTier: 0,
        jxlEffort: 7,
        jxlLossless: false,
        rawDepth: "uchar",
        tileSize: 256,
        tileOverlap: 0,
        tileContainer: "fs",
        tileLayout: "dz",
        tileFormat: "last",
        tileDepth: "last",
        tileAngle: 0,
        tileSkipBlanks: -1,
        tileBackground: [255, 255, 255, 255],
        tileCentre: false,
        tileId: "https://example.com/iiif",
        tileBasename: "",
        timeoutSeconds: 0,
        linearA: [],
        linearB: [],
        pdfBackground: [255, 255, 255, 255],
        // Function to notify of libvips warnings
        debuglog: (warning) => {
          this.emit("warning", warning);
          debuglog(warning);
        },
        // Function to notify of queue length changes
        queueListener
      };
      this.options.input = this._createInputDescriptor(input, options, { allowStream: true });
      return this;
    };
    Object.setPrototypeOf(Sharp.prototype, stream.Duplex.prototype);
    Object.setPrototypeOf(Sharp, stream.Duplex);
    function clone() {
      const clone2 = this.constructor.call();
      const { debuglog: debuglog2, queueListener: queueListener2, ...options } = this.options;
      clone2.options = structuredClone(options);
      clone2.options.debuglog = debuglog2;
      clone2.options.queueListener = queueListener2;
      if (this._isStreamInput()) {
        this.on("finish", () => {
          this._flattenBufferIn();
          clone2.options.input.buffer = this.options.input.buffer;
          clone2.emit("finish");
        });
      }
      return clone2;
    }
    Object.assign(Sharp.prototype, { clone });
    module2.exports = Sharp;
  }
});

// node_modules/sharp/lib/input.js
var require_input = __commonJS({
  "node_modules/sharp/lib/input.js"(exports2, module2) {
    var is = require_is();
    var sharp2 = require_sharp();
    var align = {
      left: "low",
      top: "low",
      low: "low",
      center: "centre",
      centre: "centre",
      right: "high",
      bottom: "high",
      high: "high"
    };
    var inputStreamParameters = [
      // Limits and error handling
      "failOn",
      "limitInputPixels",
      "unlimited",
      // Format-generic
      "animated",
      "autoOrient",
      "density",
      "ignoreIcc",
      "page",
      "pages",
      "sequentialRead",
      // Format-specific
      "jp2",
      "openSlide",
      "pdf",
      "raw",
      "svg",
      "tiff",
      // Deprecated
      "failOnError",
      "openSlideLevel",
      "pdfBackground",
      "tiffSubifd"
    ];
    function _inputOptionsFromObject(obj) {
      const params = inputStreamParameters.filter((p) => is.defined(obj[p])).map((p) => [p, obj[p]]);
      return params.length ? Object.fromEntries(params) : void 0;
    }
    function _createInputDescriptor(input, inputOptions, containerOptions) {
      const inputDescriptor = {
        autoOrient: false,
        failOn: "warning",
        limitInputPixels: 16383 ** 2,
        ignoreIcc: false,
        unlimited: false,
        sequentialRead: true
      };
      if (is.string(input)) {
        inputDescriptor.file = input;
      } else if (is.buffer(input)) {
        if (input.length === 0) {
          throw Error("Input Buffer is empty");
        }
        inputDescriptor.buffer = input;
      } else if (is.arrayBuffer(input)) {
        if (input.byteLength === 0) {
          throw Error("Input bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input, 0, input.byteLength);
      } else if (is.typedArray(input)) {
        if (input.length === 0) {
          throw Error("Input Bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
      } else if (is.plainObject(input) && !is.defined(inputOptions)) {
        inputOptions = input;
        if (_inputOptionsFromObject(inputOptions)) {
          inputDescriptor.buffer = [];
        }
      } else if (!is.defined(input) && !is.defined(inputOptions) && is.object(containerOptions) && containerOptions.allowStream) {
        inputDescriptor.buffer = [];
      } else if (Array.isArray(input)) {
        if (input.length > 1) {
          if (!this.options.joining) {
            this.options.joining = true;
            this.options.join = input.map((i) => this._createInputDescriptor(i));
          } else {
            throw new Error("Recursive join is unsupported");
          }
        } else {
          throw new Error("Expected at least two images to join");
        }
      } else {
        throw new Error(`Unsupported input '${input}' of type ${typeof input}${is.defined(inputOptions) ? ` when also providing options of type ${typeof inputOptions}` : ""}`);
      }
      if (is.object(inputOptions)) {
        if (is.defined(inputOptions.failOnError)) {
          if (is.bool(inputOptions.failOnError)) {
            inputDescriptor.failOn = inputOptions.failOnError ? "warning" : "none";
          } else {
            throw is.invalidParameterError("failOnError", "boolean", inputOptions.failOnError);
          }
        }
        if (is.defined(inputOptions.failOn)) {
          if (is.string(inputOptions.failOn) && is.inArray(inputOptions.failOn, ["none", "truncated", "error", "warning"])) {
            inputDescriptor.failOn = inputOptions.failOn;
          } else {
            throw is.invalidParameterError("failOn", "one of: none, truncated, error, warning", inputOptions.failOn);
          }
        }
        if (is.defined(inputOptions.autoOrient)) {
          if (is.bool(inputOptions.autoOrient)) {
            inputDescriptor.autoOrient = inputOptions.autoOrient;
          } else {
            throw is.invalidParameterError("autoOrient", "boolean", inputOptions.autoOrient);
          }
        }
        if (is.defined(inputOptions.density)) {
          if (is.inRange(inputOptions.density, 1, 1e5)) {
            inputDescriptor.density = inputOptions.density;
          } else {
            throw is.invalidParameterError("density", "number between 1 and 100000", inputOptions.density);
          }
        }
        if (is.defined(inputOptions.ignoreIcc)) {
          if (is.bool(inputOptions.ignoreIcc)) {
            inputDescriptor.ignoreIcc = inputOptions.ignoreIcc;
          } else {
            throw is.invalidParameterError("ignoreIcc", "boolean", inputOptions.ignoreIcc);
          }
        }
        if (is.defined(inputOptions.limitInputPixels)) {
          if (is.bool(inputOptions.limitInputPixels)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels ? 16383 ** 2 : 0;
          } else if (is.integer(inputOptions.limitInputPixels) && is.inRange(inputOptions.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels;
          } else {
            throw is.invalidParameterError("limitInputPixels", "positive integer", inputOptions.limitInputPixels);
          }
        }
        if (is.defined(inputOptions.unlimited)) {
          if (is.bool(inputOptions.unlimited)) {
            inputDescriptor.unlimited = inputOptions.unlimited;
          } else {
            throw is.invalidParameterError("unlimited", "boolean", inputOptions.unlimited);
          }
        }
        if (is.defined(inputOptions.sequentialRead)) {
          if (is.bool(inputOptions.sequentialRead)) {
            inputDescriptor.sequentialRead = inputOptions.sequentialRead;
          } else {
            throw is.invalidParameterError("sequentialRead", "boolean", inputOptions.sequentialRead);
          }
        }
        if (is.defined(inputOptions.raw)) {
          if (is.object(inputOptions.raw) && is.integer(inputOptions.raw.width) && inputOptions.raw.width > 0 && is.integer(inputOptions.raw.height) && inputOptions.raw.height > 0 && is.integer(inputOptions.raw.channels) && is.inRange(inputOptions.raw.channels, 1, 4)) {
            inputDescriptor.rawWidth = inputOptions.raw.width;
            inputDescriptor.rawHeight = inputOptions.raw.height;
            inputDescriptor.rawChannels = inputOptions.raw.channels;
            switch (input.constructor) {
              case Uint8Array:
              case Uint8ClampedArray:
                inputDescriptor.rawDepth = "uchar";
                break;
              case Int8Array:
                inputDescriptor.rawDepth = "char";
                break;
              case Uint16Array:
                inputDescriptor.rawDepth = "ushort";
                break;
              case Int16Array:
                inputDescriptor.rawDepth = "short";
                break;
              case Uint32Array:
                inputDescriptor.rawDepth = "uint";
                break;
              case Int32Array:
                inputDescriptor.rawDepth = "int";
                break;
              case Float32Array:
                inputDescriptor.rawDepth = "float";
                break;
              case Float64Array:
                inputDescriptor.rawDepth = "double";
                break;
              default:
                inputDescriptor.rawDepth = "uchar";
                break;
            }
          } else {
            throw new Error("Expected width, height and channels for raw pixel input");
          }
          inputDescriptor.rawPremultiplied = false;
          if (is.defined(inputOptions.raw.premultiplied)) {
            if (is.bool(inputOptions.raw.premultiplied)) {
              inputDescriptor.rawPremultiplied = inputOptions.raw.premultiplied;
            } else {
              throw is.invalidParameterError("raw.premultiplied", "boolean", inputOptions.raw.premultiplied);
            }
          }
          inputDescriptor.rawPageHeight = 0;
          if (is.defined(inputOptions.raw.pageHeight)) {
            if (is.integer(inputOptions.raw.pageHeight) && inputOptions.raw.pageHeight > 0 && inputOptions.raw.pageHeight <= inputOptions.raw.height) {
              if (inputOptions.raw.height % inputOptions.raw.pageHeight !== 0) {
                throw new Error(`Expected raw.height ${inputOptions.raw.height} to be a multiple of raw.pageHeight ${inputOptions.raw.pageHeight}`);
              }
              inputDescriptor.rawPageHeight = inputOptions.raw.pageHeight;
            } else {
              throw is.invalidParameterError("raw.pageHeight", "positive integer", inputOptions.raw.pageHeight);
            }
          }
        }
        if (is.defined(inputOptions.animated)) {
          if (is.bool(inputOptions.animated)) {
            inputDescriptor.pages = inputOptions.animated ? -1 : 1;
          } else {
            throw is.invalidParameterError("animated", "boolean", inputOptions.animated);
          }
        }
        if (is.defined(inputOptions.pages)) {
          if (is.integer(inputOptions.pages) && is.inRange(inputOptions.pages, -1, 1e5)) {
            inputDescriptor.pages = inputOptions.pages;
          } else {
            throw is.invalidParameterError("pages", "integer between -1 and 100000", inputOptions.pages);
          }
        }
        if (is.defined(inputOptions.page)) {
          if (is.integer(inputOptions.page) && is.inRange(inputOptions.page, 0, 1e5)) {
            inputDescriptor.page = inputOptions.page;
          } else {
            throw is.invalidParameterError("page", "integer between 0 and 100000", inputOptions.page);
          }
        }
        if (is.object(inputOptions.openSlide) && is.defined(inputOptions.openSlide.level)) {
          if (is.integer(inputOptions.openSlide.level) && is.inRange(inputOptions.openSlide.level, 0, 256)) {
            inputDescriptor.openSlideLevel = inputOptions.openSlide.level;
          } else {
            throw is.invalidParameterError("openSlide.level", "integer between 0 and 256", inputOptions.openSlide.level);
          }
        } else if (is.defined(inputOptions.level)) {
          if (is.integer(inputOptions.level) && is.inRange(inputOptions.level, 0, 256)) {
            inputDescriptor.openSlideLevel = inputOptions.level;
          } else {
            throw is.invalidParameterError("level", "integer between 0 and 256", inputOptions.level);
          }
        }
        if (is.object(inputOptions.tiff) && is.defined(inputOptions.tiff.subifd)) {
          if (is.integer(inputOptions.tiff.subifd) && is.inRange(inputOptions.tiff.subifd, -1, 1e5)) {
            inputDescriptor.tiffSubifd = inputOptions.tiff.subifd;
          } else {
            throw is.invalidParameterError("tiff.subifd", "integer between -1 and 100000", inputOptions.tiff.subifd);
          }
        } else if (is.defined(inputOptions.subifd)) {
          if (is.integer(inputOptions.subifd) && is.inRange(inputOptions.subifd, -1, 1e5)) {
            inputDescriptor.tiffSubifd = inputOptions.subifd;
          } else {
            throw is.invalidParameterError("subifd", "integer between -1 and 100000", inputOptions.subifd);
          }
        }
        if (is.object(inputOptions.svg)) {
          if (is.defined(inputOptions.svg.stylesheet)) {
            if (is.string(inputOptions.svg.stylesheet)) {
              inputDescriptor.svgStylesheet = inputOptions.svg.stylesheet;
            } else {
              throw is.invalidParameterError("svg.stylesheet", "string", inputOptions.svg.stylesheet);
            }
          }
          if (is.defined(inputOptions.svg.highBitdepth)) {
            if (is.bool(inputOptions.svg.highBitdepth)) {
              inputDescriptor.svgHighBitdepth = inputOptions.svg.highBitdepth;
            } else {
              throw is.invalidParameterError("svg.highBitdepth", "boolean", inputOptions.svg.highBitdepth);
            }
          }
        }
        if (is.object(inputOptions.pdf) && is.defined(inputOptions.pdf.background)) {
          inputDescriptor.pdfBackground = this._getBackgroundColourOption(inputOptions.pdf.background);
        } else if (is.defined(inputOptions.pdfBackground)) {
          inputDescriptor.pdfBackground = this._getBackgroundColourOption(inputOptions.pdfBackground);
        }
        if (is.object(inputOptions.jp2) && is.defined(inputOptions.jp2.oneshot)) {
          if (is.bool(inputOptions.jp2.oneshot)) {
            inputDescriptor.jp2Oneshot = inputOptions.jp2.oneshot;
          } else {
            throw is.invalidParameterError("jp2.oneshot", "boolean", inputOptions.jp2.oneshot);
          }
        }
        if (is.defined(inputOptions.create)) {
          if (is.object(inputOptions.create) && is.integer(inputOptions.create.width) && inputOptions.create.width > 0 && is.integer(inputOptions.create.height) && inputOptions.create.height > 0 && is.integer(inputOptions.create.channels)) {
            inputDescriptor.createWidth = inputOptions.create.width;
            inputDescriptor.createHeight = inputOptions.create.height;
            inputDescriptor.createChannels = inputOptions.create.channels;
            inputDescriptor.createPageHeight = 0;
            if (is.defined(inputOptions.create.pageHeight)) {
              if (is.integer(inputOptions.create.pageHeight) && inputOptions.create.pageHeight > 0 && inputOptions.create.pageHeight <= inputOptions.create.height) {
                if (inputOptions.create.height % inputOptions.create.pageHeight !== 0) {
                  throw new Error(`Expected create.height ${inputOptions.create.height} to be a multiple of create.pageHeight ${inputOptions.create.pageHeight}`);
                }
                inputDescriptor.createPageHeight = inputOptions.create.pageHeight;
              } else {
                throw is.invalidParameterError("create.pageHeight", "positive integer", inputOptions.create.pageHeight);
              }
            }
            if (is.defined(inputOptions.create.noise)) {
              if (!is.object(inputOptions.create.noise)) {
                throw new Error("Expected noise to be an object");
              }
              if (inputOptions.create.noise.type !== "gaussian") {
                throw new Error("Only gaussian noise is supported at the moment");
              }
              inputDescriptor.createNoiseType = inputOptions.create.noise.type;
              if (!is.inRange(inputOptions.create.channels, 1, 4)) {
                throw is.invalidParameterError("create.channels", "number between 1 and 4", inputOptions.create.channels);
              }
              inputDescriptor.createNoiseMean = 128;
              if (is.defined(inputOptions.create.noise.mean)) {
                if (is.number(inputOptions.create.noise.mean) && is.inRange(inputOptions.create.noise.mean, 0, 1e4)) {
                  inputDescriptor.createNoiseMean = inputOptions.create.noise.mean;
                } else {
                  throw is.invalidParameterError("create.noise.mean", "number between 0 and 10000", inputOptions.create.noise.mean);
                }
              }
              inputDescriptor.createNoiseSigma = 30;
              if (is.defined(inputOptions.create.noise.sigma)) {
                if (is.number(inputOptions.create.noise.sigma) && is.inRange(inputOptions.create.noise.sigma, 0, 1e4)) {
                  inputDescriptor.createNoiseSigma = inputOptions.create.noise.sigma;
                } else {
                  throw is.invalidParameterError("create.noise.sigma", "number between 0 and 10000", inputOptions.create.noise.sigma);
                }
              }
            } else if (is.defined(inputOptions.create.background)) {
              if (!is.inRange(inputOptions.create.channels, 3, 4)) {
                throw is.invalidParameterError("create.channels", "number between 3 and 4", inputOptions.create.channels);
              }
              inputDescriptor.createBackground = this._getBackgroundColourOption(inputOptions.create.background);
            } else {
              throw new Error("Expected valid noise or background to create a new input image");
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected valid width, height and channels to create a new input image");
          }
        }
        if (is.defined(inputOptions.text)) {
          if (is.object(inputOptions.text) && is.string(inputOptions.text.text)) {
            inputDescriptor.textValue = inputOptions.text.text;
            if (is.defined(inputOptions.text.height) && is.defined(inputOptions.text.dpi)) {
              throw new Error("Expected only one of dpi or height");
            }
            if (is.defined(inputOptions.text.font)) {
              if (is.string(inputOptions.text.font)) {
                inputDescriptor.textFont = inputOptions.text.font;
              } else {
                throw is.invalidParameterError("text.font", "string", inputOptions.text.font);
              }
            }
            if (is.defined(inputOptions.text.fontfile)) {
              if (is.string(inputOptions.text.fontfile)) {
                inputDescriptor.textFontfile = inputOptions.text.fontfile;
              } else {
                throw is.invalidParameterError("text.fontfile", "string", inputOptions.text.fontfile);
              }
            }
            if (is.defined(inputOptions.text.width)) {
              if (is.integer(inputOptions.text.width) && inputOptions.text.width > 0) {
                inputDescriptor.textWidth = inputOptions.text.width;
              } else {
                throw is.invalidParameterError("text.width", "positive integer", inputOptions.text.width);
              }
            }
            if (is.defined(inputOptions.text.height)) {
              if (is.integer(inputOptions.text.height) && inputOptions.text.height > 0) {
                inputDescriptor.textHeight = inputOptions.text.height;
              } else {
                throw is.invalidParameterError("text.height", "positive integer", inputOptions.text.height);
              }
            }
            if (is.defined(inputOptions.text.align)) {
              if (is.string(inputOptions.text.align) && is.string(this.constructor.align[inputOptions.text.align])) {
                inputDescriptor.textAlign = this.constructor.align[inputOptions.text.align];
              } else {
                throw is.invalidParameterError("text.align", "valid alignment", inputOptions.text.align);
              }
            }
            if (is.defined(inputOptions.text.justify)) {
              if (is.bool(inputOptions.text.justify)) {
                inputDescriptor.textJustify = inputOptions.text.justify;
              } else {
                throw is.invalidParameterError("text.justify", "boolean", inputOptions.text.justify);
              }
            }
            if (is.defined(inputOptions.text.dpi)) {
              if (is.integer(inputOptions.text.dpi) && is.inRange(inputOptions.text.dpi, 1, 1e6)) {
                inputDescriptor.textDpi = inputOptions.text.dpi;
              } else {
                throw is.invalidParameterError("text.dpi", "integer between 1 and 1000000", inputOptions.text.dpi);
              }
            }
            if (is.defined(inputOptions.text.rgba)) {
              if (is.bool(inputOptions.text.rgba)) {
                inputDescriptor.textRgba = inputOptions.text.rgba;
              } else {
                throw is.invalidParameterError("text.rgba", "bool", inputOptions.text.rgba);
              }
            }
            if (is.defined(inputOptions.text.spacing)) {
              if (is.integer(inputOptions.text.spacing) && is.inRange(inputOptions.text.spacing, -1e6, 1e6)) {
                inputDescriptor.textSpacing = inputOptions.text.spacing;
              } else {
                throw is.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", inputOptions.text.spacing);
              }
            }
            if (is.defined(inputOptions.text.wrap)) {
              if (is.string(inputOptions.text.wrap) && is.inArray(inputOptions.text.wrap, ["word", "char", "word-char", "none"])) {
                inputDescriptor.textWrap = inputOptions.text.wrap;
              } else {
                throw is.invalidParameterError("text.wrap", "one of: word, char, word-char, none", inputOptions.text.wrap);
              }
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected a valid string to create an image with text.");
          }
        }
        if (is.defined(inputOptions.join)) {
          if (is.defined(this.options.join)) {
            if (is.defined(inputOptions.join.animated)) {
              if (is.bool(inputOptions.join.animated)) {
                inputDescriptor.joinAnimated = inputOptions.join.animated;
              } else {
                throw is.invalidParameterError("join.animated", "boolean", inputOptions.join.animated);
              }
            }
            if (is.defined(inputOptions.join.across)) {
              if (is.integer(inputOptions.join.across) && is.inRange(inputOptions.join.across, 1, 1e6)) {
                inputDescriptor.joinAcross = inputOptions.join.across;
              } else {
                throw is.invalidParameterError("join.across", "integer between 1 and 100000", inputOptions.join.across);
              }
            }
            if (is.defined(inputOptions.join.shim)) {
              if (is.integer(inputOptions.join.shim) && is.inRange(inputOptions.join.shim, 0, 1e6)) {
                inputDescriptor.joinShim = inputOptions.join.shim;
              } else {
                throw is.invalidParameterError("join.shim", "integer between 0 and 100000", inputOptions.join.shim);
              }
            }
            if (is.defined(inputOptions.join.background)) {
              inputDescriptor.joinBackground = this._getBackgroundColourOption(inputOptions.join.background);
            }
            if (is.defined(inputOptions.join.halign)) {
              if (is.string(inputOptions.join.halign) && is.string(this.constructor.align[inputOptions.join.halign])) {
                inputDescriptor.joinHalign = this.constructor.align[inputOptions.join.halign];
              } else {
                throw is.invalidParameterError("join.halign", "valid alignment", inputOptions.join.halign);
              }
            }
            if (is.defined(inputOptions.join.valign)) {
              if (is.string(inputOptions.join.valign) && is.string(this.constructor.align[inputOptions.join.valign])) {
                inputDescriptor.joinValign = this.constructor.align[inputOptions.join.valign];
              } else {
                throw is.invalidParameterError("join.valign", "valid alignment", inputOptions.join.valign);
              }
            }
          } else {
            throw new Error("Expected input to be an array of images to join");
          }
        }
      } else if (is.defined(inputOptions)) {
        throw new Error(`Invalid input options ${inputOptions}`);
      }
      return inputDescriptor;
    }
    function _write(chunk, _encoding, callback) {
      if (Array.isArray(this.options.input.buffer)) {
        if (is.buffer(chunk)) {
          if (this.options.input.buffer.length === 0) {
            this.on("finish", () => {
              this.streamInFinished = true;
            });
          }
          this.options.input.buffer.push(chunk);
          callback();
        } else {
          callback(new Error("Non-Buffer data on Writable Stream"));
        }
      } else {
        callback(new Error("Unexpected data on Writable Stream"));
      }
    }
    function _flattenBufferIn() {
      if (this._isStreamInput()) {
        this.options.input.buffer = Buffer.concat(this.options.input.buffer);
      }
    }
    function _isStreamInput() {
      return Array.isArray(this.options.input.buffer);
    }
    function metadata(callback) {
      const stack = Error();
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.metadata(this.options, (err, metadata2) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, metadata2);
              }
            });
          });
        } else {
          sharp2.metadata(this.options, (err, metadata2) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, metadata2);
            }
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            const finished = () => {
              this._flattenBufferIn();
              sharp2.metadata(this.options, (err, metadata2) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  resolve(metadata2);
                }
              });
            };
            if (this.writableFinished) {
              finished();
            } else {
              this.once("finish", finished);
            }
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.metadata(this.options, (err, metadata2) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                resolve(metadata2);
              }
            });
          });
        }
      }
    }
    function stats(callback) {
      const stack = Error();
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.stats(this.options, (err, stats2) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, stats2);
              }
            });
          });
        } else {
          sharp2.stats(this.options, (err, stats2) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, stats2);
            }
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.on("finish", function() {
              this._flattenBufferIn();
              sharp2.stats(this.options, (err, stats2) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  resolve(stats2);
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.stats(this.options, (err, stats2) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                resolve(stats2);
              }
            });
          });
        }
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Private
        _inputOptionsFromObject,
        _createInputDescriptor,
        _write,
        _flattenBufferIn,
        _isStreamInput,
        // Public
        metadata,
        stats
      });
      Sharp.align = align;
    };
  }
});

// node_modules/sharp/lib/resize.js
var require_resize = __commonJS({
  "node_modules/sharp/lib/resize.js"(exports2, module2) {
    var is = require_is();
    var gravity = {
      center: 0,
      centre: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    };
    var position = {
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
      "right top": 5,
      "right bottom": 6,
      "left bottom": 7,
      "left top": 8
    };
    var extendWith = {
      background: "background",
      copy: "copy",
      repeat: "repeat",
      mirror: "mirror"
    };
    var strategy = {
      entropy: 16,
      attention: 17
    };
    var kernel = {
      nearest: "nearest",
      linear: "linear",
      cubic: "cubic",
      mitchell: "mitchell",
      lanczos2: "lanczos2",
      lanczos3: "lanczos3",
      mks2013: "mks2013",
      mks2021: "mks2021"
    };
    var fit = {
      contain: "contain",
      cover: "cover",
      fill: "fill",
      inside: "inside",
      outside: "outside"
    };
    var mapFitToCanvas = {
      contain: "embed",
      cover: "crop",
      fill: "ignore_aspect",
      inside: "max",
      outside: "min"
    };
    function isRotationExpected(options) {
      return options.angle % 360 !== 0 || options.rotationAngle !== 0;
    }
    function isResizeExpected(options) {
      return options.width !== -1 || options.height !== -1;
    }
    function resize(widthOrOptions, height, options) {
      if (isResizeExpected(this.options)) {
        this.options.debuglog("ignoring previous resize options");
      }
      if (this.options.widthPost !== -1) {
        this.options.debuglog("operation order will be: extract, resize, extract");
      }
      if (is.defined(widthOrOptions)) {
        if (is.object(widthOrOptions) && !is.defined(options)) {
          options = widthOrOptions;
        } else if (is.integer(widthOrOptions) && widthOrOptions > 0) {
          this.options.width = widthOrOptions;
        } else {
          throw is.invalidParameterError("width", "positive integer", widthOrOptions);
        }
      } else {
        this.options.width = -1;
      }
      if (is.defined(height)) {
        if (is.integer(height) && height > 0) {
          this.options.height = height;
        } else {
          throw is.invalidParameterError("height", "positive integer", height);
        }
      } else {
        this.options.height = -1;
      }
      if (is.object(options)) {
        if (is.defined(options.width)) {
          if (is.integer(options.width) && options.width > 0) {
            this.options.width = options.width;
          } else {
            throw is.invalidParameterError("width", "positive integer", options.width);
          }
        }
        if (is.defined(options.height)) {
          if (is.integer(options.height) && options.height > 0) {
            this.options.height = options.height;
          } else {
            throw is.invalidParameterError("height", "positive integer", options.height);
          }
        }
        if (is.defined(options.fit)) {
          const canvas = mapFitToCanvas[options.fit];
          if (is.string(canvas)) {
            this.options.canvas = canvas;
          } else {
            throw is.invalidParameterError("fit", "valid fit", options.fit);
          }
        }
        if (is.defined(options.position)) {
          const pos = is.integer(options.position) ? options.position : strategy[options.position] || position[options.position] || gravity[options.position];
          if (is.integer(pos) && (is.inRange(pos, 0, 8) || is.inRange(pos, 16, 17))) {
            this.options.position = pos;
          } else {
            throw is.invalidParameterError("position", "valid position/gravity/strategy", options.position);
          }
        }
        this._setBackgroundColourOption("resizeBackground", options.background);
        if (is.defined(options.kernel)) {
          if (is.string(kernel[options.kernel])) {
            this.options.kernel = kernel[options.kernel];
          } else {
            throw is.invalidParameterError("kernel", "valid kernel name", options.kernel);
          }
        }
        if (is.defined(options.withoutEnlargement)) {
          this._setBooleanOption("withoutEnlargement", options.withoutEnlargement);
        }
        if (is.defined(options.withoutReduction)) {
          this._setBooleanOption("withoutReduction", options.withoutReduction);
        }
        if (is.defined(options.fastShrinkOnLoad)) {
          this._setBooleanOption("fastShrinkOnLoad", options.fastShrinkOnLoad);
        }
      }
      if (isRotationExpected(this.options) && isResizeExpected(this.options)) {
        this.options.rotateBefore = true;
      }
      return this;
    }
    function extend(extend2) {
      if (is.integer(extend2) && extend2 > 0) {
        this.options.extendTop = extend2;
        this.options.extendBottom = extend2;
        this.options.extendLeft = extend2;
        this.options.extendRight = extend2;
      } else if (is.object(extend2)) {
        if (is.defined(extend2.top)) {
          if (is.integer(extend2.top) && extend2.top >= 0) {
            this.options.extendTop = extend2.top;
          } else {
            throw is.invalidParameterError("top", "positive integer", extend2.top);
          }
        }
        if (is.defined(extend2.bottom)) {
          if (is.integer(extend2.bottom) && extend2.bottom >= 0) {
            this.options.extendBottom = extend2.bottom;
          } else {
            throw is.invalidParameterError("bottom", "positive integer", extend2.bottom);
          }
        }
        if (is.defined(extend2.left)) {
          if (is.integer(extend2.left) && extend2.left >= 0) {
            this.options.extendLeft = extend2.left;
          } else {
            throw is.invalidParameterError("left", "positive integer", extend2.left);
          }
        }
        if (is.defined(extend2.right)) {
          if (is.integer(extend2.right) && extend2.right >= 0) {
            this.options.extendRight = extend2.right;
          } else {
            throw is.invalidParameterError("right", "positive integer", extend2.right);
          }
        }
        this._setBackgroundColourOption("extendBackground", extend2.background);
        if (is.defined(extend2.extendWith)) {
          if (is.string(extendWith[extend2.extendWith])) {
            this.options.extendWith = extendWith[extend2.extendWith];
          } else {
            throw is.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", extend2.extendWith);
          }
        }
      } else {
        throw is.invalidParameterError("extend", "integer or object", extend2);
      }
      return this;
    }
    function extract(options) {
      const suffix = isResizeExpected(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
      if (this.options[`width${suffix}`] !== -1) {
        this.options.debuglog("ignoring previous extract options");
      }
      ["left", "top", "width", "height"].forEach(function(name) {
        const value = options[name];
        if (is.integer(value) && value >= 0) {
          this.options[name + (name === "left" || name === "top" ? "Offset" : "") + suffix] = value;
        } else {
          throw is.invalidParameterError(name, "integer", value);
        }
      }, this);
      if (isRotationExpected(this.options) && !isResizeExpected(this.options)) {
        if (this.options.widthPre === -1 || this.options.widthPost === -1) {
          this.options.rotateBefore = true;
        }
      }
      if (this.options.input.autoOrient) {
        this.options.orientBefore = true;
      }
      return this;
    }
    function trim(options) {
      this.options.trimThreshold = 10;
      if (is.defined(options)) {
        if (is.object(options)) {
          if (is.defined(options.background)) {
            this._setBackgroundColourOption("trimBackground", options.background);
          }
          if (is.defined(options.threshold)) {
            if (is.number(options.threshold) && options.threshold >= 0) {
              this.options.trimThreshold = options.threshold;
            } else {
              throw is.invalidParameterError("threshold", "positive number", options.threshold);
            }
          }
          if (is.defined(options.lineArt)) {
            this._setBooleanOption("trimLineArt", options.lineArt);
          }
        } else {
          throw is.invalidParameterError("trim", "object", options);
        }
      }
      if (isRotationExpected(this.options)) {
        this.options.rotateBefore = true;
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        resize,
        extend,
        extract,
        trim
      });
      Sharp.gravity = gravity;
      Sharp.strategy = strategy;
      Sharp.kernel = kernel;
      Sharp.fit = fit;
      Sharp.position = position;
    };
  }
});

// node_modules/sharp/lib/composite.js
var require_composite = __commonJS({
  "node_modules/sharp/lib/composite.js"(exports2, module2) {
    var is = require_is();
    var blend = {
      clear: "clear",
      source: "source",
      over: "over",
      in: "in",
      out: "out",
      atop: "atop",
      dest: "dest",
      "dest-over": "dest-over",
      "dest-in": "dest-in",
      "dest-out": "dest-out",
      "dest-atop": "dest-atop",
      xor: "xor",
      add: "add",
      saturate: "saturate",
      multiply: "multiply",
      screen: "screen",
      overlay: "overlay",
      darken: "darken",
      lighten: "lighten",
      "colour-dodge": "colour-dodge",
      "color-dodge": "colour-dodge",
      "colour-burn": "colour-burn",
      "color-burn": "colour-burn",
      "hard-light": "hard-light",
      "soft-light": "soft-light",
      difference: "difference",
      exclusion: "exclusion"
    };
    function composite(images) {
      if (!Array.isArray(images)) {
        throw is.invalidParameterError("images to composite", "array", images);
      }
      this.options.composite = images.map((image) => {
        if (!is.object(image)) {
          throw is.invalidParameterError("image to composite", "object", image);
        }
        const inputOptions = this._inputOptionsFromObject(image);
        const composite2 = {
          input: this._createInputDescriptor(image.input, inputOptions, { allowStream: false }),
          blend: "over",
          tile: false,
          left: 0,
          top: 0,
          hasOffset: false,
          gravity: 0,
          premultiplied: false
        };
        if (is.defined(image.blend)) {
          if (is.string(blend[image.blend])) {
            composite2.blend = blend[image.blend];
          } else {
            throw is.invalidParameterError("blend", "valid blend name", image.blend);
          }
        }
        if (is.defined(image.tile)) {
          if (is.bool(image.tile)) {
            composite2.tile = image.tile;
          } else {
            throw is.invalidParameterError("tile", "boolean", image.tile);
          }
        }
        if (is.defined(image.left)) {
          if (is.integer(image.left)) {
            composite2.left = image.left;
          } else {
            throw is.invalidParameterError("left", "integer", image.left);
          }
        }
        if (is.defined(image.top)) {
          if (is.integer(image.top)) {
            composite2.top = image.top;
          } else {
            throw is.invalidParameterError("top", "integer", image.top);
          }
        }
        if (is.defined(image.top) !== is.defined(image.left)) {
          throw new Error("Expected both left and top to be set");
        } else {
          composite2.hasOffset = is.integer(image.top) && is.integer(image.left);
        }
        if (is.defined(image.gravity)) {
          if (is.integer(image.gravity) && is.inRange(image.gravity, 0, 8)) {
            composite2.gravity = image.gravity;
          } else if (is.string(image.gravity) && is.integer(this.constructor.gravity[image.gravity])) {
            composite2.gravity = this.constructor.gravity[image.gravity];
          } else {
            throw is.invalidParameterError("gravity", "valid gravity", image.gravity);
          }
        }
        if (is.defined(image.premultiplied)) {
          if (is.bool(image.premultiplied)) {
            composite2.premultiplied = image.premultiplied;
          } else {
            throw is.invalidParameterError("premultiplied", "boolean", image.premultiplied);
          }
        }
        return composite2;
      });
      return this;
    }
    module2.exports = (Sharp) => {
      Sharp.prototype.composite = composite;
      Sharp.blend = blend;
    };
  }
});

// node_modules/sharp/lib/operation.js
var require_operation = __commonJS({
  "node_modules/sharp/lib/operation.js"(exports2, module2) {
    var is = require_is();
    var vipsPrecision = {
      integer: "integer",
      float: "float",
      approximate: "approximate"
    };
    function rotate(angle, options) {
      if (!is.defined(angle)) {
        return this.autoOrient();
      }
      if (this.options.angle || this.options.rotationAngle) {
        this.options.debuglog("ignoring previous rotate options");
        this.options.angle = 0;
        this.options.rotationAngle = 0;
      }
      if (is.integer(angle) && !(angle % 90)) {
        this.options.angle = angle;
      } else if (is.number(angle)) {
        this.options.rotationAngle = angle;
        if (is.object(options) && options.background) {
          this._setBackgroundColourOption("rotationBackground", options.background);
        }
      } else {
        throw is.invalidParameterError("angle", "numeric", angle);
      }
      return this;
    }
    function autoOrient() {
      this.options.input.autoOrient = true;
      return this;
    }
    function flip(flip2) {
      this.options.flip = is.bool(flip2) ? flip2 : true;
      return this;
    }
    function flop(flop2) {
      this.options.flop = is.bool(flop2) ? flop2 : true;
      return this;
    }
    function affine(matrix, options) {
      const flatMatrix = [].concat(...matrix);
      if (flatMatrix.length === 4 && flatMatrix.every(is.number)) {
        this.options.affineMatrix = flatMatrix;
      } else {
        throw is.invalidParameterError("matrix", "1x4 or 2x2 array", matrix);
      }
      if (is.defined(options)) {
        if (is.object(options)) {
          this._setBackgroundColourOption("affineBackground", options.background);
          if (is.defined(options.idx)) {
            if (is.number(options.idx)) {
              this.options.affineIdx = options.idx;
            } else {
              throw is.invalidParameterError("options.idx", "number", options.idx);
            }
          }
          if (is.defined(options.idy)) {
            if (is.number(options.idy)) {
              this.options.affineIdy = options.idy;
            } else {
              throw is.invalidParameterError("options.idy", "number", options.idy);
            }
          }
          if (is.defined(options.odx)) {
            if (is.number(options.odx)) {
              this.options.affineOdx = options.odx;
            } else {
              throw is.invalidParameterError("options.odx", "number", options.odx);
            }
          }
          if (is.defined(options.ody)) {
            if (is.number(options.ody)) {
              this.options.affineOdy = options.ody;
            } else {
              throw is.invalidParameterError("options.ody", "number", options.ody);
            }
          }
          if (is.defined(options.interpolator)) {
            if (is.inArray(options.interpolator, Object.values(this.constructor.interpolators))) {
              this.options.affineInterpolator = options.interpolator;
            } else {
              throw is.invalidParameterError("options.interpolator", "valid interpolator name", options.interpolator);
            }
          }
        } else {
          throw is.invalidParameterError("options", "object", options);
        }
      }
      return this;
    }
    function sharpen(options, flat, jagged) {
      if (!is.defined(options)) {
        this.options.sharpenSigma = -1;
      } else if (is.bool(options)) {
        this.options.sharpenSigma = options ? -1 : 0;
      } else if (is.number(options) && is.inRange(options, 0.01, 1e4)) {
        this.options.sharpenSigma = options;
        if (is.defined(flat)) {
          if (is.number(flat) && is.inRange(flat, 0, 1e4)) {
            this.options.sharpenM1 = flat;
          } else {
            throw is.invalidParameterError("flat", "number between 0 and 10000", flat);
          }
        }
        if (is.defined(jagged)) {
          if (is.number(jagged) && is.inRange(jagged, 0, 1e4)) {
            this.options.sharpenM2 = jagged;
          } else {
            throw is.invalidParameterError("jagged", "number between 0 and 10000", jagged);
          }
        }
      } else if (is.plainObject(options)) {
        if (is.number(options.sigma) && is.inRange(options.sigma, 1e-6, 10)) {
          this.options.sharpenSigma = options.sigma;
        } else {
          throw is.invalidParameterError("options.sigma", "number between 0.000001 and 10", options.sigma);
        }
        if (is.defined(options.m1)) {
          if (is.number(options.m1) && is.inRange(options.m1, 0, 1e6)) {
            this.options.sharpenM1 = options.m1;
          } else {
            throw is.invalidParameterError("options.m1", "number between 0 and 1000000", options.m1);
          }
        }
        if (is.defined(options.m2)) {
          if (is.number(options.m2) && is.inRange(options.m2, 0, 1e6)) {
            this.options.sharpenM2 = options.m2;
          } else {
            throw is.invalidParameterError("options.m2", "number between 0 and 1000000", options.m2);
          }
        }
        if (is.defined(options.x1)) {
          if (is.number(options.x1) && is.inRange(options.x1, 0, 1e6)) {
            this.options.sharpenX1 = options.x1;
          } else {
            throw is.invalidParameterError("options.x1", "number between 0 and 1000000", options.x1);
          }
        }
        if (is.defined(options.y2)) {
          if (is.number(options.y2) && is.inRange(options.y2, 0, 1e6)) {
            this.options.sharpenY2 = options.y2;
          } else {
            throw is.invalidParameterError("options.y2", "number between 0 and 1000000", options.y2);
          }
        }
        if (is.defined(options.y3)) {
          if (is.number(options.y3) && is.inRange(options.y3, 0, 1e6)) {
            this.options.sharpenY3 = options.y3;
          } else {
            throw is.invalidParameterError("options.y3", "number between 0 and 1000000", options.y3);
          }
        }
      } else {
        throw is.invalidParameterError("sigma", "number between 0.01 and 10000", options);
      }
      return this;
    }
    function median(size) {
      if (!is.defined(size)) {
        this.options.medianSize = 3;
      } else if (is.integer(size) && is.inRange(size, 1, 1e3)) {
        this.options.medianSize = size;
      } else {
        throw is.invalidParameterError("size", "integer between 1 and 1000", size);
      }
      return this;
    }
    function blur(options) {
      let sigma;
      if (is.number(options)) {
        sigma = options;
      } else if (is.plainObject(options)) {
        if (!is.number(options.sigma)) {
          throw is.invalidParameterError("options.sigma", "number between 0.3 and 1000", sigma);
        }
        sigma = options.sigma;
        if ("precision" in options) {
          if (is.string(vipsPrecision[options.precision])) {
            this.options.precision = vipsPrecision[options.precision];
          } else {
            throw is.invalidParameterError("precision", "one of: integer, float, approximate", options.precision);
          }
        }
        if ("minAmplitude" in options) {
          if (is.number(options.minAmplitude) && is.inRange(options.minAmplitude, 1e-3, 1)) {
            this.options.minAmpl = options.minAmplitude;
          } else {
            throw is.invalidParameterError("minAmplitude", "number between 0.001 and 1", options.minAmplitude);
          }
        }
      }
      if (!is.defined(options)) {
        this.options.blurSigma = -1;
      } else if (is.bool(options)) {
        this.options.blurSigma = options ? -1 : 0;
      } else if (is.number(sigma) && is.inRange(sigma, 0.3, 1e3)) {
        this.options.blurSigma = sigma;
      } else {
        throw is.invalidParameterError("sigma", "number between 0.3 and 1000", sigma);
      }
      return this;
    }
    function dilate(width) {
      if (!is.defined(width)) {
        this.options.dilateWidth = 1;
      } else if (is.integer(width) && width > 0) {
        this.options.dilateWidth = width;
      } else {
        throw is.invalidParameterError("dilate", "positive integer", dilate);
      }
      return this;
    }
    function erode(width) {
      if (!is.defined(width)) {
        this.options.erodeWidth = 1;
      } else if (is.integer(width) && width > 0) {
        this.options.erodeWidth = width;
      } else {
        throw is.invalidParameterError("erode", "positive integer", erode);
      }
      return this;
    }
    function flatten(options) {
      this.options.flatten = is.bool(options) ? options : true;
      if (is.object(options)) {
        this._setBackgroundColourOption("flattenBackground", options.background);
      }
      return this;
    }
    function unflatten() {
      this.options.unflatten = true;
      return this;
    }
    function gamma(gamma2, gammaOut) {
      if (!is.defined(gamma2)) {
        this.options.gamma = 2.2;
      } else if (is.number(gamma2) && is.inRange(gamma2, 1, 3)) {
        this.options.gamma = gamma2;
      } else {
        throw is.invalidParameterError("gamma", "number between 1.0 and 3.0", gamma2);
      }
      if (!is.defined(gammaOut)) {
        this.options.gammaOut = this.options.gamma;
      } else if (is.number(gammaOut) && is.inRange(gammaOut, 1, 3)) {
        this.options.gammaOut = gammaOut;
      } else {
        throw is.invalidParameterError("gammaOut", "number between 1.0 and 3.0", gammaOut);
      }
      return this;
    }
    function negate(options) {
      this.options.negate = is.bool(options) ? options : true;
      if (is.plainObject(options) && "alpha" in options) {
        if (!is.bool(options.alpha)) {
          throw is.invalidParameterError("alpha", "should be boolean value", options.alpha);
        } else {
          this.options.negateAlpha = options.alpha;
        }
      }
      return this;
    }
    function normalise(options) {
      if (is.plainObject(options)) {
        if (is.defined(options.lower)) {
          if (is.number(options.lower) && is.inRange(options.lower, 0, 99)) {
            this.options.normaliseLower = options.lower;
          } else {
            throw is.invalidParameterError("lower", "number between 0 and 99", options.lower);
          }
        }
        if (is.defined(options.upper)) {
          if (is.number(options.upper) && is.inRange(options.upper, 1, 100)) {
            this.options.normaliseUpper = options.upper;
          } else {
            throw is.invalidParameterError("upper", "number between 1 and 100", options.upper);
          }
        }
      }
      if (this.options.normaliseLower >= this.options.normaliseUpper) {
        throw is.invalidParameterError(
          "range",
          "lower to be less than upper",
          `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`
        );
      }
      this.options.normalise = true;
      return this;
    }
    function normalize(options) {
      return this.normalise(options);
    }
    function clahe(options) {
      if (is.plainObject(options)) {
        if (is.integer(options.width) && options.width > 0) {
          this.options.claheWidth = options.width;
        } else {
          throw is.invalidParameterError("width", "integer greater than zero", options.width);
        }
        if (is.integer(options.height) && options.height > 0) {
          this.options.claheHeight = options.height;
        } else {
          throw is.invalidParameterError("height", "integer greater than zero", options.height);
        }
        if (is.defined(options.maxSlope)) {
          if (is.integer(options.maxSlope) && is.inRange(options.maxSlope, 0, 100)) {
            this.options.claheMaxSlope = options.maxSlope;
          } else {
            throw is.invalidParameterError("maxSlope", "integer between 0 and 100", options.maxSlope);
          }
        }
      } else {
        throw is.invalidParameterError("options", "plain object", options);
      }
      return this;
    }
    function convolve(kernel) {
      if (!is.object(kernel) || !Array.isArray(kernel.kernel) || !is.integer(kernel.width) || !is.integer(kernel.height) || !is.inRange(kernel.width, 3, 1001) || !is.inRange(kernel.height, 3, 1001) || kernel.height * kernel.width !== kernel.kernel.length) {
        throw new Error("Invalid convolution kernel");
      }
      if (!is.integer(kernel.scale)) {
        kernel.scale = kernel.kernel.reduce((a, b) => a + b, 0);
      }
      if (kernel.scale < 1) {
        kernel.scale = 1;
      }
      if (!is.integer(kernel.offset)) {
        kernel.offset = 0;
      }
      this.options.convKernel = kernel;
      return this;
    }
    function threshold(threshold2, options) {
      if (!is.defined(threshold2)) {
        this.options.threshold = 128;
      } else if (is.bool(threshold2)) {
        this.options.threshold = threshold2 ? 128 : 0;
      } else if (is.integer(threshold2) && is.inRange(threshold2, 0, 255)) {
        this.options.threshold = threshold2;
      } else {
        throw is.invalidParameterError("threshold", "integer between 0 and 255", threshold2);
      }
      if (!is.object(options) || options.greyscale === true || options.grayscale === true) {
        this.options.thresholdGrayscale = true;
      } else {
        this.options.thresholdGrayscale = false;
      }
      return this;
    }
    function boolean(operand, operator, options) {
      this.options.boolean = this._createInputDescriptor(operand, options);
      if (is.string(operator) && is.inArray(operator, ["and", "or", "eor"])) {
        this.options.booleanOp = operator;
      } else {
        throw is.invalidParameterError("operator", "one of: and, or, eor", operator);
      }
      return this;
    }
    function linear(a, b) {
      if (!is.defined(a) && is.number(b)) {
        a = 1;
      } else if (is.number(a) && !is.defined(b)) {
        b = 0;
      }
      if (!is.defined(a)) {
        this.options.linearA = [];
      } else if (is.number(a)) {
        this.options.linearA = [a];
      } else if (Array.isArray(a) && a.length && a.every(is.number)) {
        this.options.linearA = a;
      } else {
        throw is.invalidParameterError("a", "number or array of numbers", a);
      }
      if (!is.defined(b)) {
        this.options.linearB = [];
      } else if (is.number(b)) {
        this.options.linearB = [b];
      } else if (Array.isArray(b) && b.length && b.every(is.number)) {
        this.options.linearB = b;
      } else {
        throw is.invalidParameterError("b", "number or array of numbers", b);
      }
      if (this.options.linearA.length !== this.options.linearB.length) {
        throw new Error("Expected a and b to be arrays of the same length");
      }
      return this;
    }
    function recomb(inputMatrix) {
      if (!Array.isArray(inputMatrix)) {
        throw is.invalidParameterError("inputMatrix", "array", inputMatrix);
      }
      if (inputMatrix.length !== 3 && inputMatrix.length !== 4) {
        throw is.invalidParameterError("inputMatrix", "3x3 or 4x4 array", inputMatrix.length);
      }
      const recombMatrix = inputMatrix.flat().map(Number);
      if (recombMatrix.length !== 9 && recombMatrix.length !== 16) {
        throw is.invalidParameterError("inputMatrix", "cardinality of 9 or 16", recombMatrix.length);
      }
      this.options.recombMatrix = recombMatrix;
      return this;
    }
    function modulate(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "plain object", options);
      }
      if ("brightness" in options) {
        if (is.number(options.brightness) && options.brightness >= 0) {
          this.options.brightness = options.brightness;
        } else {
          throw is.invalidParameterError("brightness", "number above zero", options.brightness);
        }
      }
      if ("saturation" in options) {
        if (is.number(options.saturation) && options.saturation >= 0) {
          this.options.saturation = options.saturation;
        } else {
          throw is.invalidParameterError("saturation", "number above zero", options.saturation);
        }
      }
      if ("hue" in options) {
        if (is.integer(options.hue)) {
          this.options.hue = options.hue % 360;
        } else {
          throw is.invalidParameterError("hue", "number", options.hue);
        }
      }
      if ("lightness" in options) {
        if (is.number(options.lightness)) {
          this.options.lightness = options.lightness;
        } else {
          throw is.invalidParameterError("lightness", "number", options.lightness);
        }
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        autoOrient,
        rotate,
        flip,
        flop,
        affine,
        sharpen,
        erode,
        dilate,
        median,
        blur,
        flatten,
        unflatten,
        gamma,
        negate,
        normalise,
        normalize,
        clahe,
        convolve,
        threshold,
        boolean,
        linear,
        recomb,
        modulate
      });
    };
  }
});

// node_modules/@img/colour/color.cjs
var require_color = __commonJS({
  "node_modules/@img/colour/color.cjs"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export(index_exports, {
      default: () => index_default
    });
    module2.exports = __toCommonJS(index_exports);
    var colors = {
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 134, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 250, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 221],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      rebeccapurple: [102, 51, 153],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [112, 128, 144],
      slategrey: [112, 128, 144],
      snow: [255, 250, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 50]
    };
    for (const key in colors) Object.freeze(colors[key]);
    var color_name_default = Object.freeze(colors);
    var reverseNames = /* @__PURE__ */ Object.create(null);
    for (const name in color_name_default) {
      if (Object.hasOwn(color_name_default, name)) {
        reverseNames[color_name_default[name]] = name;
      }
    }
    var cs = {
      to: {},
      get: {}
    };
    cs.get = function(string) {
      const prefix = string.slice(0, 3).toLowerCase();
      let value;
      let model;
      switch (prefix) {
        case "hsl": {
          value = cs.get.hsl(string);
          model = "hsl";
          break;
        }
        case "hwb": {
          value = cs.get.hwb(string);
          model = "hwb";
          break;
        }
        default: {
          value = cs.get.rgb(string);
          model = "rgb";
          break;
        }
      }
      if (!value) {
        return null;
      }
      return { model, value };
    };
    cs.get.rgb = function(string) {
      if (!string) {
        return null;
      }
      const abbr = /^#([a-f\d]{3,4})$/i;
      const hex = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
      const rgba = /^rgba?\(\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)\s*(?:[\s,|/]\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(%?)\s*)?\)$/i;
      const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/i;
      const keyword = /^(\w+)$/;
      let rgb = [0, 0, 0, 1];
      let match;
      let i;
      let hexAlpha;
      if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (i = 0; i < 3; i++) {
          const i2 = i * 2;
          rgb[i] = Number.parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
        }
      } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
      } else if (match = string.match(rgba)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseFloat(match[i + 1]);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.match(per)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Math.round(Number.parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.toLowerCase().match(keyword)) {
        if (match[1] === "transparent") {
          return [0, 0, 0, 0];
        }
        if (!Object.hasOwn(color_name_default, match[1])) {
          return null;
        }
        rgb = color_name_default[match[1]].slice();
        rgb[3] = 1;
        return rgb;
      } else {
        return null;
      }
      for (i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
      }
      rgb[3] = clamp(rgb[3], 0, 1);
      return rgb;
    };
    cs.get.hsl = function(string) {
      if (!string) {
        return null;
      }
      const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
      const match = string.match(hsl);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const s = clamp(Number.parseFloat(match[2]), 0, 100);
        const l = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
      }
      return null;
    };
    cs.get.hwb = function(string) {
      if (!string) {
        return null;
      }
      const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
      const match = string.match(hwb);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const w = clamp(Number.parseFloat(match[2]), 0, 100);
        const b = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
      }
      return null;
    };
    cs.to.hex = function(...rgba) {
      return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
    };
    cs.to.rgb = function(...rgba) {
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
    };
    cs.to.rgb.percent = function(...rgba) {
      const r = Math.round(rgba[0] / 255 * 100);
      const g = Math.round(rgba[1] / 255 * 100);
      const b = Math.round(rgba[2] / 255 * 100);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g + "%, " + b + "%)" : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
    };
    cs.to.hsl = function(...hsla) {
      return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    cs.to.hwb = function(...hwba) {
      let a = "";
      if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
      }
      return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
    };
    cs.to.keyword = function(...rgb) {
      return reverseNames[rgb.slice(0, 3)];
    };
    function clamp(number_, min, max) {
      return Math.min(Math.max(min, number_), max);
    }
    function hexDouble(number_) {
      const string_ = Math.round(number_).toString(16).toUpperCase();
      return string_.length < 2 ? "0" + string_ : string_;
    }
    var color_string_default = cs;
    var reverseKeywords = {};
    for (const key of Object.keys(color_name_default)) {
      reverseKeywords[color_name_default[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      oklab: { channels: 3, labels: ["okl", "oka", "okb"] },
      lch: { channels: 3, labels: "lch" },
      oklch: { channels: 3, labels: ["okl", "okc", "okh"] },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    var conversions_default = convert;
    var LAB_FT = (6 / 29) ** 3;
    function srgbNonlinearTransform(c) {
      const cc = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92;
      return Math.min(Math.max(0, cc), 1);
    }
    function srgbNonlinearTransformInv(c) {
      return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
    }
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      switch (max) {
        case min: {
          h = 0;
          break;
        }
        case r: {
          h = (g - b) / delta;
          break;
        }
        case g: {
          h = 2 + (b - r) / delta;
          break;
        }
        case b: {
          h = 4 + (r - g) / delta;
          break;
        }
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        switch (v) {
          case r: {
            h = bdif - gdif;
            break;
          }
          case g: {
            h = 1 / 3 + rdif - bdif;
            break;
          }
          case b: {
            h = 2 / 3 + gdif - rdif;
            break;
          }
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.oklab = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const lp = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const mp = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const sp = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const aa = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const bb = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, aa * 100, bb * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Number.POSITIVE_INFINITY;
      let currentClosestKeyword;
      for (const keyword of Object.keys(color_name_default)) {
        const value = color_name_default[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return [...color_name_default[keyword]];
    };
    convert.rgb.xyz = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
      const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t3;
      let value;
      if (s === 0) {
        value = l * 255;
        return [value, value, value];
      }
      const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          value = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          value = t2;
        } else if (3 * t3 < 2) {
          value = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          value = t1;
        }
        rgb[i] = value * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0: {
          return [v, t, p];
        }
        case 1: {
          return [q, v, p];
        }
        case 2: {
          return [p, v, t];
        }
        case 3: {
          return [p, q, v];
        }
        case 4: {
          return [t, p, v];
        }
        case 5: {
          return [v, p, q];
        }
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0: {
          r = v;
          g = n;
          b = wh;
          break;
        }
        case 1: {
          r = n;
          g = v;
          b = wh;
          break;
        }
        case 2: {
          r = wh;
          g = v;
          b = n;
          break;
        }
        case 3: {
          r = wh;
          g = n;
          b = v;
          break;
        }
        case 4: {
          r = n;
          g = wh;
          b = v;
          break;
        }
        case 5: {
          r = v;
          g = wh;
          b = n;
          break;
        }
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
      g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
      b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;
      r = srgbNonlinearTransform(r);
      g = srgbNonlinearTransform(g);
      b = srgbNonlinearTransform(b);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.xyz.oklab = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      const lp = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
      const mp = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
      const sp = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const a = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const b = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, a * 100, b * 100];
    };
    convert.oklab.oklch = function(oklab) {
      return convert.lab.lch(oklab);
    };
    convert.oklab.xyz = function(oklab) {
      const ll = oklab[0] / 100;
      const a = oklab[1] / 100;
      const b = oklab[2] / 100;
      const l = (0.999999998 * ll + 0.396337792 * a + 0.215803758 * b) ** 3;
      const m = (1.000000008 * ll - 0.105561342 * a - 0.063854175 * b) ** 3;
      const s = (1.000000055 * ll - 0.089484182 * a - 1.291485538 * b) ** 3;
      const x = 1.227013851 * l - 0.55779998 * m + 0.281256149 * s;
      const y = -0.040580178 * l + 1.11225687 * m - 0.071676679 * s;
      const z = -0.076381285 * l - 0.421481978 * m + 1.58616322 * s;
      return [x * 100, y * 100, z * 100];
    };
    convert.oklab.rgb = function(oklab) {
      const ll = oklab[0] / 100;
      const aa = oklab[1] / 100;
      const bb = oklab[2] / 100;
      const l = (ll + 0.3963377774 * aa + 0.2158037573 * bb) ** 3;
      const m = (ll - 0.1055613458 * aa - 0.0638541728 * bb) ** 3;
      const s = (ll - 0.0894841775 * aa - 1.291485548 * bb) ** 3;
      const r = srgbNonlinearTransform(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
      const g = srgbNonlinearTransform(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
      const b = srgbNonlinearTransform(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
      return [r * 255, g * 255, b * 255];
    };
    convert.oklch.oklab = function(oklch) {
      return convert.lch.lab(oklch);
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > LAB_FT ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > LAB_FT ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > LAB_FT ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r >> 4 === g >> 4 && g >> 4 === b >> 4) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      args = args[0];
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (Math.trunc(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      args = args[0];
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = [...colorString].map((char) => char + char).join("");
      }
      const integer = Number.parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let hue;
      const grayscale = chroma < 1 ? min / (1 - chroma) : 0;
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0: {
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        }
        case 1: {
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        }
        case 2: {
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        }
        case 3: {
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        }
        case 4: {
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        }
        default: {
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
        }
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const value = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (value << 16) + (value << 8) + value;
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const value = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [value / 255 * 100];
    };
    function buildGraph() {
      const graph = {};
      const models2 = Object.keys(conversions_default);
      for (let { length } = models2, i = 0; i < length; i++) {
        graph[models2[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length > 0) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions_default[current]);
        for (let { length } = adjacents, i = 0; i < length; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path = [graph[toModel].parent, toModel];
      let fn = conversions_default[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions_default[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    function route(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models2 = Object.keys(graph);
      for (let { length } = models2, i = 0; i < length; i++) {
        const toModel = models2[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    }
    var route_default = route;
    var convert2 = {};
    var models = Object.keys(conversions_default);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let { length } = result, i = 0; i < length; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    for (const fromModel of models) {
      convert2[fromModel] = {};
      Object.defineProperty(convert2[fromModel], "channels", { value: conversions_default[fromModel].channels });
      Object.defineProperty(convert2[fromModel], "labels", { value: conversions_default[fromModel].labels });
      const routes = route_default(fromModel);
      const routeModels = Object.keys(routes);
      for (const toModel of routeModels) {
        const fn = routes[toModel];
        convert2[fromModel][toModel] = wrapRounded(fn);
        convert2[fromModel][toModel].raw = wrapRaw(fn);
      }
    }
    var color_convert_default = convert2;
    var skippedModels = [
      // To be honest, I don't really feel like keyword belongs in color convert, but eh.
      "keyword",
      // Gray conflicts with some method names, and has its own method defined.
      "gray",
      // Shouldn't really be in color-convert either...
      "hex"
    ];
    var hashedModelKeys = {};
    for (const model of Object.keys(color_convert_default)) {
      hashedModelKeys[[...color_convert_default[model].labels].sort().join("")] = model;
    }
    var limiters = {};
    function Color(object, model) {
      if (!(this instanceof Color)) {
        return new Color(object, model);
      }
      if (model && model in skippedModels) {
        model = null;
      }
      if (model && !(model in color_convert_default)) {
        throw new Error("Unknown model: " + model);
      }
      let i;
      let channels;
      if (object == null) {
        this.model = "rgb";
        this.color = [0, 0, 0];
        this.valpha = 1;
      } else if (object instanceof Color) {
        this.model = object.model;
        this.color = [...object.color];
        this.valpha = object.valpha;
      } else if (typeof object === "string") {
        const result = color_string_default.get(object);
        if (result === null) {
          throw new Error("Unable to parse color from string: " + object);
        }
        this.model = result.model;
        channels = color_convert_default[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
      } else if (object.length > 0) {
        this.model = model || "rgb";
        channels = color_convert_default[this.model].channels;
        const newArray = Array.prototype.slice.call(object, 0, channels);
        this.color = zeroArray(newArray, channels);
        this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
      } else if (typeof object === "number") {
        this.model = "rgb";
        this.color = [
          object >> 16 & 255,
          object >> 8 & 255,
          object & 255
        ];
        this.valpha = 1;
      } else {
        this.valpha = 1;
        const keys = Object.keys(object);
        if ("alpha" in object) {
          keys.splice(keys.indexOf("alpha"), 1);
          this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
        }
        const hashedKeys = keys.sort().join("");
        if (!(hashedKeys in hashedModelKeys)) {
          throw new Error("Unable to parse color from object: " + JSON.stringify(object));
        }
        this.model = hashedModelKeys[hashedKeys];
        const { labels } = color_convert_default[this.model];
        const color = [];
        for (i = 0; i < labels.length; i++) {
          color.push(object[labels[i]]);
        }
        this.color = zeroArray(color);
      }
      if (limiters[this.model]) {
        channels = color_convert_default[this.model].channels;
        for (i = 0; i < channels; i++) {
          const limit = limiters[this.model][i];
          if (limit) {
            this.color[i] = limit(this.color[i]);
          }
        }
      }
      this.valpha = Math.max(0, Math.min(1, this.valpha));
      if (Object.freeze) {
        Object.freeze(this);
      }
    }
    Color.prototype = {
      toString() {
        return this.string();
      },
      toJSON() {
        return this[this.model]();
      },
      string(places) {
        let self = this.model in color_string_default.to ? this : this.rgb();
        self = self.round(typeof places === "number" ? places : 1);
        const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return color_string_default.to[self.model](...arguments_);
      },
      percentString(places) {
        const self = this.rgb().round(typeof places === "number" ? places : 1);
        const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return color_string_default.to.rgb.percent(...arguments_);
      },
      array() {
        return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
      },
      object() {
        const result = {};
        const { channels } = color_convert_default[this.model];
        const { labels } = color_convert_default[this.model];
        for (let i = 0; i < channels; i++) {
          result[labels[i]] = this.color[i];
        }
        if (this.valpha !== 1) {
          result.alpha = this.valpha;
        }
        return result;
      },
      unitArray() {
        const rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
          rgb.push(this.valpha);
        }
        return rgb;
      },
      unitObject() {
        const rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
          rgb.alpha = this.valpha;
        }
        return rgb;
      },
      round(places) {
        places = Math.max(places || 0, 0);
        return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
      },
      alpha(value) {
        if (value !== void 0) {
          return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
        }
        return this.valpha;
      },
      // Rgb
      red: getset("rgb", 0, maxfn(255)),
      green: getset("rgb", 1, maxfn(255)),
      blue: getset("rgb", 2, maxfn(255)),
      hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
      saturationl: getset("hsl", 1, maxfn(100)),
      lightness: getset("hsl", 2, maxfn(100)),
      saturationv: getset("hsv", 1, maxfn(100)),
      value: getset("hsv", 2, maxfn(100)),
      chroma: getset("hcg", 1, maxfn(100)),
      gray: getset("hcg", 2, maxfn(100)),
      white: getset("hwb", 1, maxfn(100)),
      wblack: getset("hwb", 2, maxfn(100)),
      cyan: getset("cmyk", 0, maxfn(100)),
      magenta: getset("cmyk", 1, maxfn(100)),
      yellow: getset("cmyk", 2, maxfn(100)),
      black: getset("cmyk", 3, maxfn(100)),
      x: getset("xyz", 0, maxfn(95.047)),
      y: getset("xyz", 1, maxfn(100)),
      z: getset("xyz", 2, maxfn(108.833)),
      l: getset("lab", 0, maxfn(100)),
      a: getset("lab", 1),
      b: getset("lab", 2),
      keyword(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return color_convert_default[this.model].keyword(this.color);
      },
      hex(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return color_string_default.to.hex(...this.rgb().round().color);
      },
      hexa(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        const rgbArray = this.rgb().round().color;
        let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
        if (alphaHex.length === 1) {
          alphaHex = "0" + alphaHex;
        }
        return color_string_default.to.hex(...rgbArray) + alphaHex;
      },
      rgbNumber() {
        const rgb = this.rgb().color;
        return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
      },
      luminosity() {
        const rgb = this.rgb().color;
        const lum = [];
        for (const [i, element] of rgb.entries()) {
          const chan = element / 255;
          lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
      },
      contrast(color2) {
        const lum1 = this.luminosity();
        const lum2 = color2.luminosity();
        if (lum1 > lum2) {
          return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
      },
      level(color2) {
        const contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7) {
          return "AAA";
        }
        return contrastRatio >= 4.5 ? "AA" : "";
      },
      isDark() {
        const rgb = this.rgb().color;
        const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
        return yiq < 128;
      },
      isLight() {
        return !this.isDark();
      },
      negate() {
        const rgb = this.rgb();
        for (let i = 0; i < 3; i++) {
          rgb.color[i] = 255 - rgb.color[i];
        }
        return rgb;
      },
      lighten(ratio) {
        const hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
      },
      darken(ratio) {
        const hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
      },
      saturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
      },
      desaturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
      },
      whiten(ratio) {
        const hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
      },
      blacken(ratio) {
        const hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
      },
      grayscale() {
        const rgb = this.rgb().color;
        const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(value, value, value);
      },
      fade(ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
      },
      opaquer(ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
      },
      rotate(degrees) {
        const hsl = this.hsl();
        let hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
      },
      mix(mixinColor, weight) {
        if (!mixinColor || !mixinColor.rgb) {
          throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        const color1 = mixinColor.rgb();
        const color2 = this.rgb();
        const p = weight === void 0 ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = color1.alpha() - color2.alpha();
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;
        return Color.rgb(
          w1 * color1.red() + w2 * color2.red(),
          w1 * color1.green() + w2 * color2.green(),
          w1 * color1.blue() + w2 * color2.blue(),
          color1.alpha() * p + color2.alpha() * (1 - p)
        );
      }
    };
    for (const model of Object.keys(color_convert_default)) {
      if (skippedModels.includes(model)) {
        continue;
      }
      const { channels } = color_convert_default[model];
      Color.prototype[model] = function(...arguments_) {
        if (this.model === model) {
          return new Color(this);
        }
        if (arguments_.length > 0) {
          return new Color(arguments_, model);
        }
        return new Color([...assertArray(color_convert_default[this.model][model].raw(this.color)), this.valpha], model);
      };
      Color[model] = function(...arguments_) {
        let color = arguments_[0];
        if (typeof color === "number") {
          color = zeroArray(arguments_, channels);
        }
        return new Color(color, model);
      };
    }
    function roundTo(number, places) {
      return Number(number.toFixed(places));
    }
    function roundToPlace(places) {
      return function(number) {
        return roundTo(number, places);
      };
    }
    function getset(model, channel, modifier) {
      model = Array.isArray(model) ? model : [model];
      for (const m of model) {
        (limiters[m] ||= [])[channel] = modifier;
      }
      model = model[0];
      return function(value) {
        let result;
        if (value !== void 0) {
          if (modifier) {
            value = modifier(value);
          }
          result = this[model]();
          result.color[channel] = value;
          return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
          result = modifier(result);
        }
        return result;
      };
    }
    function maxfn(max) {
      return function(v) {
        return Math.max(0, Math.min(max, v));
      };
    }
    function assertArray(value) {
      return Array.isArray(value) ? value : [value];
    }
    function zeroArray(array, length) {
      for (let i = 0; i < length; i++) {
        if (typeof array[i] !== "number") {
          array[i] = 0;
        }
      }
      return array;
    }
    var index_default = Color;
  }
});

// node_modules/@img/colour/index.cjs
var require_colour = __commonJS({
  "node_modules/@img/colour/index.cjs"(exports2, module2) {
    module2.exports = require_color().default;
  }
});

// node_modules/sharp/lib/colour.js
var require_colour2 = __commonJS({
  "node_modules/sharp/lib/colour.js"(exports2, module2) {
    var color = require_colour();
    var is = require_is();
    var colourspace = {
      multiband: "multiband",
      "b-w": "b-w",
      bw: "b-w",
      cmyk: "cmyk",
      srgb: "srgb"
    };
    function tint(tint2) {
      this._setBackgroundColourOption("tint", tint2);
      return this;
    }
    function greyscale(greyscale2) {
      this.options.greyscale = is.bool(greyscale2) ? greyscale2 : true;
      return this;
    }
    function grayscale(grayscale2) {
      return this.greyscale(grayscale2);
    }
    function pipelineColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspacePipeline = colourspace2;
      return this;
    }
    function pipelineColorspace(colorspace) {
      return this.pipelineColourspace(colorspace);
    }
    function toColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspace = colourspace2;
      return this;
    }
    function toColorspace(colorspace) {
      return this.toColourspace(colorspace);
    }
    function _getBackgroundColourOption(value) {
      if (is.object(value) || is.string(value) && value.length >= 3 && value.length <= 200) {
        const colour = color(value);
        return [
          colour.red(),
          colour.green(),
          colour.blue(),
          Math.round(colour.alpha() * 255)
        ];
      } else {
        throw is.invalidParameterError("background", "object or string", value);
      }
    }
    function _setBackgroundColourOption(key, value) {
      if (is.defined(value)) {
        this.options[key] = _getBackgroundColourOption(value);
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public
        tint,
        greyscale,
        grayscale,
        pipelineColourspace,
        pipelineColorspace,
        toColourspace,
        toColorspace,
        // Private
        _getBackgroundColourOption,
        _setBackgroundColourOption
      });
      Sharp.colourspace = colourspace;
      Sharp.colorspace = colourspace;
    };
  }
});

// node_modules/sharp/lib/channel.js
var require_channel = __commonJS({
  "node_modules/sharp/lib/channel.js"(exports2, module2) {
    var is = require_is();
    var bool = {
      and: "and",
      or: "or",
      eor: "eor"
    };
    function removeAlpha() {
      this.options.removeAlpha = true;
      return this;
    }
    function ensureAlpha(alpha) {
      if (is.defined(alpha)) {
        if (is.number(alpha) && is.inRange(alpha, 0, 1)) {
          this.options.ensureAlpha = alpha;
        } else {
          throw is.invalidParameterError("alpha", "number between 0 and 1", alpha);
        }
      } else {
        this.options.ensureAlpha = 1;
      }
      return this;
    }
    function extractChannel(channel) {
      const channelMap = { red: 0, green: 1, blue: 2, alpha: 3 };
      if (Object.keys(channelMap).includes(channel)) {
        channel = channelMap[channel];
      }
      if (is.integer(channel) && is.inRange(channel, 0, 4)) {
        this.options.extractChannel = channel;
      } else {
        throw is.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", channel);
      }
      return this;
    }
    function joinChannel(images, options) {
      if (Array.isArray(images)) {
        images.forEach(function(image) {
          this.options.joinChannelIn.push(this._createInputDescriptor(image, options));
        }, this);
      } else {
        this.options.joinChannelIn.push(this._createInputDescriptor(images, options));
      }
      return this;
    }
    function bandbool(boolOp) {
      if (is.string(boolOp) && is.inArray(boolOp, ["and", "or", "eor"])) {
        this.options.bandBoolOp = boolOp;
      } else {
        throw is.invalidParameterError("boolOp", "one of: and, or, eor", boolOp);
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public instance functions
        removeAlpha,
        ensureAlpha,
        extractChannel,
        joinChannel,
        bandbool
      });
      Sharp.bool = bool;
    };
  }
});

// node_modules/sharp/lib/output.js
var require_output = __commonJS({
  "node_modules/sharp/lib/output.js"(exports2, module2) {
    var path = require("node:path");
    var is = require_is();
    var sharp2 = require_sharp();
    var formats = /* @__PURE__ */ new Map([
      ["heic", "heif"],
      ["heif", "heif"],
      ["avif", "avif"],
      ["jpeg", "jpeg"],
      ["jpg", "jpeg"],
      ["jpe", "jpeg"],
      ["tile", "tile"],
      ["dz", "tile"],
      ["png", "png"],
      ["raw", "raw"],
      ["tiff", "tiff"],
      ["tif", "tiff"],
      ["webp", "webp"],
      ["gif", "gif"],
      ["jp2", "jp2"],
      ["jpx", "jp2"],
      ["j2k", "jp2"],
      ["j2c", "jp2"],
      ["jxl", "jxl"]
    ]);
    var jp2Regex = /\.(jp[2x]|j2[kc])$/i;
    var errJp2Save = () => new Error("JP2 output requires libvips with support for OpenJPEG");
    var bitdepthFromColourCount = (colours) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(colours)));
    function toFile(fileOut, callback) {
      let err;
      if (!is.string(fileOut)) {
        err = new Error("Missing output file path");
      } else if (is.string(this.options.input.file) && path.resolve(this.options.input.file) === path.resolve(fileOut)) {
        err = new Error("Cannot use same file for input and output");
      } else if (jp2Regex.test(path.extname(fileOut)) && !this.constructor.format.jp2k.output.file) {
        err = errJp2Save();
      }
      if (err) {
        if (is.fn(callback)) {
          callback(err);
        } else {
          return Promise.reject(err);
        }
      } else {
        this.options.fileOut = fileOut;
        const stack = Error();
        return this._pipeline(callback, stack);
      }
      return this;
    }
    function toBuffer(options, callback) {
      if (is.object(options)) {
        this._setBooleanOption("resolveWithObject", options.resolveWithObject);
      } else if (this.options.resolveWithObject) {
        this.options.resolveWithObject = false;
      }
      this.options.fileOut = "";
      const stack = Error();
      return this._pipeline(is.fn(options) ? options : callback, stack);
    }
    function keepExif() {
      this.options.keepMetadata |= 1;
      return this;
    }
    function withExif(exif) {
      if (is.object(exif)) {
        for (const [ifd, entries] of Object.entries(exif)) {
          if (is.object(entries)) {
            for (const [k, v] of Object.entries(entries)) {
              if (is.string(v)) {
                this.options.withExif[`exif-${ifd.toLowerCase()}-${k}`] = v;
              } else {
                throw is.invalidParameterError(`${ifd}.${k}`, "string", v);
              }
            }
          } else {
            throw is.invalidParameterError(ifd, "object", entries);
          }
        }
      } else {
        throw is.invalidParameterError("exif", "object", exif);
      }
      this.options.withExifMerge = false;
      return this.keepExif();
    }
    function withExifMerge(exif) {
      this.withExif(exif);
      this.options.withExifMerge = true;
      return this;
    }
    function keepIccProfile() {
      this.options.keepMetadata |= 8;
      return this;
    }
    function withIccProfile(icc, options) {
      if (is.string(icc)) {
        this.options.withIccProfile = icc;
      } else {
        throw is.invalidParameterError("icc", "string", icc);
      }
      this.keepIccProfile();
      if (is.object(options)) {
        if (is.defined(options.attach)) {
          if (is.bool(options.attach)) {
            if (!options.attach) {
              this.options.keepMetadata &= ~8;
            }
          } else {
            throw is.invalidParameterError("attach", "boolean", options.attach);
          }
        }
      }
      return this;
    }
    function keepXmp() {
      this.options.keepMetadata |= 2;
      return this;
    }
    function withXmp(xmp) {
      if (is.string(xmp) && xmp.length > 0) {
        this.options.withXmp = xmp;
        this.options.keepMetadata |= 2;
      } else {
        throw is.invalidParameterError("xmp", "non-empty string", xmp);
      }
      return this;
    }
    function keepMetadata() {
      this.options.keepMetadata = 31;
      return this;
    }
    function withMetadata(options) {
      this.keepMetadata();
      this.withIccProfile("srgb");
      if (is.object(options)) {
        if (is.defined(options.orientation)) {
          if (is.integer(options.orientation) && is.inRange(options.orientation, 1, 8)) {
            this.options.withMetadataOrientation = options.orientation;
          } else {
            throw is.invalidParameterError("orientation", "integer between 1 and 8", options.orientation);
          }
        }
        if (is.defined(options.density)) {
          if (is.number(options.density) && options.density > 0) {
            this.options.withMetadataDensity = options.density;
          } else {
            throw is.invalidParameterError("density", "positive number", options.density);
          }
        }
        if (is.defined(options.icc)) {
          this.withIccProfile(options.icc);
        }
        if (is.defined(options.exif)) {
          this.withExifMerge(options.exif);
        }
      }
      return this;
    }
    function toFormat(format, options) {
      const actualFormat = formats.get((is.object(format) && is.string(format.id) ? format.id : format).toLowerCase());
      if (!actualFormat) {
        throw is.invalidParameterError("format", `one of: ${[...formats.keys()].join(", ")}`, format);
      }
      return this[actualFormat](options);
    }
    function jpeg(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jpegQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("jpegProgressive", options.progressive);
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jpegChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
        const optimiseCoding = is.bool(options.optimizeCoding) ? options.optimizeCoding : options.optimiseCoding;
        if (is.defined(optimiseCoding)) {
          this._setBooleanOption("jpegOptimiseCoding", optimiseCoding);
        }
        if (is.defined(options.mozjpeg)) {
          if (is.bool(options.mozjpeg)) {
            if (options.mozjpeg) {
              this.options.jpegTrellisQuantisation = true;
              this.options.jpegOvershootDeringing = true;
              this.options.jpegOptimiseScans = true;
              this.options.jpegProgressive = true;
              this.options.jpegQuantisationTable = 3;
            }
          } else {
            throw is.invalidParameterError("mozjpeg", "boolean", options.mozjpeg);
          }
        }
        const trellisQuantisation = is.bool(options.trellisQuantization) ? options.trellisQuantization : options.trellisQuantisation;
        if (is.defined(trellisQuantisation)) {
          this._setBooleanOption("jpegTrellisQuantisation", trellisQuantisation);
        }
        if (is.defined(options.overshootDeringing)) {
          this._setBooleanOption("jpegOvershootDeringing", options.overshootDeringing);
        }
        const optimiseScans = is.bool(options.optimizeScans) ? options.optimizeScans : options.optimiseScans;
        if (is.defined(optimiseScans)) {
          this._setBooleanOption("jpegOptimiseScans", optimiseScans);
          if (optimiseScans) {
            this.options.jpegProgressive = true;
          }
        }
        const quantisationTable = is.number(options.quantizationTable) ? options.quantizationTable : options.quantisationTable;
        if (is.defined(quantisationTable)) {
          if (is.integer(quantisationTable) && is.inRange(quantisationTable, 0, 8)) {
            this.options.jpegQuantisationTable = quantisationTable;
          } else {
            throw is.invalidParameterError("quantisationTable", "integer between 0 and 8", quantisationTable);
          }
        }
      }
      return this._updateFormatOut("jpeg", options);
    }
    function png(options) {
      if (is.object(options)) {
        if (is.defined(options.progressive)) {
          this._setBooleanOption("pngProgressive", options.progressive);
        }
        if (is.defined(options.compressionLevel)) {
          if (is.integer(options.compressionLevel) && is.inRange(options.compressionLevel, 0, 9)) {
            this.options.pngCompressionLevel = options.compressionLevel;
          } else {
            throw is.invalidParameterError("compressionLevel", "integer between 0 and 9", options.compressionLevel);
          }
        }
        if (is.defined(options.adaptiveFiltering)) {
          this._setBooleanOption("pngAdaptiveFiltering", options.adaptiveFiltering);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.pngBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.palette)) {
          this._setBooleanOption("pngPalette", options.palette);
        } else if ([options.quality, options.effort, options.colours, options.colors, options.dither].some(is.defined)) {
          this._setBooleanOption("pngPalette", true);
        }
        if (this.options.pngPalette) {
          if (is.defined(options.quality)) {
            if (is.integer(options.quality) && is.inRange(options.quality, 0, 100)) {
              this.options.pngQuality = options.quality;
            } else {
              throw is.invalidParameterError("quality", "integer between 0 and 100", options.quality);
            }
          }
          if (is.defined(options.effort)) {
            if (is.integer(options.effort) && is.inRange(options.effort, 1, 10)) {
              this.options.pngEffort = options.effort;
            } else {
              throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
            }
          }
          if (is.defined(options.dither)) {
            if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
              this.options.pngDither = options.dither;
            } else {
              throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
            }
          }
        }
      }
      return this._updateFormatOut("png", options);
    }
    function webp(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.webpQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.alphaQuality)) {
          if (is.integer(options.alphaQuality) && is.inRange(options.alphaQuality, 0, 100)) {
            this.options.webpAlphaQuality = options.alphaQuality;
          } else {
            throw is.invalidParameterError("alphaQuality", "integer between 0 and 100", options.alphaQuality);
          }
        }
        if (is.defined(options.lossless)) {
          this._setBooleanOption("webpLossless", options.lossless);
        }
        if (is.defined(options.nearLossless)) {
          this._setBooleanOption("webpNearLossless", options.nearLossless);
        }
        if (is.defined(options.smartSubsample)) {
          this._setBooleanOption("webpSmartSubsample", options.smartSubsample);
        }
        if (is.defined(options.smartDeblock)) {
          this._setBooleanOption("webpSmartDeblock", options.smartDeblock);
        }
        if (is.defined(options.preset)) {
          if (is.string(options.preset) && is.inArray(options.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) {
            this.options.webpPreset = options.preset;
          } else {
            throw is.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", options.preset);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 6)) {
            this.options.webpEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 6", options.effort);
          }
        }
        if (is.defined(options.minSize)) {
          this._setBooleanOption("webpMinSize", options.minSize);
        }
        if (is.defined(options.mixed)) {
          this._setBooleanOption("webpMixed", options.mixed);
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("webp", options);
    }
    function gif(options) {
      if (is.object(options)) {
        if (is.defined(options.reuse)) {
          this._setBooleanOption("gifReuse", options.reuse);
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("gifProgressive", options.progressive);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.gifBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.effort)) {
          if (is.number(options.effort) && is.inRange(options.effort, 1, 10)) {
            this.options.gifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
          }
        }
        if (is.defined(options.dither)) {
          if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
            this.options.gifDither = options.dither;
          } else {
            throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
          }
        }
        if (is.defined(options.interFrameMaxError)) {
          if (is.number(options.interFrameMaxError) && is.inRange(options.interFrameMaxError, 0, 32)) {
            this.options.gifInterFrameMaxError = options.interFrameMaxError;
          } else {
            throw is.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", options.interFrameMaxError);
          }
        }
        if (is.defined(options.interPaletteMaxError)) {
          if (is.number(options.interPaletteMaxError) && is.inRange(options.interPaletteMaxError, 0, 256)) {
            this.options.gifInterPaletteMaxError = options.interPaletteMaxError;
          } else {
            throw is.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", options.interPaletteMaxError);
          }
        }
        if (is.defined(options.keepDuplicateFrames)) {
          if (is.bool(options.keepDuplicateFrames)) {
            this._setBooleanOption("gifKeepDuplicateFrames", options.keepDuplicateFrames);
          } else {
            throw is.invalidParameterError("keepDuplicateFrames", "boolean", options.keepDuplicateFrames);
          }
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("gif", options);
    }
    function jp2(options) {
      if (!this.constructor.format.jp2k.output.buffer) {
        throw errJp2Save();
      }
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jp2Quality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jp2Lossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && is.inRange(options.tileWidth, 1, 32768)) {
            this.options.jp2TileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer between 1 and 32768", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && is.inRange(options.tileHeight, 1, 32768)) {
            this.options.jp2TileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer between 1 and 32768", options.tileHeight);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jp2ChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
      }
      return this._updateFormatOut("jp2", options);
    }
    function trySetAnimationOptions(source, target) {
      if (is.object(source) && is.defined(source.loop)) {
        if (is.integer(source.loop) && is.inRange(source.loop, 0, 65535)) {
          target.loop = source.loop;
        } else {
          throw is.invalidParameterError("loop", "integer between 0 and 65535", source.loop);
        }
      }
      if (is.object(source) && is.defined(source.delay)) {
        if (is.integer(source.delay) && is.inRange(source.delay, 0, 65535)) {
          target.delay = [source.delay];
        } else if (Array.isArray(source.delay) && source.delay.every(is.integer) && source.delay.every((v) => is.inRange(v, 0, 65535))) {
          target.delay = source.delay;
        } else {
          throw is.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", source.delay);
        }
      }
    }
    function tiff(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.tiffQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.bitdepth)) {
          if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [1, 2, 4, 8])) {
            this.options.tiffBitdepth = options.bitdepth;
          } else {
            throw is.invalidParameterError("bitdepth", "1, 2, 4 or 8", options.bitdepth);
          }
        }
        if (is.defined(options.tile)) {
          this._setBooleanOption("tiffTile", options.tile);
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && options.tileWidth > 0) {
            this.options.tiffTileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer greater than zero", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && options.tileHeight > 0) {
            this.options.tiffTileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer greater than zero", options.tileHeight);
          }
        }
        if (is.defined(options.miniswhite)) {
          this._setBooleanOption("tiffMiniswhite", options.miniswhite);
        }
        if (is.defined(options.pyramid)) {
          this._setBooleanOption("tiffPyramid", options.pyramid);
        }
        if (is.defined(options.xres)) {
          if (is.number(options.xres) && options.xres > 0) {
            this.options.tiffXres = options.xres;
          } else {
            throw is.invalidParameterError("xres", "number greater than zero", options.xres);
          }
        }
        if (is.defined(options.yres)) {
          if (is.number(options.yres) && options.yres > 0) {
            this.options.tiffYres = options.yres;
          } else {
            throw is.invalidParameterError("yres", "number greater than zero", options.yres);
          }
        }
        if (is.defined(options.compression)) {
          if (is.string(options.compression) && is.inArray(options.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) {
            this.options.tiffCompression = options.compression;
          } else {
            throw is.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", options.compression);
          }
        }
        if (is.defined(options.bigtiff)) {
          this._setBooleanOption("tiffBigtiff", options.bigtiff);
        }
        if (is.defined(options.predictor)) {
          if (is.string(options.predictor) && is.inArray(options.predictor, ["none", "horizontal", "float"])) {
            this.options.tiffPredictor = options.predictor;
          } else {
            throw is.invalidParameterError("predictor", "one of: none, horizontal, float", options.predictor);
          }
        }
        if (is.defined(options.resolutionUnit)) {
          if (is.string(options.resolutionUnit) && is.inArray(options.resolutionUnit, ["inch", "cm"])) {
            this.options.tiffResolutionUnit = options.resolutionUnit;
          } else {
            throw is.invalidParameterError("resolutionUnit", "one of: inch, cm", options.resolutionUnit);
          }
        }
      }
      return this._updateFormatOut("tiff", options);
    }
    function avif(options) {
      return this.heif({ ...options, compression: "av1" });
    }
    function heif(options) {
      if (is.object(options)) {
        if (is.string(options.compression) && is.inArray(options.compression, ["av1", "hevc"])) {
          this.options.heifCompression = options.compression;
        } else {
          throw is.invalidParameterError("compression", "one of: av1, hevc", options.compression);
        }
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.heifQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.heifLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 9)) {
            this.options.heifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 9", options.effort);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.heifChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
        if (is.defined(options.bitdepth)) {
          if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [8, 10, 12])) {
            if (options.bitdepth !== 8 && this.constructor.versions.heif) {
              throw is.invalidParameterError("bitdepth when using prebuilt binaries", 8, options.bitdepth);
            }
            this.options.heifBitdepth = options.bitdepth;
          } else {
            throw is.invalidParameterError("bitdepth", "8, 10 or 12", options.bitdepth);
          }
        }
      } else {
        throw is.invalidParameterError("options", "Object", options);
      }
      return this._updateFormatOut("heif", options);
    }
    function jxl(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jxlDistance = options.quality >= 30 ? 0.1 + (100 - options.quality) * 0.09 : 53 / 3e3 * options.quality * options.quality - 23 / 20 * options.quality + 25;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        } else if (is.defined(options.distance)) {
          if (is.number(options.distance) && is.inRange(options.distance, 0, 15)) {
            this.options.jxlDistance = options.distance;
          } else {
            throw is.invalidParameterError("distance", "number between 0.0 and 15.0", options.distance);
          }
        }
        if (is.defined(options.decodingTier)) {
          if (is.integer(options.decodingTier) && is.inRange(options.decodingTier, 0, 4)) {
            this.options.jxlDecodingTier = options.decodingTier;
          } else {
            throw is.invalidParameterError("decodingTier", "integer between 0 and 4", options.decodingTier);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jxlLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 1, 9)) {
            this.options.jxlEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 1 and 9", options.effort);
          }
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("jxl", options);
    }
    function raw(options) {
      if (is.object(options)) {
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(
            options.depth,
            ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"]
          )) {
            this.options.rawDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", options.depth);
          }
        }
      }
      return this._updateFormatOut("raw");
    }
    function tile(options) {
      if (is.object(options)) {
        if (is.defined(options.size)) {
          if (is.integer(options.size) && is.inRange(options.size, 1, 8192)) {
            this.options.tileSize = options.size;
          } else {
            throw is.invalidParameterError("size", "integer between 1 and 8192", options.size);
          }
        }
        if (is.defined(options.overlap)) {
          if (is.integer(options.overlap) && is.inRange(options.overlap, 0, 8192)) {
            if (options.overlap > this.options.tileSize) {
              throw is.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, options.overlap);
            }
            this.options.tileOverlap = options.overlap;
          } else {
            throw is.invalidParameterError("overlap", "integer between 0 and 8192", options.overlap);
          }
        }
        if (is.defined(options.container)) {
          if (is.string(options.container) && is.inArray(options.container, ["fs", "zip"])) {
            this.options.tileContainer = options.container;
          } else {
            throw is.invalidParameterError("container", "one of: fs, zip", options.container);
          }
        }
        if (is.defined(options.layout)) {
          if (is.string(options.layout) && is.inArray(options.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) {
            this.options.tileLayout = options.layout;
          } else {
            throw is.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", options.layout);
          }
        }
        if (is.defined(options.angle)) {
          if (is.integer(options.angle) && !(options.angle % 90)) {
            this.options.tileAngle = options.angle;
          } else {
            throw is.invalidParameterError("angle", "positive/negative multiple of 90", options.angle);
          }
        }
        this._setBackgroundColourOption("tileBackground", options.background);
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(options.depth, ["onepixel", "onetile", "one"])) {
            this.options.tileDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: onepixel, onetile, one", options.depth);
          }
        }
        if (is.defined(options.skipBlanks)) {
          if (is.integer(options.skipBlanks) && is.inRange(options.skipBlanks, -1, 65535)) {
            this.options.tileSkipBlanks = options.skipBlanks;
          } else {
            throw is.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", options.skipBlanks);
          }
        } else if (is.defined(options.layout) && options.layout === "google") {
          this.options.tileSkipBlanks = 5;
        }
        const centre = is.bool(options.center) ? options.center : options.centre;
        if (is.defined(centre)) {
          this._setBooleanOption("tileCentre", centre);
        }
        if (is.defined(options.id)) {
          if (is.string(options.id)) {
            this.options.tileId = options.id;
          } else {
            throw is.invalidParameterError("id", "string", options.id);
          }
        }
        if (is.defined(options.basename)) {
          if (is.string(options.basename)) {
            this.options.tileBasename = options.basename;
          } else {
            throw is.invalidParameterError("basename", "string", options.basename);
          }
        }
      }
      if (is.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) {
        this.options.tileFormat = this.options.formatOut;
      } else if (this.options.formatOut !== "input") {
        throw is.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
      }
      return this._updateFormatOut("dz");
    }
    function timeout(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "object", options);
      }
      if (is.integer(options.seconds) && is.inRange(options.seconds, 0, 3600)) {
        this.options.timeoutSeconds = options.seconds;
      } else {
        throw is.invalidParameterError("seconds", "integer between 0 and 3600", options.seconds);
      }
      return this;
    }
    function _updateFormatOut(formatOut, options) {
      if (!(is.object(options) && options.force === false)) {
        this.options.formatOut = formatOut;
      }
      return this;
    }
    function _setBooleanOption(key, val) {
      if (is.bool(val)) {
        this.options[key] = val;
      } else {
        throw is.invalidParameterError(key, "boolean", val);
      }
    }
    function _read() {
      if (!this.options.streamOut) {
        this.options.streamOut = true;
        const stack = Error();
        this._pipeline(void 0, stack);
      }
    }
    function _pipeline(callback, stack) {
      if (typeof callback === "function") {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, data, info);
              }
            });
          });
        } else {
          sharp2.pipeline(this.options, (err, data, info) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, data, info);
            }
          });
        }
        return this;
      } else if (this.options.streamOut) {
        if (this._isStreamInput()) {
          this.once("finish", () => {
            this._flattenBufferIn();
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                this.emit("error", is.nativeError(err, stack));
              } else {
                this.emit("info", info);
                this.push(data);
              }
              this.push(null);
              this.on("end", () => this.emit("close"));
            });
          });
          if (this.streamInFinished) {
            this.emit("finish");
          }
        } else {
          sharp2.pipeline(this.options, (err, data, info) => {
            if (err) {
              this.emit("error", is.nativeError(err, stack));
            } else {
              this.emit("info", info);
              this.push(data);
            }
            this.push(null);
            this.on("end", () => this.emit("close"));
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.once("finish", () => {
              this._flattenBufferIn();
              sharp2.pipeline(this.options, (err, data, info) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  if (this.options.resolveWithObject) {
                    resolve({ data, info });
                  } else {
                    resolve(data);
                  }
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                if (this.options.resolveWithObject) {
                  resolve({ data, info });
                } else {
                  resolve(data);
                }
              }
            });
          });
        }
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public
        toFile,
        toBuffer,
        keepExif,
        withExif,
        withExifMerge,
        keepIccProfile,
        withIccProfile,
        keepXmp,
        withXmp,
        keepMetadata,
        withMetadata,
        toFormat,
        jpeg,
        jp2,
        png,
        webp,
        tiff,
        avif,
        heif,
        jxl,
        gif,
        raw,
        tile,
        timeout,
        // Private
        _updateFormatOut,
        _setBooleanOption,
        _read,
        _pipeline
      });
    };
  }
});

// node_modules/sharp/lib/utility.js
var require_utility = __commonJS({
  "node_modules/sharp/lib/utility.js"(exports2, module2) {
    var events = require("node:events");
    var detectLibc = require_detect_libc();
    var is = require_is();
    var { runtimePlatformArch } = require_libvips();
    var sharp2 = require_sharp();
    var runtimePlatform = runtimePlatformArch();
    var libvipsVersion = sharp2.libvipsVersion();
    var format = sharp2.format();
    format.heif.output.alias = ["avif", "heic"];
    format.jpeg.output.alias = ["jpe", "jpg"];
    format.tiff.output.alias = ["tif"];
    format.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var interpolators = {
      /** [Nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation). Suitable for image enlargement only. */
      nearest: "nearest",
      /** [Bilinear interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). Faster than bicubic but with less smooth results. */
      bilinear: "bilinear",
      /** [Bicubic interpolation](http://en.wikipedia.org/wiki/Bicubic_interpolation) (the default). */
      bicubic: "bicubic",
      /** [LBB interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/lbb.cpp#L100). Prevents some "[acutance](http://en.wikipedia.org/wiki/Acutance)" but typically reduces performance by a factor of 2. */
      locallyBoundedBicubic: "lbb",
      /** [Nohalo interpolation](http://eprints.soton.ac.uk/268086/). Prevents acutance but typically reduces performance by a factor of 3. */
      nohalo: "nohalo",
      /** [VSQBS interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/vsqbs.cpp#L48). Prevents "staircasing" when enlarging. */
      vertexSplitQuadraticBasisSpline: "vsqbs"
    };
    var versions = {
      vips: libvipsVersion.semver
    };
    if (!libvipsVersion.isGlobal) {
      if (!libvipsVersion.isWasm) {
        try {
          versions = require(`@img/sharp-${runtimePlatform}/versions`);
        } catch (_) {
          try {
            versions = require(`@img/sharp-libvips-${runtimePlatform}/versions`);
          } catch (_2) {
          }
        }
      } else {
        try {
          versions = require("@img/sharp-wasm32/versions");
        } catch (_) {
        }
      }
    }
    versions.sharp = require_package().version;
    if (versions.heif && format.heif) {
      format.heif.input.fileSuffix = [".avif"];
      format.heif.output.alias = ["avif"];
    }
    function cache(options) {
      if (is.bool(options)) {
        if (options) {
          return sharp2.cache(50, 20, 100);
        } else {
          return sharp2.cache(0, 0, 0);
        }
      } else if (is.object(options)) {
        return sharp2.cache(options.memory, options.files, options.items);
      } else {
        return sharp2.cache();
      }
    }
    cache(true);
    function concurrency(concurrency2) {
      return sharp2.concurrency(is.integer(concurrency2) ? concurrency2 : null);
    }
    if (detectLibc.familySync() === detectLibc.GLIBC && !sharp2._isUsingJemalloc()) {
      sharp2.concurrency(1);
    } else if (detectLibc.familySync() === detectLibc.MUSL && sharp2.concurrency() === 1024) {
      sharp2.concurrency(require("node:os").availableParallelism());
    }
    var queue = new events.EventEmitter();
    function counters() {
      return sharp2.counters();
    }
    function simd(simd2) {
      return sharp2.simd(is.bool(simd2) ? simd2 : null);
    }
    function block(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp2.block(options.operation, true);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    function unblock(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp2.block(options.operation, false);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    module2.exports = (Sharp) => {
      Sharp.cache = cache;
      Sharp.concurrency = concurrency;
      Sharp.counters = counters;
      Sharp.simd = simd;
      Sharp.format = format;
      Sharp.interpolators = interpolators;
      Sharp.versions = versions;
      Sharp.queue = queue;
      Sharp.block = block;
      Sharp.unblock = unblock;
    };
  }
});

// node_modules/sharp/lib/index.js
var require_lib = __commonJS({
  "node_modules/sharp/lib/index.js"(exports2, module2) {
    var Sharp = require_constructor();
    require_input()(Sharp);
    require_resize()(Sharp);
    require_composite()(Sharp);
    require_operation()(Sharp);
    require_colour2()(Sharp);
    require_channel()(Sharp);
    require_output()(Sharp);
    require_utility()(Sharp);
    module2.exports = Sharp;
  }
});

// node_modules/@hyzyla/pdfium/dist/index.esm.js
var import_meta = {};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
var BYTES_PER_PIXEL = 4;
var FPDFErrorCode = {
  UNKNOWN: 1,
  // Unknown error.
  FILE: 2,
  // File not found or could not be opened.
  FORMAT: 3,
  // File not in PDF format or corrupted.
  PASSWORD: 4,
  // Password required or incorrect password.
  SECURITY: 5,
  // Unsupported security scheme.
  PAGE: 6
  // Page not found or content error.
};
var FPDFBitmap = {
  Unknown: 0,
  Gray: 1,
  // Gray scale bitmap, one byte per pixel.
  BGR: 2,
  // 3 bytes per pixel, byte order: blue, green, red.
  BGRx: 3,
  // 4 bytes per pixel, byte order: blue, green, red, unused.
  BGRA: 4
  // 4 bytes per pixel, byte order: blue, green, red, alpha.
};
var FPDFRenderFlag = {
  // Set if annotations are to be rendered (high-lights, sticky-notes, ink, etc.)
  ANNOT: 1,
  // Set if using text rendering optimized for LCD display. This flag will only
  // take effect if anti-aliasing is enabled for text.
  LCD_TEXT: 2,
  // Don't use the native text output available on some platforms
  NO_NATIVETEXT: 4,
  // Grayscale output.
  GRAYSCALE: 8,
  // Obsolete, has no effect, retained for compatibility.
  DEBUG_INFO: 128,
  // Obsolete, has no effect, retained for compatibility.
  NO_CATCH: 256,
  // Limit image cache size.
  RENDER_LIMITEDIMAGECACHE: 512,
  // Always use halftone for image stretching.
  RENDER_FORCEHALFTONE: 1024,
  // Render for printing.
  PRINTING: 2048,
  // Set to disable anti-aliasing on text. This flag will also disable LCD
  // optimization for text rendering.
  RENDER_NO_SMOOTHTEXT: 4096,
  // Set to disable anti-aliasing on images.
  RENDER_NO_SMOOTHIMAGE: 8192,
  // Set to disable anti-aliasing on paths.
  RENDER_NO_SMOOTHPATH: 16384,
  // Set whether to render in a reverse Byte order, this flag is only used when
  // rendering to a bitmap. (what Canvas likes)
  REVERSE_BYTE_ORDER: 16,
  // Set whether fill paths need to be stroked. This flag is only used when
  // FPDF_COLORSCHEME is passed in, since with a single fill color for paths the
  // boundaries of adjacent fill paths are less visible.
  CONVERT_FILL_TO_STROKE: 32
};
var FPDFPageObjectType = {
  TEXT: 1,
  PATH: 2,
  IMAGE: 3,
  SHADING: 4,
  FORM: 5
};
var DEFAULT_PAGE_RENDER_OPTIONS = {
  scale: 1,
  render: "bitmap",
  colorSpace: "BGRA",
  renderFormFields: false
};
function convertBitmapToImage(options) {
  return __awaiter(this, void 0, void 0, function* () {
    const { data, render } = options;
    if (typeof render === "function") {
      return yield render(options);
    }
    return data;
  });
}
function readUInt16LE(buffer, offset = 0) {
  return buffer[offset] | buffer[offset + 1] << 8;
}
var PDFiumObjectBase = class {
  constructor(options) {
    this.module = options.module;
    this.objectIdx = options.objectIdx;
    this.documentIdx = options.documentIdx;
    this.pageIdx = options.pageIdx;
  }
  static create(options) {
    const type = options.module._FPDFPageObj_GetType(options.objectIdx);
    switch (type) {
      case FPDFPageObjectType.TEXT:
        return new PDFiumTextObject(options);
      case FPDFPageObjectType.PATH:
        return new PDFiumPathObject(options);
      case FPDFPageObjectType.IMAGE:
        return new PDFiumImageObject(options);
      case FPDFPageObjectType.SHADING:
        return new PDFiumShadingObject(options);
      case FPDFPageObjectType.FORM:
        return new PDFiumFormObject(options);
      default:
        throw new Error(`Unknown object type: ${type}`);
    }
  }
};
var PDFiumTextObject = class extends PDFiumObjectBase {
  constructor() {
    super(...arguments);
    this.type = "text";
  }
};
var PDFiumPathObject = class extends PDFiumObjectBase {
  constructor() {
    super(...arguments);
    this.type = "path";
  }
};
var PDFiumImageObject = class _PDFiumImageObject extends PDFiumObjectBase {
  constructor() {
    super(...arguments);
    this.type = "image";
  }
  static formatToBPP(format) {
    switch (format) {
      case FPDFBitmap.Gray:
        return 1;
      case FPDFBitmap.BGR:
        return 3;
      case FPDFBitmap.BGRx:
      case FPDFBitmap.BGRA:
        return 4;
      default:
        throw new Error(`Unsupported bitmap format: ${format}`);
    }
  }
  /**
   * Return the raw uncompressed image data.
   */
  getImageDataRaw() {
    return __awaiter(this, void 0, void 0, function* () {
      const bufferSize = this.module._FPDFImageObj_GetImageDataRaw(this.objectIdx, 0, 0);
      if (!bufferSize) {
        throw new Error("Failed to get bitmap from image object.");
      }
      const bufferPtr = this.module.wasmExports.malloc(bufferSize);
      if (!this.module._FPDFImageObj_GetImageDataRaw(this.objectIdx, bufferPtr, bufferSize)) {
        throw new Error("Failed to get bitmap buffer.");
      }
      const oData = this.module.HEAPU8.slice(bufferPtr, bufferPtr + bufferSize);
      this.module.wasmExports.free(bufferPtr);
      const sizePtr = this.module.wasmExports.malloc(2 + 2);
      const widthPtr = sizePtr;
      const heightPtr = sizePtr + 2;
      if (!this.module._FPDFImageObj_GetImagePixelSize(this.objectIdx, widthPtr, heightPtr)) {
        throw new Error("Failed to get image size.");
      }
      const widthBuffer = this.module.HEAPU8.slice(widthPtr, widthPtr + 2);
      const heightBuffer = this.module.HEAPU8.slice(heightPtr, heightPtr + 2);
      this.module.wasmExports.free(sizePtr);
      const width = readUInt16LE(widthBuffer);
      const height = readUInt16LE(heightBuffer);
      const filtersCount = this.module._FPDFImageObj_GetImageFilterCount(this.objectIdx);
      const filters = [];
      for (let i = 0; i < filtersCount; i++) {
        const filterSize = this.module._FPDFImageObj_GetImageFilter(this.objectIdx, i, 0, 0);
        const filterPtr = this.module.wasmExports.malloc(filterSize);
        if (!this.module._FPDFImageObj_GetImageFilter(this.objectIdx, i, filterPtr, filterSize)) {
          throw new Error("Failed to get image filter.");
        }
        const filterBuffer = this.module.HEAPU8.slice(filterPtr, filterPtr + filterSize - 1);
        const filter = new TextDecoder().decode(filterBuffer).trim();
        this.module.wasmExports.free(filterPtr);
        filters.push(filter);
      }
      return {
        width,
        height,
        data: oData,
        filters
      };
    });
  }
  /**
   * Render the image object to a buffer with the specified render function.
   */
  render() {
    return __awaiter(this, arguments, void 0, function* (options = {
      render: "bitmap"
    }) {
      const bitmapIdx = this.module._FPDFImageObj_GetBitmap(this.objectIdx);
      if (!bitmapIdx) {
        throw new Error("Failed to get bitmap from image object.");
      }
      const bufferPtr = this.module._FPDFBitmap_GetBuffer(bitmapIdx);
      if (!bufferPtr) {
        throw new Error("Failed to get bitmap buffer.");
      }
      const stride = this.module._FPDFBitmap_GetStride(bitmapIdx);
      const width = this.module._FPDFBitmap_GetWidth(bitmapIdx);
      const height = this.module._FPDFBitmap_GetHeight(bitmapIdx);
      const format = this.module._FPDFBitmap_GetFormat(bitmapIdx);
      const oBPP = _PDFiumImageObject.formatToBPP(format);
      const bufferSize = height * stride;
      const oData = this.module.HEAPU8.slice(bufferPtr, bufferPtr + bufferSize);
      this.module.wasmExports.free(bufferPtr);
      const tBPP = BYTES_PER_PIXEL;
      const tData = new Uint8Array(width * height * tBPP);
      tData.fill(255);
      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        const tRowStart = rowIndex * tBPP * width;
        const oRowStart = rowIndex * stride;
        for (let columnIndex = 0; columnIndex < width; columnIndex++) {
          const tPixelStart = tRowStart + columnIndex * tBPP;
          const oPixelStart = oRowStart + columnIndex * oBPP;
          switch (format) {
            case FPDFBitmap.Gray: {
              const gray = oData[oPixelStart];
              tData[tPixelStart + 0] = gray;
              tData[tPixelStart + 1] = gray;
              tData[tPixelStart + 2] = gray;
              break;
            }
            case FPDFBitmap.BGR: {
              tData[tPixelStart + 0] = oData[oPixelStart + 2];
              tData[tPixelStart + 1] = oData[oPixelStart + 1];
              tData[tPixelStart + 2] = oData[oPixelStart + 0];
              break;
            }
            case FPDFBitmap.BGRx: {
              tData[tPixelStart + 0] = oData[oPixelStart + 2];
              tData[tPixelStart + 1] = oData[oPixelStart + 1];
              tData[tPixelStart + 2] = oData[oPixelStart + 0];
              break;
            }
            case FPDFBitmap.BGRA: {
              tData[tPixelStart + 0] = oData[oPixelStart + 2];
              tData[tPixelStart + 1] = oData[oPixelStart + 1];
              tData[tPixelStart + 2] = oData[oPixelStart + 0];
              tData[tPixelStart + 3] = oData[oPixelStart + 3];
              break;
            }
            default:
              throw new Error(`Unsupported bitmap format: ${format}`);
          }
        }
      }
      const image = yield convertBitmapToImage({
        render: options.render,
        width,
        height,
        data: tData
      });
      return {
        width,
        height,
        data: image
      };
    });
  }
};
var PDFiumShadingObject = class extends PDFiumObjectBase {
  constructor() {
    super(...arguments);
    this.type = "shading";
  }
};
var PDFiumFormObject = class extends PDFiumObjectBase {
  constructor() {
    super(...arguments);
    this.type = "form";
  }
};
var PDFiumPage = class {
  constructor(options) {
    this.module = options.module;
    this.pageIdx = options.pageIdx;
    this.documentIdx = options.documentIdx;
    this.document = options.document;
    this.number = options.pageIndex;
  }
  getOriginalSize() {
    const originalWidth = this.module._FPDF_GetPageWidth(this.pageIdx);
    const originalHeight = this.module._FPDF_GetPageHeight(this.pageIdx);
    return {
      originalWidth,
      originalHeight
    };
  }
  /**
   * Get the size of the page in points (1/72 inch)
   * Floored original values needed in testing. Scale can be a float number.
   */
  getSize(renderOptions) {
    const { scale, width, height } = renderOptions;
    const { originalHeight, originalWidth } = this.getOriginalSize();
    const computedWidth = Math.floor(width !== null && width !== void 0 ? width : originalWidth);
    const computedHeight = Math.floor(height !== null && height !== void 0 ? height : originalHeight);
    return {
      originalWidth: Math.floor(originalWidth),
      originalHeight: Math.floor(originalHeight),
      width: Math.floor(computedWidth * scale),
      height: Math.floor(computedHeight * scale)
    };
  }
  /**
   * Extract text from the page
   */
  getText() {
    const textPage = this.module._FPDFText_LoadPage(this.pageIdx);
    if (!textPage) {
      throw new Error("Failed to load text page");
    }
    try {
      const charCount = this.module._FPDFText_CountChars(textPage);
      if (charCount <= 0) {
        return "";
      }
      const bufferSize = (charCount + 1) * 2;
      const textPtr = this.module.wasmExports.malloc(bufferSize);
      try {
        const length = this.module._FPDFText_GetText(textPage, 0, charCount, textPtr);
        if (length <= 0) {
          return "";
        }
        const buffer = new Uint8Array(this.module.HEAPU8.buffer, textPtr, (length - 1) * 2);
        const text = new TextDecoder("utf-16le").decode(buffer);
        return text;
      } finally {
        this.module.wasmExports.free(textPtr);
      }
    } finally {
      this.module._FPDFText_ClosePage(textPage);
    }
  }
  render() {
    return __awaiter(this, arguments, void 0, function* (options = {}) {
      let formIdx = null;
      const renderOptions = Object.assign(Object.assign({}, DEFAULT_PAGE_RENDER_OPTIONS), options);
      const { colorSpace, render, renderFormFields } = renderOptions;
      const { width, height, originalWidth, originalHeight } = this.getSize(renderOptions);
      if (renderFormFields) {
        formIdx = this.document.initializeFormFields();
        this.module._FORM_OnAfterLoadPage(this.pageIdx, formIdx);
      }
      const bytesPerPixel = FPDFBitmap[colorSpace];
      const buffSize = width * height * bytesPerPixel;
      const ptr = this.module.wasmExports.malloc(buffSize);
      let bitmap = null;
      if (ptr === 0) {
        throw new Error("Failed to allocate memory for bitmap");
      }
      try {
        bitmap = this.module._FPDFBitmap_CreateEx(width, height, bytesPerPixel, ptr, width * bytesPerPixel);
        this.module._FPDFBitmap_FillRect(
          bitmap,
          0,
          // left
          0,
          // top
          width,
          // width
          height,
          // height
          4294967295
        );
        let flags = FPDFRenderFlag.ANNOT | FPDFRenderFlag.LCD_TEXT;
        flags = colorSpace === "Gray" ? flags | FPDFRenderFlag.GRAYSCALE : flags | FPDFRenderFlag.REVERSE_BYTE_ORDER;
        this.module._FPDF_RenderPageBitmap(
          bitmap,
          this.pageIdx,
          0,
          // start_x
          0,
          // start_y
          width,
          // size_x
          height,
          // size_y
          0,
          // rotate (0, normal)
          flags
        );
        if (formIdx !== null) {
          const formFlags = flags & ~FPDFRenderFlag.ANNOT;
          this.module._FPDF_FFLDraw(
            formIdx,
            bitmap,
            this.pageIdx,
            0,
            // start_x
            0,
            // start_y
            width,
            // size_x
            height,
            // size_y
            0,
            // rotate (0, normal)
            formFlags
          );
          this.module._FORM_OnBeforeClosePage(this.pageIdx, formIdx);
        }
        const image = yield this.convertBitmapToImage({
          render,
          width,
          height,
          // ⚠️ creation of a copy is necessary to avoid memory corruption
          data: this.module.HEAPU8.slice(ptr, ptr + buffSize)
        });
        return {
          width,
          height,
          originalHeight,
          originalWidth,
          data: image
        };
      } finally {
        if (bitmap !== null) {
          this.module._FPDFBitmap_Destroy(bitmap);
        }
        this.module._FPDF_ClosePage(this.pageIdx);
        this.module.wasmExports.free(ptr);
      }
    });
  }
  convertBitmapToImage(options) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield convertBitmapToImage(options);
    });
  }
  getObjectCount() {
    return this.module._FPDFPage_CountObjects(this.pageIdx);
  }
  getObject(i) {
    const object = this.module._FPDFPage_GetObject(this.pageIdx, i);
    return PDFiumObjectBase.create({
      module: this.module,
      objectIdx: object,
      documentIdx: this.documentIdx,
      pageIdx: this.pageIdx
    });
  }
  *objects() {
    const objectsCount = this.getObjectCount();
    for (let i = 0; i < objectsCount; i++) {
      yield this.getObject(i);
    }
  }
};
var PDFiumDocument = class {
  constructor(options) {
    this.formIdx = null;
    this.formPtr = null;
    this.module = options.module;
    this.documentPtr = options.documentPtr;
    this.documentIdx = options.documentIdx;
  }
  /**
   * Initialize form environment for this document
   * This is required for rendering form fields such as signatures.
   * @returns The form handle
   */
  initializeFormFields() {
    if (this.formIdx !== null) {
      return this.formIdx;
    }
    const formSize = 256;
    this.formPtr = this.module.wasmExports.malloc(formSize);
    if (this.formPtr === 0) {
      throw new Error("Failed to allocate memory for form fill environment");
    }
    this.module.HEAPU8.fill(0, this.formPtr, this.formPtr + formSize);
    new DataView(this.module.HEAPU8.buffer).setUint32(this.formPtr, 2, true);
    this.formIdx = this.module._FPDFDOC_InitFormFillEnvironment(this.documentIdx, this.formPtr);
    if (this.formIdx === 0) {
      this.module.wasmExports.free(this.formPtr);
      this.formPtr = null;
      throw new Error("Failed to initialize form fill environment");
    }
    return this.formIdx;
  }
  /**
   * Get a page from the document by its index. The index is zero-based.
   */
  getPage(pageIndex) {
    const pageIdx = this.module._FPDF_LoadPage(this.documentIdx, pageIndex);
    return new PDFiumPage({
      module: this.module,
      pageIdx,
      documentIdx: this.documentIdx,
      pageIndex,
      document: this
    });
  }
  /**
   * User-friendly iterator to iterate over all pages in the document.
   */
  *pages() {
    const pageCount = this.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      yield this.getPage(i);
    }
  }
  /**
   * Get the number of pages in the document.
   */
  getPageCount() {
    return this.module._FPDF_GetPageCount(this.documentIdx);
  }
  /**
   * After you're done with the document, you should destroy it to free the memory.
   *
   * Otherwise, you'll be fired from your job for causing a memory leak. 😱
   */
  destroy() {
    if (this.formIdx) {
      this.module._FPDFDOC_ExitFormFillEnvironment(this.formIdx);
      this.formIdx = null;
    }
    if (this.formPtr) {
      this.module.wasmExports.free(this.formPtr);
      this.formPtr = null;
    }
    this.module._FPDF_CloseDocument(this.documentIdx);
    this.module.wasmExports.free(this.documentPtr);
  }
};
function lengthBytesUTF8(str) {
  let len = 0;
  for (let i = 0; i < str.length; ++i) {
    const c = str.charCodeAt(i);
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
}
function stringToUTF8(str, heap, outIdx, maxBytesToWrite) {
  outIdx >>>= 0;
  if (!(maxBytesToWrite > 0))
    return 0;
  const startIdx = outIdx;
  const endIdx = outIdx + maxBytesToWrite - 1;
  for (let i = 0; i < str.length; ++i) {
    let u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      const u1 = str.charCodeAt(++i);
      u = 65536 + ((u & 1023) << 10) | u1 & 1023;
    }
    if (u <= 127) {
      if (outIdx >= endIdx)
        break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx)
        break;
      heap[outIdx++] = 192 | u >> 6;
      heap[outIdx++] = 128 | u & 63;
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx)
        break;
      heap[outIdx++] = 224 | u >> 12;
      heap[outIdx++] = 128 | u >> 6 & 63;
      heap[outIdx++] = 128 | u & 63;
    } else {
      if (outIdx + 3 >= endIdx)
        break;
      heap[outIdx++] = 240 | u >> 18;
      heap[outIdx++] = 128 | u >> 12 & 63;
      heap[outIdx++] = 128 | u >> 6 & 63;
      heap[outIdx++] = 128 | u & 63;
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}
var NO_OPTION_WARNING = "@hyzyla/pdfium: wasmUrl, wasmBinary is required for browser environment. \n\nPlease provide the wasm binary or URL to the init method. You can also use '@hyzyla/pdfium/browser/cdn'or '@hyzyla/pdfium/browser/base64' for quick setup, but it's not recommended for production use.";
function stringToCString(module2, str) {
  const length = lengthBytesUTF8(str) + 1;
  const passwordPtr = module2.wasmExports.malloc(length);
  stringToUTF8(str, module2.HEAPU8, passwordPtr, length);
  return passwordPtr;
}
var PDFiumLibrary$1 = class PDFiumLibrary {
  static initBase(options) {
    return __awaiter(this, void 0, void 0, function* () {
      const { wasmUrl, wasmBinary, instantiateWasm } = options || {};
      const loadOptions = {};
      if (wasmUrl) {
        loadOptions.locateFile = (_path) => wasmUrl;
      } else if (wasmBinary) {
        loadOptions.wasmBinary = wasmBinary;
      } else if (instantiateWasm) {
        loadOptions.instantiateWasm = instantiateWasm;
      } else {
        if (typeof window !== "undefined") {
          console.error(NO_OPTION_WARNING);
          throw new Error(NO_OPTION_WARNING);
        }
      }
      const module2 = yield options.vendor(loadOptions);
      module2._FPDF_InitLibraryWithConfig({
        version: 2,
        m_pIsolate: null,
        m_pUserFontPaths: null,
        m_v8EmbedderSlot: 0,
        m_pPlatform: null
      });
      return new PDFiumLibrary(module2);
    });
  }
  constructor(module2) {
    this.module = module2;
  }
  loadDocument(buff_1) {
    return __awaiter(this, arguments, void 0, function* (buff, password = "") {
      const size = buff.length;
      const documentPtr = this.module.wasmExports.malloc(size);
      this.module.HEAPU8.set(buff, documentPtr);
      let passwordPtr = 0;
      if (password) {
        passwordPtr = stringToCString(this.module, password);
      }
      const documentIdx = this.module._FPDF_LoadMemDocument(documentPtr, size, passwordPtr);
      if (!documentIdx) {
        const lastError = this.module._FPDF_GetLastError();
        this.module.wasmExports.free(documentPtr);
        if (passwordPtr !== 0) {
          this.module.wasmExports.free(passwordPtr);
        }
        switch (lastError) {
          case FPDFErrorCode.UNKNOWN:
            throw new Error("Unknown error");
          case FPDFErrorCode.FILE:
            throw new Error("File not found or could not be opened");
          case FPDFErrorCode.FORMAT:
            throw new Error("File not in PDF format or corrupted");
          case FPDFErrorCode.PASSWORD:
            throw new Error("Password required or incorrect password");
          case FPDFErrorCode.SECURITY:
            throw new Error("Unsupported security scheme");
          case FPDFErrorCode.PAGE:
            throw new Error("Page not found or content error");
          default:
            throw new Error(`PDF Loading = ${lastError}`);
        }
      }
      const document = new PDFiumDocument({
        module: this.module,
        documentPtr,
        documentIdx
      });
      if (passwordPtr !== null) {
        this.module.wasmExports.free(passwordPtr);
      }
      return document;
    });
  }
  destroy() {
    this.module._FPDF_DestroyLibrary();
  }
};
var PDFiumModule = /* @__PURE__ */ (() => {
  return async function(moduleArg = {}) {
    var moduleRtn;
    var Module = moduleArg;
    var ENVIRONMENT_IS_WEB = typeof window == "object";
    var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";
    var ENVIRONMENT_IS_NODE = typeof process == "object" && process.versions?.node && process.type != "renderer";
    var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    if (ENVIRONMENT_IS_NODE) {
      const { createRequire } = await import("module");
      var require2 = createRequire(import_meta.url);
    }
    var thisProgram = "./this.program";
    var _scriptName = import_meta.url;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var readAsync, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      const isNode = typeof process == "object" && process.versions?.node && process.type != "renderer";
      if (!isNode)
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)"
        );
      var nodeVersion = process.versions.node;
      var numericVersion = nodeVersion.split(".").slice(0, 3);
      numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
      if (numericVersion < 16e4) {
        throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
      }
      var fs2 = require2("fs");
      if (_scriptName.startsWith("file:")) {
        scriptDirectory = require2("path").dirname(require2("url").fileURLToPath(_scriptName)) + "/";
      }
      readBinary = (filename) => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs2.readFileSync(filename);
        assert(Buffer.isBuffer(ret));
        return ret;
      };
      readAsync = async (filename, binary = true) => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs2.readFileSync(filename, binary ? void 0 : "utf8");
        assert(binary ? Buffer.isBuffer(ret) : typeof ret == "string");
        return ret;
      };
      if (process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/");
      }
      process.argv.slice(2);
    } else if (ENVIRONMENT_IS_SHELL) {
      const isNode = typeof process == "object" && process.versions?.node && process.type != "renderer";
      if (isNode || typeof window == "object" || typeof WorkerGlobalScope != "undefined")
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)"
        );
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      try {
        scriptDirectory = new URL(".", _scriptName).href;
      } catch {
      }
      if (!(typeof window == "object" || typeof WorkerGlobalScope != "undefined"))
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)"
        );
      {
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = async (url) => {
          if (isFileURI(url)) {
            return new Promise((resolve, reject) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  resolve(xhr.response);
                  return;
                }
                reject(xhr.status);
              };
              xhr.onerror = reject;
              xhr.send(null);
            });
          }
          var response = await fetch(url, { credentials: "same-origin" });
          if (response.ok) {
            return response.arrayBuffer();
          }
          throw new Error(response.status + " : " + response.url);
        };
      }
    } else {
      throw new Error("environment detection error");
    }
    var out = console.log.bind(console);
    var err = console.error.bind(console);
    assert(
      !ENVIRONMENT_IS_SHELL,
      "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable."
    );
    var wasmBinary;
    if (typeof WebAssembly != "object") {
      err("no native wasm support detected");
    }
    var ABORT = false;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed" + (text ? ": " + text : ""));
      }
    }
    var isFileURI = (filename) => filename.startsWith("file://");
    function writeStackCookie() {
      var max = _emscripten_stack_get_end();
      assert((max & 3) == 0);
      if (max == 0) {
        max += 4;
      }
      HEAPU32[max >> 2] = 34821223;
      HEAPU32[max + 4 >> 2] = 2310721022;
      HEAPU32[0 >> 2] = 1668509029;
    }
    function checkStackCookie() {
      if (ABORT) return;
      var max = _emscripten_stack_get_end();
      if (max == 0) {
        max += 4;
      }
      var cookie1 = HEAPU32[max >> 2];
      var cookie2 = HEAPU32[max + 4 >> 2];
      if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort(
          `Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`
        );
      }
      if (HEAPU32[0 >> 2] != 1668509029) {
        abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    (() => {
      var h16 = new Int16Array(1);
      var h8 = new Int8Array(h16.buffer);
      h16[0] = 25459;
      if (h8[0] !== 115 || h8[1] !== 99)
        throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
    })();
    function consumedModuleProp(prop) {
      if (!Object.getOwnPropertyDescriptor(Module, prop)) {
        Object.defineProperty(Module, prop, {
          configurable: true,
          set() {
            abort(
              `Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`
            );
          }
        });
      }
    }
    function makeInvalidEarlyAccess(name) {
      return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);
    }
    function ignoredModuleProp(prop) {
      if (Object.getOwnPropertyDescriptor(Module, prop)) {
        abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
      }
    }
    function isExportedByForceFilesystem(name) {
      return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
    }
    function hookGlobalSymbolAccess(sym, func) {
      if (typeof globalThis != "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
        Object.defineProperty(globalThis, sym, {
          configurable: true,
          get() {
            func();
            return void 0;
          }
        });
      }
    }
    function missingGlobal(sym, msg) {
      hookGlobalSymbolAccess(sym, () => {
        warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
      });
    }
    missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
    missingGlobal("asm", "Please use wasmExports instead");
    function missingLibrarySymbol(sym) {
      hookGlobalSymbolAccess(sym, () => {
        var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
        var librarySymbol = sym;
        if (!librarySymbol.startsWith("_")) {
          librarySymbol = "$" + sym;
        }
        msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
        if (isExportedByForceFilesystem(sym)) {
          msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
        }
        warnOnce(msg);
      });
      unexportedRuntimeSymbol(sym);
    }
    function unexportedRuntimeSymbol(sym) {
      if (!Object.getOwnPropertyDescriptor(Module, sym)) {
        Object.defineProperty(Module, sym, {
          configurable: true,
          get() {
            var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
            if (isExportedByForceFilesystem(sym)) {
              msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
            }
            abort(msg);
          }
        });
      }
    }
    var readyPromiseResolve, readyPromiseReject;
    var wasmMemory;
    var HEAP8, HEAPU8, HEAP16, HEAP32, HEAPU32;
    var HEAP64;
    var runtimeInitialized = false;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module["HEAP8"] = HEAP8 = new Int8Array(b);
      Module["HEAP16"] = HEAP16 = new Int16Array(b);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
      Module["HEAPU16"] = new Uint16Array(b);
      Module["HEAP32"] = HEAP32 = new Int32Array(b);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
      Module["HEAPF32"] = new Float32Array(b);
      Module["HEAPF64"] = new Float64Array(b);
      HEAP64 = new BigInt64Array(b);
      new BigUint64Array(b);
    }
    assert(
      typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0,
      "JS engine does not provide full typed array support"
    );
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      consumedModuleProp("preRun");
      callRuntimeCallbacks(onPreRuns);
    }
    function initRuntime() {
      assert(!runtimeInitialized);
      runtimeInitialized = true;
      checkStackCookie();
      if (!Module["noFSInit"] && !FS.initialized) FS.init();
      wasmExports["__wasm_call_ctors"]();
      FS.ignorePermissions = false;
    }
    function postRun() {
      checkStackCookie();
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      consumedModuleProp("postRun");
      callRuntimeCallbacks(onPostRuns);
    }
    var runDependencies = 0;
    var dependenciesFulfilled = null;
    var runDependencyTracking = {};
    var runDependencyWatcher = null;
    function addRunDependency(id) {
      runDependencies++;
      Module["monitorRunDependencies"]?.(runDependencies);
      if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (runDependencyWatcher === null && typeof setInterval != "undefined") {
          runDependencyWatcher = setInterval(() => {
            if (ABORT) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
              return;
            }
            var shown = false;
            for (var dep in runDependencyTracking) {
              if (!shown) {
                shown = true;
                err("still waiting on run dependencies:");
              }
              err(`dependency: ${dep}`);
            }
            if (shown) {
              err("(end of list)");
            }
          }, 1e4);
        }
      } else {
        err("warning: run dependency added without ID");
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      Module["monitorRunDependencies"]?.(runDependencies);
      if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id];
      } else {
        err("warning: run dependency removed without ID");
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      Module["onAbort"]?.(what);
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject?.(e);
      throw e;
    }
    function createExportWrapper(name, nargs) {
      return (...args) => {
        assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
        var f = wasmExports[name];
        assert(f, `exported native function \`${name}\` not found`);
        assert(
          args.length <= nargs,
          `native function \`${name}\` called with ${args.length} args but expects ${nargs}`
        );
        return f(...args);
      };
    }
    var wasmBinaryFile;
    function findWasmBinary() {
      if (Module["locateFile"]) {
        return locateFile("pdfium.wasm");
      }
      return new URL("pdfium.wasm", import_meta.url).href;
    }
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw "both async and sync fetching of the wasm failed";
    }
    async function getWasmBinary(binaryFile) {
      if (!wasmBinary) {
        try {
          var response = await readAsync(binaryFile);
          return new Uint8Array(response);
        } catch {
        }
      }
      return getBinarySync(binaryFile);
    }
    async function instantiateArrayBuffer(binaryFile, imports) {
      try {
        var binary = await getWasmBinary(binaryFile);
        var instance = await WebAssembly.instantiate(binary, imports);
        return instance;
      } catch (reason) {
        err(`failed to asynchronously prepare wasm: ${reason}`);
        if (isFileURI(wasmBinaryFile)) {
          err(
            `warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`
          );
        }
        abort(reason);
      }
    }
    async function instantiateAsync(binary, binaryFile, imports) {
      if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
        try {
          var response = fetch(binaryFile, { credentials: "same-origin" });
          var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
          return instantiationResult;
        } catch (reason) {
          err(`wasm streaming compile failed: ${reason}`);
          err("falling back to ArrayBuffer instantiation");
        }
      }
      return instantiateArrayBuffer(binaryFile, imports);
    }
    function getWasmImports() {
      return { env: wasmImports, wasi_snapshot_preview1: wasmImports };
    }
    async function createWasm() {
      function receiveInstance(instance, module2) {
        wasmExports = instance.exports;
        Module["wasmExports"] = wasmExports;
        wasmMemory = wasmExports["memory"];
        assert(wasmMemory, "memory not found in wasm exports");
        updateMemoryViews();
        wasmTable = wasmExports["__indirect_function_table"];
        assert(wasmTable, "table not found in wasm exports");
        assignWasmExports(wasmExports);
        removeRunDependency("wasm-instantiate");
        return wasmExports;
      }
      addRunDependency("wasm-instantiate");
      var trueModule = Module;
      function receiveInstantiationResult(result2) {
        assert(
          Module === trueModule,
          "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"
        );
        trueModule = null;
        return receiveInstance(result2["instance"]);
      }
      var info = getWasmImports();
      if (Module["instantiateWasm"]) {
        return new Promise((resolve, reject) => {
          try {
            Module["instantiateWasm"](info, (mod, inst) => {
              resolve(receiveInstance(mod, inst));
            });
          } catch (e) {
            err(`Module.instantiateWasm callback failed with error: ${e}`);
            reject(e);
          }
        });
      }
      wasmBinaryFile ??= findWasmBinary();
      var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
      var exports$1 = receiveInstantiationResult(result);
      return exports$1;
    }
    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var onPostRuns = [];
    var addOnPostRun = (cb) => onPostRuns.push(cb);
    var onPreRuns = [];
    var addOnPreRun = (cb) => onPreRuns.push(cb);
    var ptrToString = (ptr) => {
      assert(typeof ptr === "number");
      ptr >>>= 0;
      return "0x" + ptr.toString(16).padStart(8, "0");
    };
    var stackRestore = (val) => __emscripten_stack_restore(val);
    var stackSave = () => _emscripten_stack_get_current();
    var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
        err(text);
      }
    };
    var syscallGetVarargI = () => {
      assert(SYSCALLS.varargs != void 0);
      var ret = HEAP32[+SYSCALLS.varargs >> 2];
      SYSCALLS.varargs += 4;
      return ret;
    };
    var syscallGetVarargP = syscallGetVarargI;
    var PATH = {
      isAbs: (path) => path.charAt(0) === "/",
      splitPath: (filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }
        return parts;
      },
      normalize: (path) => {
        var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
        path = PATH.normalizeArray(
          path.split("/").filter((p) => !!p),
          !isAbsolute
        ).join("/");
        if (!path && !isAbsolute) {
          path = ".";
        }
        if (path && trailingSlash) {
          path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
      },
      dirname: (path) => {
        var result = PATH.splitPath(path), root = result[0], dir = result[1];
        if (!root && !dir) {
          return ".";
        }
        if (dir) {
          dir = dir.slice(0, -1);
        }
        return root + dir;
      },
      basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
      join: (...paths) => PATH.normalize(paths.join("/")),
      join2: (l, r) => PATH.normalize(l + "/" + r)
    };
    var initRandomFill = () => {
      if (ENVIRONMENT_IS_NODE) {
        var nodeCrypto = require2("crypto");
        return (view) => nodeCrypto.randomFillSync(view);
      }
      return (view) => crypto.getRandomValues(view);
    };
    var randomFill = (view) => {
      (randomFill = initRandomFill())(view);
    };
    var PATH_FS = {
      resolve: (...args) => {
        var resolvedPath = "", resolvedAbsolute = false;
        for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? args[i] : FS.cwd();
          if (typeof path != "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else if (!path) {
            return "";
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        resolvedPath = PATH.normalizeArray(
          resolvedPath.split("/").filter((p) => !!p),
          !resolvedAbsolute
        ).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
      },
      relative: (from, to) => {
        from = PATH_FS.resolve(from).slice(1);
        to = PATH_FS.resolve(to).slice(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== "") break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== "") break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..");
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      }
    };
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
    var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          if ((u0 & 248) != 240)
            warnOnce(
              "Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"
            );
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return str;
    };
    var FS_stdin_getChar_buffer = [];
    var lengthBytesUTF82 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.codePointAt(i);
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 1114111)
            warnOnce(
              "Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."
            );
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
          i++;
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
    var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = lengthBytesUTF82(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      u8array.length = numBytesWritten;
      return u8array;
    };
    var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
          var fd = process.stdin.fd;
          try {
            bytesRead = fs2.readSync(fd, buf, 0, BUFSIZE);
          } catch (e) {
            if (e.toString().includes("EOF")) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString("utf-8");
          }
        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else ;
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result);
      }
      return FS_stdin_getChar_buffer.shift();
    };
    var TTY = {
      ttys: [],
      init() {
      },
      shutdown() {
      },
      register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
      stream_ops: {
        open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
        close(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        },
        write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        }
      },
      default_tty_ops: {
        get_char(tty) {
          return FS_stdin_getChar();
        },
        put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
        ioctl_tcgets(tty) {
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              3,
              28,
              127,
              21,
              4,
              0,
              1,
              0,
              17,
              19,
              26,
              0,
              18,
              15,
              23,
              22,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          };
        },
        ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        },
        ioctl_tiocgwinsz(tty) {
          return [24, 80];
        }
      },
      default_tty1_ops: {
        put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        }
      }
    };
    var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
    var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
    var mmapAlloc = (size) => {
      size = alignMemory(size, 65536);
      var ptr = _emscripten_builtin_memalign(65536, size);
      if (ptr) zeroMemory(ptr, size);
      return ptr;
    };
    var MEMFS = {
      ops_table: null,
      mount(mount) {
        return MEMFS.createNode(null, "/", 16895, 0);
      },
      createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink
            },
            stream: { llseek: MEMFS.stream_ops.llseek }
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: FS.chrdev_stream_ops
          }
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = null;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.atime = node.mtime = node.ctime = Date.now();
        if (parent) {
          parent.contents[name] = node;
          parent.atime = parent.mtime = parent.ctime = node.atime;
        }
        return node;
      },
      getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      },
      expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
      },
      resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          }
          node.usedBytes = newSize;
        }
      },
      node_ops: {
        getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
        setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) {
            if (attr[key] != null) {
              node[key] = attr[key];
            }
          }
          if (attr.size !== void 0) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
        lookup(parent, name) {
          throw new FS.ErrnoError(44);
        },
        mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
        rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (new_node) {
            if (FS.isDir(old_node.mode)) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
            FS.hashRemoveNode(new_node);
          }
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
        },
        unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
        rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
        readdir(node) {
          return [".", "..", ...Object.keys(node.contents)];
        },
        symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        },
        readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }
      },
      stream_ops: {
        read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
        write(stream, buffer, offset, length, position, canOwn) {
          assert(!(buffer instanceof ArrayBuffer));
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              assert(position === 0, "canOwn must imply no weird position inside the file");
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer.subarray) {
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
        llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
        mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        },
        msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        }
      }
    };
    var asyncLoad = async (url) => {
      var arrayBuffer = await readAsync(url);
      assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
      return new Uint8Array(arrayBuffer);
    };
    var FS_createDataFile = (...args) => FS.createDataFile(...args);
    var getUniqueRunDependency = (id) => {
      var orig = id;
      while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
      }
    };
    var preloadPlugins = [];
    var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
      if (typeof Browser != "undefined") Browser.init();
      var handled = false;
      preloadPlugins.forEach((plugin) => {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
          plugin["handle"](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    };
    var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`);
      function processData(byteArray) {
        function finish(byteArray2) {
          preFinish?.();
          if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
          }
          onload?.();
          removeRunDependency(dep);
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
          onerror?.();
          removeRunDependency(dep);
        })) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == "string") {
        asyncLoad(url).then(processData, onerror);
      } else {
        processData(url);
      }
    };
    var FS_modeStringToFlags = (str) => {
      var flagModes = {
        r: 0,
        "r+": 2,
        w: 512 | 64 | 1,
        "w+": 512 | 64 | 2,
        a: 1024 | 64 | 1,
        "a+": 1024 | 64 | 2
      };
      var flags = flagModes[str];
      if (typeof flags == "undefined") {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
    var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
    var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    };
    var strError = (errno) => UTF8ToString(_strerror(errno));
    var ERRNO_CODES = {
      EPERM: 63,
      ENOENT: 44,
      ESRCH: 71,
      EINTR: 27,
      EIO: 29,
      ENXIO: 60,
      E2BIG: 1,
      ENOEXEC: 45,
      EBADF: 8,
      ECHILD: 12,
      EAGAIN: 6,
      EWOULDBLOCK: 6,
      ENOMEM: 48,
      EACCES: 2,
      EFAULT: 21,
      ENOTBLK: 105,
      EBUSY: 10,
      EEXIST: 20,
      EXDEV: 75,
      ENODEV: 43,
      ENOTDIR: 54,
      EISDIR: 31,
      EINVAL: 28,
      ENFILE: 41,
      EMFILE: 33,
      ENOTTY: 59,
      ETXTBSY: 74,
      EFBIG: 22,
      ENOSPC: 51,
      ESPIPE: 70,
      EROFS: 69,
      EMLINK: 34,
      EPIPE: 64,
      EDOM: 18,
      ERANGE: 68,
      ENOMSG: 49,
      EIDRM: 24,
      ECHRNG: 106,
      EL2NSYNC: 156,
      EL3HLT: 107,
      EL3RST: 108,
      ELNRNG: 109,
      EUNATCH: 110,
      ENOCSI: 111,
      EL2HLT: 112,
      EDEADLK: 16,
      ENOLCK: 46,
      EBADE: 113,
      EBADR: 114,
      EXFULL: 115,
      ENOANO: 104,
      EBADRQC: 103,
      EBADSLT: 102,
      EDEADLOCK: 16,
      EBFONT: 101,
      ENOSTR: 100,
      ENODATA: 116,
      ETIME: 117,
      ENOSR: 118,
      ENONET: 119,
      ENOPKG: 120,
      EREMOTE: 121,
      ENOLINK: 47,
      EADV: 122,
      ESRMNT: 123,
      ECOMM: 124,
      EPROTO: 65,
      EMULTIHOP: 36,
      EDOTDOT: 125,
      EBADMSG: 9,
      ENOTUNIQ: 126,
      EBADFD: 127,
      EREMCHG: 128,
      ELIBACC: 129,
      ELIBBAD: 130,
      ELIBSCN: 131,
      ELIBMAX: 132,
      ELIBEXEC: 133,
      ENOSYS: 52,
      ENOTEMPTY: 55,
      ENAMETOOLONG: 37,
      ELOOP: 32,
      EOPNOTSUPP: 138,
      EPFNOSUPPORT: 139,
      ECONNRESET: 15,
      ENOBUFS: 42,
      EAFNOSUPPORT: 5,
      EPROTOTYPE: 67,
      ENOTSOCK: 57,
      ENOPROTOOPT: 50,
      ESHUTDOWN: 140,
      ECONNREFUSED: 14,
      EADDRINUSE: 3,
      ECONNABORTED: 13,
      ENETUNREACH: 40,
      ENETDOWN: 38,
      ETIMEDOUT: 73,
      EHOSTDOWN: 142,
      EHOSTUNREACH: 23,
      EINPROGRESS: 26,
      EALREADY: 7,
      EDESTADDRREQ: 17,
      EMSGSIZE: 35,
      EPROTONOSUPPORT: 66,
      ESOCKTNOSUPPORT: 137,
      EADDRNOTAVAIL: 4,
      ENETRESET: 39,
      EISCONN: 30,
      ENOTCONN: 53,
      ETOOMANYREFS: 141,
      EUSERS: 136,
      EDQUOT: 19,
      ESTALE: 72,
      ENOTSUP: 138,
      ENOMEDIUM: 148,
      EILSEQ: 25,
      EOVERFLOW: 61,
      ECANCELED: 11,
      ENOTRECOVERABLE: 56,
      EOWNERDEAD: 62,
      ESTRPIPE: 135
    };
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      filesystems: null,
      syncFSRequests: 0,
      readFiles: {},
      ErrnoError: class extends Error {
        name = "ErrnoError";
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : "");
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
      FSStream: class {
        shared = {};
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return this.flags & 1024;
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
      FSNode: class {
        node_ops = {};
        stream_ops = {};
        readMode = 292 | 73;
        writeMode = 146;
        mounted = null;
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.rdev = rdev;
          this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
      },
      lookupPath(path, opts = {}) {
        if (!path) {
          throw new FS.ErrnoError(44);
        }
        opts.follow_mount ??= true;
        if (!PATH.isAbs(path)) {
          path = FS.cwd() + "/" + path;
        }
        linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
          var parts = path.split("/").filter((p) => !!p);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break;
            }
            if (parts[i] === ".") {
              continue;
            }
            if (parts[i] === "..") {
              current_path = PATH.dirname(current_path);
              if (FS.isRoot(current)) {
                path = current_path + "/" + parts.slice(i + 1).join("/");
                continue linkloop;
              } else {
                current = current.parent;
              }
              continue;
            }
            current_path = PATH.join2(current_path, parts[i]);
            try {
              current = FS.lookupNode(current, parts[i]);
            } catch (e) {
              if (e?.errno === 44 && islast && opts.noent_okay) {
                return { path: current_path };
              }
              throw e;
            }
            if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
              current = current.mounted.root;
            }
            if (FS.isLink(current.mode) && (!islast || opts.follow)) {
              if (!current.node_ops.readlink) {
                throw new FS.ErrnoError(52);
              }
              var link = current.node_ops.readlink(current);
              if (!PATH.isAbs(link)) {
                link = PATH.dirname(current_path) + "/" + link;
              }
              path = link + "/" + parts.slice(i + 1).join("/");
              continue linkloop;
            }
          }
          return { path: current_path, node: current };
        }
        throw new FS.ErrnoError(32);
      },
      getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
      hashName(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
        }
        return (parentid + hash >>> 0) % FS.nameTable.length;
      },
      hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
      hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
      lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        return FS.lookup(parent, name);
      },
      createNode(parent, name, mode, rdev) {
        assert(typeof parent == "object");
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },
      destroyNode(node) {
        FS.hashRemoveNode(node);
      },
      isRoot(node) {
        return node === node.parent;
      },
      isMountpoint(node) {
        return !!node.mounted;
      },
      isFile(mode) {
        return (mode & 61440) === 32768;
      },
      isDir(mode) {
        return (mode & 61440) === 16384;
      },
      isLink(mode) {
        return (mode & 61440) === 40960;
      },
      isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
      isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
      isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
      isSocket(mode) {
        return (mode & 49152) === 49152;
      },
      flagsToPermissionString(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
          perms += "w";
        }
        return perms;
      },
      nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        if (perms.includes("r") && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes("w") && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes("x") && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
      mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
      mayCreate(dir, name) {
        if (!FS.isDir(dir.mode)) {
          return 54;
        }
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, "wx");
      },
      mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
      mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== "r" || flags & (512 | 64)) {
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
      checkOpExists(op, err2) {
        if (!op) {
          throw new FS.ErrnoError(err2);
        }
        return op;
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
      getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
      getStream: (fd) => FS.streams[fd],
      createStream(stream, fd = -1) {
        assert(fd >= -1);
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
      closeStream(fd) {
        FS.streams[fd] = null;
      },
      dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
      doSetAttr(stream, node, attr) {
        var setattr = stream?.stream_ops.setattr;
        var arg = setattr ? stream : node;
        setattr ??= node.node_ops.setattr;
        FS.checkOpExists(setattr, 63);
        setattr(arg, attr);
      },
      chrdev_stream_ops: {
        open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          stream.stream_ops.open?.(stream);
        },
        llseek() {
          throw new FS.ErrnoError(70);
        }
      },
      major: (dev) => dev >> 8,
      minor: (dev) => dev & 255,
      makedev: (ma, mi) => ma << 8 | mi,
      registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
      getDevice: (dev) => FS.devices[dev],
      getMounts(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push(...m.mounts);
        }
        return mounts;
      },
      syncfs(populate, callback) {
        if (typeof populate == "function") {
          callback = populate;
          populate = false;
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
      mount(type, opts, mountpoint) {
        if (typeof type == "string") {
          throw type;
        }
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path;
          node = lookup.node;
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
        var mount = { type, opts, mountpoint, mounts: [] };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          node.mounted = mount;
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      },
      unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
          while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
            current = next;
          }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
      lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
      mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name) {
          throw new FS.ErrnoError(28);
        }
        if (name === "." || name === "..") {
          throw new FS.ErrnoError(20);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
      statfs(path) {
        return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
      },
      statfsStream(stream) {
        return FS.statfsNode(stream.node);
      },
      statfsNode(node) {
        var rtn = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: FS.nextInode,
          ffree: FS.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255
        };
        if (node.node_ops.statfs) {
          Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
        }
        return rtn;
      },
      create(path, mode = 438) {
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
      mkdir(path, mode = 511) {
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
      mkdirTree(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var dir of dirs) {
          if (!dir) continue;
          if (d || PATH.isAbs(path)) d += "/";
          d += dir;
          try {
            FS.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
        }
      },
      mkdev(path, mode, dev) {
        if (typeof dev == "undefined") {
          dev = mode;
          mode = 438;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
      symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
      rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(55);
        }
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
        }
        if (old_node === new_node) {
          return;
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
          throw new FS.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        FS.hashRemoveNode(old_node);
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          FS.hashAddNode(old_node);
        }
      },
      rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
      readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
        return readdir(node);
      },
      unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
      readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return link.node_ops.readlink(link);
      },
      stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
        return getattr(node);
      },
      fstat(fd) {
        var stream = FS.getStreamChecked(fd);
        var node = stream.node;
        var getattr = stream.stream_ops.getattr;
        var arg = getattr ? stream : node;
        getattr ??= node.node_ops.getattr;
        FS.checkOpExists(getattr, 63);
        return getattr(arg);
      },
      lstat(path) {
        return FS.stat(path, true);
      },
      doChmod(stream, node, mode, dontFollow) {
        FS.doSetAttr(stream, node, {
          mode: mode & 4095 | node.mode & -4096,
          ctime: Date.now(),
          dontFollow
        });
      },
      chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChmod(null, node, mode, dontFollow);
      },
      lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
      fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.doChmod(stream, stream.node, mode, false);
      },
      doChown(stream, node, dontFollow) {
        FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
      },
      chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChown(null, node, dontFollow);
      },
      lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
      fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.doChown(stream, stream.node, false);
      },
      doTruncate(stream, node, len) {
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
      },
      truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doTruncate(null, node, len);
      },
      ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if (len < 0 || (stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.doTruncate(stream, stream.node, len);
      },
      utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
        setattr(node, { atime, mtime });
      },
      open(path, flags, mode = 438) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
        if (flags & 64) {
          mode = mode & 4095 | 32768;
        } else {
          mode = 0;
        }
        var node;
        var isDirPath;
        if (typeof path == "object") {
          node = path;
        } else {
          isDirPath = path.endsWith("/");
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 131072),
            noent_okay: true
          });
          node = lookup.node;
          path = lookup.path;
        }
        var created = false;
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20);
            }
          } else if (isDirPath) {
            throw new FS.ErrnoError(31);
          } else {
            node = FS.mknod(path, mode | 511, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (FS.isChrdev(node.mode)) {
          flags &= -513;
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        if (flags & 512 && !created) {
          FS.truncate(node, 0);
        }
        flags &= -131713;
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false
        });
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (created) {
          FS.chmod(node, mode & 511);
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
      close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
      isClosed(stream) {
        return stream.fd === null;
      },
      llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
      read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
      write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
      mmap(stream, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        if (!length) {
          throw new FS.ErrnoError(28);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
      msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
      ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
      readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
          buf = UTF8ArrayToString(buf);
        }
        FS.close(stream);
        return buf;
      },
      writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == "string") {
          data = new Uint8Array(intArrayFromString(data));
        }
        if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
        } else {
          throw new Error("Unsupported data type");
        }
        FS.close(stream);
      },
      cwd: () => FS.currentPath,
      chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
      createDefaultDirectories() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
      },
      createDefaultDevices() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
          llseek: () => 0
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomFill(randomBuffer);
            randomLeft = randomBuffer.byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice("/dev", "random", randomByte);
        FS.createDevice("/dev", "urandom", randomByte);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount(
          {
            mount() {
              var node = FS.createNode(proc_self, "fd", 16895, 73);
              node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
              node.node_ops = {
                lookup(parent, name) {
                  var fd = +name;
                  var stream = FS.getStreamChecked(fd);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: { readlink: () => stream.path },
                    id: fd + 1
                  };
                  ret.parent = ret;
                  return ret;
                },
                readdir() {
                  return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
                }
              };
              return node;
            }
          },
          {},
          "/proc/self/fd"
        );
      },
      createStandardStreams(input, output, error) {
        if (input) {
          FS.createDevice("/dev", "stdin", input);
        } else {
          FS.symlink("/dev/tty", "/dev/stdin");
        }
        if (output) {
          FS.createDevice("/dev", "stdout", null, output);
        } else {
          FS.symlink("/dev/tty", "/dev/stdout");
        }
        if (error) {
          FS.createDevice("/dev", "stderr", null, error);
        } else {
          FS.symlink("/dev/tty1", "/dev/stderr");
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
      staticInit() {
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = { MEMFS };
      },
      init(input, output, error) {
        assert(
          !FS.initialized,
          "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"
        );
        FS.initialized = true;
        input ??= Module["stdin"];
        output ??= Module["stdout"];
        error ??= Module["stderr"];
        FS.createStandardStreams(input, output, error);
      },
      quit() {
        FS.initialized = false;
        _fflush(0);
        for (var stream of FS.streams) {
          if (stream) {
            FS.close(stream);
          }
        }
      },
      findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
      analyzePath(path, dontResolveLastLink) {
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === "/";
        } catch (e) {
          ret.error = e.errno;
        }
        return ret;
      },
      createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
          parent = current;
        }
        return current;
      },
      createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
      createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == "string") {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
      createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        FS.createDevice.major ??= 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === void 0 && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.atime = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.mtime = stream.node.ctime = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
      forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != "undefined") {
          throw new Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
          );
        } else {
          try {
            obj.contents = readBinary(obj.url);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
      createLazyFile(parent, name, url, canRead, canWrite) {
        class LazyUint8Array {
          lengthKnown = false;
          chunks = [];
          get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return void 0;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
              throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
              var xhr2 = new XMLHttpRequest();
              xhr2.open("GET", url, false);
              if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
              xhr2.responseType = "arraybuffer";
              if (xhr2.overrideMimeType) {
                xhr2.overrideMimeType("text/plain; charset=x-user-defined");
              }
              xhr2.send(null);
              if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
              if (xhr2.response !== void 0) {
                return new Uint8Array(xhr2.response || []);
              }
              return intArrayFromString(xhr2.responseText || "");
            };
            var lazyArray2 = this;
            lazyArray2.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                lazyArray2.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray2.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
              return lazyArray2.chunks[chunkNum];
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
        if (typeof XMLHttpRequest != "undefined") {
          if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        Object.defineProperties(node, {
          usedBytes: {
            get: function() {
              return this.contents.length;
            }
          }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length) return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position);
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
      absolutePath() {
        abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
      },
      createFolder() {
        abort("FS.createFolder has been removed; use FS.mkdir instead");
      },
      createLink() {
        abort("FS.createLink has been removed; use FS.symlink instead");
      },
      joinPath() {
        abort("FS.joinPath has been removed; use PATH.join instead");
      },
      mmapAlloc() {
        abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
      },
      standardizePath() {
        abort("FS.standardizePath has been removed; use PATH.normalize instead");
      }
    };
    var SYSCALLS = {
      DEFAULT_POLLMASK: 5,
      calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);
          }
          return dir;
        }
        return dir + "/" + path;
      },
      writeStat(buf, stat) {
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = stat.mode;
        HEAPU32[buf + 8 >> 2] = stat.nlink;
        HEAP32[buf + 12 >> 2] = stat.uid;
        HEAP32[buf + 16 >> 2] = stat.gid;
        HEAP32[buf + 20 >> 2] = stat.rdev;
        HEAP64[buf + 24 >> 3] = BigInt(stat.size);
        HEAP32[buf + 32 >> 2] = 4096;
        HEAP32[buf + 36 >> 2] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
        HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
        HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
        HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
        HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
        HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
        HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
        return 0;
      },
      writeStatFs(buf, stats) {
        HEAP32[buf + 4 >> 2] = stats.bsize;
        HEAP32[buf + 40 >> 2] = stats.bsize;
        HEAP32[buf + 8 >> 2] = stats.blocks;
        HEAP32[buf + 12 >> 2] = stats.bfree;
        HEAP32[buf + 16 >> 2] = stats.bavail;
        HEAP32[buf + 20 >> 2] = stats.files;
        HEAP32[buf + 24 >> 2] = stats.ffree;
        HEAP32[buf + 28 >> 2] = stats.fsid;
        HEAP32[buf + 44 >> 2] = stats.flags;
        HEAP32[buf + 36 >> 2] = stats.namelen;
      },
      doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
      getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
      varargs: void 0,
      getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      }
    };
    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
          case 0: {
            var arg = syscallGetVarargI();
            if (arg < 0) {
              return -28;
            }
            while (FS.streams[arg]) {
              arg++;
            }
            var newStream;
            newStream = FS.dupStream(stream, arg);
            return newStream.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return stream.flags;
          case 4: {
            var arg = syscallGetVarargI();
            stream.flags |= arg;
            return 0;
          }
          case 12: {
            var arg = syscallGetVarargP();
            var offset = 0;
            HEAP16[arg + offset >> 1] = 2;
            return 0;
          }
          case 13:
          case 14:
            return 0;
        }
        return -28;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_fstat64(fd, buf) {
      try {
        return SYSCALLS.writeStat(buf, FS.fstat(fd));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var INT53_MAX = 9007199254740992;
    var INT53_MIN = -9007199254740992;
    var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
    function ___syscall_ftruncate64(fd, length) {
      length = bigintToI53Checked(length);
      try {
        if (isNaN(length)) return -61;
        FS.ftruncate(fd, length);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var stringToUTF82 = (str, outPtr, maxBytesToWrite) => {
      assert(
        typeof maxBytesToWrite == "number",
        "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"
      );
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
    function ___syscall_getdents64(fd, dirp, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        stream.getdents ||= FS.readdir(stream.path);
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var startIdx = Math.floor(off / struct_size);
        var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
        for (var idx = startIdx; idx < endIdx; idx++) {
          var id;
          var type;
          var name = stream.getdents[idx];
          if (name === ".") {
            id = stream.node.id;
            type = 4;
          } else if (name === "..") {
            var lookup = FS.lookupPath(stream.path, { parent: true });
            id = lookup.node.id;
            type = 4;
          } else {
            var child;
            try {
              child = FS.lookupNode(stream.node, name);
            } catch (e) {
              if (e?.errno === 28) {
                continue;
              }
              throw e;
            }
            id = child.id;
            type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
          }
          assert(id);
          HEAP64[dirp + pos >> 3] = BigInt(id);
          HEAP64[dirp + pos + 8 >> 3] = BigInt((idx + 1) * struct_size);
          HEAP16[dirp + pos + 16 >> 1] = 280;
          HEAP8[dirp + pos + 18] = type;
          stringToUTF82(name, dirp + pos + 19, 256);
          pos += struct_size;
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
          case 21509: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21505: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcgets) {
              var termios = stream.tty.ops.ioctl_tcgets(stream);
              var argp = syscallGetVarargP();
              HEAP32[argp >> 2] = termios.c_iflag || 0;
              HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
              HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
              HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
              for (var i = 0; i < 32; i++) {
                HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
              }
              return 0;
            }
            return 0;
          }
          case 21510:
          case 21511:
          case 21512: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcsets) {
              var argp = syscallGetVarargP();
              var c_iflag = HEAP32[argp >> 2];
              var c_oflag = HEAP32[argp + 4 >> 2];
              var c_cflag = HEAP32[argp + 8 >> 2];
              var c_lflag = HEAP32[argp + 12 >> 2];
              var c_cc = [];
              for (var i = 0; i < 32; i++) {
                c_cc.push(HEAP8[argp + i + 17]);
              }
              return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                c_iflag,
                c_oflag,
                c_cflag,
                c_lflag,
                c_cc
              });
            }
            return 0;
          }
          case 21519: {
            if (!stream.tty) return -59;
            var argp = syscallGetVarargP();
            HEAP32[argp >> 2] = 0;
            return 0;
          }
          case 21520: {
            if (!stream.tty) return -59;
            return -28;
          }
          case 21531: {
            var argp = syscallGetVarargP();
            return FS.ioctl(stream, op, argp);
          }
          case 21523: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tiocgwinsz) {
              var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
              var argp = syscallGetVarargP();
              HEAP16[argp >> 1] = winsize[0];
              HEAP16[argp + 2 >> 1] = winsize[1];
            }
            return 0;
          }
          case 21524: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21515: {
            if (!stream.tty) return -59;
            return 0;
          }
          default:
            return -28;
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_lstat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.writeStat(buf, FS.lstat(path));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_newfstatat(dirfd, path, buf, flags) {
      try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~6400;
        assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? syscallGetVarargI() : 0;
        return FS.open(path, flags, mode).fd;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_rmdir(path) {
      try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_stat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.writeStat(buf, FS.stat(path));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_unlinkat(dirfd, path, flags) {
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (!flags) {
          FS.unlink(path);
        } else if (flags === 512) {
          FS.rmdir(path);
        } else {
          return -28;
        }
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var __abort_js = () => abort("native code called abort()");
    var __emscripten_throw_longjmp = () => {
      throw Infinity;
    };
    function __gmtime_js(time, tmPtr) {
      time = bigintToI53Checked(time);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
      HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
      HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
    }
    var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
      return yday;
    };
    function __localtime_js(time, tmPtr) {
      time = bigintToI53Checked(time);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getHours();
      HEAP32[tmPtr + 12 >> 2] = date.getDate();
      HEAP32[tmPtr + 16 >> 2] = date.getMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getDay();
      var yday = ydayFromDate(date) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
      HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
      HEAP32[tmPtr + 32 >> 2] = dst;
    }
    var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      var extractZone = (timezoneOffset) => {
        var sign = timezoneOffset >= 0 ? "-" : "+";
        var absOffset = Math.abs(timezoneOffset);
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
        return `UTC${sign}${hours}${minutes}`;
      };
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(lengthBytesUTF82(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
      assert(lengthBytesUTF82(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
      if (summerOffset < winterOffset) {
        stringToUTF82(winterName, std_name, 17);
        stringToUTF82(summerName, dst_name, 17);
      } else {
        stringToUTF82(winterName, dst_name, 17);
        stringToUTF82(summerName, std_name, 17);
      }
    };
    var _emscripten_date_now = () => Date.now();
    var getHeapMax = () => 2147483648;
    var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536 | 0;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {
        err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
      }
    };
    var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      assert(requestedSize > oldSize);
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false;
      }
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
      return false;
    };
    var ENV = {};
    var getExecutableName = () => thisProgram || "./this.program";
    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.language || "C").replace("-", "_") + ".UTF-8";
        var env = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: lang,
          _: getExecutableName()
        };
        for (var x in ENV) {
          if (ENV[x] === void 0) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
    var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + envp >> 2] = ptr;
        bufSize += stringToUTF82(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    };
    var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF82(string) + 1;
      }
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    };
    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
      }
      return ret;
    };
    function _fd_read(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    function _fd_seek(fd, offset, whence, newOffset) {
      offset = bigintToI53Checked(offset);
      try {
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        HEAP64[newOffset >> 3] = BigInt(stream.position);
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    function _fd_sync(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (stream.stream_ops?.fsync) {
          return stream.stream_ops.fsync(stream);
        }
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) {
          break;
        }
      }
      return ret;
    };
    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var wasmTableMirror = [];
    var wasmTable;
    var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
      return func;
    };
    var getCFunc = (ident) => {
      var func = Module["_" + ident];
      assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
      return func;
    };
    var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
      HEAP8.set(array, buffer);
    };
    var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
    var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF82(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF82(str, ret, size);
      return ret;
    };
    var ccall = (ident, returnType, argTypes, args, opts) => {
      var toC = {
        string: (str) => {
          var ret2 = 0;
          if (str !== null && str !== void 0 && str !== 0) {
            ret2 = stringToUTF8OnStack(str);
          }
          return ret2;
        },
        array: (arr) => {
          var ret2 = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret2);
          return ret2;
        }
      };
      function convertReturnValue(ret2) {
        if (returnType === "string") {
          return UTF8ToString(ret2);
        }
        if (returnType === "boolean") return Boolean(ret2);
        return ret2;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== "array", 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret2) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret2);
      }
      ret = onDone(ret);
      return ret;
    };
    var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args);
    FS.createPreloadedFile = FS_createPreloadedFile;
    FS.staticInit();
    {
      if (Module["noExitRuntime"]) Module["noExitRuntime"];
      if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
      if (Module["print"]) out = Module["print"];
      if (Module["printErr"]) err = Module["printErr"];
      if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
      checkIncomingModuleAPI();
      if (Module["arguments"]) Module["arguments"];
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      assert(
        typeof Module["memoryInitializerPrefixURL"] == "undefined",
        "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"
      );
      assert(
        typeof Module["pthreadMainPrefixURL"] == "undefined",
        "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"
      );
      assert(
        typeof Module["cdInitializerPrefixURL"] == "undefined",
        "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"
      );
      assert(
        typeof Module["filePackagePrefixURL"] == "undefined",
        "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"
      );
      assert(typeof Module["read"] == "undefined", "Module.read option was removed");
      assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
      assert(
        typeof Module["readBinary"] == "undefined",
        "Module.readBinary option was removed (modify readBinary in JS)"
      );
      assert(
        typeof Module["setWindowTitle"] == "undefined",
        "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"
      );
      assert(
        typeof Module["TOTAL_MEMORY"] == "undefined",
        "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"
      );
      assert(
        typeof Module["ENVIRONMENT"] == "undefined",
        "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"
      );
      assert(
        typeof Module["STACK_SIZE"] == "undefined",
        "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"
      );
      assert(
        typeof Module["wasmMemory"] == "undefined",
        "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"
      );
      assert(
        typeof Module["INITIAL_MEMORY"] == "undefined",
        "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"
      );
    }
    Module["wasmExports"] = wasmExports;
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    var missingLibrarySymbols = [
      "writeI53ToI64",
      "writeI53ToI64Clamped",
      "writeI53ToI64Signaling",
      "writeI53ToU64Clamped",
      "writeI53ToU64Signaling",
      "readI53FromI64",
      "readI53FromU64",
      "convertI32PairToI53",
      "convertI32PairToI53Checked",
      "convertU32PairToI53",
      "getTempRet0",
      "setTempRet0",
      "exitJS",
      "withStackSave",
      "inetPton4",
      "inetNtop4",
      "inetPton6",
      "inetNtop6",
      "readSockaddr",
      "writeSockaddr",
      "emscriptenLog",
      "readEmAsmArgs",
      "jstoi_q",
      "autoResumeAudioContext",
      "getDynCaller",
      "dynCall",
      "handleException",
      "keepRuntimeAlive",
      "runtimeKeepalivePush",
      "runtimeKeepalivePop",
      "callUserCallback",
      "maybeExit",
      "asmjsMangle",
      "HandleAllocator",
      "getNativeTypeSize",
      "addOnInit",
      "addOnPostCtor",
      "addOnPreMain",
      "addOnExit",
      "STACK_SIZE",
      "STACK_ALIGN",
      "POINTER_SIZE",
      "ASSERTIONS",
      "uleb128Encode",
      "sigToWasmTypes",
      "generateFuncType",
      "convertJsFunctionToWasm",
      "getEmptyTableSlot",
      "updateTableMap",
      "getFunctionAddress",
      "addFunction",
      "removeFunction",
      "reallyNegative",
      "unSign",
      "strLen",
      "reSign",
      "formatString",
      "intArrayToString",
      "AsciiToString",
      "stringToAscii",
      "UTF16ToString",
      "stringToUTF16",
      "lengthBytesUTF16",
      "UTF32ToString",
      "stringToUTF32",
      "lengthBytesUTF32",
      "stringToNewUTF8",
      "registerKeyEventCallback",
      "maybeCStringToJsString",
      "findEventTarget",
      "getBoundingClientRect",
      "fillMouseEventData",
      "registerMouseEventCallback",
      "registerWheelEventCallback",
      "registerUiEventCallback",
      "registerFocusEventCallback",
      "fillDeviceOrientationEventData",
      "registerDeviceOrientationEventCallback",
      "fillDeviceMotionEventData",
      "registerDeviceMotionEventCallback",
      "screenOrientation",
      "fillOrientationChangeEventData",
      "registerOrientationChangeEventCallback",
      "fillFullscreenChangeEventData",
      "registerFullscreenChangeEventCallback",
      "JSEvents_requestFullscreen",
      "JSEvents_resizeCanvasForFullscreen",
      "registerRestoreOldStyle",
      "hideEverythingExceptGivenElement",
      "restoreHiddenElements",
      "setLetterbox",
      "softFullscreenResizeWebGLRenderTarget",
      "doRequestFullscreen",
      "fillPointerlockChangeEventData",
      "registerPointerlockChangeEventCallback",
      "registerPointerlockErrorEventCallback",
      "requestPointerLock",
      "fillVisibilityChangeEventData",
      "registerVisibilityChangeEventCallback",
      "registerTouchEventCallback",
      "fillGamepadEventData",
      "registerGamepadEventCallback",
      "registerBeforeUnloadEventCallback",
      "fillBatteryEventData",
      "battery",
      "registerBatteryEventCallback",
      "setCanvasElementSize",
      "getCanvasElementSize",
      "jsStackTrace",
      "getCallstack",
      "convertPCtoSourceLocation",
      "checkWasiClock",
      "wasiRightsToMuslOFlags",
      "wasiOFlagsToMuslOFlags",
      "safeSetTimeout",
      "setImmediateWrapped",
      "safeRequestAnimationFrame",
      "clearImmediateWrapped",
      "registerPostMainLoop",
      "registerPreMainLoop",
      "getPromise",
      "makePromise",
      "idsToPromises",
      "makePromiseCallback",
      "ExceptionInfo",
      "findMatchingCatch",
      "Browser_asyncPrepareDataCounter",
      "arraySum",
      "addDays",
      "getSocketFromFD",
      "getSocketAddress",
      "FS_mkdirTree",
      "_setNetworkCallback",
      "heapObjectForWebGLType",
      "toTypedArrayIndex",
      "webgl_enable_ANGLE_instanced_arrays",
      "webgl_enable_OES_vertex_array_object",
      "webgl_enable_WEBGL_draw_buffers",
      "webgl_enable_WEBGL_multi_draw",
      "webgl_enable_EXT_polygon_offset_clamp",
      "webgl_enable_EXT_clip_control",
      "webgl_enable_WEBGL_polygon_mode",
      "emscriptenWebGLGet",
      "computeUnpackAlignedImageSize",
      "colorChannelsInGlTextureFormat",
      "emscriptenWebGLGetTexPixelData",
      "emscriptenWebGLGetUniform",
      "webglGetUniformLocation",
      "webglPrepareUniformLocationsBeforeFirstUse",
      "webglGetLeftBracePos",
      "emscriptenWebGLGetVertexAttrib",
      "__glGetActiveAttribOrUniform",
      "writeGLArray",
      "registerWebGlEventCallback",
      "runAndAbortIfError",
      "ALLOC_NORMAL",
      "ALLOC_STACK",
      "allocate",
      "writeStringToMemory",
      "writeAsciiToMemory",
      "demangle",
      "stackTrace"
    ];
    missingLibrarySymbols.forEach(missingLibrarySymbol);
    var unexportedSymbols = [
      "run",
      "addRunDependency",
      "removeRunDependency",
      "out",
      "err",
      "callMain",
      "abort",
      "wasmMemory",
      "HEAP64",
      "HEAPU64",
      "writeStackCookie",
      "checkStackCookie",
      "INT53_MAX",
      "INT53_MIN",
      "bigintToI53Checked",
      "stackSave",
      "stackRestore",
      "stackAlloc",
      "ptrToString",
      "zeroMemory",
      "getHeapMax",
      "growMemory",
      "ENV",
      "ERRNO_CODES",
      "strError",
      "DNS",
      "Protocols",
      "Sockets",
      "timers",
      "warnOnce",
      "readEmAsmArgsArray",
      "getExecutableName",
      "asyncLoad",
      "alignMemory",
      "mmapAlloc",
      "wasmTable",
      "getUniqueRunDependency",
      "noExitRuntime",
      "addOnPreRun",
      "addOnPostRun",
      "freeTableIndexes",
      "functionsInTableMap",
      "setValue",
      "getValue",
      "PATH",
      "PATH_FS",
      "UTF8Decoder",
      "UTF8ArrayToString",
      "UTF8ToString",
      "stringToUTF8Array",
      "stringToUTF8",
      "lengthBytesUTF8",
      "intArrayFromString",
      "UTF16Decoder",
      "stringToUTF8OnStack",
      "writeArrayToMemory",
      "JSEvents",
      "specialHTMLTargets",
      "findCanvasEventTarget",
      "currentFullscreenStrategy",
      "restoreOldWindowedStyle",
      "UNWIND_CACHE",
      "ExitStatus",
      "getEnvStrings",
      "doReadv",
      "doWritev",
      "initRandomFill",
      "randomFill",
      "emSetImmediate",
      "emClearImmediate_deps",
      "emClearImmediate",
      "promiseMap",
      "uncaughtExceptionCount",
      "exceptionLast",
      "exceptionCaught",
      "Browser",
      "requestFullscreen",
      "requestFullScreen",
      "setCanvasSize",
      "getUserMedia",
      "createContext",
      "getPreloadedImageData__data",
      "wget",
      "MONTH_DAYS_REGULAR",
      "MONTH_DAYS_LEAP",
      "MONTH_DAYS_REGULAR_CUMULATIVE",
      "MONTH_DAYS_LEAP_CUMULATIVE",
      "isLeapYear",
      "ydayFromDate",
      "SYSCALLS",
      "preloadPlugins",
      "FS_createPreloadedFile",
      "FS_modeStringToFlags",
      "FS_getMode",
      "FS_stdin_getChar_buffer",
      "FS_stdin_getChar",
      "FS_unlink",
      "FS_createPath",
      "FS_createDevice",
      "FS_readFile",
      "FS",
      "FS_root",
      "FS_mounts",
      "FS_devices",
      "FS_streams",
      "FS_nextInode",
      "FS_nameTable",
      "FS_currentPath",
      "FS_initialized",
      "FS_ignorePermissions",
      "FS_filesystems",
      "FS_syncFSRequests",
      "FS_readFiles",
      "FS_lookupPath",
      "FS_getPath",
      "FS_hashName",
      "FS_hashAddNode",
      "FS_hashRemoveNode",
      "FS_lookupNode",
      "FS_createNode",
      "FS_destroyNode",
      "FS_isRoot",
      "FS_isMountpoint",
      "FS_isFile",
      "FS_isDir",
      "FS_isLink",
      "FS_isChrdev",
      "FS_isBlkdev",
      "FS_isFIFO",
      "FS_isSocket",
      "FS_flagsToPermissionString",
      "FS_nodePermissions",
      "FS_mayLookup",
      "FS_mayCreate",
      "FS_mayDelete",
      "FS_mayOpen",
      "FS_checkOpExists",
      "FS_nextfd",
      "FS_getStreamChecked",
      "FS_getStream",
      "FS_createStream",
      "FS_closeStream",
      "FS_dupStream",
      "FS_doSetAttr",
      "FS_chrdev_stream_ops",
      "FS_major",
      "FS_minor",
      "FS_makedev",
      "FS_registerDevice",
      "FS_getDevice",
      "FS_getMounts",
      "FS_syncfs",
      "FS_mount",
      "FS_unmount",
      "FS_lookup",
      "FS_mknod",
      "FS_statfs",
      "FS_statfsStream",
      "FS_statfsNode",
      "FS_create",
      "FS_mkdir",
      "FS_mkdev",
      "FS_symlink",
      "FS_rename",
      "FS_rmdir",
      "FS_readdir",
      "FS_readlink",
      "FS_stat",
      "FS_fstat",
      "FS_lstat",
      "FS_doChmod",
      "FS_chmod",
      "FS_lchmod",
      "FS_fchmod",
      "FS_doChown",
      "FS_chown",
      "FS_lchown",
      "FS_fchown",
      "FS_doTruncate",
      "FS_truncate",
      "FS_ftruncate",
      "FS_utime",
      "FS_open",
      "FS_close",
      "FS_isClosed",
      "FS_llseek",
      "FS_read",
      "FS_write",
      "FS_mmap",
      "FS_msync",
      "FS_ioctl",
      "FS_writeFile",
      "FS_cwd",
      "FS_chdir",
      "FS_createDefaultDirectories",
      "FS_createDefaultDevices",
      "FS_createSpecialDirectories",
      "FS_createStandardStreams",
      "FS_staticInit",
      "FS_init",
      "FS_quit",
      "FS_findObject",
      "FS_analyzePath",
      "FS_createFile",
      "FS_createDataFile",
      "FS_forceLoadFile",
      "FS_createLazyFile",
      "FS_absolutePath",
      "FS_createFolder",
      "FS_createLink",
      "FS_joinPath",
      "FS_mmapAlloc",
      "FS_standardizePath",
      "MEMFS",
      "TTY",
      "PIPEFS",
      "SOCKFS",
      "tempFixedLengthArray",
      "miniTempWebGLFloatBuffers",
      "miniTempWebGLIntBuffers",
      "GL",
      "AL",
      "GLUT",
      "EGL",
      "GLEW",
      "IDBStore",
      "SDL",
      "SDL_gfx",
      "allocateUTF8",
      "allocateUTF8OnStack",
      "print",
      "printErr",
      "jstoi_s"
    ];
    unexportedSymbols.forEach(unexportedRuntimeSymbol);
    function checkIncomingModuleAPI() {
      ignoredModuleProp("fetchSettings");
    }
    Module["_PDFium_Init"] = makeInvalidEarlyAccess("_PDFium_Init");
    Module["_FPDF_InitLibraryWithConfig"] = makeInvalidEarlyAccess("_FPDF_InitLibraryWithConfig");
    Module["_FPDFAnnot_IsSupportedSubtype"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_IsSupportedSubtype"
    );
    Module["_FPDFPage_CreateAnnot"] = makeInvalidEarlyAccess("_FPDFPage_CreateAnnot");
    Module["_FPDFPage_GetAnnotCount"] = makeInvalidEarlyAccess("_FPDFPage_GetAnnotCount");
    Module["_FPDFPage_GetAnnot"] = makeInvalidEarlyAccess("_FPDFPage_GetAnnot");
    Module["_FPDFPage_GetAnnotIndex"] = makeInvalidEarlyAccess("_FPDFPage_GetAnnotIndex");
    Module["_FPDFPage_CloseAnnot"] = makeInvalidEarlyAccess("_FPDFPage_CloseAnnot");
    Module["_FPDFPage_RemoveAnnot"] = makeInvalidEarlyAccess("_FPDFPage_RemoveAnnot");
    Module["_FPDFAnnot_GetSubtype"] = makeInvalidEarlyAccess("_FPDFAnnot_GetSubtype");
    Module["_FPDFAnnot_IsObjectSupportedSubtype"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_IsObjectSupportedSubtype"
    );
    Module["_FPDFAnnot_UpdateObject"] = makeInvalidEarlyAccess("_FPDFAnnot_UpdateObject");
    Module["_FPDFAnnot_AddInkStroke"] = makeInvalidEarlyAccess("_FPDFAnnot_AddInkStroke");
    Module["_FPDFAnnot_RemoveInkList"] = makeInvalidEarlyAccess("_FPDFAnnot_RemoveInkList");
    Module["_FPDFAnnot_AppendObject"] = makeInvalidEarlyAccess("_FPDFAnnot_AppendObject");
    Module["_FPDFAnnot_GetObjectCount"] = makeInvalidEarlyAccess("_FPDFAnnot_GetObjectCount");
    Module["_FPDFAnnot_GetObject"] = makeInvalidEarlyAccess("_FPDFAnnot_GetObject");
    Module["_FPDFAnnot_RemoveObject"] = makeInvalidEarlyAccess("_FPDFAnnot_RemoveObject");
    Module["_FPDFAnnot_SetColor"] = makeInvalidEarlyAccess("_FPDFAnnot_SetColor");
    Module["_FPDFAnnot_GetColor"] = makeInvalidEarlyAccess("_FPDFAnnot_GetColor");
    Module["_FPDFAnnot_HasAttachmentPoints"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_HasAttachmentPoints"
    );
    Module["_FPDFAnnot_SetAttachmentPoints"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_SetAttachmentPoints"
    );
    Module["_FPDFAnnot_AppendAttachmentPoints"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_AppendAttachmentPoints"
    );
    Module["_FPDFAnnot_CountAttachmentPoints"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_CountAttachmentPoints"
    );
    Module["_FPDFAnnot_GetAttachmentPoints"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetAttachmentPoints"
    );
    Module["_FPDFAnnot_SetRect"] = makeInvalidEarlyAccess("_FPDFAnnot_SetRect");
    Module["_FPDFAnnot_GetRect"] = makeInvalidEarlyAccess("_FPDFAnnot_GetRect");
    Module["_FPDFAnnot_GetVertices"] = makeInvalidEarlyAccess("_FPDFAnnot_GetVertices");
    Module["_FPDFAnnot_GetInkListCount"] = makeInvalidEarlyAccess("_FPDFAnnot_GetInkListCount");
    Module["_FPDFAnnot_GetInkListPath"] = makeInvalidEarlyAccess("_FPDFAnnot_GetInkListPath");
    Module["_FPDFAnnot_GetLine"] = makeInvalidEarlyAccess("_FPDFAnnot_GetLine");
    Module["_FPDFAnnot_SetBorder"] = makeInvalidEarlyAccess("_FPDFAnnot_SetBorder");
    Module["_FPDFAnnot_GetBorder"] = makeInvalidEarlyAccess("_FPDFAnnot_GetBorder");
    Module["_FPDFAnnot_HasKey"] = makeInvalidEarlyAccess("_FPDFAnnot_HasKey");
    Module["_FPDFAnnot_GetValueType"] = makeInvalidEarlyAccess("_FPDFAnnot_GetValueType");
    Module["_FPDFAnnot_SetStringValue"] = makeInvalidEarlyAccess("_FPDFAnnot_SetStringValue");
    Module["_FPDFAnnot_GetStringValue"] = makeInvalidEarlyAccess("_FPDFAnnot_GetStringValue");
    Module["_FPDFAnnot_GetNumberValue"] = makeInvalidEarlyAccess("_FPDFAnnot_GetNumberValue");
    Module["_FPDFAnnot_SetAP"] = makeInvalidEarlyAccess("_FPDFAnnot_SetAP");
    Module["_FPDFAnnot_GetAP"] = makeInvalidEarlyAccess("_FPDFAnnot_GetAP");
    Module["_FPDFAnnot_GetLinkedAnnot"] = makeInvalidEarlyAccess("_FPDFAnnot_GetLinkedAnnot");
    Module["_FPDFAnnot_GetFlags"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFlags");
    Module["_FPDFAnnot_SetFlags"] = makeInvalidEarlyAccess("_FPDFAnnot_SetFlags");
    Module["_FPDFAnnot_GetFormFieldFlags"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldFlags");
    Module["_FPDFAnnot_SetFormFieldFlags"] = makeInvalidEarlyAccess("_FPDFAnnot_SetFormFieldFlags");
    Module["_FPDFAnnot_GetFormFieldAtPoint"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFormFieldAtPoint"
    );
    Module["_FPDFAnnot_GetFormFieldName"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldName");
    Module["_FPDFAnnot_GetFormFieldType"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldType");
    Module["_FPDFAnnot_GetFormAdditionalActionJavaScript"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormAdditionalActionJavaScript");
    Module["_FPDFAnnot_GetFormFieldAlternateName"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFormFieldAlternateName"
    );
    Module["_FPDFAnnot_GetFormFieldValue"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldValue");
    Module["_FPDFAnnot_GetOptionCount"] = makeInvalidEarlyAccess("_FPDFAnnot_GetOptionCount");
    Module["_FPDFAnnot_GetOptionLabel"] = makeInvalidEarlyAccess("_FPDFAnnot_GetOptionLabel");
    Module["_FPDFAnnot_IsOptionSelected"] = makeInvalidEarlyAccess("_FPDFAnnot_IsOptionSelected");
    Module["_FPDFAnnot_GetFontSize"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFontSize");
    Module["_FPDFAnnot_SetFontColor"] = makeInvalidEarlyAccess("_FPDFAnnot_SetFontColor");
    Module["_FPDFAnnot_GetFontColor"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFontColor");
    Module["_FPDFAnnot_IsChecked"] = makeInvalidEarlyAccess("_FPDFAnnot_IsChecked");
    Module["_FPDFAnnot_SetFocusableSubtypes"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_SetFocusableSubtypes"
    );
    Module["_FPDFAnnot_GetFocusableSubtypesCount"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFocusableSubtypesCount"
    );
    Module["_FPDFAnnot_GetFocusableSubtypes"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFocusableSubtypes"
    );
    Module["_FPDFAnnot_GetLink"] = makeInvalidEarlyAccess("_FPDFAnnot_GetLink");
    Module["_FPDFAnnot_GetFormControlCount"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFormControlCount"
    );
    Module["_FPDFAnnot_GetFormControlIndex"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFormControlIndex"
    );
    Module["_FPDFAnnot_GetFormFieldExportValue"] = makeInvalidEarlyAccess(
      "_FPDFAnnot_GetFormFieldExportValue"
    );
    Module["_FPDFAnnot_SetURI"] = makeInvalidEarlyAccess("_FPDFAnnot_SetURI");
    Module["_FPDFAnnot_GetFileAttachment"] = makeInvalidEarlyAccess("_FPDFAnnot_GetFileAttachment");
    Module["_FPDFAnnot_AddFileAttachment"] = makeInvalidEarlyAccess("_FPDFAnnot_AddFileAttachment");
    Module["_FPDFDoc_GetAttachmentCount"] = makeInvalidEarlyAccess("_FPDFDoc_GetAttachmentCount");
    Module["_FPDFDoc_AddAttachment"] = makeInvalidEarlyAccess("_FPDFDoc_AddAttachment");
    Module["_FPDFDoc_GetAttachment"] = makeInvalidEarlyAccess("_FPDFDoc_GetAttachment");
    Module["_FPDFDoc_DeleteAttachment"] = makeInvalidEarlyAccess("_FPDFDoc_DeleteAttachment");
    Module["_FPDFAttachment_GetName"] = makeInvalidEarlyAccess("_FPDFAttachment_GetName");
    Module["_FPDFAttachment_HasKey"] = makeInvalidEarlyAccess("_FPDFAttachment_HasKey");
    Module["_FPDFAttachment_GetValueType"] = makeInvalidEarlyAccess("_FPDFAttachment_GetValueType");
    Module["_FPDFAttachment_SetStringValue"] = makeInvalidEarlyAccess(
      "_FPDFAttachment_SetStringValue"
    );
    Module["_FPDFAttachment_GetStringValue"] = makeInvalidEarlyAccess(
      "_FPDFAttachment_GetStringValue"
    );
    Module["_FPDFAttachment_SetFile"] = makeInvalidEarlyAccess("_FPDFAttachment_SetFile");
    Module["_FPDFAttachment_GetFile"] = makeInvalidEarlyAccess("_FPDFAttachment_GetFile");
    Module["_FPDFAttachment_GetSubtype"] = makeInvalidEarlyAccess("_FPDFAttachment_GetSubtype");
    Module["_FPDFCatalog_IsTagged"] = makeInvalidEarlyAccess("_FPDFCatalog_IsTagged");
    Module["_FPDFCatalog_SetLanguage"] = makeInvalidEarlyAccess("_FPDFCatalog_SetLanguage");
    Module["_FPDFAvail_Create"] = makeInvalidEarlyAccess("_FPDFAvail_Create");
    Module["_FPDFAvail_Destroy"] = makeInvalidEarlyAccess("_FPDFAvail_Destroy");
    Module["_FPDFAvail_IsDocAvail"] = makeInvalidEarlyAccess("_FPDFAvail_IsDocAvail");
    Module["_FPDFAvail_GetDocument"] = makeInvalidEarlyAccess("_FPDFAvail_GetDocument");
    Module["_FPDFAvail_GetFirstPageNum"] = makeInvalidEarlyAccess("_FPDFAvail_GetFirstPageNum");
    Module["_FPDFAvail_IsPageAvail"] = makeInvalidEarlyAccess("_FPDFAvail_IsPageAvail");
    Module["_FPDFAvail_IsFormAvail"] = makeInvalidEarlyAccess("_FPDFAvail_IsFormAvail");
    Module["_FPDFAvail_IsLinearized"] = makeInvalidEarlyAccess("_FPDFAvail_IsLinearized");
    Module["_FPDFBookmark_GetFirstChild"] = makeInvalidEarlyAccess("_FPDFBookmark_GetFirstChild");
    Module["_FPDFBookmark_GetNextSibling"] = makeInvalidEarlyAccess("_FPDFBookmark_GetNextSibling");
    Module["_FPDFBookmark_GetTitle"] = makeInvalidEarlyAccess("_FPDFBookmark_GetTitle");
    Module["_FPDFBookmark_GetCount"] = makeInvalidEarlyAccess("_FPDFBookmark_GetCount");
    Module["_FPDFBookmark_Find"] = makeInvalidEarlyAccess("_FPDFBookmark_Find");
    Module["_FPDFBookmark_GetDest"] = makeInvalidEarlyAccess("_FPDFBookmark_GetDest");
    Module["_FPDFBookmark_GetAction"] = makeInvalidEarlyAccess("_FPDFBookmark_GetAction");
    Module["_FPDFAction_GetType"] = makeInvalidEarlyAccess("_FPDFAction_GetType");
    Module["_FPDFAction_GetDest"] = makeInvalidEarlyAccess("_FPDFAction_GetDest");
    Module["_FPDFAction_GetFilePath"] = makeInvalidEarlyAccess("_FPDFAction_GetFilePath");
    Module["_FPDFAction_GetURIPath"] = makeInvalidEarlyAccess("_FPDFAction_GetURIPath");
    Module["_FPDFDest_GetDestPageIndex"] = makeInvalidEarlyAccess("_FPDFDest_GetDestPageIndex");
    Module["_FPDFDest_GetView"] = makeInvalidEarlyAccess("_FPDFDest_GetView");
    Module["_FPDFDest_GetLocationInPage"] = makeInvalidEarlyAccess("_FPDFDest_GetLocationInPage");
    Module["_FPDFLink_GetLinkAtPoint"] = makeInvalidEarlyAccess("_FPDFLink_GetLinkAtPoint");
    Module["_FPDFLink_GetLinkZOrderAtPoint"] = makeInvalidEarlyAccess(
      "_FPDFLink_GetLinkZOrderAtPoint"
    );
    Module["_FPDFLink_GetDest"] = makeInvalidEarlyAccess("_FPDFLink_GetDest");
    Module["_FPDFLink_GetAction"] = makeInvalidEarlyAccess("_FPDFLink_GetAction");
    Module["_FPDFLink_Enumerate"] = makeInvalidEarlyAccess("_FPDFLink_Enumerate");
    Module["_FPDFLink_GetAnnot"] = makeInvalidEarlyAccess("_FPDFLink_GetAnnot");
    Module["_FPDFLink_GetAnnotRect"] = makeInvalidEarlyAccess("_FPDFLink_GetAnnotRect");
    Module["_FPDFLink_CountQuadPoints"] = makeInvalidEarlyAccess("_FPDFLink_CountQuadPoints");
    Module["_FPDFLink_GetQuadPoints"] = makeInvalidEarlyAccess("_FPDFLink_GetQuadPoints");
    Module["_FPDF_GetPageAAction"] = makeInvalidEarlyAccess("_FPDF_GetPageAAction");
    Module["_FPDF_GetFileIdentifier"] = makeInvalidEarlyAccess("_FPDF_GetFileIdentifier");
    Module["_FPDF_GetMetaText"] = makeInvalidEarlyAccess("_FPDF_GetMetaText");
    Module["_FPDF_GetPageLabel"] = makeInvalidEarlyAccess("_FPDF_GetPageLabel");
    Module["_FPDFPageObj_NewImageObj"] = makeInvalidEarlyAccess("_FPDFPageObj_NewImageObj");
    Module["_FPDFImageObj_LoadJpegFile"] = makeInvalidEarlyAccess("_FPDFImageObj_LoadJpegFile");
    Module["_FPDFImageObj_LoadJpegFileInline"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_LoadJpegFileInline"
    );
    Module["_FPDFImageObj_SetMatrix"] = makeInvalidEarlyAccess("_FPDFImageObj_SetMatrix");
    Module["_FPDFImageObj_SetBitmap"] = makeInvalidEarlyAccess("_FPDFImageObj_SetBitmap");
    Module["_FPDFImageObj_GetBitmap"] = makeInvalidEarlyAccess("_FPDFImageObj_GetBitmap");
    Module["_FPDFImageObj_GetRenderedBitmap"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetRenderedBitmap"
    );
    Module["_FPDFImageObj_GetImageDataDecoded"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetImageDataDecoded"
    );
    Module["_FPDFImageObj_GetImageDataRaw"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetImageDataRaw"
    );
    Module["_FPDFImageObj_GetImageFilterCount"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetImageFilterCount"
    );
    Module["_FPDFImageObj_GetImageFilter"] = makeInvalidEarlyAccess("_FPDFImageObj_GetImageFilter");
    Module["_FPDFImageObj_GetImageMetadata"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetImageMetadata"
    );
    Module["_FPDFImageObj_GetImagePixelSize"] = makeInvalidEarlyAccess(
      "_FPDFImageObj_GetImagePixelSize"
    );
    Module["_FPDFImageObj_GetIccProfileDataDecoded"] = makeInvalidEarlyAccess("_FPDFImageObj_GetIccProfileDataDecoded");
    Module["_FPDF_CreateNewDocument"] = makeInvalidEarlyAccess("_FPDF_CreateNewDocument");
    Module["_FPDFPage_Delete"] = makeInvalidEarlyAccess("_FPDFPage_Delete");
    Module["_FPDF_MovePages"] = makeInvalidEarlyAccess("_FPDF_MovePages");
    Module["_FPDFPage_New"] = makeInvalidEarlyAccess("_FPDFPage_New");
    Module["_FPDFPage_GetRotation"] = makeInvalidEarlyAccess("_FPDFPage_GetRotation");
    Module["_FPDFPage_InsertObject"] = makeInvalidEarlyAccess("_FPDFPage_InsertObject");
    Module["_FPDFPage_InsertObjectAtIndex"] = makeInvalidEarlyAccess(
      "_FPDFPage_InsertObjectAtIndex"
    );
    Module["_FPDFPage_RemoveObject"] = makeInvalidEarlyAccess("_FPDFPage_RemoveObject");
    Module["_FPDFPage_CountObjects"] = makeInvalidEarlyAccess("_FPDFPage_CountObjects");
    Module["_FPDFPage_GetObject"] = makeInvalidEarlyAccess("_FPDFPage_GetObject");
    Module["_FPDFPage_HasTransparency"] = makeInvalidEarlyAccess("_FPDFPage_HasTransparency");
    Module["_FPDFPageObj_Destroy"] = makeInvalidEarlyAccess("_FPDFPageObj_Destroy");
    Module["_FPDFPageObj_GetMarkedContentID"] = makeInvalidEarlyAccess(
      "_FPDFPageObj_GetMarkedContentID"
    );
    Module["_FPDFPageObj_CountMarks"] = makeInvalidEarlyAccess("_FPDFPageObj_CountMarks");
    Module["_FPDFPageObj_GetMark"] = makeInvalidEarlyAccess("_FPDFPageObj_GetMark");
    Module["_FPDFPageObj_AddMark"] = makeInvalidEarlyAccess("_FPDFPageObj_AddMark");
    Module["_FPDFPageObj_RemoveMark"] = makeInvalidEarlyAccess("_FPDFPageObj_RemoveMark");
    Module["_FPDFPageObjMark_GetName"] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetName");
    Module["_FPDFPageObjMark_CountParams"] = makeInvalidEarlyAccess("_FPDFPageObjMark_CountParams");
    Module["_FPDFPageObjMark_GetParamKey"] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamKey");
    Module["_FPDFPageObjMark_GetParamValueType"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_GetParamValueType"
    );
    Module["_FPDFPageObjMark_GetParamIntValue"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_GetParamIntValue"
    );
    Module["_FPDFPageObjMark_GetParamStringValue"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_GetParamStringValue"
    );
    Module["_FPDFPageObjMark_GetParamBlobValue"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_GetParamBlobValue"
    );
    Module["_FPDFPageObj_HasTransparency"] = makeInvalidEarlyAccess("_FPDFPageObj_HasTransparency");
    Module["_FPDFPageObjMark_SetIntParam"] = makeInvalidEarlyAccess("_FPDFPageObjMark_SetIntParam");
    Module["_FPDFPageObjMark_SetStringParam"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_SetStringParam"
    );
    Module["_FPDFPageObjMark_SetBlobParam"] = makeInvalidEarlyAccess(
      "_FPDFPageObjMark_SetBlobParam"
    );
    Module["_FPDFPageObjMark_RemoveParam"] = makeInvalidEarlyAccess("_FPDFPageObjMark_RemoveParam");
    Module["_FPDFPageObj_GetType"] = makeInvalidEarlyAccess("_FPDFPageObj_GetType");
    Module["_FPDFPageObj_GetIsActive"] = makeInvalidEarlyAccess("_FPDFPageObj_GetIsActive");
    Module["_FPDFPageObj_SetIsActive"] = makeInvalidEarlyAccess("_FPDFPageObj_SetIsActive");
    Module["_FPDFPage_GenerateContent"] = makeInvalidEarlyAccess("_FPDFPage_GenerateContent");
    Module["_FPDFPageObj_Transform"] = makeInvalidEarlyAccess("_FPDFPageObj_Transform");
    Module["_FPDFPageObj_TransformF"] = makeInvalidEarlyAccess("_FPDFPageObj_TransformF");
    Module["_FPDFPageObj_GetMatrix"] = makeInvalidEarlyAccess("_FPDFPageObj_GetMatrix");
    Module["_FPDFPageObj_SetMatrix"] = makeInvalidEarlyAccess("_FPDFPageObj_SetMatrix");
    Module["_FPDFPageObj_SetBlendMode"] = makeInvalidEarlyAccess("_FPDFPageObj_SetBlendMode");
    Module["_FPDFPage_TransformAnnots"] = makeInvalidEarlyAccess("_FPDFPage_TransformAnnots");
    Module["_FPDFPage_SetRotation"] = makeInvalidEarlyAccess("_FPDFPage_SetRotation");
    Module["_FPDFPageObj_SetFillColor"] = makeInvalidEarlyAccess("_FPDFPageObj_SetFillColor");
    Module["_FPDFPageObj_GetFillColor"] = makeInvalidEarlyAccess("_FPDFPageObj_GetFillColor");
    Module["_FPDFPageObj_GetBounds"] = makeInvalidEarlyAccess("_FPDFPageObj_GetBounds");
    Module["_FPDFPageObj_GetRotatedBounds"] = makeInvalidEarlyAccess(
      "_FPDFPageObj_GetRotatedBounds"
    );
    Module["_FPDFPageObj_SetStrokeColor"] = makeInvalidEarlyAccess("_FPDFPageObj_SetStrokeColor");
    Module["_FPDFPageObj_GetStrokeColor"] = makeInvalidEarlyAccess("_FPDFPageObj_GetStrokeColor");
    Module["_FPDFPageObj_SetStrokeWidth"] = makeInvalidEarlyAccess("_FPDFPageObj_SetStrokeWidth");
    Module["_FPDFPageObj_GetStrokeWidth"] = makeInvalidEarlyAccess("_FPDFPageObj_GetStrokeWidth");
    Module["_FPDFPageObj_GetLineJoin"] = makeInvalidEarlyAccess("_FPDFPageObj_GetLineJoin");
    Module["_FPDFPageObj_SetLineJoin"] = makeInvalidEarlyAccess("_FPDFPageObj_SetLineJoin");
    Module["_FPDFPageObj_GetLineCap"] = makeInvalidEarlyAccess("_FPDFPageObj_GetLineCap");
    Module["_FPDFPageObj_SetLineCap"] = makeInvalidEarlyAccess("_FPDFPageObj_SetLineCap");
    Module["_FPDFPageObj_GetDashPhase"] = makeInvalidEarlyAccess("_FPDFPageObj_GetDashPhase");
    Module["_FPDFPageObj_SetDashPhase"] = makeInvalidEarlyAccess("_FPDFPageObj_SetDashPhase");
    Module["_FPDFPageObj_GetDashCount"] = makeInvalidEarlyAccess("_FPDFPageObj_GetDashCount");
    Module["_FPDFPageObj_GetDashArray"] = makeInvalidEarlyAccess("_FPDFPageObj_GetDashArray");
    Module["_FPDFPageObj_SetDashArray"] = makeInvalidEarlyAccess("_FPDFPageObj_SetDashArray");
    Module["_FPDFFormObj_CountObjects"] = makeInvalidEarlyAccess("_FPDFFormObj_CountObjects");
    Module["_FPDFFormObj_GetObject"] = makeInvalidEarlyAccess("_FPDFFormObj_GetObject");
    Module["_FPDFFormObj_RemoveObject"] = makeInvalidEarlyAccess("_FPDFFormObj_RemoveObject");
    Module["_FPDFPageObj_CreateNewPath"] = makeInvalidEarlyAccess("_FPDFPageObj_CreateNewPath");
    Module["_FPDFPageObj_CreateNewRect"] = makeInvalidEarlyAccess("_FPDFPageObj_CreateNewRect");
    Module["_FPDFPath_CountSegments"] = makeInvalidEarlyAccess("_FPDFPath_CountSegments");
    Module["_FPDFPath_GetPathSegment"] = makeInvalidEarlyAccess("_FPDFPath_GetPathSegment");
    Module["_FPDFPath_MoveTo"] = makeInvalidEarlyAccess("_FPDFPath_MoveTo");
    Module["_FPDFPath_LineTo"] = makeInvalidEarlyAccess("_FPDFPath_LineTo");
    Module["_FPDFPath_BezierTo"] = makeInvalidEarlyAccess("_FPDFPath_BezierTo");
    Module["_FPDFPath_Close"] = makeInvalidEarlyAccess("_FPDFPath_Close");
    Module["_FPDFPath_SetDrawMode"] = makeInvalidEarlyAccess("_FPDFPath_SetDrawMode");
    Module["_FPDFPath_GetDrawMode"] = makeInvalidEarlyAccess("_FPDFPath_GetDrawMode");
    Module["_FPDFPathSegment_GetPoint"] = makeInvalidEarlyAccess("_FPDFPathSegment_GetPoint");
    Module["_FPDFPathSegment_GetType"] = makeInvalidEarlyAccess("_FPDFPathSegment_GetType");
    Module["_FPDFPathSegment_GetClose"] = makeInvalidEarlyAccess("_FPDFPathSegment_GetClose");
    Module["_FPDFPageObj_NewTextObj"] = makeInvalidEarlyAccess("_FPDFPageObj_NewTextObj");
    Module["_FPDFText_SetText"] = makeInvalidEarlyAccess("_FPDFText_SetText");
    Module["_FPDFText_SetCharcodes"] = makeInvalidEarlyAccess("_FPDFText_SetCharcodes");
    Module["_FPDFText_LoadFont"] = makeInvalidEarlyAccess("_FPDFText_LoadFont");
    Module["_FPDFText_LoadStandardFont"] = makeInvalidEarlyAccess("_FPDFText_LoadStandardFont");
    Module["_FPDFText_LoadCidType2Font"] = makeInvalidEarlyAccess("_FPDFText_LoadCidType2Font");
    Module["_FPDFTextObj_GetFontSize"] = makeInvalidEarlyAccess("_FPDFTextObj_GetFontSize");
    Module["_FPDFTextObj_GetText"] = makeInvalidEarlyAccess("_FPDFTextObj_GetText");
    Module["_FPDFTextObj_GetRenderedBitmap"] = makeInvalidEarlyAccess(
      "_FPDFTextObj_GetRenderedBitmap"
    );
    Module["_FPDFFont_Close"] = makeInvalidEarlyAccess("_FPDFFont_Close");
    Module["_FPDFPageObj_CreateTextObj"] = makeInvalidEarlyAccess("_FPDFPageObj_CreateTextObj");
    Module["_FPDFTextObj_GetTextRenderMode"] = makeInvalidEarlyAccess(
      "_FPDFTextObj_GetTextRenderMode"
    );
    Module["_FPDFTextObj_SetTextRenderMode"] = makeInvalidEarlyAccess(
      "_FPDFTextObj_SetTextRenderMode"
    );
    Module["_FPDFTextObj_GetFont"] = makeInvalidEarlyAccess("_FPDFTextObj_GetFont");
    Module["_FPDFFont_GetBaseFontName"] = makeInvalidEarlyAccess("_FPDFFont_GetBaseFontName");
    Module["_FPDFFont_GetFamilyName"] = makeInvalidEarlyAccess("_FPDFFont_GetFamilyName");
    Module["_FPDFFont_GetFontData"] = makeInvalidEarlyAccess("_FPDFFont_GetFontData");
    Module["_FPDFFont_GetIsEmbedded"] = makeInvalidEarlyAccess("_FPDFFont_GetIsEmbedded");
    Module["_FPDFFont_GetFlags"] = makeInvalidEarlyAccess("_FPDFFont_GetFlags");
    Module["_FPDFFont_GetWeight"] = makeInvalidEarlyAccess("_FPDFFont_GetWeight");
    Module["_FPDFFont_GetItalicAngle"] = makeInvalidEarlyAccess("_FPDFFont_GetItalicAngle");
    Module["_FPDFFont_GetAscent"] = makeInvalidEarlyAccess("_FPDFFont_GetAscent");
    Module["_FPDFFont_GetDescent"] = makeInvalidEarlyAccess("_FPDFFont_GetDescent");
    Module["_FPDFFont_GetGlyphWidth"] = makeInvalidEarlyAccess("_FPDFFont_GetGlyphWidth");
    Module["_FPDFFont_GetGlyphPath"] = makeInvalidEarlyAccess("_FPDFFont_GetGlyphPath");
    Module["_FPDFGlyphPath_CountGlyphSegments"] = makeInvalidEarlyAccess(
      "_FPDFGlyphPath_CountGlyphSegments"
    );
    Module["_FPDFGlyphPath_GetGlyphPathSegment"] = makeInvalidEarlyAccess(
      "_FPDFGlyphPath_GetGlyphPathSegment"
    );
    Module["_FSDK_SetUnSpObjProcessHandler"] = makeInvalidEarlyAccess(
      "_FSDK_SetUnSpObjProcessHandler"
    );
    Module["_FSDK_SetTimeFunction"] = makeInvalidEarlyAccess("_FSDK_SetTimeFunction");
    Module["_FSDK_SetLocaltimeFunction"] = makeInvalidEarlyAccess("_FSDK_SetLocaltimeFunction");
    Module["_FPDFDoc_GetPageMode"] = makeInvalidEarlyAccess("_FPDFDoc_GetPageMode");
    Module["_FPDFPage_Flatten"] = makeInvalidEarlyAccess("_FPDFPage_Flatten");
    Module["_FPDFPage_HasFormFieldAtPoint"] = makeInvalidEarlyAccess(
      "_FPDFPage_HasFormFieldAtPoint"
    );
    Module["_FPDFPage_FormFieldZOrderAtPoint"] = makeInvalidEarlyAccess(
      "_FPDFPage_FormFieldZOrderAtPoint"
    );
    Module["_FPDFDOC_InitFormFillEnvironment"] = makeInvalidEarlyAccess(
      "_FPDFDOC_InitFormFillEnvironment"
    );
    Module["_FPDFDOC_ExitFormFillEnvironment"] = makeInvalidEarlyAccess(
      "_FPDFDOC_ExitFormFillEnvironment"
    );
    Module["_FORM_OnMouseMove"] = makeInvalidEarlyAccess("_FORM_OnMouseMove");
    Module["_FORM_OnMouseWheel"] = makeInvalidEarlyAccess("_FORM_OnMouseWheel");
    Module["_FORM_OnFocus"] = makeInvalidEarlyAccess("_FORM_OnFocus");
    Module["_FORM_OnLButtonDown"] = makeInvalidEarlyAccess("_FORM_OnLButtonDown");
    Module["_FORM_OnLButtonUp"] = makeInvalidEarlyAccess("_FORM_OnLButtonUp");
    Module["_FORM_OnLButtonDoubleClick"] = makeInvalidEarlyAccess("_FORM_OnLButtonDoubleClick");
    Module["_FORM_OnRButtonDown"] = makeInvalidEarlyAccess("_FORM_OnRButtonDown");
    Module["_FORM_OnRButtonUp"] = makeInvalidEarlyAccess("_FORM_OnRButtonUp");
    Module["_FORM_OnKeyDown"] = makeInvalidEarlyAccess("_FORM_OnKeyDown");
    Module["_FORM_OnKeyUp"] = makeInvalidEarlyAccess("_FORM_OnKeyUp");
    Module["_FORM_OnChar"] = makeInvalidEarlyAccess("_FORM_OnChar");
    Module["_FORM_GetFocusedText"] = makeInvalidEarlyAccess("_FORM_GetFocusedText");
    Module["_FORM_GetSelectedText"] = makeInvalidEarlyAccess("_FORM_GetSelectedText");
    Module["_FORM_ReplaceAndKeepSelection"] = makeInvalidEarlyAccess(
      "_FORM_ReplaceAndKeepSelection"
    );
    Module["_FORM_ReplaceSelection"] = makeInvalidEarlyAccess("_FORM_ReplaceSelection");
    Module["_FORM_SelectAllText"] = makeInvalidEarlyAccess("_FORM_SelectAllText");
    Module["_FORM_CanUndo"] = makeInvalidEarlyAccess("_FORM_CanUndo");
    Module["_FORM_CanRedo"] = makeInvalidEarlyAccess("_FORM_CanRedo");
    Module["_FORM_Undo"] = makeInvalidEarlyAccess("_FORM_Undo");
    Module["_FORM_Redo"] = makeInvalidEarlyAccess("_FORM_Redo");
    Module["_FORM_ForceToKillFocus"] = makeInvalidEarlyAccess("_FORM_ForceToKillFocus");
    Module["_FORM_GetFocusedAnnot"] = makeInvalidEarlyAccess("_FORM_GetFocusedAnnot");
    Module["_FORM_SetFocusedAnnot"] = makeInvalidEarlyAccess("_FORM_SetFocusedAnnot");
    Module["_FPDF_FFLDraw"] = makeInvalidEarlyAccess("_FPDF_FFLDraw");
    Module["_FPDF_SetFormFieldHighlightColor"] = makeInvalidEarlyAccess(
      "_FPDF_SetFormFieldHighlightColor"
    );
    Module["_FPDF_SetFormFieldHighlightAlpha"] = makeInvalidEarlyAccess(
      "_FPDF_SetFormFieldHighlightAlpha"
    );
    Module["_FPDF_RemoveFormFieldHighlight"] = makeInvalidEarlyAccess(
      "_FPDF_RemoveFormFieldHighlight"
    );
    Module["_FORM_OnAfterLoadPage"] = makeInvalidEarlyAccess("_FORM_OnAfterLoadPage");
    Module["_FORM_OnBeforeClosePage"] = makeInvalidEarlyAccess("_FORM_OnBeforeClosePage");
    Module["_FORM_DoDocumentJSAction"] = makeInvalidEarlyAccess("_FORM_DoDocumentJSAction");
    Module["_FORM_DoDocumentOpenAction"] = makeInvalidEarlyAccess("_FORM_DoDocumentOpenAction");
    Module["_FORM_DoDocumentAAction"] = makeInvalidEarlyAccess("_FORM_DoDocumentAAction");
    Module["_FORM_DoPageAAction"] = makeInvalidEarlyAccess("_FORM_DoPageAAction");
    Module["_FORM_SetIndexSelected"] = makeInvalidEarlyAccess("_FORM_SetIndexSelected");
    Module["_FORM_IsIndexSelected"] = makeInvalidEarlyAccess("_FORM_IsIndexSelected");
    Module["_FPDFDoc_GetJavaScriptActionCount"] = makeInvalidEarlyAccess(
      "_FPDFDoc_GetJavaScriptActionCount"
    );
    Module["_FPDFDoc_GetJavaScriptAction"] = makeInvalidEarlyAccess("_FPDFDoc_GetJavaScriptAction");
    Module["_FPDFDoc_CloseJavaScriptAction"] = makeInvalidEarlyAccess(
      "_FPDFDoc_CloseJavaScriptAction"
    );
    Module["_FPDFJavaScriptAction_GetName"] = makeInvalidEarlyAccess(
      "_FPDFJavaScriptAction_GetName"
    );
    Module["_FPDFJavaScriptAction_GetScript"] = makeInvalidEarlyAccess(
      "_FPDFJavaScriptAction_GetScript"
    );
    Module["_FPDF_ImportPagesByIndex"] = makeInvalidEarlyAccess("_FPDF_ImportPagesByIndex");
    Module["_FPDF_ImportPages"] = makeInvalidEarlyAccess("_FPDF_ImportPages");
    Module["_FPDF_ImportNPagesToOne"] = makeInvalidEarlyAccess("_FPDF_ImportNPagesToOne");
    Module["_FPDF_NewXObjectFromPage"] = makeInvalidEarlyAccess("_FPDF_NewXObjectFromPage");
    Module["_FPDF_CloseXObject"] = makeInvalidEarlyAccess("_FPDF_CloseXObject");
    Module["_FPDF_NewFormObjectFromXObject"] = makeInvalidEarlyAccess(
      "_FPDF_NewFormObjectFromXObject"
    );
    Module["_FPDF_CopyViewerPreferences"] = makeInvalidEarlyAccess("_FPDF_CopyViewerPreferences");
    Module["_FPDF_RenderPageBitmapWithColorScheme_Start"] = makeInvalidEarlyAccess("_FPDF_RenderPageBitmapWithColorScheme_Start");
    Module["_FPDF_RenderPageBitmap_Start"] = makeInvalidEarlyAccess("_FPDF_RenderPageBitmap_Start");
    Module["_FPDF_RenderPage_Continue"] = makeInvalidEarlyAccess("_FPDF_RenderPage_Continue");
    Module["_FPDF_RenderPage_Close"] = makeInvalidEarlyAccess("_FPDF_RenderPage_Close");
    Module["_FPDF_SaveAsCopy"] = makeInvalidEarlyAccess("_FPDF_SaveAsCopy");
    Module["_FPDF_SaveWithVersion"] = makeInvalidEarlyAccess("_FPDF_SaveWithVersion");
    Module["_FPDFText_GetCharIndexFromTextIndex"] = makeInvalidEarlyAccess(
      "_FPDFText_GetCharIndexFromTextIndex"
    );
    Module["_FPDFText_GetTextIndexFromCharIndex"] = makeInvalidEarlyAccess(
      "_FPDFText_GetTextIndexFromCharIndex"
    );
    Module["_FPDF_GetSignatureCount"] = makeInvalidEarlyAccess("_FPDF_GetSignatureCount");
    Module["_FPDF_GetSignatureObject"] = makeInvalidEarlyAccess("_FPDF_GetSignatureObject");
    Module["_FPDFSignatureObj_GetContents"] = makeInvalidEarlyAccess(
      "_FPDFSignatureObj_GetContents"
    );
    Module["_FPDFSignatureObj_GetByteRange"] = makeInvalidEarlyAccess(
      "_FPDFSignatureObj_GetByteRange"
    );
    Module["_FPDFSignatureObj_GetSubFilter"] = makeInvalidEarlyAccess(
      "_FPDFSignatureObj_GetSubFilter"
    );
    Module["_FPDFSignatureObj_GetReason"] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetReason");
    Module["_FPDFSignatureObj_GetTime"] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetTime");
    Module["_FPDFSignatureObj_GetDocMDPPermission"] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetDocMDPPermission");
    Module["_FPDF_StructTree_GetForPage"] = makeInvalidEarlyAccess("_FPDF_StructTree_GetForPage");
    Module["_FPDF_StructTree_Close"] = makeInvalidEarlyAccess("_FPDF_StructTree_Close");
    Module["_FPDF_StructTree_CountChildren"] = makeInvalidEarlyAccess(
      "_FPDF_StructTree_CountChildren"
    );
    Module["_FPDF_StructTree_GetChildAtIndex"] = makeInvalidEarlyAccess(
      "_FPDF_StructTree_GetChildAtIndex"
    );
    Module["_FPDF_StructElement_GetAltText"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetAltText"
    );
    Module["_FPDF_StructElement_GetActualText"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetActualText"
    );
    Module["_FPDF_StructElement_GetID"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetID");
    Module["_FPDF_StructElement_GetLang"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetLang");
    Module["_FPDF_StructElement_GetAttributeCount"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetAttributeCount");
    Module["_FPDF_StructElement_GetAttributeAtIndex"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetAttributeAtIndex");
    Module["_FPDF_StructElement_GetStringAttribute"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetStringAttribute");
    Module["_FPDF_StructElement_GetMarkedContentID"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetMarkedContentID");
    Module["_FPDF_StructElement_GetType"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetType");
    Module["_FPDF_StructElement_GetObjType"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetObjType"
    );
    Module["_FPDF_StructElement_GetTitle"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetTitle");
    Module["_FPDF_StructElement_CountChildren"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_CountChildren"
    );
    Module["_FPDF_StructElement_GetChildAtIndex"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetChildAtIndex"
    );
    Module["_FPDF_StructElement_GetChildMarkedContentID"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetChildMarkedContentID");
    Module["_FPDF_StructElement_GetParent"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetParent"
    );
    Module["_FPDF_StructElement_Attr_GetCount"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_Attr_GetCount"
    );
    Module["_FPDF_StructElement_Attr_GetName"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_Attr_GetName"
    );
    Module["_FPDF_StructElement_Attr_GetValue"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_Attr_GetValue"
    );
    Module["_FPDF_StructElement_Attr_GetType"] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_Attr_GetType"
    );
    Module["_FPDF_StructElement_Attr_GetBooleanValue"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetBooleanValue");
    Module["_FPDF_StructElement_Attr_GetNumberValue"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetNumberValue");
    Module["_FPDF_StructElement_Attr_GetStringValue"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetStringValue");
    Module["_FPDF_StructElement_Attr_GetBlobValue"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetBlobValue");
    Module["_FPDF_StructElement_Attr_CountChildren"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_CountChildren");
    Module["_FPDF_StructElement_Attr_GetChildAtIndex"] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetChildAtIndex");
    Module["_FPDF_StructElement_GetMarkedContentIdCount"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetMarkedContentIdCount");
    Module["_FPDF_StructElement_GetMarkedContentIdAtIndex"] = makeInvalidEarlyAccess("_FPDF_StructElement_GetMarkedContentIdAtIndex");
    Module["_FPDF_AddInstalledFont"] = makeInvalidEarlyAccess("_FPDF_AddInstalledFont");
    Module["_FPDF_SetSystemFontInfo"] = makeInvalidEarlyAccess("_FPDF_SetSystemFontInfo");
    Module["_FPDF_GetDefaultTTFMap"] = makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMap");
    Module["_FPDF_GetDefaultTTFMapCount"] = makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMapCount");
    Module["_FPDF_GetDefaultTTFMapEntry"] = makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMapEntry");
    Module["_FPDF_GetDefaultSystemFontInfo"] = makeInvalidEarlyAccess(
      "_FPDF_GetDefaultSystemFontInfo"
    );
    Module["_FPDF_FreeDefaultSystemFontInfo"] = makeInvalidEarlyAccess(
      "_FPDF_FreeDefaultSystemFontInfo"
    );
    Module["_FPDFText_LoadPage"] = makeInvalidEarlyAccess("_FPDFText_LoadPage");
    Module["_FPDFText_ClosePage"] = makeInvalidEarlyAccess("_FPDFText_ClosePage");
    Module["_FPDFText_CountChars"] = makeInvalidEarlyAccess("_FPDFText_CountChars");
    Module["_FPDFText_GetUnicode"] = makeInvalidEarlyAccess("_FPDFText_GetUnicode");
    Module["_FPDFText_GetTextObject"] = makeInvalidEarlyAccess("_FPDFText_GetTextObject");
    Module["_FPDFText_IsGenerated"] = makeInvalidEarlyAccess("_FPDFText_IsGenerated");
    Module["_FPDFText_IsHyphen"] = makeInvalidEarlyAccess("_FPDFText_IsHyphen");
    Module["_FPDFText_HasUnicodeMapError"] = makeInvalidEarlyAccess("_FPDFText_HasUnicodeMapError");
    Module["_FPDFText_GetFontSize"] = makeInvalidEarlyAccess("_FPDFText_GetFontSize");
    Module["_FPDFText_GetFontInfo"] = makeInvalidEarlyAccess("_FPDFText_GetFontInfo");
    Module["_FPDFText_GetFontWeight"] = makeInvalidEarlyAccess("_FPDFText_GetFontWeight");
    Module["_FPDFText_GetFillColor"] = makeInvalidEarlyAccess("_FPDFText_GetFillColor");
    Module["_FPDFText_GetStrokeColor"] = makeInvalidEarlyAccess("_FPDFText_GetStrokeColor");
    Module["_FPDFText_GetCharAngle"] = makeInvalidEarlyAccess("_FPDFText_GetCharAngle");
    Module["_FPDFText_GetCharBox"] = makeInvalidEarlyAccess("_FPDFText_GetCharBox");
    Module["_FPDFText_GetLooseCharBox"] = makeInvalidEarlyAccess("_FPDFText_GetLooseCharBox");
    Module["_FPDFText_GetMatrix"] = makeInvalidEarlyAccess("_FPDFText_GetMatrix");
    Module["_FPDFText_GetCharOrigin"] = makeInvalidEarlyAccess("_FPDFText_GetCharOrigin");
    Module["_FPDFText_GetCharIndexAtPos"] = makeInvalidEarlyAccess("_FPDFText_GetCharIndexAtPos");
    Module["_FPDFText_GetText"] = makeInvalidEarlyAccess("_FPDFText_GetText");
    Module["_FPDFText_CountRects"] = makeInvalidEarlyAccess("_FPDFText_CountRects");
    Module["_FPDFText_GetRect"] = makeInvalidEarlyAccess("_FPDFText_GetRect");
    Module["_FPDFText_GetBoundedText"] = makeInvalidEarlyAccess("_FPDFText_GetBoundedText");
    Module["_FPDFText_FindStart"] = makeInvalidEarlyAccess("_FPDFText_FindStart");
    Module["_FPDFText_FindNext"] = makeInvalidEarlyAccess("_FPDFText_FindNext");
    Module["_FPDFText_FindPrev"] = makeInvalidEarlyAccess("_FPDFText_FindPrev");
    Module["_FPDFText_GetSchResultIndex"] = makeInvalidEarlyAccess("_FPDFText_GetSchResultIndex");
    Module["_FPDFText_GetSchCount"] = makeInvalidEarlyAccess("_FPDFText_GetSchCount");
    Module["_FPDFText_FindClose"] = makeInvalidEarlyAccess("_FPDFText_FindClose");
    Module["_FPDFLink_LoadWebLinks"] = makeInvalidEarlyAccess("_FPDFLink_LoadWebLinks");
    Module["_FPDFLink_CountWebLinks"] = makeInvalidEarlyAccess("_FPDFLink_CountWebLinks");
    Module["_FPDFLink_GetURL"] = makeInvalidEarlyAccess("_FPDFLink_GetURL");
    Module["_FPDFLink_CountRects"] = makeInvalidEarlyAccess("_FPDFLink_CountRects");
    Module["_FPDFLink_GetRect"] = makeInvalidEarlyAccess("_FPDFLink_GetRect");
    Module["_FPDFLink_GetTextRange"] = makeInvalidEarlyAccess("_FPDFLink_GetTextRange");
    Module["_FPDFLink_CloseWebLinks"] = makeInvalidEarlyAccess("_FPDFLink_CloseWebLinks");
    Module["_FPDFPage_GetDecodedThumbnailData"] = makeInvalidEarlyAccess(
      "_FPDFPage_GetDecodedThumbnailData"
    );
    Module["_FPDFPage_GetRawThumbnailData"] = makeInvalidEarlyAccess(
      "_FPDFPage_GetRawThumbnailData"
    );
    Module["_FPDFPage_GetThumbnailAsBitmap"] = makeInvalidEarlyAccess(
      "_FPDFPage_GetThumbnailAsBitmap"
    );
    Module["_FPDFPage_SetMediaBox"] = makeInvalidEarlyAccess("_FPDFPage_SetMediaBox");
    Module["_FPDFPage_SetCropBox"] = makeInvalidEarlyAccess("_FPDFPage_SetCropBox");
    Module["_FPDFPage_SetBleedBox"] = makeInvalidEarlyAccess("_FPDFPage_SetBleedBox");
    Module["_FPDFPage_SetTrimBox"] = makeInvalidEarlyAccess("_FPDFPage_SetTrimBox");
    Module["_FPDFPage_SetArtBox"] = makeInvalidEarlyAccess("_FPDFPage_SetArtBox");
    Module["_FPDFPage_GetMediaBox"] = makeInvalidEarlyAccess("_FPDFPage_GetMediaBox");
    Module["_FPDFPage_GetCropBox"] = makeInvalidEarlyAccess("_FPDFPage_GetCropBox");
    Module["_FPDFPage_GetBleedBox"] = makeInvalidEarlyAccess("_FPDFPage_GetBleedBox");
    Module["_FPDFPage_GetTrimBox"] = makeInvalidEarlyAccess("_FPDFPage_GetTrimBox");
    Module["_FPDFPage_GetArtBox"] = makeInvalidEarlyAccess("_FPDFPage_GetArtBox");
    Module["_FPDFPage_TransFormWithClip"] = makeInvalidEarlyAccess("_FPDFPage_TransFormWithClip");
    Module["_FPDFPageObj_TransformClipPath"] = makeInvalidEarlyAccess(
      "_FPDFPageObj_TransformClipPath"
    );
    Module["_FPDFPageObj_GetClipPath"] = makeInvalidEarlyAccess("_FPDFPageObj_GetClipPath");
    Module["_FPDFClipPath_CountPaths"] = makeInvalidEarlyAccess("_FPDFClipPath_CountPaths");
    Module["_FPDFClipPath_CountPathSegments"] = makeInvalidEarlyAccess(
      "_FPDFClipPath_CountPathSegments"
    );
    Module["_FPDFClipPath_GetPathSegment"] = makeInvalidEarlyAccess("_FPDFClipPath_GetPathSegment");
    Module["_FPDF_CreateClipPath"] = makeInvalidEarlyAccess("_FPDF_CreateClipPath");
    Module["_FPDF_DestroyClipPath"] = makeInvalidEarlyAccess("_FPDF_DestroyClipPath");
    Module["_FPDFPage_InsertClipPath"] = makeInvalidEarlyAccess("_FPDFPage_InsertClipPath");
    Module["_FPDF_InitLibrary"] = makeInvalidEarlyAccess("_FPDF_InitLibrary");
    Module["_malloc"] = makeInvalidEarlyAccess("_malloc");
    Module["_free"] = makeInvalidEarlyAccess("_free");
    Module["_FPDF_DestroyLibrary"] = makeInvalidEarlyAccess("_FPDF_DestroyLibrary");
    Module["_FPDF_SetSandBoxPolicy"] = makeInvalidEarlyAccess("_FPDF_SetSandBoxPolicy");
    Module["_FPDF_LoadDocument"] = makeInvalidEarlyAccess("_FPDF_LoadDocument");
    Module["_FPDF_GetFormType"] = makeInvalidEarlyAccess("_FPDF_GetFormType");
    Module["_FPDF_LoadXFA"] = makeInvalidEarlyAccess("_FPDF_LoadXFA");
    Module["_FPDF_LoadMemDocument"] = makeInvalidEarlyAccess("_FPDF_LoadMemDocument");
    Module["_FPDF_LoadMemDocument64"] = makeInvalidEarlyAccess("_FPDF_LoadMemDocument64");
    Module["_FPDF_LoadCustomDocument"] = makeInvalidEarlyAccess("_FPDF_LoadCustomDocument");
    Module["_FPDF_GetFileVersion"] = makeInvalidEarlyAccess("_FPDF_GetFileVersion");
    Module["_FPDF_DocumentHasValidCrossReferenceTable"] = makeInvalidEarlyAccess("_FPDF_DocumentHasValidCrossReferenceTable");
    Module["_FPDF_GetDocPermissions"] = makeInvalidEarlyAccess("_FPDF_GetDocPermissions");
    Module["_FPDF_GetDocUserPermissions"] = makeInvalidEarlyAccess("_FPDF_GetDocUserPermissions");
    Module["_FPDF_GetSecurityHandlerRevision"] = makeInvalidEarlyAccess(
      "_FPDF_GetSecurityHandlerRevision"
    );
    Module["_FPDF_GetPageCount"] = makeInvalidEarlyAccess("_FPDF_GetPageCount");
    Module["_FPDF_LoadPage"] = makeInvalidEarlyAccess("_FPDF_LoadPage");
    Module["_FPDF_GetPageWidthF"] = makeInvalidEarlyAccess("_FPDF_GetPageWidthF");
    Module["_FPDF_GetPageWidth"] = makeInvalidEarlyAccess("_FPDF_GetPageWidth");
    Module["_FPDF_GetPageHeightF"] = makeInvalidEarlyAccess("_FPDF_GetPageHeightF");
    Module["_FPDF_GetPageHeight"] = makeInvalidEarlyAccess("_FPDF_GetPageHeight");
    Module["_FPDF_GetPageBoundingBox"] = makeInvalidEarlyAccess("_FPDF_GetPageBoundingBox");
    Module["_FPDF_RenderPageBitmap"] = makeInvalidEarlyAccess("_FPDF_RenderPageBitmap");
    Module["_FPDF_RenderPageBitmapWithMatrix"] = makeInvalidEarlyAccess(
      "_FPDF_RenderPageBitmapWithMatrix"
    );
    Module["_FPDF_ClosePage"] = makeInvalidEarlyAccess("_FPDF_ClosePage");
    Module["_FPDF_CloseDocument"] = makeInvalidEarlyAccess("_FPDF_CloseDocument");
    Module["_FPDF_GetLastError"] = makeInvalidEarlyAccess("_FPDF_GetLastError");
    Module["_FPDF_DeviceToPage"] = makeInvalidEarlyAccess("_FPDF_DeviceToPage");
    Module["_FPDF_PageToDevice"] = makeInvalidEarlyAccess("_FPDF_PageToDevice");
    Module["_FPDFBitmap_Create"] = makeInvalidEarlyAccess("_FPDFBitmap_Create");
    Module["_FPDFBitmap_CreateEx"] = makeInvalidEarlyAccess("_FPDFBitmap_CreateEx");
    Module["_FPDFBitmap_GetFormat"] = makeInvalidEarlyAccess("_FPDFBitmap_GetFormat");
    Module["_FPDFBitmap_FillRect"] = makeInvalidEarlyAccess("_FPDFBitmap_FillRect");
    Module["_FPDFBitmap_GetBuffer"] = makeInvalidEarlyAccess("_FPDFBitmap_GetBuffer");
    Module["_FPDFBitmap_GetWidth"] = makeInvalidEarlyAccess("_FPDFBitmap_GetWidth");
    Module["_FPDFBitmap_GetHeight"] = makeInvalidEarlyAccess("_FPDFBitmap_GetHeight");
    Module["_FPDFBitmap_GetStride"] = makeInvalidEarlyAccess("_FPDFBitmap_GetStride");
    Module["_FPDFBitmap_Destroy"] = makeInvalidEarlyAccess("_FPDFBitmap_Destroy");
    Module["_FPDF_GetPageSizeByIndexF"] = makeInvalidEarlyAccess("_FPDF_GetPageSizeByIndexF");
    Module["_FPDF_GetPageSizeByIndex"] = makeInvalidEarlyAccess("_FPDF_GetPageSizeByIndex");
    Module["_FPDF_VIEWERREF_GetPrintScaling"] = makeInvalidEarlyAccess(
      "_FPDF_VIEWERREF_GetPrintScaling"
    );
    Module["_FPDF_VIEWERREF_GetNumCopies"] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetNumCopies");
    Module["_FPDF_VIEWERREF_GetPrintPageRange"] = makeInvalidEarlyAccess(
      "_FPDF_VIEWERREF_GetPrintPageRange"
    );
    Module["_FPDF_VIEWERREF_GetPrintPageRangeCount"] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintPageRangeCount");
    Module["_FPDF_VIEWERREF_GetPrintPageRangeElement"] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintPageRangeElement");
    Module["_FPDF_VIEWERREF_GetDuplex"] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetDuplex");
    Module["_FPDF_VIEWERREF_GetName"] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetName");
    Module["_FPDF_CountNamedDests"] = makeInvalidEarlyAccess("_FPDF_CountNamedDests");
    Module["_FPDF_GetNamedDestByName"] = makeInvalidEarlyAccess("_FPDF_GetNamedDestByName");
    Module["_FPDF_GetNamedDest"] = makeInvalidEarlyAccess("_FPDF_GetNamedDest");
    Module["_FPDF_GetXFAPacketCount"] = makeInvalidEarlyAccess("_FPDF_GetXFAPacketCount");
    Module["_FPDF_GetXFAPacketName"] = makeInvalidEarlyAccess("_FPDF_GetXFAPacketName");
    Module["_FPDF_GetXFAPacketContent"] = makeInvalidEarlyAccess("_FPDF_GetXFAPacketContent");
    Module["_FPDF_GetTrailerEnds"] = makeInvalidEarlyAccess("_FPDF_GetTrailerEnds");
    var _fflush = makeInvalidEarlyAccess("_fflush");
    var _emscripten_stack_get_end = makeInvalidEarlyAccess("_emscripten_stack_get_end");
    var _emscripten_builtin_memalign = makeInvalidEarlyAccess("_emscripten_builtin_memalign");
    var _strerror = makeInvalidEarlyAccess("_strerror");
    var _setThrew = makeInvalidEarlyAccess("_setThrew");
    var _emscripten_stack_init = makeInvalidEarlyAccess("_emscripten_stack_init");
    var __emscripten_stack_restore = makeInvalidEarlyAccess("__emscripten_stack_restore");
    var __emscripten_stack_alloc = makeInvalidEarlyAccess("__emscripten_stack_alloc");
    var _emscripten_stack_get_current = makeInvalidEarlyAccess("_emscripten_stack_get_current");
    function assignWasmExports(wasmExports2) {
      Module["_PDFium_Init"] = createExportWrapper("PDFium_Init", 0);
      Module["_FPDF_InitLibraryWithConfig"] = createExportWrapper(
        "FPDF_InitLibraryWithConfig",
        1
      );
      Module["_FPDFAnnot_IsSupportedSubtype"] = createExportWrapper(
        "FPDFAnnot_IsSupportedSubtype",
        1
      );
      Module["_FPDFPage_CreateAnnot"] = createExportWrapper("FPDFPage_CreateAnnot", 2);
      Module["_FPDFPage_GetAnnotCount"] = createExportWrapper("FPDFPage_GetAnnotCount", 1);
      Module["_FPDFPage_GetAnnot"] = createExportWrapper("FPDFPage_GetAnnot", 2);
      Module["_FPDFPage_GetAnnotIndex"] = createExportWrapper("FPDFPage_GetAnnotIndex", 2);
      Module["_FPDFPage_CloseAnnot"] = createExportWrapper("FPDFPage_CloseAnnot", 1);
      Module["_FPDFPage_RemoveAnnot"] = createExportWrapper("FPDFPage_RemoveAnnot", 2);
      Module["_FPDFAnnot_GetSubtype"] = createExportWrapper("FPDFAnnot_GetSubtype", 1);
      Module["_FPDFAnnot_IsObjectSupportedSubtype"] = createExportWrapper(
        "FPDFAnnot_IsObjectSupportedSubtype",
        1
      );
      Module["_FPDFAnnot_UpdateObject"] = createExportWrapper("FPDFAnnot_UpdateObject", 2);
      Module["_FPDFAnnot_AddInkStroke"] = createExportWrapper("FPDFAnnot_AddInkStroke", 3);
      Module["_FPDFAnnot_RemoveInkList"] = createExportWrapper("FPDFAnnot_RemoveInkList", 1);
      Module["_FPDFAnnot_AppendObject"] = createExportWrapper("FPDFAnnot_AppendObject", 2);
      Module["_FPDFAnnot_GetObjectCount"] = createExportWrapper(
        "FPDFAnnot_GetObjectCount",
        1
      );
      Module["_FPDFAnnot_GetObject"] = createExportWrapper("FPDFAnnot_GetObject", 2);
      Module["_FPDFAnnot_RemoveObject"] = createExportWrapper("FPDFAnnot_RemoveObject", 2);
      Module["_FPDFAnnot_SetColor"] = createExportWrapper("FPDFAnnot_SetColor", 6);
      Module["_FPDFAnnot_GetColor"] = createExportWrapper("FPDFAnnot_GetColor", 6);
      Module["_FPDFAnnot_HasAttachmentPoints"] = createExportWrapper(
        "FPDFAnnot_HasAttachmentPoints",
        1
      );
      Module["_FPDFAnnot_SetAttachmentPoints"] = createExportWrapper(
        "FPDFAnnot_SetAttachmentPoints",
        3
      );
      Module["_FPDFAnnot_AppendAttachmentPoints"] = createExportWrapper(
        "FPDFAnnot_AppendAttachmentPoints",
        2
      );
      Module["_FPDFAnnot_CountAttachmentPoints"] = createExportWrapper(
        "FPDFAnnot_CountAttachmentPoints",
        1
      );
      Module["_FPDFAnnot_GetAttachmentPoints"] = createExportWrapper(
        "FPDFAnnot_GetAttachmentPoints",
        3
      );
      Module["_FPDFAnnot_SetRect"] = createExportWrapper("FPDFAnnot_SetRect", 2);
      Module["_FPDFAnnot_GetRect"] = createExportWrapper("FPDFAnnot_GetRect", 2);
      Module["_FPDFAnnot_GetVertices"] = createExportWrapper("FPDFAnnot_GetVertices", 3);
      Module["_FPDFAnnot_GetInkListCount"] = createExportWrapper(
        "FPDFAnnot_GetInkListCount",
        1
      );
      Module["_FPDFAnnot_GetInkListPath"] = createExportWrapper(
        "FPDFAnnot_GetInkListPath",
        4
      );
      Module["_FPDFAnnot_GetLine"] = createExportWrapper("FPDFAnnot_GetLine", 3);
      Module["_FPDFAnnot_SetBorder"] = createExportWrapper("FPDFAnnot_SetBorder", 4);
      Module["_FPDFAnnot_GetBorder"] = createExportWrapper("FPDFAnnot_GetBorder", 4);
      Module["_FPDFAnnot_HasKey"] = createExportWrapper("FPDFAnnot_HasKey", 2);
      Module["_FPDFAnnot_GetValueType"] = createExportWrapper("FPDFAnnot_GetValueType", 2);
      Module["_FPDFAnnot_SetStringValue"] = createExportWrapper(
        "FPDFAnnot_SetStringValue",
        3
      );
      Module["_FPDFAnnot_GetStringValue"] = createExportWrapper(
        "FPDFAnnot_GetStringValue",
        4
      );
      Module["_FPDFAnnot_GetNumberValue"] = createExportWrapper(
        "FPDFAnnot_GetNumberValue",
        3
      );
      Module["_FPDFAnnot_SetAP"] = createExportWrapper("FPDFAnnot_SetAP", 3);
      Module["_FPDFAnnot_GetAP"] = createExportWrapper("FPDFAnnot_GetAP", 4);
      Module["_FPDFAnnot_GetLinkedAnnot"] = createExportWrapper(
        "FPDFAnnot_GetLinkedAnnot",
        2
      );
      Module["_FPDFAnnot_GetFlags"] = createExportWrapper("FPDFAnnot_GetFlags", 1);
      Module["_FPDFAnnot_SetFlags"] = createExportWrapper("FPDFAnnot_SetFlags", 2);
      Module["_FPDFAnnot_GetFormFieldFlags"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldFlags",
        2
      );
      Module["_FPDFAnnot_SetFormFieldFlags"] = createExportWrapper(
        "FPDFAnnot_SetFormFieldFlags",
        3
      );
      Module["_FPDFAnnot_GetFormFieldAtPoint"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldAtPoint",
        3
      );
      Module["_FPDFAnnot_GetFormFieldName"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldName",
        4
      );
      Module["_FPDFAnnot_GetFormFieldType"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldType",
        2
      );
      Module["_FPDFAnnot_GetFormAdditionalActionJavaScript"] = createExportWrapper("FPDFAnnot_GetFormAdditionalActionJavaScript", 5);
      Module["_FPDFAnnot_GetFormFieldAlternateName"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldAlternateName",
        4
      );
      Module["_FPDFAnnot_GetFormFieldValue"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldValue",
        4
      );
      Module["_FPDFAnnot_GetOptionCount"] = createExportWrapper(
        "FPDFAnnot_GetOptionCount",
        2
      );
      Module["_FPDFAnnot_GetOptionLabel"] = createExportWrapper(
        "FPDFAnnot_GetOptionLabel",
        5
      );
      Module["_FPDFAnnot_IsOptionSelected"] = createExportWrapper(
        "FPDFAnnot_IsOptionSelected",
        3
      );
      Module["_FPDFAnnot_GetFontSize"] = createExportWrapper("FPDFAnnot_GetFontSize", 3);
      Module["_FPDFAnnot_SetFontColor"] = createExportWrapper("FPDFAnnot_SetFontColor", 5);
      Module["_FPDFAnnot_GetFontColor"] = createExportWrapper("FPDFAnnot_GetFontColor", 5);
      Module["_FPDFAnnot_IsChecked"] = createExportWrapper("FPDFAnnot_IsChecked", 2);
      Module["_FPDFAnnot_SetFocusableSubtypes"] = createExportWrapper(
        "FPDFAnnot_SetFocusableSubtypes",
        3
      );
      Module["_FPDFAnnot_GetFocusableSubtypesCount"] = createExportWrapper(
        "FPDFAnnot_GetFocusableSubtypesCount",
        1
      );
      Module["_FPDFAnnot_GetFocusableSubtypes"] = createExportWrapper(
        "FPDFAnnot_GetFocusableSubtypes",
        3
      );
      Module["_FPDFAnnot_GetLink"] = createExportWrapper("FPDFAnnot_GetLink", 1);
      Module["_FPDFAnnot_GetFormControlCount"] = createExportWrapper(
        "FPDFAnnot_GetFormControlCount",
        2
      );
      Module["_FPDFAnnot_GetFormControlIndex"] = createExportWrapper(
        "FPDFAnnot_GetFormControlIndex",
        2
      );
      Module["_FPDFAnnot_GetFormFieldExportValue"] = createExportWrapper(
        "FPDFAnnot_GetFormFieldExportValue",
        4
      );
      Module["_FPDFAnnot_SetURI"] = createExportWrapper("FPDFAnnot_SetURI", 2);
      Module["_FPDFAnnot_GetFileAttachment"] = createExportWrapper(
        "FPDFAnnot_GetFileAttachment",
        1
      );
      Module["_FPDFAnnot_AddFileAttachment"] = createExportWrapper(
        "FPDFAnnot_AddFileAttachment",
        2
      );
      Module["_FPDFDoc_GetAttachmentCount"] = createExportWrapper(
        "FPDFDoc_GetAttachmentCount",
        1
      );
      Module["_FPDFDoc_AddAttachment"] = createExportWrapper("FPDFDoc_AddAttachment", 2);
      Module["_FPDFDoc_GetAttachment"] = createExportWrapper("FPDFDoc_GetAttachment", 2);
      Module["_FPDFDoc_DeleteAttachment"] = createExportWrapper(
        "FPDFDoc_DeleteAttachment",
        2
      );
      Module["_FPDFAttachment_GetName"] = createExportWrapper("FPDFAttachment_GetName", 3);
      Module["_FPDFAttachment_HasKey"] = createExportWrapper("FPDFAttachment_HasKey", 2);
      Module["_FPDFAttachment_GetValueType"] = createExportWrapper(
        "FPDFAttachment_GetValueType",
        2
      );
      Module["_FPDFAttachment_SetStringValue"] = createExportWrapper(
        "FPDFAttachment_SetStringValue",
        3
      );
      Module["_FPDFAttachment_GetStringValue"] = createExportWrapper(
        "FPDFAttachment_GetStringValue",
        4
      );
      Module["_FPDFAttachment_SetFile"] = createExportWrapper("FPDFAttachment_SetFile", 4);
      Module["_FPDFAttachment_GetFile"] = createExportWrapper("FPDFAttachment_GetFile", 4);
      Module["_FPDFAttachment_GetSubtype"] = createExportWrapper(
        "FPDFAttachment_GetSubtype",
        3
      );
      Module["_FPDFCatalog_IsTagged"] = createExportWrapper("FPDFCatalog_IsTagged", 1);
      Module["_FPDFCatalog_SetLanguage"] = createExportWrapper("FPDFCatalog_SetLanguage", 2);
      Module["_FPDFAvail_Create"] = createExportWrapper("FPDFAvail_Create", 2);
      Module["_FPDFAvail_Destroy"] = createExportWrapper("FPDFAvail_Destroy", 1);
      Module["_FPDFAvail_IsDocAvail"] = createExportWrapper("FPDFAvail_IsDocAvail", 2);
      Module["_FPDFAvail_GetDocument"] = createExportWrapper("FPDFAvail_GetDocument", 2);
      Module["_FPDFAvail_GetFirstPageNum"] = createExportWrapper(
        "FPDFAvail_GetFirstPageNum",
        1
      );
      Module["_FPDFAvail_IsPageAvail"] = createExportWrapper("FPDFAvail_IsPageAvail", 3);
      Module["_FPDFAvail_IsFormAvail"] = createExportWrapper("FPDFAvail_IsFormAvail", 2);
      Module["_FPDFAvail_IsLinearized"] = createExportWrapper("FPDFAvail_IsLinearized", 1);
      Module["_FPDFBookmark_GetFirstChild"] = createExportWrapper(
        "FPDFBookmark_GetFirstChild",
        2
      );
      Module["_FPDFBookmark_GetNextSibling"] = createExportWrapper(
        "FPDFBookmark_GetNextSibling",
        2
      );
      Module["_FPDFBookmark_GetTitle"] = createExportWrapper("FPDFBookmark_GetTitle", 3);
      Module["_FPDFBookmark_GetCount"] = createExportWrapper("FPDFBookmark_GetCount", 1);
      Module["_FPDFBookmark_Find"] = createExportWrapper("FPDFBookmark_Find", 2);
      Module["_FPDFBookmark_GetDest"] = createExportWrapper("FPDFBookmark_GetDest", 2);
      Module["_FPDFBookmark_GetAction"] = createExportWrapper("FPDFBookmark_GetAction", 1);
      Module["_FPDFAction_GetType"] = createExportWrapper("FPDFAction_GetType", 1);
      Module["_FPDFAction_GetDest"] = createExportWrapper("FPDFAction_GetDest", 2);
      Module["_FPDFAction_GetFilePath"] = createExportWrapper("FPDFAction_GetFilePath", 3);
      Module["_FPDFAction_GetURIPath"] = createExportWrapper("FPDFAction_GetURIPath", 4);
      Module["_FPDFDest_GetDestPageIndex"] = createExportWrapper(
        "FPDFDest_GetDestPageIndex",
        2
      );
      Module["_FPDFDest_GetView"] = createExportWrapper("FPDFDest_GetView", 3);
      Module["_FPDFDest_GetLocationInPage"] = createExportWrapper(
        "FPDFDest_GetLocationInPage",
        7
      );
      Module["_FPDFLink_GetLinkAtPoint"] = createExportWrapper("FPDFLink_GetLinkAtPoint", 3);
      Module["_FPDFLink_GetLinkZOrderAtPoint"] = createExportWrapper(
        "FPDFLink_GetLinkZOrderAtPoint",
        3
      );
      Module["_FPDFLink_GetDest"] = createExportWrapper("FPDFLink_GetDest", 2);
      Module["_FPDFLink_GetAction"] = createExportWrapper("FPDFLink_GetAction", 1);
      Module["_FPDFLink_Enumerate"] = createExportWrapper("FPDFLink_Enumerate", 3);
      Module["_FPDFLink_GetAnnot"] = createExportWrapper("FPDFLink_GetAnnot", 2);
      Module["_FPDFLink_GetAnnotRect"] = createExportWrapper("FPDFLink_GetAnnotRect", 2);
      Module["_FPDFLink_CountQuadPoints"] = createExportWrapper(
        "FPDFLink_CountQuadPoints",
        1
      );
      Module["_FPDFLink_GetQuadPoints"] = createExportWrapper("FPDFLink_GetQuadPoints", 3);
      Module["_FPDF_GetPageAAction"] = createExportWrapper("FPDF_GetPageAAction", 2);
      Module["_FPDF_GetFileIdentifier"] = createExportWrapper("FPDF_GetFileIdentifier", 4);
      Module["_FPDF_GetMetaText"] = createExportWrapper("FPDF_GetMetaText", 4);
      Module["_FPDF_GetPageLabel"] = createExportWrapper("FPDF_GetPageLabel", 4);
      Module["_FPDFPageObj_NewImageObj"] = createExportWrapper("FPDFPageObj_NewImageObj", 1);
      Module["_FPDFImageObj_LoadJpegFile"] = createExportWrapper(
        "FPDFImageObj_LoadJpegFile",
        4
      );
      Module["_FPDFImageObj_LoadJpegFileInline"] = createExportWrapper(
        "FPDFImageObj_LoadJpegFileInline",
        4
      );
      Module["_FPDFImageObj_SetMatrix"] = createExportWrapper("FPDFImageObj_SetMatrix", 7);
      Module["_FPDFImageObj_SetBitmap"] = createExportWrapper("FPDFImageObj_SetBitmap", 4);
      Module["_FPDFImageObj_GetBitmap"] = createExportWrapper("FPDFImageObj_GetBitmap", 1);
      Module["_FPDFImageObj_GetRenderedBitmap"] = createExportWrapper(
        "FPDFImageObj_GetRenderedBitmap",
        3
      );
      Module["_FPDFImageObj_GetImageDataDecoded"] = createExportWrapper(
        "FPDFImageObj_GetImageDataDecoded",
        3
      );
      Module["_FPDFImageObj_GetImageDataRaw"] = createExportWrapper(
        "FPDFImageObj_GetImageDataRaw",
        3
      );
      Module["_FPDFImageObj_GetImageFilterCount"] = createExportWrapper(
        "FPDFImageObj_GetImageFilterCount",
        1
      );
      Module["_FPDFImageObj_GetImageFilter"] = createExportWrapper(
        "FPDFImageObj_GetImageFilter",
        4
      );
      Module["_FPDFImageObj_GetImageMetadata"] = createExportWrapper(
        "FPDFImageObj_GetImageMetadata",
        3
      );
      Module["_FPDFImageObj_GetImagePixelSize"] = createExportWrapper(
        "FPDFImageObj_GetImagePixelSize",
        3
      );
      Module["_FPDFImageObj_GetIccProfileDataDecoded"] = createExportWrapper(
        "FPDFImageObj_GetIccProfileDataDecoded",
        5
      );
      Module["_FPDF_CreateNewDocument"] = createExportWrapper("FPDF_CreateNewDocument", 0);
      Module["_FPDFPage_Delete"] = createExportWrapper("FPDFPage_Delete", 2);
      Module["_FPDF_MovePages"] = createExportWrapper("FPDF_MovePages", 4);
      Module["_FPDFPage_New"] = createExportWrapper("FPDFPage_New", 4);
      Module["_FPDFPage_GetRotation"] = createExportWrapper("FPDFPage_GetRotation", 1);
      Module["_FPDFPage_InsertObject"] = createExportWrapper("FPDFPage_InsertObject", 2);
      Module["_FPDFPage_InsertObjectAtIndex"] = createExportWrapper(
        "FPDFPage_InsertObjectAtIndex",
        3
      );
      Module["_FPDFPage_RemoveObject"] = createExportWrapper("FPDFPage_RemoveObject", 2);
      Module["_FPDFPage_CountObjects"] = createExportWrapper("FPDFPage_CountObjects", 1);
      Module["_FPDFPage_GetObject"] = createExportWrapper("FPDFPage_GetObject", 2);
      Module["_FPDFPage_HasTransparency"] = createExportWrapper(
        "FPDFPage_HasTransparency",
        1
      );
      Module["_FPDFPageObj_Destroy"] = createExportWrapper("FPDFPageObj_Destroy", 1);
      Module["_FPDFPageObj_GetMarkedContentID"] = createExportWrapper(
        "FPDFPageObj_GetMarkedContentID",
        1
      );
      Module["_FPDFPageObj_CountMarks"] = createExportWrapper("FPDFPageObj_CountMarks", 1);
      Module["_FPDFPageObj_GetMark"] = createExportWrapper("FPDFPageObj_GetMark", 2);
      Module["_FPDFPageObj_AddMark"] = createExportWrapper("FPDFPageObj_AddMark", 2);
      Module["_FPDFPageObj_RemoveMark"] = createExportWrapper("FPDFPageObj_RemoveMark", 2);
      Module["_FPDFPageObjMark_GetName"] = createExportWrapper("FPDFPageObjMark_GetName", 4);
      Module["_FPDFPageObjMark_CountParams"] = createExportWrapper(
        "FPDFPageObjMark_CountParams",
        1
      );
      Module["_FPDFPageObjMark_GetParamKey"] = createExportWrapper(
        "FPDFPageObjMark_GetParamKey",
        5
      );
      Module["_FPDFPageObjMark_GetParamValueType"] = createExportWrapper(
        "FPDFPageObjMark_GetParamValueType",
        2
      );
      Module["_FPDFPageObjMark_GetParamIntValue"] = createExportWrapper(
        "FPDFPageObjMark_GetParamIntValue",
        3
      );
      Module["_FPDFPageObjMark_GetParamStringValue"] = createExportWrapper(
        "FPDFPageObjMark_GetParamStringValue",
        5
      );
      Module["_FPDFPageObjMark_GetParamBlobValue"] = createExportWrapper(
        "FPDFPageObjMark_GetParamBlobValue",
        5
      );
      Module["_FPDFPageObj_HasTransparency"] = createExportWrapper(
        "FPDFPageObj_HasTransparency",
        1
      );
      Module["_FPDFPageObjMark_SetIntParam"] = createExportWrapper(
        "FPDFPageObjMark_SetIntParam",
        5
      );
      Module["_FPDFPageObjMark_SetStringParam"] = createExportWrapper(
        "FPDFPageObjMark_SetStringParam",
        5
      );
      Module["_FPDFPageObjMark_SetBlobParam"] = createExportWrapper(
        "FPDFPageObjMark_SetBlobParam",
        6
      );
      Module["_FPDFPageObjMark_RemoveParam"] = createExportWrapper(
        "FPDFPageObjMark_RemoveParam",
        3
      );
      Module["_FPDFPageObj_GetType"] = createExportWrapper("FPDFPageObj_GetType", 1);
      Module["_FPDFPageObj_GetIsActive"] = createExportWrapper("FPDFPageObj_GetIsActive", 2);
      Module["_FPDFPageObj_SetIsActive"] = createExportWrapper("FPDFPageObj_SetIsActive", 2);
      Module["_FPDFPage_GenerateContent"] = createExportWrapper(
        "FPDFPage_GenerateContent",
        1
      );
      Module["_FPDFPageObj_Transform"] = createExportWrapper("FPDFPageObj_Transform", 7);
      Module["_FPDFPageObj_TransformF"] = createExportWrapper("FPDFPageObj_TransformF", 2);
      Module["_FPDFPageObj_GetMatrix"] = createExportWrapper("FPDFPageObj_GetMatrix", 2);
      Module["_FPDFPageObj_SetMatrix"] = createExportWrapper("FPDFPageObj_SetMatrix", 2);
      Module["_FPDFPageObj_SetBlendMode"] = createExportWrapper(
        "FPDFPageObj_SetBlendMode",
        2
      );
      Module["_FPDFPage_TransformAnnots"] = createExportWrapper(
        "FPDFPage_TransformAnnots",
        7
      );
      Module["_FPDFPage_SetRotation"] = createExportWrapper("FPDFPage_SetRotation", 2);
      Module["_FPDFPageObj_SetFillColor"] = createExportWrapper(
        "FPDFPageObj_SetFillColor",
        5
      );
      Module["_FPDFPageObj_GetFillColor"] = createExportWrapper(
        "FPDFPageObj_GetFillColor",
        5
      );
      Module["_FPDFPageObj_GetBounds"] = createExportWrapper("FPDFPageObj_GetBounds", 5);
      Module["_FPDFPageObj_GetRotatedBounds"] = createExportWrapper(
        "FPDFPageObj_GetRotatedBounds",
        2
      );
      Module["_FPDFPageObj_SetStrokeColor"] = createExportWrapper(
        "FPDFPageObj_SetStrokeColor",
        5
      );
      Module["_FPDFPageObj_GetStrokeColor"] = createExportWrapper(
        "FPDFPageObj_GetStrokeColor",
        5
      );
      Module["_FPDFPageObj_SetStrokeWidth"] = createExportWrapper(
        "FPDFPageObj_SetStrokeWidth",
        2
      );
      Module["_FPDFPageObj_GetStrokeWidth"] = createExportWrapper(
        "FPDFPageObj_GetStrokeWidth",
        2
      );
      Module["_FPDFPageObj_GetLineJoin"] = createExportWrapper("FPDFPageObj_GetLineJoin", 1);
      Module["_FPDFPageObj_SetLineJoin"] = createExportWrapper("FPDFPageObj_SetLineJoin", 2);
      Module["_FPDFPageObj_GetLineCap"] = createExportWrapper("FPDFPageObj_GetLineCap", 1);
      Module["_FPDFPageObj_SetLineCap"] = createExportWrapper("FPDFPageObj_SetLineCap", 2);
      Module["_FPDFPageObj_GetDashPhase"] = createExportWrapper(
        "FPDFPageObj_GetDashPhase",
        2
      );
      Module["_FPDFPageObj_SetDashPhase"] = createExportWrapper(
        "FPDFPageObj_SetDashPhase",
        2
      );
      Module["_FPDFPageObj_GetDashCount"] = createExportWrapper(
        "FPDFPageObj_GetDashCount",
        1
      );
      Module["_FPDFPageObj_GetDashArray"] = createExportWrapper(
        "FPDFPageObj_GetDashArray",
        3
      );
      Module["_FPDFPageObj_SetDashArray"] = createExportWrapper(
        "FPDFPageObj_SetDashArray",
        4
      );
      Module["_FPDFFormObj_CountObjects"] = createExportWrapper(
        "FPDFFormObj_CountObjects",
        1
      );
      Module["_FPDFFormObj_GetObject"] = createExportWrapper("FPDFFormObj_GetObject", 2);
      Module["_FPDFFormObj_RemoveObject"] = createExportWrapper(
        "FPDFFormObj_RemoveObject",
        2
      );
      Module["_FPDFPageObj_CreateNewPath"] = createExportWrapper(
        "FPDFPageObj_CreateNewPath",
        2
      );
      Module["_FPDFPageObj_CreateNewRect"] = createExportWrapper(
        "FPDFPageObj_CreateNewRect",
        4
      );
      Module["_FPDFPath_CountSegments"] = createExportWrapper("FPDFPath_CountSegments", 1);
      Module["_FPDFPath_GetPathSegment"] = createExportWrapper("FPDFPath_GetPathSegment", 2);
      Module["_FPDFPath_MoveTo"] = createExportWrapper("FPDFPath_MoveTo", 3);
      Module["_FPDFPath_LineTo"] = createExportWrapper("FPDFPath_LineTo", 3);
      Module["_FPDFPath_BezierTo"] = createExportWrapper("FPDFPath_BezierTo", 7);
      Module["_FPDFPath_Close"] = createExportWrapper("FPDFPath_Close", 1);
      Module["_FPDFPath_SetDrawMode"] = createExportWrapper("FPDFPath_SetDrawMode", 3);
      Module["_FPDFPath_GetDrawMode"] = createExportWrapper("FPDFPath_GetDrawMode", 3);
      Module["_FPDFPathSegment_GetPoint"] = createExportWrapper(
        "FPDFPathSegment_GetPoint",
        3
      );
      Module["_FPDFPathSegment_GetType"] = createExportWrapper("FPDFPathSegment_GetType", 1);
      Module["_FPDFPathSegment_GetClose"] = createExportWrapper(
        "FPDFPathSegment_GetClose",
        1
      );
      Module["_FPDFPageObj_NewTextObj"] = createExportWrapper("FPDFPageObj_NewTextObj", 3);
      Module["_FPDFText_SetText"] = createExportWrapper("FPDFText_SetText", 2);
      Module["_FPDFText_SetCharcodes"] = createExportWrapper("FPDFText_SetCharcodes", 3);
      Module["_FPDFText_LoadFont"] = createExportWrapper("FPDFText_LoadFont", 5);
      Module["_FPDFText_LoadStandardFont"] = createExportWrapper(
        "FPDFText_LoadStandardFont",
        2
      );
      Module["_FPDFText_LoadCidType2Font"] = createExportWrapper(
        "FPDFText_LoadCidType2Font",
        6
      );
      Module["_FPDFTextObj_GetFontSize"] = createExportWrapper("FPDFTextObj_GetFontSize", 2);
      Module["_FPDFTextObj_GetText"] = createExportWrapper("FPDFTextObj_GetText", 4);
      Module["_FPDFTextObj_GetRenderedBitmap"] = createExportWrapper(
        "FPDFTextObj_GetRenderedBitmap",
        4
      );
      Module["_FPDFFont_Close"] = createExportWrapper("FPDFFont_Close", 1);
      Module["_FPDFPageObj_CreateTextObj"] = createExportWrapper(
        "FPDFPageObj_CreateTextObj",
        3
      );
      Module["_FPDFTextObj_GetTextRenderMode"] = createExportWrapper(
        "FPDFTextObj_GetTextRenderMode",
        1
      );
      Module["_FPDFTextObj_SetTextRenderMode"] = createExportWrapper(
        "FPDFTextObj_SetTextRenderMode",
        2
      );
      Module["_FPDFTextObj_GetFont"] = createExportWrapper("FPDFTextObj_GetFont", 1);
      Module["_FPDFFont_GetBaseFontName"] = createExportWrapper(
        "FPDFFont_GetBaseFontName",
        3
      );
      Module["_FPDFFont_GetFamilyName"] = createExportWrapper("FPDFFont_GetFamilyName", 3);
      Module["_FPDFFont_GetFontData"] = createExportWrapper("FPDFFont_GetFontData", 4);
      Module["_FPDFFont_GetIsEmbedded"] = createExportWrapper("FPDFFont_GetIsEmbedded", 1);
      Module["_FPDFFont_GetFlags"] = createExportWrapper("FPDFFont_GetFlags", 1);
      Module["_FPDFFont_GetWeight"] = createExportWrapper("FPDFFont_GetWeight", 1);
      Module["_FPDFFont_GetItalicAngle"] = createExportWrapper("FPDFFont_GetItalicAngle", 2);
      Module["_FPDFFont_GetAscent"] = createExportWrapper("FPDFFont_GetAscent", 3);
      Module["_FPDFFont_GetDescent"] = createExportWrapper("FPDFFont_GetDescent", 3);
      Module["_FPDFFont_GetGlyphWidth"] = createExportWrapper("FPDFFont_GetGlyphWidth", 4);
      Module["_FPDFFont_GetGlyphPath"] = createExportWrapper("FPDFFont_GetGlyphPath", 3);
      Module["_FPDFGlyphPath_CountGlyphSegments"] = createExportWrapper(
        "FPDFGlyphPath_CountGlyphSegments",
        1
      );
      Module["_FPDFGlyphPath_GetGlyphPathSegment"] = createExportWrapper(
        "FPDFGlyphPath_GetGlyphPathSegment",
        2
      );
      Module["_FSDK_SetUnSpObjProcessHandler"] = createExportWrapper(
        "FSDK_SetUnSpObjProcessHandler",
        1
      );
      Module["_FSDK_SetTimeFunction"] = createExportWrapper("FSDK_SetTimeFunction", 1);
      Module["_FSDK_SetLocaltimeFunction"] = createExportWrapper(
        "FSDK_SetLocaltimeFunction",
        1
      );
      Module["_FPDFDoc_GetPageMode"] = createExportWrapper("FPDFDoc_GetPageMode", 1);
      Module["_FPDFPage_Flatten"] = createExportWrapper("FPDFPage_Flatten", 2);
      Module["_FPDFPage_HasFormFieldAtPoint"] = createExportWrapper(
        "FPDFPage_HasFormFieldAtPoint",
        4
      );
      Module["_FPDFPage_FormFieldZOrderAtPoint"] = createExportWrapper(
        "FPDFPage_FormFieldZOrderAtPoint",
        4
      );
      Module["_FPDFDOC_InitFormFillEnvironment"] = createExportWrapper(
        "FPDFDOC_InitFormFillEnvironment",
        2
      );
      Module["_FPDFDOC_ExitFormFillEnvironment"] = createExportWrapper(
        "FPDFDOC_ExitFormFillEnvironment",
        1
      );
      Module["_FORM_OnMouseMove"] = createExportWrapper("FORM_OnMouseMove", 5);
      Module["_FORM_OnMouseWheel"] = createExportWrapper("FORM_OnMouseWheel", 6);
      Module["_FORM_OnFocus"] = createExportWrapper("FORM_OnFocus", 5);
      Module["_FORM_OnLButtonDown"] = createExportWrapper("FORM_OnLButtonDown", 5);
      Module["_FORM_OnLButtonUp"] = createExportWrapper("FORM_OnLButtonUp", 5);
      Module["_FORM_OnLButtonDoubleClick"] = createExportWrapper(
        "FORM_OnLButtonDoubleClick",
        5
      );
      Module["_FORM_OnRButtonDown"] = createExportWrapper("FORM_OnRButtonDown", 5);
      Module["_FORM_OnRButtonUp"] = createExportWrapper("FORM_OnRButtonUp", 5);
      Module["_FORM_OnKeyDown"] = createExportWrapper("FORM_OnKeyDown", 4);
      Module["_FORM_OnKeyUp"] = createExportWrapper("FORM_OnKeyUp", 4);
      Module["_FORM_OnChar"] = createExportWrapper("FORM_OnChar", 4);
      Module["_FORM_GetFocusedText"] = createExportWrapper("FORM_GetFocusedText", 4);
      Module["_FORM_GetSelectedText"] = createExportWrapper("FORM_GetSelectedText", 4);
      Module["_FORM_ReplaceAndKeepSelection"] = createExportWrapper(
        "FORM_ReplaceAndKeepSelection",
        3
      );
      Module["_FORM_ReplaceSelection"] = createExportWrapper("FORM_ReplaceSelection", 3);
      Module["_FORM_SelectAllText"] = createExportWrapper("FORM_SelectAllText", 2);
      Module["_FORM_CanUndo"] = createExportWrapper("FORM_CanUndo", 2);
      Module["_FORM_CanRedo"] = createExportWrapper("FORM_CanRedo", 2);
      Module["_FORM_Undo"] = createExportWrapper("FORM_Undo", 2);
      Module["_FORM_Redo"] = createExportWrapper("FORM_Redo", 2);
      Module["_FORM_ForceToKillFocus"] = createExportWrapper("FORM_ForceToKillFocus", 1);
      Module["_FORM_GetFocusedAnnot"] = createExportWrapper("FORM_GetFocusedAnnot", 3);
      Module["_FORM_SetFocusedAnnot"] = createExportWrapper("FORM_SetFocusedAnnot", 2);
      Module["_FPDF_FFLDraw"] = createExportWrapper("FPDF_FFLDraw", 9);
      Module["_FPDF_SetFormFieldHighlightColor"] = createExportWrapper(
        "FPDF_SetFormFieldHighlightColor",
        3
      );
      Module["_FPDF_SetFormFieldHighlightAlpha"] = createExportWrapper(
        "FPDF_SetFormFieldHighlightAlpha",
        2
      );
      Module["_FPDF_RemoveFormFieldHighlight"] = createExportWrapper(
        "FPDF_RemoveFormFieldHighlight",
        1
      );
      Module["_FORM_OnAfterLoadPage"] = createExportWrapper("FORM_OnAfterLoadPage", 2);
      Module["_FORM_OnBeforeClosePage"] = createExportWrapper("FORM_OnBeforeClosePage", 2);
      Module["_FORM_DoDocumentJSAction"] = createExportWrapper("FORM_DoDocumentJSAction", 1);
      Module["_FORM_DoDocumentOpenAction"] = createExportWrapper(
        "FORM_DoDocumentOpenAction",
        1
      );
      Module["_FORM_DoDocumentAAction"] = createExportWrapper("FORM_DoDocumentAAction", 2);
      Module["_FORM_DoPageAAction"] = createExportWrapper("FORM_DoPageAAction", 3);
      Module["_FORM_SetIndexSelected"] = createExportWrapper("FORM_SetIndexSelected", 4);
      Module["_FORM_IsIndexSelected"] = createExportWrapper("FORM_IsIndexSelected", 3);
      Module["_FPDFDoc_GetJavaScriptActionCount"] = createExportWrapper(
        "FPDFDoc_GetJavaScriptActionCount",
        1
      );
      Module["_FPDFDoc_GetJavaScriptAction"] = createExportWrapper(
        "FPDFDoc_GetJavaScriptAction",
        2
      );
      Module["_FPDFDoc_CloseJavaScriptAction"] = createExportWrapper(
        "FPDFDoc_CloseJavaScriptAction",
        1
      );
      Module["_FPDFJavaScriptAction_GetName"] = createExportWrapper(
        "FPDFJavaScriptAction_GetName",
        3
      );
      Module["_FPDFJavaScriptAction_GetScript"] = createExportWrapper(
        "FPDFJavaScriptAction_GetScript",
        3
      );
      Module["_FPDF_ImportPagesByIndex"] = createExportWrapper("FPDF_ImportPagesByIndex", 5);
      Module["_FPDF_ImportPages"] = createExportWrapper("FPDF_ImportPages", 4);
      Module["_FPDF_ImportNPagesToOne"] = createExportWrapper("FPDF_ImportNPagesToOne", 5);
      Module["_FPDF_NewXObjectFromPage"] = createExportWrapper("FPDF_NewXObjectFromPage", 3);
      Module["_FPDF_CloseXObject"] = createExportWrapper("FPDF_CloseXObject", 1);
      Module["_FPDF_NewFormObjectFromXObject"] = createExportWrapper(
        "FPDF_NewFormObjectFromXObject",
        1
      );
      Module["_FPDF_CopyViewerPreferences"] = createExportWrapper(
        "FPDF_CopyViewerPreferences",
        2
      );
      Module["_FPDF_RenderPageBitmapWithColorScheme_Start"] = createExportWrapper("FPDF_RenderPageBitmapWithColorScheme_Start", 10);
      Module["_FPDF_RenderPageBitmap_Start"] = createExportWrapper(
        "FPDF_RenderPageBitmap_Start",
        9
      );
      Module["_FPDF_RenderPage_Continue"] = createExportWrapper(
        "FPDF_RenderPage_Continue",
        2
      );
      Module["_FPDF_RenderPage_Close"] = createExportWrapper("FPDF_RenderPage_Close", 1);
      Module["_FPDF_SaveAsCopy"] = createExportWrapper("FPDF_SaveAsCopy", 3);
      Module["_FPDF_SaveWithVersion"] = createExportWrapper("FPDF_SaveWithVersion", 4);
      Module["_FPDFText_GetCharIndexFromTextIndex"] = createExportWrapper(
        "FPDFText_GetCharIndexFromTextIndex",
        2
      );
      Module["_FPDFText_GetTextIndexFromCharIndex"] = createExportWrapper(
        "FPDFText_GetTextIndexFromCharIndex",
        2
      );
      Module["_FPDF_GetSignatureCount"] = createExportWrapper("FPDF_GetSignatureCount", 1);
      Module["_FPDF_GetSignatureObject"] = createExportWrapper("FPDF_GetSignatureObject", 2);
      Module["_FPDFSignatureObj_GetContents"] = createExportWrapper(
        "FPDFSignatureObj_GetContents",
        3
      );
      Module["_FPDFSignatureObj_GetByteRange"] = createExportWrapper(
        "FPDFSignatureObj_GetByteRange",
        3
      );
      Module["_FPDFSignatureObj_GetSubFilter"] = createExportWrapper(
        "FPDFSignatureObj_GetSubFilter",
        3
      );
      Module["_FPDFSignatureObj_GetReason"] = createExportWrapper(
        "FPDFSignatureObj_GetReason",
        3
      );
      Module["_FPDFSignatureObj_GetTime"] = createExportWrapper(
        "FPDFSignatureObj_GetTime",
        3
      );
      Module["_FPDFSignatureObj_GetDocMDPPermission"] = createExportWrapper(
        "FPDFSignatureObj_GetDocMDPPermission",
        1
      );
      Module["_FPDF_StructTree_GetForPage"] = createExportWrapper(
        "FPDF_StructTree_GetForPage",
        1
      );
      Module["_FPDF_StructTree_Close"] = createExportWrapper("FPDF_StructTree_Close", 1);
      Module["_FPDF_StructTree_CountChildren"] = createExportWrapper(
        "FPDF_StructTree_CountChildren",
        1
      );
      Module["_FPDF_StructTree_GetChildAtIndex"] = createExportWrapper(
        "FPDF_StructTree_GetChildAtIndex",
        2
      );
      Module["_FPDF_StructElement_GetAltText"] = createExportWrapper(
        "FPDF_StructElement_GetAltText",
        3
      );
      Module["_FPDF_StructElement_GetActualText"] = createExportWrapper(
        "FPDF_StructElement_GetActualText",
        3
      );
      Module["_FPDF_StructElement_GetID"] = createExportWrapper(
        "FPDF_StructElement_GetID",
        3
      );
      Module["_FPDF_StructElement_GetLang"] = createExportWrapper(
        "FPDF_StructElement_GetLang",
        3
      );
      Module["_FPDF_StructElement_GetAttributeCount"] = createExportWrapper(
        "FPDF_StructElement_GetAttributeCount",
        1
      );
      Module["_FPDF_StructElement_GetAttributeAtIndex"] = createExportWrapper(
        "FPDF_StructElement_GetAttributeAtIndex",
        2
      );
      Module["_FPDF_StructElement_GetStringAttribute"] = createExportWrapper(
        "FPDF_StructElement_GetStringAttribute",
        4
      );
      Module["_FPDF_StructElement_GetMarkedContentID"] = createExportWrapper(
        "FPDF_StructElement_GetMarkedContentID",
        1
      );
      Module["_FPDF_StructElement_GetType"] = createExportWrapper(
        "FPDF_StructElement_GetType",
        3
      );
      Module["_FPDF_StructElement_GetObjType"] = createExportWrapper(
        "FPDF_StructElement_GetObjType",
        3
      );
      Module["_FPDF_StructElement_GetTitle"] = createExportWrapper(
        "FPDF_StructElement_GetTitle",
        3
      );
      Module["_FPDF_StructElement_CountChildren"] = createExportWrapper(
        "FPDF_StructElement_CountChildren",
        1
      );
      Module["_FPDF_StructElement_GetChildAtIndex"] = createExportWrapper(
        "FPDF_StructElement_GetChildAtIndex",
        2
      );
      Module["_FPDF_StructElement_GetChildMarkedContentID"] = createExportWrapper("FPDF_StructElement_GetChildMarkedContentID", 2);
      Module["_FPDF_StructElement_GetParent"] = createExportWrapper(
        "FPDF_StructElement_GetParent",
        1
      );
      Module["_FPDF_StructElement_Attr_GetCount"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetCount",
        1
      );
      Module["_FPDF_StructElement_Attr_GetName"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetName",
        5
      );
      Module["_FPDF_StructElement_Attr_GetValue"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetValue",
        2
      );
      Module["_FPDF_StructElement_Attr_GetType"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetType",
        1
      );
      Module["_FPDF_StructElement_Attr_GetBooleanValue"] = createExportWrapper("FPDF_StructElement_Attr_GetBooleanValue", 2);
      Module["_FPDF_StructElement_Attr_GetNumberValue"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetNumberValue",
        2
      );
      Module["_FPDF_StructElement_Attr_GetStringValue"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetStringValue",
        4
      );
      Module["_FPDF_StructElement_Attr_GetBlobValue"] = createExportWrapper(
        "FPDF_StructElement_Attr_GetBlobValue",
        4
      );
      Module["_FPDF_StructElement_Attr_CountChildren"] = createExportWrapper(
        "FPDF_StructElement_Attr_CountChildren",
        1
      );
      Module["_FPDF_StructElement_Attr_GetChildAtIndex"] = createExportWrapper("FPDF_StructElement_Attr_GetChildAtIndex", 2);
      Module["_FPDF_StructElement_GetMarkedContentIdCount"] = createExportWrapper("FPDF_StructElement_GetMarkedContentIdCount", 1);
      Module["_FPDF_StructElement_GetMarkedContentIdAtIndex"] = createExportWrapper("FPDF_StructElement_GetMarkedContentIdAtIndex", 2);
      Module["_FPDF_AddInstalledFont"] = createExportWrapper("FPDF_AddInstalledFont", 3);
      Module["_FPDF_SetSystemFontInfo"] = createExportWrapper("FPDF_SetSystemFontInfo", 1);
      Module["_FPDF_GetDefaultTTFMap"] = createExportWrapper("FPDF_GetDefaultTTFMap", 0);
      Module["_FPDF_GetDefaultTTFMapCount"] = createExportWrapper(
        "FPDF_GetDefaultTTFMapCount",
        0
      );
      Module["_FPDF_GetDefaultTTFMapEntry"] = createExportWrapper(
        "FPDF_GetDefaultTTFMapEntry",
        1
      );
      Module["_FPDF_GetDefaultSystemFontInfo"] = createExportWrapper(
        "FPDF_GetDefaultSystemFontInfo",
        0
      );
      Module["_FPDF_FreeDefaultSystemFontInfo"] = createExportWrapper(
        "FPDF_FreeDefaultSystemFontInfo",
        1
      );
      Module["_FPDFText_LoadPage"] = createExportWrapper("FPDFText_LoadPage", 1);
      Module["_FPDFText_ClosePage"] = createExportWrapper("FPDFText_ClosePage", 1);
      Module["_FPDFText_CountChars"] = createExportWrapper("FPDFText_CountChars", 1);
      Module["_FPDFText_GetUnicode"] = createExportWrapper("FPDFText_GetUnicode", 2);
      Module["_FPDFText_GetTextObject"] = createExportWrapper("FPDFText_GetTextObject", 2);
      Module["_FPDFText_IsGenerated"] = createExportWrapper("FPDFText_IsGenerated", 2);
      Module["_FPDFText_IsHyphen"] = createExportWrapper("FPDFText_IsHyphen", 2);
      Module["_FPDFText_HasUnicodeMapError"] = createExportWrapper(
        "FPDFText_HasUnicodeMapError",
        2
      );
      Module["_FPDFText_GetFontSize"] = createExportWrapper("FPDFText_GetFontSize", 2);
      Module["_FPDFText_GetFontInfo"] = createExportWrapper("FPDFText_GetFontInfo", 5);
      Module["_FPDFText_GetFontWeight"] = createExportWrapper("FPDFText_GetFontWeight", 2);
      Module["_FPDFText_GetFillColor"] = createExportWrapper("FPDFText_GetFillColor", 6);
      Module["_FPDFText_GetStrokeColor"] = createExportWrapper("FPDFText_GetStrokeColor", 6);
      Module["_FPDFText_GetCharAngle"] = createExportWrapper("FPDFText_GetCharAngle", 2);
      Module["_FPDFText_GetCharBox"] = createExportWrapper("FPDFText_GetCharBox", 6);
      Module["_FPDFText_GetLooseCharBox"] = createExportWrapper(
        "FPDFText_GetLooseCharBox",
        3
      );
      Module["_FPDFText_GetMatrix"] = createExportWrapper("FPDFText_GetMatrix", 3);
      Module["_FPDFText_GetCharOrigin"] = createExportWrapper("FPDFText_GetCharOrigin", 4);
      Module["_FPDFText_GetCharIndexAtPos"] = createExportWrapper(
        "FPDFText_GetCharIndexAtPos",
        5
      );
      Module["_FPDFText_GetText"] = createExportWrapper("FPDFText_GetText", 4);
      Module["_FPDFText_CountRects"] = createExportWrapper("FPDFText_CountRects", 3);
      Module["_FPDFText_GetRect"] = createExportWrapper("FPDFText_GetRect", 6);
      Module["_FPDFText_GetBoundedText"] = createExportWrapper("FPDFText_GetBoundedText", 7);
      Module["_FPDFText_FindStart"] = createExportWrapper("FPDFText_FindStart", 4);
      Module["_FPDFText_FindNext"] = createExportWrapper("FPDFText_FindNext", 1);
      Module["_FPDFText_FindPrev"] = createExportWrapper("FPDFText_FindPrev", 1);
      Module["_FPDFText_GetSchResultIndex"] = createExportWrapper(
        "FPDFText_GetSchResultIndex",
        1
      );
      Module["_FPDFText_GetSchCount"] = createExportWrapper("FPDFText_GetSchCount", 1);
      Module["_FPDFText_FindClose"] = createExportWrapper("FPDFText_FindClose", 1);
      Module["_FPDFLink_LoadWebLinks"] = createExportWrapper("FPDFLink_LoadWebLinks", 1);
      Module["_FPDFLink_CountWebLinks"] = createExportWrapper("FPDFLink_CountWebLinks", 1);
      Module["_FPDFLink_GetURL"] = createExportWrapper("FPDFLink_GetURL", 4);
      Module["_FPDFLink_CountRects"] = createExportWrapper("FPDFLink_CountRects", 2);
      Module["_FPDFLink_GetRect"] = createExportWrapper("FPDFLink_GetRect", 7);
      Module["_FPDFLink_GetTextRange"] = createExportWrapper("FPDFLink_GetTextRange", 4);
      Module["_FPDFLink_CloseWebLinks"] = createExportWrapper("FPDFLink_CloseWebLinks", 1);
      Module["_FPDFPage_GetDecodedThumbnailData"] = createExportWrapper(
        "FPDFPage_GetDecodedThumbnailData",
        3
      );
      Module["_FPDFPage_GetRawThumbnailData"] = createExportWrapper(
        "FPDFPage_GetRawThumbnailData",
        3
      );
      Module["_FPDFPage_GetThumbnailAsBitmap"] = createExportWrapper(
        "FPDFPage_GetThumbnailAsBitmap",
        1
      );
      Module["_FPDFPage_SetMediaBox"] = createExportWrapper("FPDFPage_SetMediaBox", 5);
      Module["_FPDFPage_SetCropBox"] = createExportWrapper("FPDFPage_SetCropBox", 5);
      Module["_FPDFPage_SetBleedBox"] = createExportWrapper("FPDFPage_SetBleedBox", 5);
      Module["_FPDFPage_SetTrimBox"] = createExportWrapper("FPDFPage_SetTrimBox", 5);
      Module["_FPDFPage_SetArtBox"] = createExportWrapper("FPDFPage_SetArtBox", 5);
      Module["_FPDFPage_GetMediaBox"] = createExportWrapper("FPDFPage_GetMediaBox", 5);
      Module["_FPDFPage_GetCropBox"] = createExportWrapper("FPDFPage_GetCropBox", 5);
      Module["_FPDFPage_GetBleedBox"] = createExportWrapper("FPDFPage_GetBleedBox", 5);
      Module["_FPDFPage_GetTrimBox"] = createExportWrapper("FPDFPage_GetTrimBox", 5);
      Module["_FPDFPage_GetArtBox"] = createExportWrapper("FPDFPage_GetArtBox", 5);
      Module["_FPDFPage_TransFormWithClip"] = createExportWrapper(
        "FPDFPage_TransFormWithClip",
        3
      );
      Module["_FPDFPageObj_TransformClipPath"] = createExportWrapper(
        "FPDFPageObj_TransformClipPath",
        7
      );
      Module["_FPDFPageObj_GetClipPath"] = createExportWrapper("FPDFPageObj_GetClipPath", 1);
      Module["_FPDFClipPath_CountPaths"] = createExportWrapper("FPDFClipPath_CountPaths", 1);
      Module["_FPDFClipPath_CountPathSegments"] = createExportWrapper(
        "FPDFClipPath_CountPathSegments",
        2
      );
      Module["_FPDFClipPath_GetPathSegment"] = createExportWrapper(
        "FPDFClipPath_GetPathSegment",
        3
      );
      Module["_FPDF_CreateClipPath"] = createExportWrapper("FPDF_CreateClipPath", 4);
      Module["_FPDF_DestroyClipPath"] = createExportWrapper("FPDF_DestroyClipPath", 1);
      Module["_FPDFPage_InsertClipPath"] = createExportWrapper("FPDFPage_InsertClipPath", 2);
      Module["_FPDF_InitLibrary"] = createExportWrapper("FPDF_InitLibrary", 0);
      Module["_malloc"] = createExportWrapper("malloc", 1);
      Module["_free"] = createExportWrapper("free", 1);
      Module["_FPDF_DestroyLibrary"] = createExportWrapper("FPDF_DestroyLibrary", 0);
      Module["_FPDF_SetSandBoxPolicy"] = createExportWrapper("FPDF_SetSandBoxPolicy", 2);
      Module["_FPDF_LoadDocument"] = createExportWrapper("FPDF_LoadDocument", 2);
      Module["_FPDF_GetFormType"] = createExportWrapper("FPDF_GetFormType", 1);
      Module["_FPDF_LoadXFA"] = createExportWrapper("FPDF_LoadXFA", 1);
      Module["_FPDF_LoadMemDocument"] = createExportWrapper("FPDF_LoadMemDocument", 3);
      Module["_FPDF_LoadMemDocument64"] = createExportWrapper("FPDF_LoadMemDocument64", 3);
      Module["_FPDF_LoadCustomDocument"] = createExportWrapper("FPDF_LoadCustomDocument", 2);
      Module["_FPDF_GetFileVersion"] = createExportWrapper("FPDF_GetFileVersion", 2);
      Module["_FPDF_DocumentHasValidCrossReferenceTable"] = createExportWrapper("FPDF_DocumentHasValidCrossReferenceTable", 1);
      Module["_FPDF_GetDocPermissions"] = createExportWrapper("FPDF_GetDocPermissions", 1);
      Module["_FPDF_GetDocUserPermissions"] = createExportWrapper(
        "FPDF_GetDocUserPermissions",
        1
      );
      Module["_FPDF_GetSecurityHandlerRevision"] = createExportWrapper(
        "FPDF_GetSecurityHandlerRevision",
        1
      );
      Module["_FPDF_GetPageCount"] = createExportWrapper("FPDF_GetPageCount", 1);
      Module["_FPDF_LoadPage"] = createExportWrapper("FPDF_LoadPage", 2);
      Module["_FPDF_GetPageWidthF"] = createExportWrapper("FPDF_GetPageWidthF", 1);
      Module["_FPDF_GetPageWidth"] = createExportWrapper("FPDF_GetPageWidth", 1);
      Module["_FPDF_GetPageHeightF"] = createExportWrapper("FPDF_GetPageHeightF", 1);
      Module["_FPDF_GetPageHeight"] = createExportWrapper("FPDF_GetPageHeight", 1);
      Module["_FPDF_GetPageBoundingBox"] = createExportWrapper("FPDF_GetPageBoundingBox", 2);
      Module["_FPDF_RenderPageBitmap"] = createExportWrapper("FPDF_RenderPageBitmap", 8);
      Module["_FPDF_RenderPageBitmapWithMatrix"] = createExportWrapper(
        "FPDF_RenderPageBitmapWithMatrix",
        5
      );
      Module["_FPDF_ClosePage"] = createExportWrapper("FPDF_ClosePage", 1);
      Module["_FPDF_CloseDocument"] = createExportWrapper("FPDF_CloseDocument", 1);
      Module["_FPDF_GetLastError"] = createExportWrapper("FPDF_GetLastError", 0);
      Module["_FPDF_DeviceToPage"] = createExportWrapper("FPDF_DeviceToPage", 10);
      Module["_FPDF_PageToDevice"] = createExportWrapper("FPDF_PageToDevice", 10);
      Module["_FPDFBitmap_Create"] = createExportWrapper("FPDFBitmap_Create", 3);
      Module["_FPDFBitmap_CreateEx"] = createExportWrapper("FPDFBitmap_CreateEx", 5);
      Module["_FPDFBitmap_GetFormat"] = createExportWrapper("FPDFBitmap_GetFormat", 1);
      Module["_FPDFBitmap_FillRect"] = createExportWrapper("FPDFBitmap_FillRect", 6);
      Module["_FPDFBitmap_GetBuffer"] = createExportWrapper("FPDFBitmap_GetBuffer", 1);
      Module["_FPDFBitmap_GetWidth"] = createExportWrapper("FPDFBitmap_GetWidth", 1);
      Module["_FPDFBitmap_GetHeight"] = createExportWrapper("FPDFBitmap_GetHeight", 1);
      Module["_FPDFBitmap_GetStride"] = createExportWrapper("FPDFBitmap_GetStride", 1);
      Module["_FPDFBitmap_Destroy"] = createExportWrapper("FPDFBitmap_Destroy", 1);
      Module["_FPDF_GetPageSizeByIndexF"] = createExportWrapper(
        "FPDF_GetPageSizeByIndexF",
        3
      );
      Module["_FPDF_GetPageSizeByIndex"] = createExportWrapper("FPDF_GetPageSizeByIndex", 4);
      Module["_FPDF_VIEWERREF_GetPrintScaling"] = createExportWrapper(
        "FPDF_VIEWERREF_GetPrintScaling",
        1
      );
      Module["_FPDF_VIEWERREF_GetNumCopies"] = createExportWrapper(
        "FPDF_VIEWERREF_GetNumCopies",
        1
      );
      Module["_FPDF_VIEWERREF_GetPrintPageRange"] = createExportWrapper(
        "FPDF_VIEWERREF_GetPrintPageRange",
        1
      );
      Module["_FPDF_VIEWERREF_GetPrintPageRangeCount"] = createExportWrapper(
        "FPDF_VIEWERREF_GetPrintPageRangeCount",
        1
      );
      Module["_FPDF_VIEWERREF_GetPrintPageRangeElement"] = createExportWrapper("FPDF_VIEWERREF_GetPrintPageRangeElement", 2);
      Module["_FPDF_VIEWERREF_GetDuplex"] = createExportWrapper(
        "FPDF_VIEWERREF_GetDuplex",
        1
      );
      Module["_FPDF_VIEWERREF_GetName"] = createExportWrapper("FPDF_VIEWERREF_GetName", 4);
      Module["_FPDF_CountNamedDests"] = createExportWrapper("FPDF_CountNamedDests", 1);
      Module["_FPDF_GetNamedDestByName"] = createExportWrapper("FPDF_GetNamedDestByName", 2);
      Module["_FPDF_GetNamedDest"] = createExportWrapper("FPDF_GetNamedDest", 4);
      Module["_FPDF_GetXFAPacketCount"] = createExportWrapper("FPDF_GetXFAPacketCount", 1);
      Module["_FPDF_GetXFAPacketName"] = createExportWrapper("FPDF_GetXFAPacketName", 4);
      Module["_FPDF_GetXFAPacketContent"] = createExportWrapper(
        "FPDF_GetXFAPacketContent",
        5
      );
      Module["_FPDF_GetTrailerEnds"] = createExportWrapper("FPDF_GetTrailerEnds", 3);
      _fflush = createExportWrapper("fflush", 1);
      _emscripten_stack_get_end = wasmExports2["emscripten_stack_get_end"];
      wasmExports2["emscripten_stack_get_base"];
      _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign", 2);
      _strerror = createExportWrapper("strerror", 1);
      _setThrew = createExportWrapper("setThrew", 2);
      _emscripten_stack_init = wasmExports2["emscripten_stack_init"];
      wasmExports2["emscripten_stack_get_free"];
      __emscripten_stack_restore = wasmExports2["_emscripten_stack_restore"];
      __emscripten_stack_alloc = wasmExports2["_emscripten_stack_alloc"];
      _emscripten_stack_get_current = wasmExports2["emscripten_stack_get_current"];
    }
    var wasmImports = {
      __syscall_fcntl64: ___syscall_fcntl64,
      __syscall_fstat64: ___syscall_fstat64,
      __syscall_ftruncate64: ___syscall_ftruncate64,
      __syscall_getdents64: ___syscall_getdents64,
      __syscall_ioctl: ___syscall_ioctl,
      __syscall_lstat64: ___syscall_lstat64,
      __syscall_newfstatat: ___syscall_newfstatat,
      __syscall_openat: ___syscall_openat,
      __syscall_rmdir: ___syscall_rmdir,
      __syscall_stat64: ___syscall_stat64,
      __syscall_unlinkat: ___syscall_unlinkat,
      _abort_js: __abort_js,
      _emscripten_throw_longjmp: __emscripten_throw_longjmp,
      _gmtime_js: __gmtime_js,
      _localtime_js: __localtime_js,
      _tzset_js: __tzset_js,
      emscripten_date_now: _emscripten_date_now,
      emscripten_resize_heap: _emscripten_resize_heap,
      environ_get: _environ_get,
      environ_sizes_get: _environ_sizes_get,
      fd_close: _fd_close,
      fd_read: _fd_read,
      fd_seek: _fd_seek,
      fd_sync: _fd_sync,
      fd_write: _fd_write,
      invoke_ii,
      invoke_iii,
      invoke_iiii,
      invoke_iiiii,
      invoke_v,
      invoke_viii,
      invoke_viiii
    };
    var wasmExports = await createWasm();
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_v(index) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    var calledRun;
    function stackCheckInit() {
      _emscripten_stack_init();
      writeStackCookie();
    }
    function run() {
      if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      stackCheckInit();
      preRun();
      if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      function doRun() {
        assert(!calledRun);
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve?.(Module);
        Module["onRuntimeInitialized"]?.();
        consumedModuleProp("onRuntimeInitialized");
        assert(
          !Module["_main"],
          'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'
        );
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(() => {
          setTimeout(() => Module["setStatus"](""), 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
      checkStackCookie();
    }
    function preInit() {
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].shift()();
        }
      }
      consumedModuleProp("preInit");
    }
    preInit();
    run();
    if (runtimeInitialized) {
      moduleRtn = Module;
    } else {
      moduleRtn = new Promise((resolve, reject) => {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
    }
    for (const prop of Object.keys(Module)) {
      if (!(prop in moduleArg)) {
        Object.defineProperty(moduleArg, prop, {
          configurable: true,
          get() {
            abort(
              `Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`
            );
          }
        });
      }
    }
    return moduleRtn;
  };
})();
var PDFiumLibrary2 = class extends PDFiumLibrary$1 {
  static init(options) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield PDFiumLibrary$1.initBase({
        vendor: PDFiumModule,
        wasmBinary: options === null || options === void 0 ? void 0 : options.wasmBinary,
        wasmUrl: options === null || options === void 0 ? void 0 : options.wasmUrl,
        instantiateWasm: options === null || options === void 0 ? void 0 : options.instantiateWasm
      });
    });
  }
};

// pdf2png.mjs
var import_fs = require("fs");
var import_sharp = __toESM(require_lib(), 1);
async function renderFunction(options) {
  return await (0, import_sharp.default)(options.data, {
    raw: {
      width: options.width,
      height: options.height,
      channels: 4
    }
  }).png().toBuffer();
}
async function main() {
  const inputFile = process.argv[2];
  const outputDir = process.argv[3];
  if (!inputFile || !outputDir) {
    console.error("Usage: node pdf2png.js <input.pdf> <output_dir>");
    process.exit(1);
  }
  await import_fs.promises.mkdir(outputDir, { recursive: true });
  const buff = await import_fs.promises.readFile(inputFile);
  const library = await PDFiumLibrary2.init();
  const document = await library.loadDocument(buff);
  let totalTime = 0;
  let pageCount = 0;
  for (const page of document.pages()) {
    console.log(`${page.number} - rendering...`);
    const startTime = performance.now();
    const image = await page.render({
      scale: 3,
      // 3x scale (72 DPI is the default)
      render: renderFunction
      // sharp function to convert raw bitmap data to PNG
    });
    await import_fs.promises.writeFile(`${outputDir}/${page.number}.png`, Buffer.from(image.data));
    const endTime = performance.now();
    const pageTime = endTime - startTime;
    totalTime += pageTime;
    pageCount++;
    console.log(`${page.number} - rendered in ${pageTime.toFixed(2)} ms`);
  }
  if (pageCount > 0) {
    const avgTimePerPage = totalTime / pageCount;
    const pagesPerSecond = pageCount / (totalTime / 1e3);
    console.log(`
Summary:`);
    console.log(`Total pages: ${pageCount}`);
    console.log(`Total time: ${totalTime.toFixed(2)} ms`);
    console.log(`Average time per page: ${avgTimePerPage.toFixed(2)} ms`);
    console.log(`Pages per second: ${pagesPerSecond.toFixed(2)}`);
  }
  document.destroy();
  library.destroy();
}
main();
/*! Bundled license information:

sharp/lib/is.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/libvips.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/sharp.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/constructor.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/input.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/resize.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/composite.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/operation.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/colour.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/channel.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/output.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/utility.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)

sharp/lib/index.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)
*/
