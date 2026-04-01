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

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize2(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render2(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render2(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/shared/gameData.ts
var controlCards = [
  { title: "Employee Training", category: "Identify", cost: 35e3, desc: "Educates staff on social engineering, suspicious behavior, and physical security awareness." },
  { title: "Emergency Procedures", category: "Identify", cost: 3e4, desc: "Defines escalation, reporting, and verification procedures for suspicious requests and major incidents." },
  { title: "Asset Inventory", category: "Identify", cost: 25e3, desc: "Maintains a current inventory of systems, devices, owners, and critical data." },
  { title: "Risk Assessment", category: "Identify", cost: 4e4, desc: "Prioritizes cyber risk, outside testing, and acceptable-risk planning across the organization." },
  { title: "Phishing Campaigns", category: "Identify", cost: 25e3, desc: "Runs simulations to improve staff readiness against phishing and business email compromise." },
  { title: "Firewall", category: "Protect", cost: 75e3, desc: "Filters traffic between internal and external networks and segments sensitive environments." },
  { title: "Antivirus", category: "Protect", cost: 5e4, desc: "Detects and blocks known malware and suspicious execution on endpoints." },
  { title: "Multi-factor Auth", category: "Protect", cost: 9e4, desc: "Adds a second factor to authentication so stolen passwords are less useful." },
  { title: "Encryption", category: "Protect", cost: 85e3, desc: "Protects sensitive data at rest and in transit, including backups and portable devices." },
  { title: "Patch Management", category: "Protect", cost: 6e4, desc: "Applies security updates quickly to reduce exposure to known vulnerabilities." },
  { title: "SIEM Monitoring", category: "Detect", cost: 1e5, desc: "Centralizes logging and alerting to help teams spot suspicious activity faster." },
  { title: "User Activity Logs", category: "Detect", cost: 3e4, desc: "Tracks unusual logins, behavior changes, and risky account usage." },
  { title: "IDS", category: "Detect", cost: 8e4, desc: "Detects network intrusion attempts and suspicious east-west movement." },
  { title: "Endpoint Detection", category: "Detect", cost: 6e4, desc: "Provides deeper endpoint visibility into malware, scripts, and persistence behavior." },
  { title: "Threat Intelligence", category: "Detect", cost: 4e4, desc: "Uses external threat data to identify likely indicators and active attacker behavior." },
  { title: "Incident Response Team", category: "Respond", cost: 1e5, desc: "Ensures trained responders or contracted specialists can coordinate during a serious event." },
  { title: "Backup & Restore", category: "Respond", cost: 6e4, desc: "Provides tested data recovery and restoration capability after outages, corruption, or ransomware." },
  { title: "Disaster Recovery Plan", category: "Respond", cost: 8e4, desc: "Documents how to restore operations after major incidents or facility-level disruption." },
  { title: "Communications Plan", category: "Respond", cost: 4e4, desc: "Defines who communicates to staff, public, leadership, and media during an outage." },
  { title: "Legal & Compliance", category: "Respond", cost: 5e4, desc: "Covers notification rules, privacy obligations, and legal decision points after a breach." }
];
var injectCardDrafts = [
  {
    event: "Living-off-the-Land (LotL) PowerShell Attack",
    description: "An attacker uses legitimate Windows tools (PowerShell and WMI) to move laterally through your network.",
    impacts: [
      { text: "Lateral movement across network \xE2\u20AC\u201C $75,000", mitigatedBy: "IDS" },
      { text: "Malware-less persistence established \xE2\u20AC\u201C $45,000", mitigatedBy: "Endpoint Detection" }
    ],
    stats: "60% of modern attacks now use 'LotL' techniques, where no actual malware files are ever saved to the disk.",
    remediation: "Enforce PowerShell Constrained Language Mode and use Endpoint Detection (EDR) to monitor for suspicious process parenting."
  },
  {
    event: "Phishing Whaling Attack",
    description: "An email from a bad actor impersonating a high ranking administrator is received. Requesting an urgent payroll transfer due to a recent bank account change. Payroll processes this change.",
    impacts: [
      { text: "Payroll funds misdirected \xE2\u20AC\u201C $35,000", mitigatedBy: "Employee Training" },
      { text: "No verification of transfer \xE2\u20AC\u201C $30,000", mitigatedBy: "Phishing Campaigns" }
    ],
    stats: "Phishing attacks cost US businesses $17B annually. Approximately 30% of employees click phishing links without training.",
    remediation: "Conduct employee phishing simulations and implement strict verification for anything relating to password changes, MFA Resets, Change in bank information, Paying Invoices and Wire transfers. Do you require these types of changes to be in person?"
  },
  {
    event: "Internet Service Outage",
    description: "A neighboring business has a sprinkler line put in and accidently cuts your connection to your ISP, taking your internet down for 3 days.",
    impacts: [
      { text: "Business operations disrupted \xE2\u20AC\u201C $50,000", mitigatedBy: "Disaster Recovery Plan" },
      { text: "Unable to communicate to all parties \xE2\u20AC\u201C $30,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Accidental outages are extremely common, and are something a good business continitunity plan would help protect against.",
    remediation: "Outages come in all shapes and sizes, and not just ransomware events. Would your environment survive this?"
  },
  {
    event: "Ransomware \xE2\u20AC\u201C Double Extortion",
    description: "Your Critical Authentication servers have been encrypted. Sensitive data is exfiltrated and a heafty ransom is demanded.",
    impacts: [
      { text: "Malware executed \xE2\u20AC\u201C $80,000", mitigatedBy: "Antivirus" },
      { text: "Unable to restore systems quickly \xE2\u20AC\u201C $120,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Average ransomware recovery costs now exceed $5.08 Million! Aside from the 1,000's of man hours and months it can take to recover.",
    remediation: "Use layered defenses, maintain onsite and offsite backups, and test incident response plans regularly. Are you prepared to pay? Not to pay? What if its medical data involving patient images? There are many things to consider here."
  },
  {
    event: "Insider Threat \xE2\u20AC\u201C Data Exfiltration",
    description: "An Employee downloads confidential data and uploads it to their personal cloud storage because they said it was easier to use. Internal documents have been leaked to the news.",
    impacts: [
      { text: "Intellectual property loss \xE2\u20AC\u201C $70,000", mitigatedBy: "User Activity Logs" },
      { text: "Business strategy exposure \xE2\u20AC\u201C $35,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "Insider threats cause over $8.76M in losses per year.",
    remediation: "Monitor user behavior and enforce least privilege. Google and Microsoft both have tools to monitor both intentional and unintentional possible data exfil."
  },
  {
    event: "Malware via USB Drop",
    description: "An infected USB drive is placed in the parking lot of your organization. A staff member is curious and plugs it into their workstation. Malware quickly spreads through your network.",
    impacts: [
      { text: "Malware infection \xE2\u20AC\u201C $25,000", mitigatedBy: "Antivirus" },
      { text: "Lateral movement risk \xE2\u20AC\u201C $20,000", mitigatedBy: "Patch Management" }
    ],
    stats: "With new techniques being implemented all the time, USB-based malware still remains a common infection vector. Many attackers will spend over a year trying to get into a target company. Its much easier to drop a flash drive or send a phishing email to get the Information they need to attack than it is to attack externally",
    remediation: "Educate staff and use endpoint protection."
  },
  {
    event: "Web Application Exploit",
    description: "Your Employee web portal was not updated to the lastet security standards. An attacker used SQL injection to gain access to your employee information database and customer portal.",
    impacts: [
      { text: "Customer data exfiltrated \xE2\u20AC\u201C $55,000", mitigatedBy: "Patch Management" },
      { text: "Loss of trust \xE2\u20AC\u201C $20,000", mitigatedBy: "Encryption" }
    ],
    stats: "Web application attacks are the top method for data breaches. It can take teams of people years to fully secure a site with new Vulnerabilities coming out every day.",
    remediation: "Patch systems and conduct penetration testing. OWASP Juice Shop has some good tutorials on Injection attacks."
  },
  {
    event: "MFA Fatigue / Push Bombing",
    description: "During a major update, An attacker with a stolen password sends hundreds of MFA push notifications to a sysadmin. Thinking it was part of the update process, the admin clicks 'Approve'.",
    impacts: [
      { text: "Administrative account compromise \xE2\u20AC\u201C $100,000", mitigatedBy: "Employee Training" },
      { text: "Infrastructure access \xE2\u20AC\u201C $50,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Push bombing was the primary vector in the high-profile Uber and Cisco breaches in 2022.",
    remediation: "Switch from simple 'Approve/Deny' push notifications to 'MFA Number Matching', or passkeys to ensure the user is physically present at the login screen."
  },
  {
    event: "Ransomware via 'PrintNightmare' Exploit",
    description: "Attackers exploit a critical vulnerability in the Windows Print Spooler service to gain SYSTEM-level privileges and deploy ransomware network-wide.",
    impacts: [
      { text: "Privilege escalation \xE2\u20AC\u201C $80,000", mitigatedBy: "Patch Management" },
      { text: "Widespread file encryption \xE2\u20AC\u201C $120,000", mitigatedBy: "Antivirus" }
    ],
    stats: "Critical vulnerabilities like PrintNightmare allow low-level users to become domain admins in seconds.",
    remediation: "Disable the Print Spooler service on domain controllers and ensure critical security patches are applied within a resonable time period after release."
  },
  {
    event: "Supply Chain Attack: Malicious Library (Log4j Anyone?)",
    description: "An internal application relies on an Open Source library that has been hijacked by a foreign threat actor. The library contains a back-door.",
    impacts: [
      { text: "Application back-door \xE2\u20AC\u201C $65,000", mitigatedBy: "Threat Intelligence" },
      { text: "Data exfiltration via API \xE2\u20AC\u201C $45,000", mitigatedBy: "IDS" }
    ],
    stats: "Supply chain attacks (like the SolarWinds breach) are devastating because the software comes from a 'trusted' vendor.",
    remediation: "Maintain a Software Bill of Materials (SBOM) and use network segmentation to prevent apps from communicating with unknown external IPs."
  },
  {
    event: "Shadow AI / Prompt Injection",
    description: "A staff member uses an unauthorized third-party AI tool to 'summarize' confidential information. The AI tool's database is used to train a public model, exposing your confidential data.",
    impacts: [
      { text: "Intellectual property leak \xE2\u20AC\u201C $75,000", mitigatedBy: "Risk Assessment" },
      { text: "Compliance violation (Data Privacy) \xE2\u20AC\u201C $45,000", mitigatedBy: "Legal & Compliance" }
    ],
    stats: "Shadow AI (using AI without IT approval) has overtaken other types of accidental corporate data leakage Worldwide.",
    remediation: "Establish an 'Acceptable Use Policy' for Generative AI and implement CASB (Cloud Access Security Broker) tools to block unauthorized AI domains."
  },
  {
    event: "Physical Social Engineering: 'Tailgating'",
    description: "A person dressed as a delivery driver, carrying a large box, waits by the Main entrance. A staff member holds the door open for them. The intruder places a 'Dropbox' device (a small pirate computer) behind a printer, granting them remote access to your internal network.",
    impacts: [
      { text: "Physical perimeter breach \xE2\u20AC\u201C $40,000", mitigatedBy: "Employee Training" },
      { text: "Internal network backdoor \xE2\u20AC\u201C $70,000", mitigatedBy: "IDS" }
    ],
    stats: "Physical security is the first line of defense; a $100 device hidden inside a building can bypass a $100,000 external firewall.",
    remediation: "Conduct 'Badge-In' training and ensure that all network jacks in public-facing areas (lobbies, conference rooms) are disabled or restricted by MAC-filtering."
  },
  {
    event: "How was your Hawaii trip?",
    description: "A staff member unknowingly brings a family of hissing cockroaches back from vacation in their backpack. These pests have now infested the server room, and they are causing electrical arcing and shorting out of equipment.",
    impacts: [
      { text: "Hardware failure and short circuits \xE2\u20AC\u201C $85,000", mitigatedBy: "Risk Assessment" },
      { text: "Network downtime and data loss \xE2\u20AC\u201C $45,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Environmental threats aren't just weather-related; bio-infestations can cause permanent 'carbon tracking' on circuit boards, leading to cascading hardware failures that are often not covered by standard e-waste warranties.",
    remediation: "Immediately power down affected racks to prevent fire, engage professional pest control for deep-clean fumigation, and utilize off-site Disaster Recovery (DR) sites to maintain business continuity while hardware is replaced."
  },
  {
    event: "DDoS Attack",
    description: "Bad Actors flood your external facing IP's with traffic, causing your network equipment to have a memory dump error and crash. You are currently down.",
    impacts: [
      { text: "Service downtime \xE2\u20AC\u201C $35,000", mitigatedBy: "Firewall" },
      { text: "Lost revenue \xE2\u20AC\u201C $25,000", mitigatedBy: "Incident Response Team" }
    ],
    stats: "Average DDoS attack costs $20,000\xE2\u20AC\u201C$40,000 per hour of downtime.",
    remediation: "Deploy traffic filtering and response procedures. Remember that having your device ignore traffic still has a CPU cost. Do you have DDos prevention?"
  },
  {
    event: "Spear Phishing \xE2\u20AC\u201C HR Compromise",
    description: "An email was sent to HR asking them to Verify Their Email or it will be shut off. The Staff members put in their username and password allowing their Credentials to be sent to a bad actor. This resulted in stolen data, exposing employee PII, and an impending ransomware attack.",
    impacts: [
      { text: "Employee PII leaked \xE2\u20AC\u201C $40,000", mitigatedBy: "Employee Training" },
      { text: "Reputation damage \xE2\u20AC\u201C $15,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Social engineering caused 36% of reported breaches in 2023.",
    remediation: "Train staff on IT procedures and enforce MFA on all accounts. This is an extremely common attack vector and millions of these types of emails are sent daily."
  },
  {
    event: "Communications outage",
    description: "AWS North american servers are down. Your VOIP, and Email providers are expierencing an outage as a result.",
    impacts: [
      { text: "Servers are Down \xE2\u20AC\u201C $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to contact staff/Members \xE2\u20AC\u201C $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "3rd party outages cost companies Billions in losses globally.",
    remediation: "Cyber resilance plans are important for all scenarios. Make good generalized Disaster recovery plans. Do you have a way to communicate if phones and email are down?"
  },
  {
    event: "Door Access Control Outage",
    description: "Targeting IOT devices, A bad actor tries to access your Facilites door access server. The bad actor did not gain access, but the Database that holds all of your door access key card data is now corrupted.",
    impacts: [
      { text: "Access control restricted \xE2\u20AC\u201C $60,000", mitigatedBy: "SIEM Monitoring" },
      { text: "Unable to access buildings \xE2\u20AC\u201C $20,000", mitigatedBy: "Backup & Restore" }
    ],
    stats: "Third-party and IoT-related outages contribute to billions of dollars in global business losses each year.",
    remediation: "Implement cyber resilience and disaster recovery plans, including regular backups and monitoring of physical security systems. Do you have a way to get in and out of your buildings without keycard access?"
  },
  {
    event: "Natures Course",
    description: "An earthquake has taken out your Main Data Center. All other business locations seem to have limited damage.",
    impacts: [
      { text: "Outage per Hour \xE2\u20AC\u201C $60,000", mitigatedBy: "Emergency Procedures" },
      { text: "Unable to Contact Staff/Members or emergency personel \xE2\u20AC\u201C $20,000", mitigatedBy: "Communications Plan" }
    ],
    stats: "Industry surveys suggest that **90% of mid-sized and large enterprises can lose more than $300,000 in revenue per hour of downtime after a major weather event.",
    remediation: "If a major weather event or earthquake were to happen, how would your building(s) survive? How quickly could you recover from an event like this?."
  },
  {
    event: "Lost Unencrypted Laptop",
    description: "An Employee at a conference leaves their laptop with sensitive data in their vehicle. The laptop is missing and presumed stolen.",
    impacts: [
      { text: "Data exposure \xE2\u20AC\u201C $45,000", mitigatedBy: "Encryption" },
      { text: "Asset tracking failure \xE2\u20AC\u201C $20,000", mitigatedBy: "Asset Inventory" }
    ],
    stats: "Lost devices are the direct cause of 15% of data breaches.",
    remediation: "Encrypt devices and track assets. Do you have a good inventory system? Inventory is #1 in the NIST Framework for Cybersecurity Controls. Would you know if a laptop was missing, or who one belonged to if it was found?"
  },
  {
    event: "DNS Hijacking",
    description: "Domain records are altered to redirect web traffic from a known good website to a malicious one. This bad shortcut is now being pushed to all staff.",
    impacts: [
      { text: "Website outage \xE2\u20AC\u201C $35,000", mitigatedBy: "Threat Intelligence" },
      { text: "Delayed detection \xE2\u20AC\u201C $20,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "DNS hijacks can impact thousands of users quickly and are hard to catch.",
    remediation: "Secure DNS accounts and monitor changes."
  },
  {
    event: "Insider Sabotage",
    description: "A Disgruntled employee deletes all your Access management Data before he leaves on his last day. ie;ise, AD, entra etc.",
    impacts: [
      { text: "Data loss \xE2\u20AC\u201C $60,000", mitigatedBy: "Backup & Restore" },
      { text: "Delayed detection \xE2\u20AC\u201C $30,000", mitigatedBy: "User Activity Logs" }
    ],
    stats: "Insider sabotage is frequent in todays business world and can cause major operational damage and downtime if recovery systems are not put in place.",
    remediation: "Monitor behavior and enforce access controls. Do you have a goood onboarding and offboarding process?"
  },
  {
    event: "Credential Harvesting Website",
    description: "Staff trying to download a PDF reader find themselves on a Fake login page that captures their credentials (Username and password).",
    impacts: [
      { text: "Account compromise \xE2\u20AC\u201C $35,000", mitigatedBy: "Employee Training" },
      { text: "Unauthorized access \xE2\u20AC\u201C $25,000", mitigatedBy: "Multi-factor Auth" }
    ],
    stats: "Credential harvesting is a top phishing tactic alongside direct payroll, giftcard and money transfer schemes.",
    remediation: "Educate users and enforce MFA."
  },
  {
    event: "Public Wi-Fi Credential Theft",
    description: "Employee logs in to unsecured Wi-Fi that closely mimics yours, giving up that users username and password for your organization.",
    impacts: [
      { text: "Credential interception \xE2\u20AC\u201C $30,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Unauthorized access \xE2\u20AC\u201C $20,000", mitigatedBy: "Employee Training" }
    ],
    stats: "Public Wi-Fi is a high-risk environment and shouldnt be used by Employees.",
    remediation: "Train staff and enforce MFA. With the large scale attacks in todays environment, excersise extreme caution with any Free or public wifi. Most should never be used on company owned devices."
  },
  {
    event: "VPN Credential Leak",
    description: "An Admin asks for VPN access to allow them to work from home when needed. At a conference a bad actor spots their credentials on a post it note on their laptop, allowing remote access to your environment.",
    impacts: [
      { text: "Network breach \xE2\u20AC\u201C $40,000", mitigatedBy: "Multi-factor Auth" },
      { text: "Suspicious activity unnoticed \xE2\u20AC\u201C $30,000", mitigatedBy: "SIEM Monitoring" }
    ],
    stats: "VPN access remains a prime target. Many compaines will allow VPN access for remote work from personal devices or improperly secured ones.",
    remediation: "Enforce MFA and monitor logins. In General, VPN Access should only be allowed by those individuals it is strictly necessary for and not on a permananent basis. Setting login times can also help prevent attacks."
  },
  {
    event: "New Parking Lot.",
    description: "A sink Hole drops your primary data center into a 20ft hole.",
    impacts: [
      { text: "Loss of Data \xE2\u20AC\u201C $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natural Disaster \xE2\u20AC\u201C $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios, and test backups regularly."
  },
  {
    event: "Do you hear buzzing?.",
    description: "Bees have taken over your server room through the HVAC system. Your entire building has to be evacuated and the HVAC has to be turned off for removal which could take several days.",
    impacts: [
      { text: "Loss of Data \xE2\u20AC\u201C $80,000", mitigatedBy: "Backup & Restore" },
      { text: "Natures Course \xE2\u20AC\u201C $2,000,000", mitigatedBy: "Disaster Recovery Plan" }
    ],
    stats: "Environmental problems are an ever present risk.",
    remediation: "Train staff on Worst Case Senarios. Rememember: You dont need a plan for all outages, just the category of outage."
  }
];
function slugifyInjectEvent(event) {
  return event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
var injectCards = injectCardDrafts.map((inject) => ({
  id: slugifyInjectEvent(inject.event),
  ...inject
}));

// src/client/main.ts
var import_qrcode = __toESM(require_browser(), 1);
var app = document.getElementById("app");
if (!app) throw new Error("App root not found");
var appRoot = app;
var state = {
  socket: null,
  clientId: "",
  role: null,
  room: null,
  roomCode: new URLSearchParams(window.location.search).get("room")?.toUpperCase() ?? "",
  playerName: "",
  error: "",
  hostInfo: null,
  joinLinks: [],
  joinLinksKey: "",
  reportDrafts: {},
  currentTime: Date.now(),
  reconnectTimer: null,
  facilitatorInjectModalDismissedRound: 0,
  facilitatorSelectedPlayerId: "",
  facilitatorModalMode: "",
  facilitatorFinalModalDismissed: false,
  facilitatorFinalModalRound: 0,
  injectLibrary: [],
  injectBuilderError: "",
  injectEditorId: "",
  injectDraft: createEmptyInjectDraft(),
  adminConfigured: true,
  adminAuthenticated: false,
  adminChecking: false,
  adminLoginError: ""
};
var categoryOrder = ["Identify", "Protect", "Detect", "Respond"];
var categoryClassMap = {
  Identify: "identify",
  Protect: "protect",
  Detect: "detect",
  Respond: "respond"
};
function createEmptyInjectDraft() {
  return {
    event: "",
    description: "",
    impacts: [
      { text: "", mitigatedBy: controlCards[0]?.title ?? "" },
      { text: "", mitigatedBy: controlCards[1]?.title ?? controlCards[0]?.title ?? "" }
    ],
    stats: "",
    remediation: ""
  };
}
function cloneInjectDraft(inject) {
  return {
    event: inject.event,
    description: inject.description,
    impacts: inject.impacts.map((impact) => ({ ...impact })),
    stats: inject.stats,
    remediation: inject.remediation
  };
}
function getFacilitatorSessionStorageKey() {
  return "irtt-facilitator-session";
}
function getOrCreateFacilitatorSessionKey() {
  let sessionKey = localStorage.getItem(getFacilitatorSessionStorageKey());
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(getFacilitatorSessionStorageKey(), sessionKey);
  }
  return sessionKey;
}
function getPlayerSessionStorageKey(roomCode) {
  return `irtt-player-session:${roomCode.toUpperCase()}`;
}
function getPlayerNameStorageKey(roomCode) {
  return `irtt-player-name:${roomCode.toUpperCase()}`;
}
function getPlayerActiveRoomStorageKey() {
  return "irtt-player-active-room";
}
function getOrCreatePlayerSessionKey(roomCode) {
  const key = getPlayerSessionStorageKey(roomCode);
  let sessionKey = localStorage.getItem(key);
  if (!sessionKey) {
    sessionKey = crypto.randomUUID();
    localStorage.setItem(key, sessionKey);
  }
  return sessionKey;
}
function persistPlayerIdentity(roomCode, playerName) {
  localStorage.setItem(getPlayerNameStorageKey(roomCode), playerName);
  getOrCreatePlayerSessionKey(roomCode);
}
function getStoredPlayerIdentity(roomCode) {
  return {
    name: localStorage.getItem(getPlayerNameStorageKey(roomCode)) ?? "",
    sessionKey: localStorage.getItem(getPlayerSessionStorageKey(roomCode)) ?? ""
  };
}
function getActivePlayerRoomCode() {
  return sessionStorage.getItem(getPlayerActiveRoomStorageKey()) ?? "";
}
function setActivePlayerRoomCode(roomCode) {
  sessionStorage.setItem(getPlayerActiveRoomStorageKey(), roomCode.toUpperCase());
}
function clearActivePlayerRoomCode() {
  sessionStorage.removeItem(getPlayerActiveRoomStorageKey());
}
function getFieldPreserveKey(element) {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
    return "";
  }
  if (element.id) return `id:${element.id}`;
  if (element instanceof HTMLInputElement && element.closest(".report-check")) return `report-check:${element.value}`;
  if ("impactTextIndex" in element.dataset && element.dataset.impactTextIndex) return `impact-text:${element.dataset.impactTextIndex}`;
  if ("impactControlIndex" in element.dataset && element.dataset.impactControlIndex) return `impact-control:${element.dataset.impactControlIndex}`;
  return "";
}
function capturePreservedFields() {
  const activeElement = document.activeElement;
  return [...appRoot.querySelectorAll("input, textarea, select")].map((element) => {
    const key = getFieldPreserveKey(element);
    if (!key) return null;
    const field = element;
    return {
      key,
      value: field.value,
      checked: field instanceof HTMLInputElement ? field.checked : void 0,
      selectionStart: "selectionStart" in field ? field.selectionStart : null,
      selectionEnd: "selectionEnd" in field ? field.selectionEnd : null,
      hadFocus: activeElement === field
    };
  }).filter((snapshot) => Boolean(snapshot));
}
function restorePreservedFields(snapshots) {
  if (!snapshots.length) return;
  const fieldMap = /* @__PURE__ */ new Map();
  for (const element of appRoot.querySelectorAll("input, textarea, select")) {
    const key = getFieldPreserveKey(element);
    if (key) fieldMap.set(key, element);
  }
  for (const snapshot of snapshots) {
    const nextField = fieldMap.get(snapshot.key);
    if (!(nextField instanceof HTMLInputElement || nextField instanceof HTMLTextAreaElement || nextField instanceof HTMLSelectElement)) {
      continue;
    }
    if (nextField instanceof HTMLInputElement && typeof snapshot.checked === "boolean") {
      nextField.checked = snapshot.checked;
    } else {
      nextField.value = snapshot.value;
    }
    if (snapshot.hadFocus) {
      nextField.focus();
      if ("setSelectionRange" in nextField && typeof snapshot.selectionStart === "number" && typeof snapshot.selectionEnd === "number") {
        nextField.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
      }
    }
  }
}
function getView() {
  if (window.location.pathname.startsWith("/admin/injects")) return "admin";
  if (window.location.pathname.startsWith("/facilitator")) return "facilitator";
  if (window.location.pathname.startsWith("/player")) return "player";
  return "landing";
}
function getJoinUrls() {
  if (!state.hostInfo || !state.roomCode) return [];
  const baseUrl = state.hostInfo.joinBaseUrl?.trim();
  if (baseUrl) {
    return [`${baseUrl}/player?room=${state.roomCode}`];
  }
  if (state.hostInfo.addresses.length) {
    return state.hostInfo.addresses.map((address) => `http://${address}:${state.hostInfo?.port}/player?room=${state.roomCode}`);
  }
  return [`${window.location.origin}/player?room=${state.roomCode}`];
}
async function refreshJoinLinks() {
  const urls = getJoinUrls();
  const nextKey = urls.join("|");
  if (!urls.length) {
    state.joinLinks = [];
    state.joinLinksKey = "";
    return;
  }
  if (nextKey === state.joinLinksKey && state.joinLinks.length === urls.length) {
    return;
  }
  state.joinLinksKey = nextKey;
  state.joinLinks = await Promise.all(
    urls.map(async (url) => ({
      url,
      qrDataUrl: await import_qrcode.default.toDataURL(url, { margin: 1, width: 220 })
    }))
  );
}
function getReportDraftKey(round) {
  return `${state.roomCode}:${round}`;
}
function getReportDraft(round) {
  return state.reportDrafts[getReportDraftKey(round)] ?? { summary: "", notified: [] };
}
function updateReportDraft(round, nextDraft) {
  state.reportDrafts[getReportDraftKey(round)] = nextDraft;
}
function clearReportDraft(round) {
  delete state.reportDrafts[getReportDraftKey(round)];
}
function formatCountdown(targetTime) {
  const remainingMs = Math.max(0, targetTime - state.currentTime);
  const totalSeconds = Math.ceil(remainingMs / 1e3);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
async function loadHostInfo() {
  try {
    const response = await fetch("/api/info");
    state.hostInfo = await response.json();
    state.adminConfigured = state.hostInfo.adminConfigured ?? false;
    await refreshJoinLinks();
  } catch {
    state.hostInfo = null;
    state.adminConfigured = false;
    state.joinLinks = [];
    state.joinLinksKey = "";
  }
}
async function adminApiFetch(url, init = {}) {
  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: new Headers(init.headers)
  });
}
async function loadAdminSession() {
  if (getView() !== "admin") return;
  state.adminChecking = true;
  try {
    const response = await adminApiFetch("/api/admin/session");
    const payload = await response.json();
    state.adminConfigured = payload.configured;
    state.adminAuthenticated = payload.authenticated;
    state.adminLoginError = "";
    if (payload.authenticated) {
      await loadAdminInjectLibrary();
    }
  } catch {
    state.adminConfigured = true;
    state.adminAuthenticated = false;
    state.adminLoginError = "Unable to contact the admin service right now.";
  } finally {
    state.adminChecking = false;
  }
}
async function loadAdminInjectLibrary() {
  if (getView() !== "admin") return;
  try {
    const response = await adminApiFetch("/api/admin/injects");
    if (response.status === 401) {
      state.adminAuthenticated = false;
      state.injectLibrary = [];
      return;
    }
    const payload = await response.json();
    state.injectLibrary = payload.injects;
    state.injectBuilderError = "";
  } catch {
    state.injectBuilderError = "Unable to load the inject library right now.";
  }
}
async function loginAdmin(password) {
  state.adminLoginError = "";
  try {
    const response = await adminApiFetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      const payload = await response.json();
      state.adminLoginError = payload.message ?? "Login failed.";
      render();
      return;
    }
    state.adminAuthenticated = true;
    state.injectDraft = createEmptyInjectDraft();
    state.injectEditorId = "";
    await loadAdminInjectLibrary();
    render();
  } catch {
    state.adminLoginError = "Unable to contact the admin service right now.";
    render();
  }
}
async function logoutAdmin() {
  try {
    await adminApiFetch("/api/admin/logout", { method: "POST" });
  } catch {
  }
  state.adminAuthenticated = false;
  state.injectLibrary = [];
  state.injectBuilderError = "";
  state.injectEditorId = "";
  state.injectDraft = createEmptyInjectDraft();
  render();
}
function maybeAutoRejoinPlayerRoom() {
  if (getView() !== "player" || !state.roomCode || !state.socket || state.room) return;
  if (getActivePlayerRoomCode() !== state.roomCode) return;
  const stored = getStoredPlayerIdentity(state.roomCode);
  if (!stored.name || !stored.sessionKey) return;
  state.playerName = stored.name;
  send({ type: "join-room", roomCode: state.roomCode, name: stored.name, sessionKey: stored.sessionKey });
}
function maybeAutoRejoinFacilitatorRoom() {
  if (getView() !== "facilitator" || !state.roomCode || !state.socket || state.room) return;
  send({ type: "rejoin-facilitator", roomCode: state.roomCode, sessionKey: getOrCreateFacilitatorSessionKey() });
}
function connect() {
  if (state.socket || !["facilitator", "player"].includes(getView())) return;
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  state.socket = new WebSocket(`${protocol}://${window.location.host}`);
  state.socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "welcome") {
      state.clientId = message.clientId;
      state.role = message.role;
    }
    if (message.type === "room-created") {
      state.roomCode = message.roomCode;
      history.replaceState(null, "", `/facilitator?room=${message.roomCode}`);
      void refreshJoinLinks().then(() => render());
    }
    if (message.type === "room-state") {
      const priorPhase = state.room?.phase;
      const priorInjectRound = state.room?.currentInject?.round ?? 0;
      state.room = message.room;
      if (getView() === "facilitator") {
        void refreshJoinLinks().then(() => render());
      }
      if (getView() === "player" && message.room.currentInject) {
        const resolution = message.room.currentInject.resolutions.find((entry) => entry.playerId === state.clientId);
        if (resolution?.reportSubmitted) {
          clearReportDraft(message.room.currentInject.round);
        }
      }
      if (getView() === "player") {
        const playerExists = message.room.players.some((player) => player.id === state.clientId);
        if (playerExists) {
          setActivePlayerRoomCode(message.room.roomCode);
        }
      }
      if (getView() === "facilitator") {
        if (!state.facilitatorSelectedPlayerId && message.room.players.length) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
        }
        const selectedStillExists = message.room.players.some((player) => player.id === state.facilitatorSelectedPlayerId);
        if (!selectedStillExists) {
          state.facilitatorSelectedPlayerId = message.room.players[0]?.id ?? "";
          state.facilitatorModalMode = "";
        }
        if (message.room.currentInject && message.room.currentInject.round !== priorInjectRound) {
          state.facilitatorInjectModalDismissedRound = 0;
        }
        if (message.room.phase === "hotwash" && priorPhase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = message.room.round;
        }
        if (message.room.phase !== "hotwash") {
          state.facilitatorFinalModalDismissed = false;
          state.facilitatorFinalModalRound = 0;
        }
      }
    }
    if (message.type === "error") {
      state.error = message.message;
    }
    render();
    maybeAutoRejoinPlayerRoom();
    maybeAutoRejoinFacilitatorRoom();
  });
  state.socket.addEventListener("close", () => {
    state.socket = null;
    if (state.reconnectTimer) {
      window.clearTimeout(state.reconnectTimer);
    }
    if (!["facilitator", "player"].includes(getView())) return;
    state.reconnectTimer = window.setTimeout(() => {
      state.reconnectTimer = null;
      connect();
    }, 1e3);
    render();
  });
}
function send(message) {
  state.error = "";
  state.socket?.send(JSON.stringify(message));
}
function cardSelected(player, cardTitle) {
  return player?.selectedCards.includes(cardTitle) ?? false;
}
function getLocalPlayer() {
  return state.room?.players.find((player) => player.id === state.clientId);
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderRoomJoinSummary() {
  if (!state.hostInfo || !state.roomCode) return `<div class="muted">Join details will appear once the room is ready.</div>`;
  if (!state.joinLinks.length) return `<div class="muted">Generating join QR code...</div>`;
  const primaryJoinLink = state.joinLinks[0];
  const joinDisplayUrl = primaryJoinLink.url.split("?")[0] ?? primaryJoinLink.url;
  return `
    <div class="room-code-block">
      <img class="join-qr compact" src="${primaryJoinLink.qrDataUrl}" alt="QR code for ${escapeHtml(primaryJoinLink.url)}">
      <div>
        <div class="eyebrow">Room</div>
        <h2 class="room-code-value">Code: ${state.roomCode}</h2>
        <div class="muted room-join-path">${escapeHtml(joinDisplayUrl)}</div>
      </div>
    </div>
  `;
}
function selectAdminInject(injectId = "") {
  state.injectBuilderError = "";
  state.injectEditorId = injectId;
  if (injectId) {
    const inject = state.injectLibrary.find((entry) => entry.id === injectId);
    state.injectDraft = inject ? cloneInjectDraft(inject) : createEmptyInjectDraft();
  } else {
    state.injectDraft = createEmptyInjectDraft();
  }
  render();
}
function renderLanding() {
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Multiplayer Classroom Mode</div>
          <h1>Incident Response Tabletop Live</h1>
          <p class="muted">A facilitator hosts the room, players join on their own devices, everyone builds a deck, then the room survives the inject phase together.</p>
        </div>
        <div class="landing-actions">
          <a href="/facilitator"><button>Facilitator Screen</button></a>
          <a href="/player"><button class="secondary">Player Join</button></a>
        </div>
      </div>
    </div>
  `;
}
function renderInject(currentInject) {
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => `<div class="inject-row"><span>${escapeHtml(impact.text)}</span><span class="badge warn">${escapeHtml(impact.mitigatedBy)}</span></div>`).join("")}
    <div class="spacer"></div>
    <div class="eyebrow">Player outcomes</div>
    ${currentInject.resolutions.map((resolution) => `
      <div class="inject-row">
        <strong>${escapeHtml(resolution.playerName)}</strong>
        <div class="stack">
          ${resolution.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
          <span class="badge ${resolution.delta >= 0 ? "good" : "bad"}">${resolution.delta >= 0 ? "+" : ""}${resolution.delta}</span>
        </div>
      </div>
    `).join("")}
    ${currentInject.reports.length ? `
      <div class="spacer"></div>
      <div class="eyebrow">Submitted Reports</div>
      ${currentInject.reports.map((report) => `
        <div class="report-card">
          <strong>${escapeHtml(report.playerName)}</strong>
          <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
          <div class="row">
            ${report.notified.length ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("") : `<span class="badge">No notifications selected</span>`}
          </div>
        </div>
      `).join("")}
    ` : ""}
  `;
}
function renderFacilitatorPlayerInjectModal(currentInject, player) {
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === player.id);
  const report = currentInject.reports.find((entry) => entry.playerId === player.id);
  return `
    <div class="eyebrow">Current Round View</div>
    <h2>${escapeHtml(player.name)}</h2>
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
    const protectedByPlayer = player.selectedCards.includes(impact.mitigatedBy);
    return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
  }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Round Result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    ${report ? `
      <div class="report-card">
        <strong>Submitted Report</strong>
        <div class="muted">${report.summary ? escapeHtml(report.summary) : "No written summary provided."}</div>
        <div class="row">
          ${report.notified.length ? report.notified.map((entry) => `<span class="badge warn">${escapeHtml(entry)}</span>`).join("") : `<span class="badge">No notifications selected</span>`}
        </div>
      </div>
    ` : `<div class="report-card"><strong>No report submitted</strong><div class="muted">This player did not submit the optional incident report for this round.</div></div>`}
  `;
}
function renderInjectDiscussionModal(currentInject) {
  return `
    <div class="eyebrow">Current Inject</div>
    <h2>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h2>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => `
      <div class="inject-row">
        <span>${escapeHtml(impact.text)}</span>
        <span class="badge warn">${escapeHtml(impact.mitigatedBy)}</span>
      </div>
    `).join("")}
    <div class="spacer"></div>
    <div class="report-card">
      <strong>Remediation Guidance</strong>
      <div class="muted">${escapeHtml(currentInject.inject.remediation)}</div>
    </div>
    <div class="spacer"></div>
    <div class="report-card">
      <strong>Discussion Prompt</strong>
      <div class="stack modal-prompt-list">
        <div>What happened first, and how would your team confirm the incident is real?</div>
        <div>Who needs to be notified in the first 15 minutes?</div>
        <div>Which selected controls helped most, and what gaps were exposed?</div>
        <div>What is your next operational decision before moving to the next round?</div>
      </div>
    </div>
  `;
}
function renderInjectBuilderContent() {
  const draft = state.injectDraft;
  return `
    <div class="inject-builder-page">
      ${state.injectBuilderError ? `<div class="panel slim-panel"><span class="badge bad">${escapeHtml(state.injectBuilderError)}</span></div>` : ""}
      <div class="inject-builder-layout">
        <div class="inject-library-list">
          <div class="inject-builder-section-row">
            <div class="eyebrow">Library</div>
            <button class="secondary slim-button" id="create-new-inject" type="button">New Inject</button>
          </div>
          ${state.injectLibrary.length ? state.injectLibrary.map((inject) => `
              <div class="inject-library-item ${inject.id === state.injectEditorId ? "active" : ""}">
                <div>
                  <strong>${escapeHtml(inject.event)}</strong>
                  <div class="muted">${inject.impacts.length} impacts</div>
                </div>
                <div class="stack">
                  <button class="secondary slim-button" data-inject-edit-id="${inject.id}">Edit</button>
                  <button class="danger slim-button" data-inject-delete-id="${inject.id}">Delete</button>
                </div>
              </div>
            `).join("") : `<div class="muted">No inject cards yet. Create the first one to seed the library.</div>`}
        </div>
        <div class="inject-builder-form">
          <label class="form-block">
            <span class="eyebrow">Inject Title</span>
            <input id="inject-event" value="${escapeHtml(draft.event)}" maxlength="120" placeholder="Ransomware - Shared Drive Encryption">
          </label>
          <label class="form-block">
            <span class="eyebrow">Scenario Description</span>
            <textarea id="inject-description" maxlength="600" placeholder="What is happening in this inject?">${escapeHtml(draft.description)}</textarea>
          </label>
          <div class="form-block">
            <div class="inject-builder-section-row">
              <span class="eyebrow">Impact Rows</span>
              <button class="secondary slim-button" id="add-impact-row" type="button">Add Impact</button>
            </div>
            <div class="inject-impact-list">
              ${draft.impacts.map((impact, index) => `
                <div class="inject-impact-editor">
                  <input data-impact-text-index="${index}" value="${escapeHtml(impact.text)}" maxlength="140" placeholder="What goes wrong for the team?">
                  <select data-impact-control-index="${index}">
                    ${controlCards.map((card) => `<option value="${escapeHtml(card.title)}" ${impact.mitigatedBy === card.title ? "selected" : ""}>${escapeHtml(card.title)}</option>`).join("")}
                  </select>
                  <button class="danger slim-button" data-remove-impact-index="${index}" type="button" ${draft.impacts.length <= 1 ? "disabled" : ""}>Remove</button>
                </div>
              `).join("")}
            </div>
          </div>
          <label class="form-block">
            <span class="eyebrow">Context / Stats</span>
            <textarea id="inject-stats" maxlength="400" placeholder="Why does this scenario matter in the real world?">${escapeHtml(draft.stats)}</textarea>
          </label>
          <label class="form-block">
            <span class="eyebrow">Remediation Guidance</span>
            <textarea id="inject-remediation" maxlength="500" placeholder="What should the team discuss or do next?">${escapeHtml(draft.remediation)}</textarea>
          </label>
          <div class="controls">
            <button class="success" id="save-inject">${state.injectEditorId ? "Save Changes" : "Create Inject"}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function renderFacilitator() {
  const room = state.room;
  const players = room?.players ?? [];
  const ready = players.filter((player) => player.locked).length;
  const canBegin = Boolean(room && room.phase === "deckbuild" && players.length > 0 && ready === players.length);
  const currentInject = room?.currentInject;
  const showFinishGame = Boolean(room && room.phase === "gameplay" && room.round >= room.maxRounds && currentInject);
  const deckbuildCountdown = room?.phase === "deckbuild" && room.deckbuildAutoLockAt ? formatCountdown(room.deckbuildAutoLockAt) : "";
  const selectedPlayer = players.find((player) => player.id === state.facilitatorSelectedPlayerId) ?? players[0];
  const showInjectDiscussionModal = Boolean(
    currentInject && room?.phase === "gameplay" && currentInject.round !== state.facilitatorInjectModalDismissedRound
  );
  const showFinalModal = Boolean(
    room && room.phase === "hotwash" && room.round >= room.maxRounds && !state.facilitatorFinalModalDismissed
  );
  const showPlayerModal = Boolean(selectedPlayer && state.facilitatorModalMode);
  const playersPanel = `
    <div class="panel">
      <div class="eyebrow">Players</div>
      <h3>Readiness Board</h3>
      <div class="players">
        ${players.length ? players.map((player) => `
          <div class="player-row">
            <div>
              <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "deck" ? "active" : ""}" data-player-id="${player.id}" data-player-view="deck">${escapeHtml(player.name)}</button>
              <div class="muted">${player.selectedCards.length} cards selected \u2022 ${player.budgetRemaining.toLocaleString()} budget left</div>
            </div>
            <div class="stack">
              <button class="secondary remove-player-button" data-remove-player-id="${player.id}">Remove</button>
              <span class="badge ${player.connected ? "good" : "warn"}">${player.connected ? "Connected" : "Offline"}</span>
              <button class="badge badge-toggle ${player.locked ? "good" : "warn"}" data-toggle-player-lock="${player.id}" type="button">${player.locked ? "Locked" : "Building"}</button>
            </div>
          </div>
        `).join("") : `<div class="muted">No players yet. Share the join URL and room code.</div>`}
      </div>
    </div>
  `;
  const leaderboardPanel = `
    <div class="panel">
      <div class="eyebrow">Leaderboard</div>
      <h3>Team Results</h3>
      <div class="leaderboard">
        ${players.map((player) => `
          <div class="leaderboard-item">
            <button class="player-name-button ${player.id === selectedPlayer?.id && state.facilitatorModalMode === "inject" ? "active" : ""}" data-player-id="${player.id}" data-player-view="inject">${escapeHtml(player.name)}</button>
            <div><span class="muted">Score</span><div>${player.score}</div></div>
            <div><span class="muted">Last</span><div>${player.lastDelta >= 0 ? "+" : ""}${player.lastDelta}</div></div>
            <div><span class="muted">Hits</span><div>${player.criticalHits}</div></div>
            <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
          </div>
        `).join("") || `<div class="muted">Players will appear here after they join the room.</div>`}
      </div>
    </div>
  `;
  appRoot.innerHTML = `
    <div class="app-shell">
      ${room ? "" : `
        <div class="hero">
          <div>
            <div class="eyebrow">Facilitator Console</div>
            <h1>Run the room and drive the incident</h1>
            <p class="muted">Create the room, let everyone build decks, then move the group into live injects and hotwash.</p>
          </div>
          <div class="controls">
            ${state.adminConfigured ? `<a href="/admin/injects"><button class="secondary" type="button">Admin Injects</button></a>` : ""}
            <button id="create-room">Create Room</button>
          </div>
        </div>
      `}
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${room ? `
        <div class="panel room-panel">
          <div class="room-panel-header">
            ${renderRoomJoinSummary()}
            <div class="controls">
              <button class="secondary" id="reset-room">Reset Room</button>
              ${room.phase === "deckbuild" ? `<button class="secondary" id="start-deckbuild-timer" ${room.deckbuildAutoLockAt ? "disabled" : ""}>Start 5 Minute Timer</button>` : ""}
              ${room.phase === "deckbuild" ? `<button id="begin-gameplay" ${canBegin ? "" : "disabled"}>Begin Incident Phase</button>` : ""}
              ${room.phase === "gameplay" && !showFinishGame ? `<button id="draw-inject" ${room.round >= room.maxRounds ? "disabled" : ""}>Draw Inject</button>` : ""}
              ${showFinishGame ? `<button class="success" id="finish-game">Finish Game</button>` : ""}
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Phase</span><span class="value">${room.phase}</span></div>
            <div class="stat"><span class="muted">Players</span><span class="value">${players.length}</span></div>
            <div class="stat"><span class="muted">Locked</span><span class="value">${ready}/${players.length}</span></div>
            <div class="stat"><span class="muted">Round</span><span class="value">${room.round}/${room.maxRounds}</span></div>
          </div>
          ${deckbuildCountdown ? `<div class="spacer"></div><div class="badge warn">Auto-lock and incident start in ${deckbuildCountdown}</div>` : ""}
        </div>
        <div class="layout">
          <div>
            ${room.phase === "deckbuild" ? `${playersPanel}${leaderboardPanel}` : `${leaderboardPanel}${playersPanel}`}
          </div>
          <div>
            <div class="panel">
              <div class="eyebrow">Current Inject</div>
              ${currentInject ? `<div class="controls"><button class="secondary" id="open-inject-discussion-modal">Open Briefing</button></div><div class="spacer"></div>` : ""}
              ${currentInject ? renderInject(currentInject) : `<div class="muted">No inject has been drawn yet.</div>`}
            </div>
          </div>
        </div>
      ` : ""}
      ${showPlayerModal && selectedPlayer ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            ${state.facilitatorModalMode === "deck" ? `
                <div class="eyebrow">Locked Deck</div>
                <h2>${escapeHtml(selectedPlayer.name)}</h2>
                ${selectedPlayer.selectedCards.length ? selectedPlayer.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("") : `<div class="muted">No cards selected yet.</div>`}
              ` : currentInject ? renderFacilitatorPlayerInjectModal(currentInject, selectedPlayer) : `
                  <div class="eyebrow">Current Round View</div>
                  <h2>${escapeHtml(selectedPlayer.name)}</h2>
                  <div class="muted">No inject has been drawn yet, so there is no current-round player view to display.</div>
                `}
            <div class="controls">
              <button id="close-player-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
      ${showInjectDiscussionModal && currentInject ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            ${renderInjectDiscussionModal(currentInject)}
            <div class="controls">
              <button id="close-inject-discussion-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
      ${showFinalModal && room ? `
        <div class="modal-backdrop">
          <div class="modal-card">
            <div class="eyebrow">Final Scores</div>
            <h2>Round ${room.maxRounds} complete</h2>
            <p class="muted">All five rounds have been resolved. Scores reflect how hard each team was hit over the full exercise.</p>
            <div class="leaderboard">
              ${[...players].sort((a, b) => b.score - a.score).map((player) => `
                  <div class="leaderboard-item">
                    <strong>${escapeHtml(player.name)}</strong>
                    <div><span class="muted">Final Score</span><div>${player.score}</div></div>
                    <div><span class="muted">Critical Hits</span><div>${player.criticalHits}</div></div>
                    <div><span class="muted">Cards</span><div>${player.selectedCards.length}</div></div>
                    <div><span class="muted">Status</span><div>${player.score >= 0 ? "Held" : "Overrun"}</div></div>
                  </div>
                `).join("")}
            </div>
            <div class="controls">
              <button id="close-final-modal">Close</button>
            </div>
          </div>
        </div>
      ` : ""}
    </div>
  `;
  document.getElementById("create-room")?.addEventListener(
    "click",
    () => send({ type: "create-room", sessionKey: getOrCreateFacilitatorSessionKey() })
  );
  document.getElementById("start-deckbuild-timer")?.addEventListener("click", () => send({ type: "start-deckbuild-timer", roomCode: state.roomCode, durationSeconds: 300 }));
  document.getElementById("begin-gameplay")?.addEventListener("click", () => send({ type: "begin-gameplay", roomCode: state.roomCode }));
  document.getElementById("draw-inject")?.addEventListener("click", () => send({ type: "draw-inject", roomCode: state.roomCode }));
  document.getElementById("finish-game")?.addEventListener("click", () => send({ type: "finish-game", roomCode: state.roomCode }));
  document.getElementById("reset-room")?.addEventListener("click", () => send({ type: "reset-room", roomCode: state.roomCode }));
  document.querySelectorAll("[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const clickedId = button.getAttribute("data-player-id") ?? "";
      const clickedView = button.getAttribute("data-player-view") ?? "";
      const isSame = state.facilitatorSelectedPlayerId === clickedId && state.facilitatorModalMode === clickedView;
      state.facilitatorSelectedPlayerId = isSame ? "" : clickedId;
      state.facilitatorModalMode = isSame ? "" : clickedView;
      render();
    });
  });
  document.querySelectorAll("[data-remove-player-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const playerId = button.getAttribute("data-remove-player-id") ?? "";
      const player = players.find((entry) => entry.id === playerId);
      if (!playerId || !player) return;
      const confirmed = window.confirm(`Remove ${player.name} from the room?`);
      if (!confirmed) return;
      if (state.facilitatorSelectedPlayerId === playerId) {
        state.facilitatorSelectedPlayerId = "";
        state.facilitatorModalMode = "";
      }
      send({ type: "remove-player", roomCode: state.roomCode, playerId });
    });
  });
  document.querySelectorAll("[data-toggle-player-lock]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const playerId = button.getAttribute("data-toggle-player-lock") ?? "";
      if (!playerId) return;
      send({ type: "toggle-player-lock", roomCode: state.roomCode, playerId });
    });
  });
  document.getElementById("close-player-modal")?.addEventListener("click", () => {
    state.facilitatorSelectedPlayerId = "";
    state.facilitatorModalMode = "";
    render();
  });
  document.getElementById("close-inject-discussion-modal")?.addEventListener("click", () => {
    state.facilitatorInjectModalDismissedRound = currentInject?.round ?? 0;
    render();
  });
  document.getElementById("open-inject-discussion-modal")?.addEventListener("click", () => {
    state.facilitatorInjectModalDismissedRound = 0;
    render();
  });
  document.getElementById("close-final-modal")?.addEventListener("click", () => {
    state.facilitatorFinalModalDismissed = true;
    render();
  });
}
function renderAdmin() {
  const injectCount = state.injectLibrary.length;
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Admin Console</div>
          <h1>Inject Builder</h1>
          <p class="muted">Manage the persistent inject library from a separate protected admin route.</p>
        </div>
        <div class="controls">
          <a href="/facilitator"><button class="secondary" type="button">Back to Facilitator</button></a>
          ${state.adminAuthenticated ? `<button id="admin-logout">Log Out</button>` : ""}
        </div>
      </div>
      ${state.adminChecking ? `
        <div class="panel">
          <div class="muted">Checking admin session...</div>
        </div>
      ` : !state.adminConfigured ? `
        <div class="panel">
          <div class="eyebrow">Not Configured</div>
          <h2>Admin login is disabled</h2>
          <p class="muted">Set <code>ADMIN_PASSWORD_HASH</code> on the server to enable the admin route.</p>
        </div>
      ` : !state.adminAuthenticated ? `
        <div class="panel admin-login-panel">
          <div class="eyebrow">Admin Login</div>
          <h2>Sign in to manage inject cards</h2>
          <p class="muted">This route is separate from the live game and uses a secure admin session.</p>
          ${state.adminLoginError ? `<div class="badge bad">${escapeHtml(state.adminLoginError)}</div>` : ""}
          <div class="join-form">
            <input id="admin-password" type="password" placeholder="Admin password">
            <button id="admin-login">Log In</button>
          </div>
        </div>
      ` : `
        <div class="panel room-panel">
          <div class="room-panel-header">
            <div>
              <div class="eyebrow">Library Status</div>
              <h2>${injectCount} Inject Cards</h2>
            </div>
            <div class="controls">
              <button class="secondary" id="create-new-inject" type="button">New Inject</button>
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="muted">Saved Injects</span><span class="value">${injectCount}</span></div>
            <div class="stat"><span class="muted">Status</span><span class="value">Protected</span></div>
            <div class="stat"><span class="muted">Route</span><span class="value">/admin/injects</span></div>
            <div class="stat"><span class="muted">Access</span><span class="value">Cookie Session</span></div>
          </div>
        </div>
        ${renderInjectBuilderContent()}
      `}
    </div>
  `;
  document.getElementById("admin-login")?.addEventListener("click", () => {
    const password = document.getElementById("admin-password")?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-password")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const password = document.getElementById("admin-password")?.value ?? "";
    void loginAdmin(password);
  });
  document.getElementById("admin-logout")?.addEventListener("click", () => {
    void logoutAdmin();
  });
  if (!state.adminAuthenticated) return;
  document.getElementById("create-new-inject")?.addEventListener("click", () => selectAdminInject());
  document.querySelectorAll("[data-inject-edit-id]").forEach((button) => {
    button.addEventListener("click", () => selectAdminInject(button.getAttribute("data-inject-edit-id") ?? ""));
  });
  document.querySelectorAll("[data-inject-delete-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const injectId = button.getAttribute("data-inject-delete-id") ?? "";
      const inject = state.injectLibrary.find((entry) => entry.id === injectId);
      if (!inject) return;
      const confirmed = window.confirm(`Delete inject card "${inject.event}"?`);
      if (!confirmed) return;
      try {
        const response = await adminApiFetch(`/api/admin/injects/${injectId}`, { method: "DELETE" });
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message ?? "Unable to delete inject.");
        }
        await loadAdminInjectLibrary();
        if (state.injectEditorId === injectId) {
          state.injectEditorId = "";
          state.injectDraft = createEmptyInjectDraft();
        }
        render();
      } catch (error) {
        state.injectBuilderError = error instanceof Error ? error.message : "Unable to delete inject.";
        render();
      }
    });
  });
  document.getElementById("add-impact-row")?.addEventListener("click", () => {
    state.injectDraft.impacts.push({ text: "", mitigatedBy: controlCards[0]?.title ?? "" });
    render();
  });
  document.querySelectorAll("[data-remove-impact-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-remove-impact-index"));
      state.injectDraft.impacts.splice(index, 1);
      render();
    });
  });
  document.querySelectorAll("[data-impact-text-index]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.getAttribute("data-impact-text-index"));
      state.injectDraft.impacts[index].text = input.value;
    });
  });
  document.querySelectorAll("[data-impact-control-index]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.getAttribute("data-impact-control-index"));
      state.injectDraft.impacts[index].mitigatedBy = select.value;
    });
  });
  document.getElementById("save-inject")?.addEventListener("click", async () => {
    state.injectBuilderError = "";
    state.injectDraft.event = document.getElementById("inject-event")?.value ?? "";
    state.injectDraft.description = document.getElementById("inject-description")?.value ?? "";
    state.injectDraft.stats = document.getElementById("inject-stats")?.value ?? "";
    state.injectDraft.remediation = document.getElementById("inject-remediation")?.value ?? "";
    try {
      const response = await adminApiFetch(state.injectEditorId ? `/api/admin/injects/${state.injectEditorId}` : "/api/admin/injects", {
        method: state.injectEditorId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.injectDraft)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to save inject.");
      }
      await loadAdminInjectLibrary();
      if (payload.inject) {
        state.injectEditorId = payload.inject.id;
        state.injectDraft = cloneInjectDraft(payload.inject);
      }
      render();
    } catch (error) {
      state.injectBuilderError = error instanceof Error ? error.message : "Unable to save inject.";
      render();
    }
  });
}
function renderLockedDeck(player) {
  return `
    <div class="panel">
      <div class="eyebrow">Locked Loadout</div>
      <h3>Your Controls</h3>
      ${player.selectedCards.length ? player.selectedCards.map((title) => `<div class="inject-row"><span>${escapeHtml(title)}</span></div>`).join("") : `<div class="muted">No cards selected.</div>`}
    </div>
  `;
}
function renderPlayerInject(currentInject, playerId) {
  const localPlayer = getLocalPlayer();
  const resolution = currentInject.resolutions.find((entry) => entry.playerId === playerId);
  const reportDraft = getReportDraft(currentInject.round);
  return `
    <h3>Round ${currentInject.round}: ${escapeHtml(currentInject.inject.event)}</h3>
    <p class="muted">${escapeHtml(currentInject.inject.description)}</p>
    ${currentInject.inject.impacts.map((impact) => {
    const protectedByPlayer = localPlayer?.selectedCards.includes(impact.mitigatedBy);
    return `
        <div class="inject-impact ${protectedByPlayer ? "good" : "bad"}">
          <strong>${escapeHtml(impact.text)}</strong>
          <div class="muted">${protectedByPlayer ? `Covered by ${escapeHtml(impact.mitigatedBy)}` : `Missing ${escapeHtml(impact.mitigatedBy)}`}</div>
        </div>
      `;
  }).join("")}
    <div class="spacer"></div>
    <div class="inject-row">
      <strong>Your result</strong>
      <div class="stack">
        ${resolution?.reportSubmitted ? `<span class="badge good">Report +${resolution.reportBonus}</span>` : ""}
        <span class="badge ${resolution && resolution.delta >= 0 ? "good" : "bad"}">${resolution ? `${resolution.delta >= 0 ? "+" : ""}${resolution.delta}` : "Pending"}</span>
      </div>
    </div>
    <div class="muted">${escapeHtml(currentInject.inject.remediation)}</div>
    ${resolution && !resolution.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-form">
        <div class="eyebrow">Optional Incident Report</div>
        <p class="muted">Submit a short round report for a +5 bonus.</p>
        <textarea id="report-summary" class="report-textarea" placeholder="What happened for your team, and what would you do next?">${escapeHtml(reportDraft.summary)}</textarea>
        <div class="report-checkboxes">
          ${["Law Enforcement", "Management", "Internal Ticketing", "Communications / PR", "Legal / Compliance"].map((label) => `
            <label class="report-check">
              <input type="checkbox" value="${label}" ${reportDraft.notified.includes(label) ? "checked" : ""}>
              <span>${label}</span>
            </label>
          `).join("")}
        </div>
        <button id="submit-report" class="success">Submit Report (+5)</button>
      </div>
    ` : resolution?.reportSubmitted ? `
      <div class="spacer"></div>
      <div class="report-card">
        <strong>Report submitted</strong>
        <div class="muted">Your round report bonus has been applied.</div>
      </div>
    ` : ""}
  `;
}
function renderDeckBuilder(player) {
  const deckbuildCountdown = state.room?.deckbuildAutoLockAt ? formatCountdown(state.room.deckbuildAutoLockAt) : "";
  return `
    <div class="panel">
      <div class="deckbuild-sticky">
        <div class="deckbuild-budget">
          <div>
            <div class="eyebrow">Budget Left</div>
            <strong>$${player.budgetRemaining.toLocaleString()}</strong>
          </div>
          <div class="muted">${player.selectedCards.length} cards selected</div>
        </div>
        <div class="row">
          ${player.locked ? `<button class="secondary" id="unlock-deck">Unlock Deck</button>` : `<button class="success" id="lock-deck">Lock Deck</button>`}
        </div>
      </div>
      ${deckbuildCountdown ? `<div class="badge warn deckbuild-timer-badge">Auto-lock in ${deckbuildCountdown}</div><div class="spacer"></div>` : ""}
      <div class="spacer"></div>
      <div class="controls-grid">
        ${categoryOrder.map((category) => {
    const cards = controlCards.filter((card) => card.category === category);
    const categoryClass = categoryClassMap[category];
    return `
            <div class="category category-${categoryClass}">
              <div class="eyebrow">${category}</div>
              <h3>${category} Cards</h3>
              ${cards.map((card) => `
                <div class="control-card category-${categoryClass} ${cardSelected(player, card.title) ? "selected" : ""}">
                  <strong>${escapeHtml(card.title)}</strong>
                  <div class="muted">${escapeHtml(card.desc)}</div>
                  <div class="row">
                    <span class="badge warn category-badge-${categoryClass}">$${card.cost.toLocaleString()}</span>
                    ${cardSelected(player, card.title) ? `<span class="badge good">Selected</span>` : ""}
                  </div>
                  <button class="category-button-${categoryClass}" ${player.locked ? "disabled" : ""} data-card-toggle="${escapeHtml(card.title)}">${cardSelected(player, card.title) ? "Remove" : "Add to Deck"}</button>
                </div>
              `).join("")}
            </div>
          `;
  }).join("")}
      </div>
    </div>
  `;
}
function renderPlayer() {
  const room = state.room;
  const player = getLocalPlayer();
  const isDeckbuild = room?.phase === "deckbuild";
  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <div class="eyebrow">Player Console</div>
          <h1>${player ? escapeHtml(player.name) : "Join the room"}</h1>
          <p class="muted">${room ? `Room ${room.roomCode} \u2022 Phase: ${room.phase}` : "Enter the facilitator's room code and your name to join."}</p>
        </div>
      </div>
      ${state.error ? `<div class="panel"><span class="badge bad">${escapeHtml(state.error)}</span></div>` : ""}
      ${!player ? `
        <div class="panel">
          <div class="join-form">
            <input id="room-code" placeholder="Room code" value="${escapeHtml(state.roomCode)}" maxlength="4">
            <input id="player-name" placeholder="Your name" value="${escapeHtml(state.playerName)}" maxlength="24">
            <button id="join-room">Join Room</button>
            <button class="secondary" id="change-room-link" type="button">Use Different Room</button>
          </div>
        </div>
      ` : `
        ${isDeckbuild ? `
          <div>
            ${renderDeckBuilder(player)}
          </div>
        ` : `
          <div class="layout">
            <div>
              <div class="panel">
                <div class="stat-grid">
                  <div class="stat"><span class="muted">Budget Left</span><span class="value">${player.budgetRemaining.toLocaleString()}</span></div>
                  <div class="stat"><span class="muted">Score</span><span class="value">${player.score}</span></div>
                  <div class="stat"><span class="muted">Critical Hits</span><span class="value">${player.criticalHits}</span></div>
                  <div class="stat"><span class="muted">Deck Status</span><span class="value">${player.locked ? "Locked" : "Open"}</span></div>
                </div>
              </div>
              ${renderLockedDeck(player)}
            </div>
            <div>
              <div class="panel">
                <div class="eyebrow">Current Round</div>
                ${room?.currentInject ? renderPlayerInject(room.currentInject, player.id) : `<div class="muted">Waiting for the facilitator to draw the next inject.</div>`}
              </div>
            </div>
          </div>
        `}
      `}
    </div>
  `;
  document.getElementById("join-room")?.addEventListener("click", () => {
    const roomCode = document.getElementById("room-code").value.toUpperCase();
    const playerName = document.getElementById("player-name").value;
    state.roomCode = roomCode;
    state.playerName = playerName;
    persistPlayerIdentity(roomCode, playerName);
    setActivePlayerRoomCode(roomCode);
    history.replaceState(null, "", `/player?room=${roomCode}`);
    send({ type: "join-room", roomCode, name: playerName, sessionKey: getOrCreatePlayerSessionKey(roomCode) });
  });
  document.getElementById("room-code")?.addEventListener("input", (event) => {
    state.roomCode = event.target.value.toUpperCase();
  });
  document.getElementById("player-name")?.addEventListener("input", (event) => {
    state.playerName = event.target.value;
  });
  document.getElementById("change-room-link")?.addEventListener("click", () => {
    state.roomCode = "";
    state.room = null;
    state.error = "";
    clearActivePlayerRoomCode();
    history.replaceState(null, "", "/player");
    render();
  });
  document.querySelectorAll("[data-card-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      send({ type: "toggle-card", roomCode: state.roomCode, cardTitle: button.getAttribute("data-card-toggle") ?? "" });
    });
  });
  document.getElementById("lock-deck")?.addEventListener("click", () => send({ type: "lock-deck", roomCode: state.roomCode }));
  document.getElementById("unlock-deck")?.addEventListener("click", () => send({ type: "unlock-deck", roomCode: state.roomCode }));
  document.getElementById("report-summary")?.addEventListener("input", () => {
    const currentRound = room?.currentInject?.round;
    if (!currentRound) return;
    const summary = document.getElementById("report-summary")?.value ?? "";
    const notified = [...document.querySelectorAll(".report-check input:checked")].map((input) => input.value);
    updateReportDraft(currentRound, { summary, notified });
  });
  document.querySelectorAll(".report-check input").forEach((input) => {
    input.addEventListener("change", () => {
      const currentRound = room?.currentInject?.round;
      if (!currentRound) return;
      const summary = document.getElementById("report-summary")?.value ?? "";
      const notified = [...document.querySelectorAll(".report-check input:checked")].map((entry) => entry.value);
      updateReportDraft(currentRound, { summary, notified });
    });
  });
  document.getElementById("submit-report")?.addEventListener("click", () => {
    const currentRound = room?.currentInject?.round;
    const draft = currentRound ? getReportDraft(currentRound) : { summary: "", notified: [] };
    const summaryInput = document.getElementById("report-summary")?.value ?? "";
    const summary = draft.summary || summaryInput;
    const notified = draft.notified.length ? draft.notified : [...document.querySelectorAll(".report-check input:checked")].map((input) => input.value);
    send({ type: "submit-report", roomCode: state.roomCode, summary, notified });
  });
}
function render() {
  const preservedFields = capturePreservedFields();
  const view = getView();
  if (view === "landing") {
    renderLanding();
    restorePreservedFields(preservedFields);
    return;
  }
  if (view === "facilitator") {
    renderFacilitator();
    restorePreservedFields(preservedFields);
    return;
  }
  if (view === "admin") {
    renderAdmin();
    restorePreservedFields(preservedFields);
    return;
  }
  renderPlayer();
  restorePreservedFields(preservedFields);
}
async function initialize() {
  const view = getView();
  if (view === "facilitator") {
    await loadHostInfo();
  }
  if (view === "admin") {
    await loadAdminSession();
  }
  render();
}
window.setInterval(() => {
  state.currentTime = Date.now();
  if (state.room?.phase === "deckbuild" && state.room.deckbuildAutoLockAt) {
    render();
  }
}, 1e3);
connect();
maybeAutoRejoinPlayerRoom();
maybeAutoRejoinFacilitatorRoom();
void initialize();
//# sourceMappingURL=app.js.map
