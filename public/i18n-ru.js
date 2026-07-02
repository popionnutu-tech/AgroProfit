/**
 * Interfata bilingva RO + RU pentru rolul OPERATOR (vorbitor de rusa).
 * Se incarca INAINTE de app.js. Nu are dependinte; expune globale pe window.
 *
 * Model: aditiv, doar prezentare. Cand modul bilingv e activ (operator logat),
 * textul cunoscut din dictionar se afiseaza ca „RO / RU". Ce nu e in dictionar
 * (nume furnizor/produs, observatii, cifre) trece NESCHIMBAT — deci datele nu se traduc.
 */
(function () {
  "use strict";

  // RO -> RU. Cheia = exact textul afisat (dupa trim). Acopera tot ce vede operatorul:
  // navigatie, titluri, etichete formulare, antete tabele, butoane, optiuni, placeholdere,
  // etichete dashboard, statusuri/badge-uri si mesajele uzuale generate in JS.
  var RU_DICT = {
    // --- Autentificare / cont ---
    "Intrare in sistem": "Вход в систему",
    "Utilizator": "Пользователь",
    "Parola": "Пароль",
    "Autentificare": "Войти",
    "Se verifica accesul...": "Проверка доступа…",
    "Autentificarea a esuat.": "Ошибка входа.",
    "Schimbare parola": "Смена пароля",
    "Schimbă parola": "Сменить пароль",
    "Parola curenta": "Текущий пароль",
    "Parola noua": "Новый пароль",
    "Confirma parola noua": "Подтвердите новый пароль",
    "Salveaza parola": "Сохранить пароль",
    "Renunta": "Отмена",
    "Ieșire": "Выход",
    "Meniu": "Меню",

    // --- Navigatie ---
    "Acasă": "Главная",
    "Dashboard": "Панель",
    "Recepții": "Приёмки",
    "Procesare": "Обработка",
    "Stoc": "Остаток",
    "Transfer": "Перемещение",
    "Transferuri": "Перемещения",
    "Livrări": "Отгрузки",
    "Reclamații": "Претензии",
    "Financiar": "Финансы",
    "Deschidere": "Открытие",
    "Rapoarte": "Отчёты",
    "Audit": "Аудит",

    // --- Dashboard ---
    "Cilindri": "Силосы",
    "RECEPȚII · TOTALE": "ПРИЁМКИ · ВСЕГО",
    "CANTITATE · TONE": "КОЛИЧЕСТВО · ТОННЫ",
    "PROCESĂRI": "ОБРАБОТКИ",
    "DEȘEU CONFIRMAT": "ОТХОДЫ ПОДТВ.",
    "LIVRĂRI": "ОТГРУЗКИ",
    "ÎNCASĂRI": "ПОСТУПЛЕНИЯ",
    "PLĂȚI": "ПЛАТЕЖИ",
    "RECLAMAȚII": "ПРЕТЕНЗИИ",

    // --- Titluri sectiuni ---
    "Stoc neprocesat pe produs": "Необработанный остаток по продукту",
    "Receptie noua": "Новая приёмка",
    "Recepții recente": "Последние приёмки",
    "Receptii recente": "Последние приёмки",
    "Filtre receptii": "Фильтры приёмок",
    "Procesare pe produs": "Обработка по продукту",
    "Procesări în lucru": "Обработки в работе",
    "Filtre procesari": "Фильтры обработок",
    "Procesari recente": "Последние обработки",
    "Stoc pe cilindru": "Остаток по силосам",
    "Transfer între cilindri": "Перемещение между силосами",
    "Filtre transferuri": "Фильтры перемещений",
    "Transferuri recente": "Последние перемещения",
    "Stoc pe locatii": "Остаток по локациям",
    "Mișcare stoc pe perioadă": "Движение остатка за период",
    "Livrare / iesire din stoc": "Отгрузка / выбытие со склада",
    "Livrari recente": "Последние отгрузки",
    "Completează tara": "Введите тару",

    // --- Etichete formular: recepție ---
    "Furnizor": "Поставщик",
    "(tastează, alege din listă sau lasă gol)": "(введите, выберите из списка или оставьте пустым)",
    "Nume furnizor nou (persoană fizică)": "Имя нового поставщика (физ. лицо)",
    "Produs": "Продукт",
    "Masă brută (kg) — camion plin": "Брутто (кг) — гружёный",
    "Tara (kg) — camion gol": "Тара (кг) — порожний",
    "Preț / kg": "Цена / кг",
    "Locatie initiala": "Начальная локация",
    "Umiditate %": "Влажность %",
    "Impuritati %": "Сорность %",
    "Vehicul": "Транспорт",
    "Receptionat de": "Принял",
    "Observatii": "Примечания",
    "Observații": "Примечания",
    "📷 Poză masă brută (cântar)": "📷 Фото брутто (весы)",
    "📷 Poză masă netă (cântar)": "📷 Фото нетто (весы)",
    "📷 Poză nr. mașină": "📷 Фото номера машины",
    "(opțional)": "(необязательно)",

    // --- Etichete formular: procesare ---
    "Tip procesare": "Тип обработки",
    "Din cilindru (sursă)": "Из силоса (источник)",
    "În cilindru (destinație)": "В силос (назначение)",
    "Cantitate procesată (kg)": "Обработано (кг)",
    "Deșeu confirmat (kg)": "Отходы подтв. (кг)",
    "Umiditate inițială %": "Влажность нач. %",
    "Umiditate finală %": "Влажность кон. %",
    "Operator": "Оператор",

    // --- Etichete formular: transfer ---
    "Din cilindru": "Из силоса",
    "În cilindru": "В силос",
    "Cantitate (kg)": "Количество (кг)",

    // --- Etichete formular: livrare / factura ---
    "Din cilindru / locatie": "Из силоса / локации",
    "Cumparator": "Покупатель",
    "Cumpărător": "Покупатель",
    "Cumpărător (firmă)": "Покупатель (фирма)",
    "Mașină (din nomenclator)": "Машина (из справочника)",
    "Remorcă (din nomenclator)": "Прицеп (из справочника)",
    "Masă brută (kg)": "Брутто (кг)",
    "Masă camion / tară (kg)": "Тара машины (кг)",
    "Vânzător": "Продавец",
    "Achitare": "Оплата",
    "Invoice / factură": "Счёт-фактура",
    "Data invoice": "Дата счёта",
    "Valuta": "Валюта",
    "Preț pe kg (lei)": "Цена за кг (лей)",
    "Curs valutar": "Курс валюты",
    "Cotă TVA": "Ставка НДС",
    "Nr. contract": "№ договора",
    "Data contract": "Дата договора",
    "Mașină (nr.)": "Машина (№)",
    "Remorcă (nr.)": "Прицеп (№)",

    // --- Filtre ---
    "Filtru dupa status": "Фильтр по статусу",
    "Filtru dupa produs": "Фильтр по продукту",
    "Filtru dupa furnizor": "Фильтр по поставщику",
    "Filtru dupa tip": "Фильтр по типу",
    "Filtru dupa cilindru": "Фильтр по силосу",
    "Stare plată": "Состояние оплаты",
    "Perioada de la": "Период с",
    "Pana la": "По",
    "De la": "С",

    // --- Optiuni select ---
    "Toate": "Все",
    "Toate produsele": "Все продукты",
    "Toti furnizorii": "Все поставщики",
    "Toate procesarile": "Все обработки",
    "Toate locatiile": "Все локации",
    "Cu restanță (datorăm)": "С задолженностью (должны)",

    // --- Antete tabele ---
    "ID": "ID",
    "Data": "Дата",
    "Cantitate": "Количество",
    "Locatie": "Локация",
    "Locație": "Локация",
    "Valoare": "Стоимость",
    "Achitat": "Оплачено",
    "Rest": "Остаток",
    "Data plată": "Дата оплаты",
    "Stare": "Состояние",
    "Status": "Статус",
    "Detalii": "Детали",
    "Acțiuni": "Действия",
    "Tara (kg)": "Тара (кг)",
    "Tone": "Тонны",
    "Kg": "Кг",
    "Sursă": "Источник",
    "Destinație": "Назначение",
    "Tip": "Тип",
    "Procesat": "Обработано",
    "Deșeu": "Отходы",
    "Net final": "Нетто итог",
    "Din": "Из",
    "În": "В",
    "Mașină": "Машина",
    "Masina": "Машина",
    "Remorcă": "Прицеп",
    "Vanzator": "Продавец",
    "Pret": "Цена",
    "Sumă factură": "Сумма счёта",
    "Achitată": "Оплачено",
    "Partener": "Партнёр",
    "Suma": "Сумма",

    // --- Butoane ---
    "Salveaza": "Сохранить",
    "Salvează": "Сохранить",
    "Salveaza si nou": "Сохранить и новый",
    "Salveaza procesarea": "Сохранить обработку",
    "Salveaza «în lucru»": "Сохранить «в работе»",
    "Salveaza transferul": "Сохранить перемещение",
    "Confirmă": "Подтвердить",
    "Anulează": "Отменить",
    "Renunță la finalizare": "Отменить завершение",
    "Recepție nouă": "Новая приёмка",
    "Livrare nouă": "Новая отгрузка",
    "Plată": "Платёж",
    "🌙 Închide ziua": "🌙 Закрыть день",

    // --- Statusuri document (recepție/procesare/livrare) ---
    "Draft": "Черновик",
    "Proiect": "Черновик",
    "Confirmat": "Подтверждено",
    "Procesata": "Обработано",
    "Inchis": "Закрыто",
    "Anulat": "Отменено",
    "Redeschis": "Переоткрыто",
    "Noua": "Новая",
    "Verificata": "Проверено",
    "Finalizata": "Завершено",
    "Livrat": "Отгружено",
    "In descarcare": "На разгрузке",
    "In lucru": "В работе",

    // --- Statusuri plata ---
    "Neachitat": "Не оплачено",
    "Partial": "Частично",
    "Parțial": "Частично",

    // --- Mesaje uzuale (generate in JS) ---
    "Se salveaza...": "Сохранение…",
    "Adaugare anulata.": "Добавление отменено.",
    "Receptia a fost salvata.": "Приёмка сохранена.",
    "Procesare anulată.": "Обработка отменена.",
    "Transferul a fost salvat.": "Перемещение сохранено.",
    "Livrarea a fost salvata.": "Отгрузка сохранена."
  };

  var bilingual = false;

  function setBilingual(enabled) {
    bilingual = !!enabled;
  }

  // Intoarce "RO / RU" cand modul bilingv e activ si textul e in dictionar; altfel textul neatins.
  // Idempotent: dupa transformare rezultatul nu mai e cheie in dictionar, deci nu se dubleaza.
  function bi(text) {
    if (!bilingual || text == null) return text;
    var key = String(text).trim();
    if (!key) return text;
    var ru = RU_DICT[key];
    if (!ru || ru === key) return text;
    // pastreaza spatiile din jur (ex. "Furnizor " dintr-un <label>)
    return String(text).replace(key, key + " / " + ru);
  }

  // Parcurge textul STATIC din pagina si il face bilingv, o singura data (idempotent).
  // Traduce noduri de text simple + atributul placeholder. Nu atinge celulele populate ulterior
  // de JS (nume proprii, cifre) si nici valorile din input-uri.
  function applyBilingualDom(root) {
    if (!bilingual) return;
    var scope = root || document.getElementById("page-shell") || document.body;
    if (!scope) return;

    // 1) Noduri de text (titluri, etichete, antete, butoane, optiuni)
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var v = node.nodeValue;
        if (!v) return NodeFilter.FILTER_REJECT;
        var key = v.trim();
        if (!key || !RU_DICT[key]) return NodeFilter.FILTER_REJECT;
        var tag = node.parentNode && node.parentNode.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var pending = [];
    var n;
    while ((n = walker.nextNode())) pending.push(n);
    pending.forEach(function (node) {
      var key = node.nodeValue.trim();
      var ru = RU_DICT[key];
      if (ru && ru !== key) node.nodeValue = node.nodeValue.replace(key, key + " / " + ru);
    });

    // 2) Placeholdere
    scope.querySelectorAll("[placeholder]").forEach(function (el) {
      var key = (el.getAttribute("placeholder") || "").trim();
      var ru = RU_DICT[key];
      if (ru && ru !== key) el.setAttribute("placeholder", key + " / " + ru);
    });
  }

  window.RU_DICT = RU_DICT;
  window.setBilingual = setBilingual;
  window.bi = bi;
  window.applyBilingualDom = applyBilingualDom;
})();
