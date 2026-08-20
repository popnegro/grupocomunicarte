# Grupo Comunicarte — PMV Consolidation Audit — 2026-08-20

## Decision

The project should **not** be rebuilt or visually redesigned again. The immediate objective is to consolidate the existing PMV and move directly to real inventory loading.

## Reference hierarchy

1. **Landing / established visual language** = visual Source of Truth.
2. **2026-08-20 PMV snapshot** = functional/UI snapshot to preserve; do not treat it as a reason to re-open design exploration.
3. **main** = current architectural/operational base.
4. `experiment/pmv-inventory-explorer` = historical visual/PMV reference only; it is not a safe merge base because GitHub reports no common ancestor with `main`.

## Important repository finding

`main` and `experiment/pmv-inventory-explorer` do not share a common ancestor according to GitHub's compare API. Therefore the old branch must **not** be merged wholesale into `main`. Its UI patterns can be used as reference, but implementation must remain on the current `main` architecture.

## Current main architecture observed

- Public landing pages live under `src/pages/public`.
- `/inventario` is implemented in `src/pages/Inventario.tsx`.
- Dashboard functionality is centralized in `src/components/DashboardView.tsx` and modularized under `src/components/dashboard/`.
- `InventoryModule.tsx` already contains operational concepts including search, city/category/type/status filters, archive handling, add support, duplicate support, delete confirmation, inspector tabs, media upload and export hooks.
- `DashboardView.tsx` already loads screen, client, media-kit and changelog data through API calls and also contains a Firestore screen-loading path.
- The current dashboard navigation already includes inventory, leads, locations, reports and settings/admin areas.
- `CalendarModule.tsx`, `LeadsModule.tsx`, `InventoryModule.tsx` and `MediaKitModule.tsx` exist in the current dashboard module set.

## Critical consolidation risks

### 1. Do not replace the current dashboard with the old demo dashboard

The current `main` dashboard contains substantially more operational structure than the historical PMV branch. The target is to simplify its presentation, not remove its capabilities.

### 2. Preserve administrative actions

The inventory workflow must retain:

- edit
- duplicate/clone
- copy support data
- add support
- archive/delete handling
- availability/status management
- location/geographic data
- multimedia
- technical data

### 3. One inventory source of truth

The real inventory record must feed:

`Landing cards → /inventario → support detail → Dashboard inventory → Media Kit PDF/PPT`

No duplicated manually-maintained datasets should be introduced.

### 4. Real inventory is the next functional milestone

The next implementation step is importing and normalizing the existing real CSV/PPT inventory for:

- Mendoza — Tradicionales
- Mendoza — LEDs
- Mendoza — LED Móvil
- Buenos Aires — Tradicionales
- Buenos Aires — LEDs
- Buenos Aires — LED Móvil

The PPT/CSV data must become structured records rather than remaining presentation-only content.

### 5. Media Kit generation

The Media Kit must consume the same inventory records and support generation/export of:

- PDF
- PPT

The output should use the support's actual technical, commercial, geographic and multimedia data.

## Visual consolidation rules

- Hanken Grotesk remains the project typography.
- Keep the established neutral palette and semantic accents.
- Keep functional status badges.
- Remove decorative badges/pills, ornamental separators and redundant icons when they do not communicate state or enable an action.
- Avoid decorative UI that competes with the inventory/map workflow.
- Do not add screens when an existing route/state can handle the behavior.
- Keep `/inventario` within the established four-stage workflow.
- Do not redesign the map engine.

## Conversion/UX backlog to preserve for later implementation

These are useful but must not block inventory loading:

- no-results contextual banner with reset filters
- empty Media Kit guidance
- inter-city selection feedback
- reserved-support contextual explanation
- mobile add/remove feedback
- contact form instead of mailto where appropriate
- light contextual assistance/toasts

They should be implemented only after the real inventory flow is stable.

## Definition of DONE for the next milestone

A support can be imported once and then:

1. appear on the public inventory/map;
2. appear with its real data in the public card/detail;
3. be edited/cloned/copied from Dashboard;
4. have availability changed from Dashboard;
5. include real multimedia;
6. be selected by an advertiser;
7. be included in a Media Kit;
8. generate a real PDF/PPT proposal.

## Immediate next action

**Stop design exploration. Load and normalize the real inventory.**
