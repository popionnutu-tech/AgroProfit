# AgroProfit+ — Manual de utilizare: rolul **Manager**

> Pentru: utilizatorul cu rol **Manager / Șef depozit**
> Aplicație: AgroProfit+ (ERP elevator de cereale)
> Limbă interfață: Română · Monedă de bază: MDL

---

## 1. Ce poate face Managerul (pe scurt)

Managerul este responsabilul operațional al depozitului. Are acces la **operațiuni, finanțe, rapoarte și audit**. Concret:

- Gestionează **recepțiile** (intrări marfă) și le **închide / redeschide**.
- Gestionează **procesarea** (uscare / curățare) și urmărește **randamentul**.
- Vede **stocul** (pe produse, pe cilindri, pe locații) și face **transferuri** între cilindri.
- Gestionează **livrările** (ieșiri), introduce **datele de factură** și le **închide / anulează / redeschide**.
- Înregistrează **plăți către furnizori** și **încasări de la clienți**.
- Gestionează **reclamațiile** de calitate / greutate / facturare.
- Vede **rapoarte, dashboard** și **jurnalul de audit**.

**NU poate** (sunt rezervate altor roluri): crearea/editarea nomenclatoarelor, crearea soldurilor de deschidere, ajustarea impactului de factură/stoc al reclamațiilor, administrarea utilizatorilor și setările de sistem (acestea sunt ale **Administratorului** / **Contabilului-șef**).

---

## 2. Meniul (bara laterală)

| Meniu | Ce faci aici |
|-------|--------------|
| **Acasă** | Tablou de bord: indicatori ai zilei, avertismente operaționale |
| **Recepții** | Intrări marfă: creare, editare, **închidere/redeschidere** |
| **Procesare** | Uscare/curățare, finalizare, urmărire randament |
| **Stoc** | Vizualizare stoc pe produse / cilindri / locații (doar citire) |
| **Transfer** | Mutare marfă între cilindri |
| **Livrări** | Ieșiri marfă, date factură, **închidere/anulare/redeschidere** |
| **Reclamații** | Reclamații calitate / greutate / facturare |
| **Financiar** | Plăți furnizori și încasări clienți |
| **Deschidere** | Solduri inițiale (doar citire) |
| **Rapoarte** | Raport zilnic, KPI, export |
| **Audit** | Jurnal de modificări (cine, ce, când) |

---

## 3. Recepții (intrări marfă)

**Fluxul unei recepții:**
1. Operatorul cântărește **brut** (camion + marfă) → recepția intră în „În descărcare".
2. Operatorul cântărește **tara** (camion gol) → cântărirea se finalizează, recepția trece în „Procesată".
3. **Managerul setează prețul** (MDL/kg), dacă nu a fost setat automat.
4. **Managerul verifică calitatea** (umiditate, impuritate).
5. După procesare, statusul devine „Confirmat".
6. **Managerul închide recepția** (`Încheie recepția`) → status **Închis** (document blocat).
7. La nevoie, **Managerul redeschide** (`Redeschide recepția`) → status **Redeschis**, pentru corecții.

> ⚠️ **Regulă:** nu închide o recepție **fără preț setat** — creează expunere financiară necontrolată.

**Stări recepție:** Proiect → În descărcare → Procesată → Confirmat → Închis / Anulat / Redeschis.

---

## 4. Procesare (uscare / curățare)

1. Creezi o procesare: selectezi recepția/recepțiile, setezi parametrii (uscare, curățare %).
2. Procesarea rulează pe **cilindri** (stoc intern în tone).
3. Poți **pune pe pauză** (status „În lucru").
4. **Finalizezi** procesarea (status „Finalizată") → se calculează greutatea netă și **randamentul**.
5. La eșec, poți **anula** (status „Anulat").

> **Randament % = (cantitate netă procesată / cantitate brută recepționată) × 100.** Este KPI urmărit zilnic pe dashboard — managerul investighează abaterile.

---

## 5. Stoc și Transfer

- **Stoc** (doar citire): stoc neprocesat pe produs, stoc pe cilindri, stoc pe locații; raport de stoc pe perioadă (sold inițial + recepții + procesare − livrări = sold final).
- **Transfer:** muți produs dintr-un cilindru în altul; urmărirea locației se actualizează în timp real.

> **Unități:** stocul intern este în **tone**; formularele acceptă **kg** (se împart automat la 1000).

---

## 6. Livrări (ieșiri marfă)

**Fluxul unei livrări:**
1. **Creezi livrarea:** selectezi produs/client, introduci greutatea brută și tara.
2. Apeși **Confirmat**.
3. Apeși **Livrat** → iese din stoc, se calculează cantitatea netă.
4. Deschizi **„Date factură"** și completezi:
   - Număr factură
   - Monedă (MDL / EUR / USD / RON)
   - Preț (de contract)
   - Curs valutar (dacă e valută străină)
5. **Închizi livrarea** (`Închide livrare`) → status **Închis** (blochează datele financiare).

**Calcul valoare factură:**
- **În MDL:** `preț (MDL/kg) × cantitate (kg) = total (MDL)`
- **În valută:** `preț (valută/tonă) × cantitate (tone) = total (valută)` → `× curs = total (MDL)`

> ⚠️ **Regulă:** livrarea trebuie să aibă **număr de factură** înainte de închidere (pentru pista de audit).

**Acțiuni exclusiv manager:** Închide / Anulează / Redeschide livrarea.
**Stări livrare:** Proiect → Confirmat → Livrat → Închis / Redeschis / Anulat.

---

## 7. Financiar (plăți și încasări)

Trei tipuri de operațiuni:

1. **Plată furnizor** — legată de o **recepție**. Statusul se actualizează automat: Neachitat → Parțial → Achitat integral.
2. **Încasare client** — legată de o **livrare**. Status: Neîncasat → Parțial → Încasat.
3. **Sold inițial** — stinge o datorie/creanță din perioada anterioară.

**Cum înregistrezi:**
- Alegi documentul (recepție / livrare), introduci **suma, data, tipul de plată** (numerar, transfer etc.) și, opțional, o **notă**.
- Soldul rămas se recalculează automat per document.
- La supraplată de la client → se creează **avans** (credit aplicabil ulterior).

---

## 8. Reclamații

1. Înregistrezi reclamația: o legi de o **livrare**, alegi **tipul** (abatere calitate / lipsă greutate / eroare facturare) și suma dedusă.
2. Stări: Deschisă → Acceptată / Respinsă → Închisă.
3. Poți edita statusul și suma dedusă.

> ⚠️ **Limitări:** Managerul **NU** poate ajusta impactul de factură al reclamației (Contabil) și **NU** poate corecta stocul cauzat de reclamație (Contabil-șef). Sumele deduse afectează creanțele clienților — se reconciliază cu contabilitatea.

---

## 9. Rapoarte și Dashboard

- **Acasă (dashboard):** recepții, cantitate procesată, randament %, livrări, plăți, încasări, stoc, reclamații; carduri financiare (total plătit/încasat azi); avertismente (recepții fără preț, abateri de calitate, livrări fără factură).
- **Raport zilnic (Rapoarte):** filtru pe interval de date; sumar pentru recepții, procesări, livrări, tranzacții, reclamații; total cantități, prețuri, plăți, încasări, randament, cash-flow.
- **Export:** recepții, procesări, livrări, tranzacții, reclamații (date tabelare).

---

## 10. Audit

- Vezi **toate modificările** la documente: dată/oră, utilizator, tip entitate, acțiune (creare, editare, închidere, redeschidere) și detaliile schimbării.
- Filtrare pe tip de entitate (recepție, livrare, procesare, tranzacție, reclamație).
- **Doar vizualizare** — managerul nu modifică jurnalul.

> Orice document redeschis poate fi editat, dar **toate modificările rămân în audit**.

---

## 11. Acces din Telegram (Mini App)

Managerul are și acces din **Telegram Mini App** (`/m/`) cu un subset de funcții: Recepții (citire + creare), Procesare (citire), Livrări (citire), Reclamații (citire), Financiar (vizualizare + înregistrare), Rapoarte, Stoc, Audit.
*Nu* sunt disponibile în Telegram: ajustările de stoc/factură ale reclamațiilor, administrarea utilizatorilor, setările de sistem.

---

## 12. Reguli de business cheie (de reținut)

1. Stocul intern e în **tone**; formularele acceptă **kg**.
2. Facturare dublă: **MDL** (preț/kg) vs **valută** (preț/tonă × curs).
3. **Nu** închide recepția fără preț.
4. Livrarea are nevoie de **număr de factură** înainte de închidere.
5. Sumele din reclamații afectează creanțele — reconciliază cu contabilul.
6. Soldul de deschidere îl setează **doar Administratorul**; managerul îl citește.
7. Plățile/încasările parțiale actualizează automat soldul rămas.
8. Documentele redeschise sunt editabile, dar **auditate**.
9. **Randamentul** este KPI zilnic — investighează abaterile.

---

*Acest manual reflectă permisiunile rolului „manager" definite în aplicație. Pentru funcții suplimentare (nomenclatoare, solduri de deschidere, utilizatori), contactează Administratorul.*
