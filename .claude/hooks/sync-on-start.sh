#!/usr/bin/env bash
# Hook SessionStart: sincronizeaza ramura de lucru cu remote-ul la INCEPUTUL fiecarei sesiuni.
#
# SCOP: lucrezi de pe mai multe calculatoare (acasa / serviciu) fara sa mai apara
# divergenta. La pornire:
#   - aduce ultimele commit-uri (git fetch);
#   - daca esti DOAR in urma -> face fast-forward automat (te pune la zi, fara sa suprascrie nimic);
#   - daca ramurile au DIVERGAT sau ai modificari nesalvate -> DOAR avertizeaza (nu atinge nimic);
#   - avertizeaza si daca ramura de lucru e in urma lui `main` (cazul depistat anterior).
#
# Iese mereu cu 0 (non-blocant). Nu face NICIODATA push si nu suprascrie munca locala.

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
export PATH="$HOME/.local/bin:$PATH"
export GIT_TERMINAL_PROMPT=0   # nu bloca sesiunea cerand parola daca nu sunt credentiale

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  exit 0
fi

# fetch cu timeout daca exista (nu lasa sesiunea sa atarne pe retea proasta)
TO=""
command -v timeout  >/dev/null 2>&1 && TO="timeout 20"
command -v gtimeout >/dev/null 2>&1 && TO="gtimeout 20"
$TO git fetch origin --quiet 2>/dev/null

NOTE=""

if git rev-parse --verify --quiet "origin/$BRANCH" >/dev/null 2>&1; then
  set -- $(git rev-list --left-right --count "HEAD...origin/$BRANCH" 2>/dev/null)
  AHEAD="${1:-0}"; BEHIND="${2:-0}"
  DIRTY="$(git status --porcelain 2>/dev/null)"

  if [ "$BEHIND" -gt 0 ] && [ "$AHEAD" -eq 0 ]; then
    if [ -z "$DIRTY" ]; then
      if git merge --ff-only --quiet "origin/$BRANCH" 2>/dev/null; then
        NOTE="Sincronizat: am adus $BEHIND commit(uri) de pe origin/$BRANCH (fast-forward). Esti la zi."
      else
        NOTE="Esti in urma cu $BEHIND commit(uri) pe $BRANCH, dar fast-forward a esuat. Ruleaza manual: git pull --ff-only."
      fi
    else
      NOTE="Esti in urma cu $BEHIND commit(uri) pe origin/$BRANCH SI ai modificari nesalvate. Fa commit/stash apoi git pull --ff-only INAINTE de a lucra (altfel apare divergenta)."
    fi
  elif [ "$BEHIND" -gt 0 ] && [ "$AHEAD" -gt 0 ]; then
    NOTE="ATENTIE divergenta pe $BRANCH: $AHEAD commit local(e) + $BEHIND pe remote. Reconciliaza inainte de a lucra: git pull --rebase (sau merge) si rezolva conflictele."
  elif [ "$AHEAD" -gt 0 ]; then
    NOTE="Ai $AHEAD commit(uri) locale nepushate pe $BRANCH (se urca automat la prima modificare)."
  else
    NOTE="La zi cu origin/$BRANCH."
  fi
else
  NOTE="Ramura $BRANCH nu are inca corespondent pe remote (origin/$BRANCH lipseste)."
fi

# Avertizare suplimentara: ramura de lucru in urma lui main (exact cazul depistat anterior)
if git rev-parse --verify --quiet origin/main >/dev/null 2>&1 && [ "$BRANCH" != "main" ]; then
  BEHIND_MAIN="$(git rev-list --count "HEAD..origin/main" 2>/dev/null || echo 0)"
  if [ "${BEHIND_MAIN:-0}" -gt 0 ]; then
    NOTE="$NOTE | $BRANCH e in urma lui origin/main cu $BEHIND_MAIN commit(uri) — ia in calcul: git merge origin/main."
  fi
fi

# escape minimal pentru JSON
NOTE="${NOTE//\\/\\\\}"
NOTE="${NOTE//\"/\\\"}"
printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"SYNC RAMURA: %s"}}\n' "$NOTE"
exit 0
