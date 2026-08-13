#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BRANCH="audit/ux-ui-remix"

printf '\n[1/6] Verificando repositorio...\n'
git rev-parse --show-toplevel >/dev/null

printf '[2/6] Creando backup local...\n'
BACKUP="../grupocomunicarte-qa-backup-$(date +%Y%m%d-%H%M%S).patch"
git diff --binary > "$BACKUP" || true
git diff --cached --binary >> "$BACKUP" || true
printf 'Backup: %s\n' "$BACKUP"

printf '[3/6] Sincronizando skeleton de Explorer...\n'
git fetch origin "$BRANCH" >/dev/null 2>&1 || true
if git cat-file -e "origin/$BRANCH:remix-landing/src/components/ExplorerSkeleton.tsx" 2>/dev/null; then
  git restore --source="origin/$BRANCH" -- "src/components/ExplorerSkeleton.tsx"
fi

printf '[4/6] Corrigiendo advertencias conocidas...\n'
python3 - <<'PY'
from pathlib import Path

# DashboardSupportsPage: MapPin is unused in the current component.
p = Path('src/components/DashboardSupportsPage.tsx')
if p.exists():
    s = p.read_text()
    s = s.replace(', MapPin, Video,', ', Video,')
    s = s.replace('MapPin, Video,', 'Video,')
    p.write_text(s)

# MediaKitStudio: enforce the domain type and B2B/B2C values.
p = Path('src/components/MediaKitStudio.tsx')
if p.exists():
    s = p.read_text()
    if "MediaKitAudience" not in s.split("from '../types';")[0]:
        s = s.replace(
            "import type { Lead, MediaKit, Support } from '../types';",
            "import type { Lead, MediaKit, MediaKitAudience, Support } from '../types';",
        )
        s = s.replace(
            "import type {\n  Lead,\n  MediaKit,\n  Support,\n} from '../types';",
            "import type {\n  Lead,\n  MediaKit,\n  MediaKitAudience,\n  Support,\n} from '../types';",
        )
    s = s.replace(
        "useState('Modern Pitch')",
        "useState<MediaKitAudience>('B2C')",
    )
    s = s.replace(
        "useState(\"Modern Pitch\")",
        "useState<MediaKitAudience>('B2C')",
    )
    s = s.replace(
        "onChange={(e) => setSlidesLayout(e.target.value)}",
        "onChange={(e) => setSlidesLayout(e.target.value as MediaKitAudience)}",
    )
    s = s.replace(
        '<option>Modern Pitch</option><option>Corporate</option><option>Minimal</option>',
        '<option value="B2B">B2B · Agencias</option><option value="B2C">B2C · Cliente directo</option>',
    )
    p.write_text(s)

# Media Kit CSS: repair doubled escapes introduced into selectors.
p = Path('src/components/dashboard-media-kit.css')
if p.exists():
    s = p.read_text()
    s = s.replace('\\\\', '\\')
    p.write_text(s)
PY

printf '[5/6] Inyectando skeleton de Explorer cuando corresponda...\n'
python3 - <<'PY'
from pathlib import Path

p = Path('src/components/ExplorerPage.tsx')
if p.exists():
    s = p.read_text()
    if "./ExplorerSkeleton" not in s:
        marker = "import { SelectionBar } from './SelectionBar';"
        if marker in s:
            s = s.replace(marker, marker + "\nimport { ExplorerInventorySkeleton } from './ExplorerSkeleton';")

    s = s.replace(
        "<div className=\"flex flex-col items-center justify-center py-12 text-center\"><LoaderCircle className=\"mx-auto h-12 w-12 animate-spin text-slate-300\" /><h3 className=\"mt-2 text-sm font-medium text-gray-900\">Cargando inventario...</h3><p className=\"mt-1 text-sm text-gray-500\">Estamos preparando las ubicaciones disponibles.</p></div>",
        "<ExplorerInventorySkeleton />",
    )
    s = s.replace(
        "h-[600px]",
        "h-150",
    )
    s = s.replace(
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
    )
    s = s.replace(
        ", ArrowLeft, LoaderCircle",
        ", ArrowLeft",
    )
    s = s.replace(
        ",ArrowLeft,LoaderCircle",
        ",ArrowLeft",
    )
    p.write_text(s)
PY

printf '[6/6] Validando...\n'
npm run lint
npm run build

printf '\n✅ Reconciliación QA completada.\n'
printf 'Revisá: git status --short\n'
printf 'Backup: %s\n' "$BACKUP"
