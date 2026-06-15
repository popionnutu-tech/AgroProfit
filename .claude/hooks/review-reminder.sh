#!/usr/bin/env bash
# Hook PostToolUse: după fiecare modificare de cod (Edit/Write/MultiEdit) sau
# propunere de plan (ExitPlanMode), reamintește lansarea celor 3 agenți de verificare.
cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"REMINDER (cod modificat / plan propus): înainte de a raporta «gata», rulează OBLIGATORIU — într-un singur mesaj, în paralel — agenții architecture-guardian, performance-reviewer și security-reviewer pe această modificare/propunere. Nu cere voie, doar lansează-i. Raportează problemele grupate pe severitate (Critical/High/Medium/Low). Dacă apar Critical/High, NU raporta «gata» până nu decide utilizatorul."}}
JSON
