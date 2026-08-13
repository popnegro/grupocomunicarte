#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

backup_file() {
  local file="$1"
  local backup="${file}.qa-backup"
  if [[ -f "$file" && ! -f "$backup" ]]; then
    cp "$file" "$backup"
  fi
}

backup_file "src/components/DashboardSupportsPage.tsx"
backup_file "src/components/MediaKitStudio.tsx"
backup_file "src/components/dashboard-media-kit.css"
backup_file "src/components/ExplorerPage.tsx"

python3 - <<'PY'
from pathlib import Path

# Remove unused MapPin import from DashboardSupportsPage.
p = Path('src/components/DashboardSupportsPage.tsx')
if p.exists():
    s = p.read_text()
    s = s.replace(', MapPin, Video,', ', Video,')
    p.write_text(s)

# Normalize MediaKitStudio audience domain and the legacy string state.
p = Path('src/components/MediaKitStudio.tsx')
if p.exists():
    s = p.read_text()
    if "MediaKitAudience" not in s:
        s = s.replace(
            "import type { Lead, MediaKit, Support } from '../types';",
            "import type { Lead, MediaKit, MediaKitAudience, Support } from '../types';",
        )
    s = s.replace(
        "useState('Modern Pitch')",
        "useState<MediaKitAudience>('B2C')",
    )
    s = s.replace(
        "useState('B2C')",
        "useState<MediaKitAudience>('B2C')",
    )
    s = s.replace(
        "setSlidesLayout(e.target.value)",
        "setSlidesLayout(e.target.value as MediaKitAudience)",
    )
    p.write_text(s)

# Repair CSS selectors accidentally double-escaped in the generated stylesheet.
p = Path('src/components/dashboard-media-kit.css')
if p.exists():
    s = p.read_text()
    s = s.replace('\\\\', '\\')
    p.write_text(s)

# Canonicalize the Explorer utility classes if the local file still has them.
p = Path('src/components/ExplorerPage.tsx')
if p.exists():
    s = p.read_text()
    s = s.replace('focus-visible:outline focus-visible:outline-2', 'focus-visible:outline-2')
    s = s.replace('h-[600px]', 'h-150')
    if "./ExplorerSkeleton" in s:
        s = s.replace('import { Search,', 'import { Search,')
    p.write_text(s)
PY

if [[ -f src/components/ExplorerSkeleton.tsx ]]; then
  true
else
  echo "ExplorerSkeleton.tsx no existe. Ejecutá primero: git pull --ff-only origin audit/ux-ui-remix"
  exit 1
fi

npm run lint
npm run build

echo
echo "QA local: lint y build finalizaron correctamente."
