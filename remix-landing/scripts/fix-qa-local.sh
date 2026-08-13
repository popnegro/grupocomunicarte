#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BACKUP_DIR=".qa-backups"
mkdir -p "$BACKUP_DIR"

backup_file() {
  local file="$1"
  local backup="$BACKUP_DIR/$(basename "$file")"
  if [[ -f "$file" && ! -f "$backup" ]]; then
    cp "$file" "$backup"
  fi
}

backup_file "src/components/DashboardSupportsPage.tsx"
backup_file "src/components/MediaKitStudio.tsx"
backup_file "src/components/dashboard-media-kit.css"
backup_file "src/components/ExplorerPage.tsx"
backup_file "src/components/ExplorerSkeleton.tsx"

python3 - <<'PY'
from pathlib import Path

# 1. DashboardSupportsPage: remove unused MapPin import.
p = Path('src/components/DashboardSupportsPage.tsx')
if p.exists():
    s = p.read_text()
    s = s.replace(', MapPin, Video,', ', Video,')
    p.write_text(s)

# 2. MediaKitStudio: align legacy slidesLayout with the domain type.
p = Path('src/components/MediaKitStudio.tsx')
if p.exists():
    s = p.read_text()
    if 'MediaKitAudience' not in s:
        s = s.replace(
            "import type { Lead, MediaKit, Support } from '../types';",
            "import type { Lead, MediaKit, MediaKitAudience, Support } from '../types';",
        )
    s = s.replace("useState('Modern Pitch')", "useState<MediaKitAudience>('B2C')")
    s = s.replace("setSlidesLayout(e.target.value)", "setSlidesLayout(e.target.value as MediaKitAudience)")
    p.write_text(s)

# 3. dashboard-media-kit.css: repair accidental double escaping.
p = Path('src/components/dashboard-media-kit.css')
if p.exists():
    s = p.read_text()
    s = s.replace('\\\\', '\\')
    p.write_text(s)

# 4. Explorer: normalize utility classes and add the shared skeleton import.
p = Path('src/components/ExplorerPage.tsx')
if p.exists():
    s = p.read_text()
    s = s.replace(
        'import { SupportImage } from \'./SupportImage\';',
        'import { SupportImage } from \'./SupportImage\';\nimport { ExplorerInventorySkeleton } from \'./ExplorerSkeleton\';',
    )
    s = s.replace('focus-visible:outline focus-visible:outline-2', 'focus-visible:outline-2')
    s = s.replace('h-[600px]', 'h-150')
    s = s.replace(
        '<div className="flex flex-col items-center justify-center py-12 text-center"><LoaderCircle className="mx-auto h-12 w-12 animate-spin text-slate-300" /><h3 className="mt-2 text-sm font-medium text-gray-900">Cargando inventario...</h3><p className="mt-1 text-sm text-gray-500">Estamos preparando las ubicaciones disponibles.</p></div>',
        '<ExplorerInventorySkeleton />',
    )
    s = s.replace(', LoaderCircle', '')
    s = s.replace('LoaderCircle, ', '')
    p.write_text(s)

# 5. Explorer skeleton should not use arbitrary height now that Tailwind 4 canonical utilities are available.
p = Path('src/components/ExplorerSkeleton.tsx')
if p.exists():
    s = p.read_text().replace('h-[600px]', 'h-150')
    p.write_text(s)
PY

if [[ ! -f src/components/ExplorerSkeleton.tsx ]]; then
  echo "ERROR: ExplorerSkeleton.tsx no existe. Recuperalo primero con: git pull --ff-only origin audit/ux-ui-remix"
  exit 1
fi

npm run lint
npm run build

echo
echo "QA local: lint y build finalizaron correctamente."
echo "Backups temporales: $BACKUP_DIR"
