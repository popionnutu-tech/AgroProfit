#!/usr/bin/env bash
# Hook PostToolUse: auto-commit + push pe ramura de lucru DUPA fiecare modificare de cod.
#
# SIGURANTA (regula proiectului): push pe `main` => deploy AUTOMAT in PRODUCTIE peste
# date reale. De aceea acest hook REFUZA sa opereze pe `main`. Commit + push se fac
# DOAR pe o ramura de lucru (ex. `dev`) -> Vercel face deploy de PREVIEW, productia ramane neatinsa.
#
# Iese mereu cu 0 ca sa nu blocheze fluxul; semnaleaza starea prin additionalContext.

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

# foloseste gh CLI instalat in ~/.local/bin daca exista
export PATH="$HOME/.local/bin:$PATH"

# doar intr-un repo git
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"

# Protectie productie: pe main (sau detached HEAD) NU comitem/pushuim automat.
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "HEAD" ] || [ -z "$BRANCH" ]; then
  cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"AUTO-COMMIT DEZACTIVAT: esti pe `main` (sau detached HEAD). Push pe main declanseaza deploy in PRODUCTIE peste date reale. Treci pe ramura de lucru (`git checkout dev`) ca sa se activeze auto-commit + push de preview."}}
JSON
  exit 0
fi

# nimic de comis?
if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
  exit 0
fi

TS="$(date '+%Y-%m-%d %H:%M:%S')"
git add -A 2>/dev/null

if ! git commit -q \
  -m "auto: modificare cod ($TS)" \
  -m "Commit automat (hook PostToolUse) pe ramura $BRANCH." \
  -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>" 2>/dev/null; then
  exit 0
fi

if git push -q origin "$BRANCH" 2>/tmp/agro_auto_push_err; then
  MSG="commit + push OK pe origin/$BRANCH (Vercel ruleaza un deploy de PREVIEW)."
else
  ERR="$(head -1 /tmp/agro_auto_push_err 2>/dev/null)"
  MSG="commit LOCAL OK pe $BRANCH, dar push a ESUAT ($ERR). Verifica reteaua/credentialele si fa push manual."
fi

# escape minimal pentru JSON (ghilimele si backslash)
MSG="${MSG//\\/\\\\}"
MSG="${MSG//\"/\\\"}"
printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"AUTO-COMMIT: %s"}}\n' "$MSG"
exit 0
