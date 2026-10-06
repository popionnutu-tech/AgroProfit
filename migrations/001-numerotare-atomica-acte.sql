-- ============================================================================
-- Numerotarea ATOMICĂ a actelor de achiziție
--
-- DE CE: până acum numărul se calcula din blobul JSON (`max + 1`) și se scria cu
-- un upsert necondiționat, fără verificare de versiune. O scriere concurentă —
-- operatorul salvează o recepție în timp ce contabilul tipărește — putea pierde
-- incrementul, și două acte semnate ajungeau cu ACELAȘI număr în dosarul fiscal.
-- Aplicația detecta cazul după scriere și refuza tipărirea, dar nu îl făcea
-- imposibil.
--
-- CE FACE: mută registrul numerelor în PostgreSQL. Advisory lock pe firmă (ca
-- alocările să fie serializate) + cheie primară (firmă, număr) — deci duplicatul
-- e imposibil chiar dacă lacătul ar fi ocolit.
--
-- SIGURANȚĂ: strict ADITIVĂ. Nu atinge `kv_storage` și nu modifică nicio dată
-- existentă. Codul aplicației merge și ÎNAINTE de a rula asta (cade pe metoda
-- veche).
--
-- ⚠️ ORDINEA CONTEAZĂ. Dacă s-au emis deja acte pe metoda veche, contorul din
-- PostgreSQL ar porni de la 914 și ar DUPLICA numere deja tipărite și semnate.
-- De aceea migrarea SEAMĂNĂ tabelul din numerele existente (blocul de mai jos,
-- citit din `kv_storage`), înainte ca funcția să fie folosită.
--
-- CUM SE RULEAZĂ: Supabase → SQL Editor → paste → Run. Se poate rula de mai
-- multe ori fără efect (idempotentă).
-- ============================================================================

create table if not exists public.purchase_act_numbers (
  company_id  integer     not null,
  number      integer     not null,
  series      text        not null default '',
  receipt_ids jsonb       not null default '[]'::jsonb,
  issued_at   timestamptz not null default now(),
  primary key (company_id, number)
);

comment on table public.purchase_act_numbers is
  'Registrul numerelor de act de achiziție. Cheia primară (company_id, number) face '
  'duplicatul imposibil. Seria e per firmă, deci fiecare firmă are propriul șir.';

-- Șirul pornește de la 914: actul lui Cojocari Ana din 02.10.2026, numerotat pe
-- hârtie. Actele de dinainte rămân nenumerotate în aplicație — au numere scrise
-- de mână și nu se rescrie nimic semnat.
create or replace function public.allocate_purchase_act_number(
  p_company_id integer,
  p_series     text,
  p_receipt_ids jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_number integer;
begin
  if p_company_id is null then
    raise exception 'Firma emitenta e obligatorie';
  end if;

  -- Serializează alocările pentru ACEEAȘI firmă, pe durata tranzacției. Firme
  -- diferite nu se blochează între ele.
  -- Varianta cu DOUĂ argumente, ca să avem spațiu de nume propriu: cheile mici
  -- (1, 2, 3 — id-uri de firmă) stau altfel în spațiul GLOBAL de advisory locks,
  -- unde orice extensie sau job care ia `pg_advisory_lock(1)` s-ar bloca reciproc
  -- cu alocarea de acte, fără nicio legătură logică.
  perform pg_advisory_xact_lock(hashtext('purchase_act_number'), p_company_id);

  select coalesce(max(number), 913) + 1
    into v_number
    from public.purchase_act_numbers
   where company_id = p_company_id;

  insert into public.purchase_act_numbers (company_id, number, series, receipt_ids)
  values (p_company_id, v_number, coalesce(p_series, ''), coalesce(p_receipt_ids, '[]'::jsonb));

  return v_number;
end;
$$;

comment on function public.allocate_purchase_act_number is
  'Alocă atomic următorul număr de act pentru o firmă. Advisory lock + cheie primară: '
  'două cereri concurente nu pot primi același număr.';

-- RLS pe tabel: service role îl ocolește (așa trebuie), dar dacă vreodată cheia
-- anon/publishable ajunge să citească baza, registrul nu se expune.
alter table public.purchase_act_numbers enable row level security;

-- ⚠️ ESENȚIAL. Funcția e `security definer`, deci rulează ca proprietar și OCOLEȘTE
-- RLS-ul de mai sus. În Postgres, funcțiile noi primesc `EXECUTE` pentru `PUBLIC`,
-- iar Supabase expune `anon` și `authenticated` prin PostgREST
-- (`POST /rest/v1/rpc/allocate_purchase_act_number`). Fără liniile de mai jos,
-- oricine ar avea cheia publishable putea arde numere din șirul fiscal în buclă —
-- exact „gaura în șir, imposibil de explicat la control" pe care migrarea o previne.
revoke all on function public.allocate_purchase_act_number(integer, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.allocate_purchase_act_number(integer, text, jsonb)
  to service_role;
revoke all on table public.purchase_act_numbers from anon, authenticated;

-- ============================================================================
-- SEMĂNAREA din numerele deja emise
--
-- Actele emise pe metoda veche au numărul pe recepție, în blobul JSON de sub cheia
-- `receipts`. Se inserează aici cel mai mare număr per firmă, ca următoarea alocare
-- atomică să continue de la el, nu de la 914.
--
-- Rândurile semănate au `series`/`receipt_ids` din document și `issued_at` real când
-- există. Idempotent: `on conflict do nothing`.
-- ============================================================================

insert into public.purchase_act_numbers (company_id, number, series, receipt_ids, issued_at)
select
  coalesce((r->>'actCompanyId')::integer, 0)          as company_id,
  (r->>'actNumber')::integer                          as number,
  coalesce(r->>'actSeries', '')                       as series,
  coalesce(r->'actFigures'->'receiptIds', '[]'::jsonb) as receipt_ids,
  coalesce((r->>'actIssuedAt')::timestamptz, now())   as issued_at
from public.kv_storage k
cross join lateral jsonb_array_elements(k.value->'receipts') as r
where k.key = 'receipts'
  and (r->>'actNumber') is not null
  and (r->>'actNumber') ~ '^[0-9]+$'
  and (r->>'actNumber')::integer > 0
on conflict (company_id, number) do nothing;

-- ============================================================================
-- VERIFICARE (opțional, rulează separat după migrare)
--
-- Ce s-a semănat din actele deja emise (ar trebui să coincidă cu dosarul de hârtie):
--   select company_id, series, min(number), max(number), count(*)
--     from public.purchase_act_numbers group by company_id, series order by company_id;
--
-- Următorul număr care se va aloca pentru firma 1:
--   select coalesce(max(number), 913) + 1 from public.purchase_act_numbers where company_id = 1;
--
-- NU rula `allocate_purchase_act_number` „de test": fiecare apel CONSUMĂ definitiv un
-- număr din șirul fiscal. Testează pe o firmă inexistentă (ex. 999) și șterge după:
--   select public.allocate_purchase_act_number(999, 'TEST', '[]'::jsonb);
--   delete from public.purchase_act_numbers where company_id = 999;
-- ============================================================================
