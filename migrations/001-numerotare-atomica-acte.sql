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
-- veche), deci ordinea nu contează.
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
  perform pg_advisory_xact_lock(p_company_id);

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

-- Aplicația se conectează cu service role, care ocolește RLS. Activăm totuși RLS
-- fără politici: dacă vreodată cheia anon/publishable ajunge să citească baza,
-- registrul de acte nu se expune.
alter table public.purchase_act_numbers enable row level security;

-- ============================================================================
-- VERIFICARE (opțional, rulează separat după migrare)
--
--   select public.allocate_purchase_act_number(1, 'AP', '[1,2]'::jsonb);  -- 914
--   select public.allocate_purchase_act_number(1, 'AP', '[3]'::jsonb);    -- 915
--   select public.allocate_purchase_act_number(2, 'AGR', '[4]'::jsonb);   -- 914 (altă firmă)
--   select * from public.purchase_act_numbers order by company_id, number;
--
-- Dacă rulezi verificarea, ȘTERGE rândurile de test înainte de folosirea reală:
--   delete from public.purchase_act_numbers;
-- ============================================================================
