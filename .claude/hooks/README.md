# Hooks AgroProfit

## review-reminder.sh
PostToolUse → reamintește lansarea celor 3 agenți de verificare după fiecare modificare.

## auto-commit.sh (nivel proiect)
PostToolUse → commit + push automat pe ramura de lucru (deploy de PREVIEW pe Vercel).
Activ doar când Claude Code rulează din interiorul acestui repo.

## ~/.claude/hooks/agroprofit-auto-commit.sh (nivel global)
Același comportament, dar instalat în setările globale ale utilizatorului, deci se aplică în
**orice sesiune** Claude Code, indiferent de directorul de pornire. Are doi gardieni:
1. operează doar pe repo-ul AgroProfit (verifică remote-ul `origin`);
2. nu operează niciodată pe `main`/detached HEAD (protejează producția).

Promovarea în producție (`dev` → `main`) rămâne manuală.
