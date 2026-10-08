// Generator de coduri QR, scris local si fara nicio dependenta.
//
// De ce nu o biblioteca: documentele oficiale se tiparesc intr-o fereastra deschisa de
// aplicatie (`openOfficialDocWindow`), iar politica de securitate a paginii (CSP) permite
// scripturi doar de pe propriul domeniu. Un QR adus de pe un CDN pur si simplu nu s-ar
// incarca, iar unul generat pe un server strain ar trimite acolo datele actului.
//
// Acopera versiunile 1-10 la nivelul de corectie M (pana la 213 de octeti) — mai mult decat
// incape pe un act de achizitie. Rezultatul e o matrice de module (true = modul negru), din
// care `qrSvg` scoate un SVG ce se tipareste curat, la orice dimensiune.
(function (global) {
  "use strict";

  // --- Aritmetica in campul Galois GF(256), polinomul 0x11D (standardul QR) ---
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function initTables() {
    let x = 1;
    for (let i = 0; i < 255; i += 1) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
  })();

  const gfMul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

  // Polinomul generator pentru `degree` coduri de corectie.
  function generatorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i += 1) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j += 1) {
        // (p_j x^k)(x + α^i) = p_j x^(k+1) + p_j·α^i x^k — termenul deplasat ramane pe
        // pozitia lui, iar produsul cu α^i coboara cu una. Inversate, dau polinomul citit
        // invers, iar codurile de corectie ies gresite (codul nu se mai decodeaza).
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  // Restul impartirii (codurile de corectie) pentru un bloc de date.
  function ecCodewords(data, ecLen) {
    const gen = generatorPoly(ecLen);
    const res = new Array(ecLen).fill(0);
    for (const byte of data) {
      const factor = byte ^ res[0];
      res.shift();
      res.push(0);
      for (let i = 0; i < ecLen; i += 1) res[i] ^= gfMul(gen[i + 1], factor);
    }
    return res;
  }

  // --- Tabelele standardului, nivel de corectie M, versiunile 1-10 ---
  // [coduri de corectie per bloc, [blocuri, coduri de date per bloc], ...]
  const EC_TABLE_M = {
    1: [10, [[1, 16]]],
    2: [16, [[1, 28]]],
    3: [26, [[1, 44]]],
    4: [18, [[2, 32]]],
    5: [24, [[2, 43]]],
    6: [16, [[4, 27]]],
    7: [18, [[4, 31]]],
    8: [22, [[2, 38], [2, 39]]],
    9: [22, [[3, 36], [2, 37]]],
    10: [26, [[4, 43], [1, 44]]]
  };
  // Centrele modelelor de aliniere (versiunea 1 nu are).
  const ALIGN_CENTERS = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };
  // Sirul de 18 biti cu informatia de versiune (doar de la versiunea 7 in sus).
  const VERSION_BITS = { 7: 0x07c94, 8: 0x085bc, 9: 0x09a99, 10: 0x0a4d3 };

  const dataCapacity = (version) => {
    const [, groups] = EC_TABLE_M[version];
    return groups.reduce((sum, [blocks, size]) => sum + blocks * size, 0);
  };

  function chooseVersion(byteLength) {
    for (let v = 1; v <= 10; v += 1) {
      const countBits = v <= 9 ? 8 : 16;
      const needed = Math.ceil((4 + countBits + byteLength * 8) / 8);
      if (needed <= dataCapacity(v)) return v;
    }
    return null; // peste 213 de octeti: apelantul decide (noi scurtam textul)
  }

  // --- Datele: mod „octeti", lungime, continut, terminator, umplutura ---
  function buildDataCodewords(bytes, version) {
    const countBits = version <= 9 ? 8 : 16;
    const bits = [];
    const push = (value, length) => {
      for (let i = length - 1; i >= 0; i -= 1) bits.push((value >> i) & 1);
    };
    push(0b0100, 4); // mod „octeti"
    push(bytes.length, countBits);
    for (const b of bytes) push(b, 8);

    const capacityBits = dataCapacity(version) * 8;
    for (let i = 0; i < 4 && bits.length < capacityBits; i += 1) bits.push(0); // terminator
    while (bits.length % 8 !== 0) bits.push(0);

    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bits[i + j];
      codewords.push(byte);
    }
    // Umplutura standard, alternativ 236 / 17.
    const pad = [0xec, 0x11];
    let k = 0;
    while (codewords.length < dataCapacity(version)) {
      codewords.push(pad[k % 2]);
      k += 1;
    }
    return codewords;
  }

  // Blocuri + intercalare, exact in ordinea ceruta de standard.
  function interleave(codewords, version) {
    const [ecLen, groups] = EC_TABLE_M[version];
    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    for (const [blocks, size] of groups) {
      for (let i = 0; i < blocks; i += 1) {
        const block = codewords.slice(offset, offset + size);
        offset += size;
        dataBlocks.push(block);
        ecBlocks.push(ecCodewords(block, ecLen));
      }
    }
    const out = [];
    const maxData = Math.max(...dataBlocks.map((b) => b.length));
    for (let i = 0; i < maxData; i += 1) {
      for (const block of dataBlocks) if (i < block.length) out.push(block[i]);
    }
    for (let i = 0; i < ecLen; i += 1) {
      for (const block of ecBlocks) out.push(block[i]);
    }
    return out;
  }

  // --- Matricea: modele fixe, date, masti ---
  function createMatrix(version) {
    const size = version * 4 + 17;
    const modules = Array.from({ length: size }, () => new Array(size).fill(null));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (r, c, value) => {
      modules[r][c] = value;
      reserved[r][c] = true;
    };

    const finder = (row, col) => {
      for (let r = -1; r <= 7; r += 1) {
        for (let c = -1; c <= 7; c += 1) {
          const rr = row + r;
          const cc = col + c;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          const inRing = r >= 0 && r <= 6 && c >= 0 && c <= 6
            && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          set(rr, cc, inRing);
        }
      }
    };
    finder(0, 0);
    finder(0, size - 7);
    finder(size - 7, 0);

    for (let i = 8; i < size - 8; i += 1) {
      const dark = i % 2 === 0;
      set(6, i, dark);
      set(i, 6, dark);
    }

    const centers = ALIGN_CENTERS[version];
    const lastCenter = centers.length ? centers[centers.length - 1] : 0;
    for (const r of centers) {
      for (const c of centers) {
        // Se sar DOAR cele trei modele care ar cadea peste colturile de cautare. Cele care
        // stau pe randul/coloana de sincronizare se deseneaza normal (au aceleasi module in
        // acele puncte). Sarindu-le, harta modulelor rezervate iesea alta decat cea a
        // standardului si intreg sirul de date se deplasa — codul nu se mai decoda.
        const pesteFinder = (r === 6 && c === 6)
          || (r === 6 && c === lastCenter)
          || (r === lastCenter && c === 6);
        if (pesteFinder) continue;
        for (let dr = -2; dr <= 2; dr += 1) {
          for (let dc = -2; dc <= 2; dc += 1) {
            set(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
          }
        }
      }
    }

    set(size - 8, 8, true); // modulul intunecat, mereu negru

    // Locurile informatiei de format (se completeaza dupa alegerea mastii).
    for (let i = 0; i <= 8; i += 1) {
      if (!reserved[8][i]) set(8, i, false);
      if (!reserved[i][8]) set(i, 8, false);
    }
    for (let i = 0; i < 8; i += 1) {
      if (!reserved[8][size - 1 - i]) set(8, size - 1 - i, false);
      if (!reserved[size - 1 - i][8]) set(size - 1 - i, 8, false);
    }

    if (version >= 7) {
      const bits = VERSION_BITS[version];
      for (let i = 0; i < 18; i += 1) {
        const bit = ((bits >> i) & 1) === 1;
        const r = Math.floor(i / 3);
        const c = size - 11 + (i % 3);
        set(r, c, bit);
        set(c, r, bit);
      }
    }
    return { modules, reserved, size };
  }

  // Asezarea datelor in zigzag, de jos-dreapta in sus.
  function placeData(state, codewords) {
    const { modules, reserved, size } = state;
    const bits = [];
    for (const byte of codewords) {
      for (let i = 7; i >= 0; i -= 1) bits.push((byte >> i) & 1);
    }
    let bitIndex = 0;
    let upward = true;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col -= 1; // coloana de sincronizare se sare
      for (let step = 0; step < size; step += 1) {
        const row = upward ? size - 1 - step : step;
        for (const c of [col, col - 1]) {
          if (reserved[row][c]) continue;
          modules[row][c] = bitIndex < bits.length ? bits[bitIndex] === 1 : false;
          bitIndex += 1;
        }
      }
      upward = !upward;
    }
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
  ];

  // Informatia de format: nivelul de corectie M (00) + masca, cu cod BCH si XOR standard.
  function formatBits(maskIndex) {
    const data = (0b00 << 3) | maskIndex;
    let value = data << 10;
    for (let i = 4; i >= 0; i -= 1) {
      if ((value >> (10 + i)) & 1) value ^= 0b10100110111 << i;
    }
    return ((data << 10) | value) ^ 0b101010000010010;
  }

  function applyFormat(state, maskIndex) {
    const { modules, size } = state;
    const bits = formatBits(maskIndex);
    const bit = (i) => ((bits >> i) & 1) === 1;
    // Prima copie: coloana 8 in jos (bitii 0-5), coltul, apoi randul 8 spre stanga.
    for (let i = 0; i <= 5; i += 1) modules[i][8] = bit(i);
    modules[7][8] = bit(6);
    modules[8][8] = bit(7);
    modules[8][7] = bit(8);
    for (let i = 9; i <= 14; i += 1) modules[8][14 - i] = bit(i);
    // A doua copie: randul 8 dinspre dreapta (bitii 0-7) si coloana 8 de jos (bitii 8-14).
    for (let i = 0; i <= 7; i += 1) modules[8][size - 1 - i] = bit(i);
    for (let i = 8; i <= 14; i += 1) modules[size - 15 + i][8] = bit(i);
  }

  // Penalizarile standardului: aleg masca cea mai „linistita" vizual.
  function penalty(modules, size) {
    let score = 0;
    const runScore = (line) => {
      let run = 1;
      for (let i = 1; i < line.length; i += 1) {
        if (line[i] === line[i - 1]) {
          run += 1;
        } else {
          if (run >= 5) score += 3 + (run - 5);
          run = 1;
        }
      }
      if (run >= 5) score += 3 + (run - 5);
    };
    for (let r = 0; r < size; r += 1) runScore(modules[r]);
    for (let c = 0; c < size; c += 1) runScore(modules.map((row) => row[c]));

    for (let r = 0; r < size - 1; r += 1) {
      for (let c = 0; c < size - 1; c += 1) {
        const v = modules[r][c];
        if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) score += 3;
      }
    }

    const pattern = [true, false, true, true, true, false, true, false, false, false, false];
    const matches = (line, start) => pattern.every((p, i) => line[start + i] === p);
    const reversed = pattern.slice().reverse();
    const matchesRev = (line, start) => reversed.every((p, i) => line[start + i] === p);
    // Coloanele se extrag O SINGURA data: reconstruite in bucla interioara, cautarea sablonului
    // devenea cubica in latura codului.
    const columns = [];
    for (let c = 0; c < size; c += 1) columns.push(modules.map((row) => row[c]));
    for (let i = 0; i < size; i += 1) {
      for (let start = 0; start + 11 <= size; start += 1) {
        if (matches(modules[i], start) || matchesRev(modules[i], start)) score += 40;
        if (matches(columns[i], start) || matchesRev(columns[i], start)) score += 40;
      }
    }

    let dark = 0;
    for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) if (modules[r][c]) dark += 1;
    const percent = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;
    return score;
  }

  function toBytes(text) {
    return Array.from(new TextEncoder().encode(String(text)));
  }

  // Matricea de module pentru un text. `null` daca textul nu incape (peste 213 octeti).
  // `forcedMask` exista doar pentru verificari (comparatie cu un generator de referinta pe
  // aceeasi masca). In aplicatie se apeleaza fara el si masca se alege dupa penalizari.
  function qrMatrix(text, forcedMask) {
    const bytes = toBytes(text);
    const version = chooseVersion(bytes.length);
    if (!version) return null;
    const codewords = interleave(buildDataCodewords(bytes, version), version);

    let best = null;
    for (let mask = 0; mask < 8; mask += 1) {
      if (forcedMask !== undefined && mask !== forcedMask) continue;
      const state = createMatrix(version);
      placeData(state, codewords);
      for (let r = 0; r < state.size; r += 1) {
        for (let c = 0; c < state.size; c += 1) {
          if (!state.reserved[r][c] && MASKS[mask](r, c)) state.modules[r][c] = !state.modules[r][c];
        }
      }
      applyFormat(state, mask);
      const score = penalty(state.modules, state.size);
      if (!best || score < best.score) best = { score, modules: state.modules, size: state.size };
    }
    if (!best) return null; // `forcedMask` in afara intervalului 0-7
    return best.modules.map((row) => row.map((v) => v === true));
  }

  // SVG alb-negru, cu zona linistita de 4 module ceruta de standard.
  function qrSvg(matrix, pixelSize) {
    if (!matrix) return "";
    const quiet = 4;
    const size = matrix.length + quiet * 2;
    const rects = [];
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix.length; c += 1) {
        if (matrix[r][c]) rects.push(`<rect x="${c + quiet}" y="${r + quiet}" width="1" height="1"/>`);
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${pixelSize}" height="${pixelSize}" shape-rendering="crispEdges">`
      + `<rect width="${size}" height="${size}" fill="#fff"/><g fill="#000">${rects.join("")}</g></svg>`;
  }

  global.qrMatrix = qrMatrix;
  global.qrSvg = qrSvg;
  if (typeof module !== "undefined" && module.exports) module.exports = { qrMatrix, qrSvg };
})(typeof window !== "undefined" ? window : globalThis);
