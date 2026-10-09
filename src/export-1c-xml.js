"use strict";

// ============================================================================
// EXPORT PENTRU 1C — formatul nativ de schimb (`ФайлОбмена`, versiunea 2.0)
//
// DE CE EXISTA, pe langa CSV
// CSV-ul se incarca manual, coloana cu coloana. XML-ul e formatul pe care 1C il citeste
// direct, fara potrivire de coloane — deci fara greseli de mapare la import.
//
// DE CE NU S-A FACUT DE LA INCEPUT
// In formatul de schimb, 1C potriveste obiectele dupa cheia din `<Ссылка>`. Pentru multe
// tipuri cheia e GUID-ul (`{УникальныйИдентификатор}`), iar un GUID inventat de noi ar CREA
// obiecte noi la fiecare import — exact dublura pe care exportul o evita.
//
// DE CE SE POATE TOTUSI, PENTRU CONTRAGENTI
// Verificat in exportul REAL al utilizatorului (`Contragenti.xml`, 3.254 de contragenti):
// regula `Контрагенты` NU are `СинхронизироватьПоИдентификатору`, deci 1C potriveste dupa
// cheia naturala, care e intotdeauna aceeasi pereche:
//
//     <Ссылка><Свойство Имя="ФискКод">…</Свойство>
//             <Свойство Имя="Наименование">…</Свойство></Ссылка>
//
// Verificat pe toti cei 763 de contragenti persoane fizice: 763/763 au exact aceasta cheie.
// In plus, regula are `НеЗамещать=true` — ce exista deja in 1C nu se suprascrie.
//
// ⚠️ CHEIA E PERECHEA, NU DOAR CODUL. O diferenta de scriere in DENUMIRE („Scripniciuc Oleg"
// cu un spatiu vs. doua, cum apare in exportul real) face ca 1C sa NU gaseasca furnizorul si
// sa creeze unul nou. De aceea se exporta doar furnizorii NEMARCATI: cei care exista deja in
// 1C sint marcati la potrivirea pe cod fiscal si nu mai ajung niciodata in fisier.
// Un furnizor FARA cod fiscal nu se exporta deloc (aceeasi regula ca la CSV).
//
// REGULILE DE CONVERSIE (`src/1c/reguli-schimb.xml`) calatoresc in fisier: fara ele, 1C nu
// stie sa interpreteze obiectele. Sint luate din exportul real al utilizatorului, deci
// corespund EXACT configuratiei lui. Nu contin date (verificat: 329 de reguli, zero coduri
// fiscale, zero nume).
// ============================================================================

const fs = require("node:fs");
const path = require("node:path");

const CAI_REGULI = path.join(__dirname, "1c", "reguli-schimb.xml");

// Acelasi plafon ca `MAX_IDS_1C` din handler: un fisier nu poate contine mai multi
// furnizori decat pot fi ceruti sau marcati intr-o operatie.
const MAX_FURNIZORI_XML = 500;

let reguliCache = null;

// Citite O DATA si tinute in memorie. Fisierul are 105.706 CARACTERE, dar fiind chirilic
// ocupa 2 octeti pe caracter in UTF-8: 186 KiB pe disc si pe retea. Citirea sincrona
// costa 1,3 ms si se face o singura data per instanta, si doar daca se cere XML —
// un cold start fara export XML nu atinge fisierul deloc.
function reguliSchimb() {
  if (reguliCache === null) {
    reguliCache = fs.readFileSync(CAI_REGULI, "utf8").trim();
  }
  return reguliCache;
}

// XML-ul se construieste prin concatenare de siruri, deci TOT ce vine din date trece pe aici.
// Fara asta, un furnizor numit `Ion & Fiii <SRL>` ar rupe fisierul, iar o denumire cu `]]>`
// sau cu ghilimele ar putea inchide un atribut. Se escapeaza si `'`/`"`: aceeasi functie e
// folosita si pentru valori de atribut.
function esc(valoare) {
  return String(valoare === null || valoare === undefined ? "" : valoare)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Caracterele pe care XML 1.0 nu le admite se SCOT la sursa.
//
// Nu e o masura de prudenta: escaparea NU ajuta (`&#1;` si `&#xFFFF;` sint la fel de
// invalide ca octetul brut), iar un singur astfel de caracter face parserul sa respinga
// FISIERUL INTREG — nu randul. 1C nu spune pe ce pozitie, deci cauti cu ochiul intr-un
// fisier de 100 KB.
//
// Multimea admisa, din gramatica XML 1.0 (productia `Char`):
//     #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
// Deci se scot:
//   - controalele C0, mai putin TAB/LF/CR;
//   - DEL (legal in 1.0, interzis in 1.1 — se scoate oricum, nu are ce cauta intr-un nume);
//   - U+FFFE si U+FFFF, care cad in afara intervalului `[#xE000-#xFFFD]`;
//   - surogatele NEPERECHE. Perechile valide se pastreaza: ele formeaza emoji si caractere
//     din planurile superioare, perfect legale. Doar jumatatile orfane — care apar din
//     taierea unui sir la mijlocul unei perechi — sint invalide.
function curataControl(valoare) {
  return String(valoare === null || valoare === undefined ? "" : valoare)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFE\uFFFF]/g, "")
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, "")
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}

// O proprietate simpla. Valoarea goala NU se scrie ca `<Значение></Значение>`: 1C asteapta
// `<Пусто/>`, exact cum scrie si el la export.
function proprietate(nume, tip, valoare) {
  const v = curataControl(valoare).trim();
  const corp = v === "" ? "\t\t<Пусто/>\n" : `\t\t<Значение>${esc(v)}</Значение>\n`;
  // `nume` si `tip` sint LITERALI din codul de mai jos, nu date — nu pot contine niciodata
  // `& < > " '`. Escaparea lor insemna 140.000 de `replace()` irosite la 500 de furnizori,
  // 41% din timpul de constructie. Valoarea, in schimb, vine din nomenclator si TREBUIE
  // escapata (`esc(v)` de mai sus).
  return `\t<Свойство Имя="${nume}" Тип="${tip}">\n${corp}\t</Свойство>\n`;
}

// Proprietatile de tip referinta (catre alt obiect din 1C) pe care le lasam mereu goale.
// Se scriu EXPLICIT, nu se omit: exportul real al lui 1C le contine pe toate, iar un obiect
// incomplet poate fi incarcat cu campuri ramase din alta sursa.
function referintaGoala(nume, tip) {
  // Literali, ca mai sus — fara escapare.
  return `\t<Свойство Имя="${nume}" Тип="${tip}">\n\t\t<Пусто/>\n\t</Свойство>\n`;
}

// Ordinea si componenta proprietatilor urmeaza EXACT exportul real al utilizatorului.
// 1C nu cere o anumita ordine, dar un fisier identic ca forma cu cel pe care il produce el
// e cel mai usor de confruntat cand ceva nu se incarca.
function obiectContragent(nrq, rand) {
  const cod = curataControl(rand.cod).trim();
  const denumire = curataControl(rand.denumire).trim();
  const persoanaFizica = rand.persoanaFizica === true;

  // CHEIA. Perechea exacta dupa care 1C potriveste; vezi antetul fisierului.
  const cheie =
    `<Ссылка Нпп="${nrq}">\n` +
    proprietate("ФискКод", "Строка", cod) +
    proprietate("Наименование", "Строка", denumire) +
    `</Ссылка>`;

  const corp =
    `\t<Свойство Имя="ВидКонтрагента" Тип="ПеречислениеСсылка.ВидыКонтрагентов">\n` +
    `\t\t<Значение>${persoanaFizica ? "ЧастноеЛицо" : "Организация"}</Значение>\n` +
    `\t</Свойство>\n` +
    proprietate("Город", "Строка", "") +
    proprietate("ДатаВыдачиПаспорта", "Дата", "") +
    proprietate("ДатаПервойРасхСФ", "Дата", "") +
    proprietate("КемВыданПаспорт", "Строка", "") +
    proprietate("НазвСокрГруп", "Строка", "") +
    // La persoane fizice 1C lasa „NaimenovaniePolnoe" gol (verificat pe toate cele 763);
    // la firme pune aceeasi denumire. Se respecta conventia lui, nu a noastra.
    proprietate("НаименованиеПолное", "Строка", persoanaFizica ? "" : denumire) +
    proprietate("НДСаванса", "Число", "") +
    proprietate("НеРезидент", "Булево", "false") +
    proprietate("НомерПаспорта", "Строка", "") +
    referintaGoala("ОснРасчСчет", "СправочникСсылка.РасчетныеСчета") +
    proprietate("ПометкаУдаления", "Булево", "false") +
    proprietate("ПочтАдрес", "Строка", "") +
    proprietate("Представитель", "Строка", "") +
    // Codul de TVA ramine GOL: in AgroProfit el exista doar pe firmele NOASTRE
    // (`companies[].vatCode`), nu pe parteneri. Rubrica se scrie oricum, ca obiectul sa
    // aiba aceeasi forma ca in exportul real al lui 1C.
    proprietate("РегНомНДС", "Строка", "") +
    proprietate("СерияПаспорта", "Строка", "") +
    referintaGoala("Страна", "СправочникСсылка.КлассификаторСтранМира") +
    proprietate("СуммаАванса", "Число", "") +
    proprietate("Телефоны", "Строка", rand.telefon || "") +
    referintaGoala("ТипДокумента", "СправочникСсылка.ТипДокумента") +
    proprietate("ЮрАдрес", "Строка", rand.adresa || "");

  return (
    `<Объект Нпп="${nrq}" Тип="СправочникСсылка.Контрагенты" ` +
    `ИмяПравила="Контрагенты" НеЗамещать="true">${cheie}\n${corp}</Объект>`
  );
}

// 1C scrie data fara fus orar, in ora locala. `toISOString()` ar da UTC, deci in Moldova
// documentele ar aparea cu 2-3 ore inapoi — iar o exportare de la 01:00 ar cadea in ziua
// precedenta. Se formateaza componentele locale.
function dataLocala1c(d) {
  const z = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T` +
    `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`
  );
}

/**
 * Construieste fisierul de schimb pentru FURNIZORI.
 *
 * @param {Array} randuri  obiecte { cod, denumire, persoanaFizica, adresa, telefon }
 *
 * NU poarta banca si IBAN-ul, desi CSV-ul le are: in 1C contul bancar e un obiect
 * SEPARAT (`СправочникСсылка.РасчетныеСчета`), referit prin `ОснРасчСчет`. Trimis ca text
 * in obiectul contrapartii, ar fi ignorat tacut. Se completeaza manual in 1C.
 * @param {Object} optiuni { acum: Date }  — injectabila, ca testul sa fie determinist
 * @returns {string} XML complet, gata de scris in fisier
 */
function construiesteXmlFurnizori(randuri, optiuni = {}) {
  const lista = Array.isArray(randuri) ? randuri : [];
  // PLAFON. Masurat: 3.401 octeti per furnizor, deci plafonul de 4,5 MB al raspunsului
  // serverless se atinge la ~1.330. Pe calea normala (selectie bifata) `MAX_IDS_1C` tine
  // deja, dar `GET ?all=1&format=xml` o ocoleste — `idsDinCerere` intoarce o lista goala,
  // iar atunci exportul scoate TOT. CSV-ul pe aceeasi ruta da ~0,5 MB, deci lipsa plafonului
  // n-a contat niciodata pina la formatul asta.
  // Mai bine o eroare care spune ce sa faci decat o eroare opaca de platforma.
  if (lista.length > MAX_FURNIZORI_XML) {
    const e = new Error(
      `Prea multi furnizori intr-un singur fisier XML (${lista.length}, maxim ` +
      `${MAX_FURNIZORI_XML}). Bifeaza-i in transe sau descarca in format CSV.`
    );
    e.statusCode = 400;
    throw e;
  }
  const acum = optiuni.acum instanceof Date ? optiuni.acum : new Date();
  const stampila = dataLocala1c(acum);

  const obiecte = [];
  let nrq = 0;
  for (const rand of lista) {
    const cod = curataControl((rand || {}).cod).trim();
    const denumire = curataControl((rand || {}).denumire).trim();
    // Fara cod fiscal, 1C nu l-ar putea lega de nimic — ar intra ca furnizor nou, nepotrivit
    // cu niciun act. Fara denumire, cheia e incompleta. Aceeasi regula ca la CSV.
    if (!cod || !denumire) continue;
    nrq += 1;
    obiecte.push(obiectContragent(nrq, rand));
  }

  // `Ид правил` trebuie sa fie acelasi cu cel din blocul de reguli, altfel 1C refuza fisierul.
  const idReguli = (reguliSchimb().match(/<Ид>([^<]+)<\/Ид>/) || [])[1] || "";

  const antet =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<ФайлОбмена ВерсияФормата="2.0" ДатаВыгрузки="${esc(stampila)}" ` +
    `НачалоПериодаВыгрузки="${esc(stampila)}" ОкончаниеПериодаВыгрузки="${esc(stampila)}" ` +
    `ИмяКонфигурацииИсточника="БухгалтерияДляМолдовы" ` +
    `ИмяКонфигурацииПриемника="БухгалтерияДляМолдовы" ` +
    `ИдПравилКонвертации="${esc(idReguli)}" Комментарий="AgroProfit+">\n`;

  // BOM UTF-8: exportul real al lui 1C il are, iar fara el unele versiuni citesc fisierul
  // ca ANSI si strica diacriticele din denumiri.
  return (
    "﻿" + antet + reguliSchimb() + "\n" + obiecte.join("\n") + "\n</ФайлОбмена>\n"
  );
}

module.exports = {
  construiesteXmlFurnizori,
  MAX_FURNIZORI_XML,
  // exportate pentru teste
  esc,
  curataControl,
  dataLocala1c
};
