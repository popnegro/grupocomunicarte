# PMV Final Integration

## Canonical architecture

- `main` is the canonical application and backend integration branch.
- `experiment/pmv-inventory-explorer` is a historical Golden UI/UX reference only.
- The 2026-08-20 snapshot records the consolidated PMV presentation state.
- Do **not** merge the historical branch wholesale into `main`; the histories are unrelated.

## Public workflow

`Landing → /inventario → detalle/selección → Media Kit/cotización → /confirmacion`

`/inventario` remains the four-stage workflow:

1. Explorar y filtrar
2. Detalle y selección
3. Media Kit / cotización
4. Confirmación

No new intermediate screens are required for the PMV.

## Administrative workflow

The dashboard remains operational and must preserve existing capabilities:

- executive overview
- inventory management
- edit support
- duplicate/clone support
- copy support data
- add support
- availability/status management
- archive/delete handling
- geographic data
- multimedia
- leads management
- reservations/calendar
- Media Kit management

Lead states remain operational and visible:

`Nuevo → Contactado → Kit Enviado → Cerrado`

## Inventory is the next milestone

The next implementation step is **real inventory loading**, not another design iteration.

The inventory must cover:

- Mendoza — Soportes Tradicionales
- Mendoza — LEDs
- Mendoza — LED Móvil
- Buenos Aires — Soportes Tradicionales
- Buenos Aires — LEDs
- Buenos Aires — LED Móvil

The existing database already contains the core `screens`, `locations`, `cities`, `categories` and `media` structures. The real CSV/PPT content must be normalized into these structures rather than duplicated across views.

## Single source of truth

A support is entered once and reused by:

`Landing cards → /inventario → map/detail → Dashboard inventory → Media Kit`

The public card, administrative record and Media Kit must consume the same support data.

## Media Kit output

The PMV target is:

- generate/download PDF
- generate/export PPT / Google Slides where the existing integration supports it

Outputs must use the real support data and multimedia from the inventory source of truth.

## Visual rules

- Landing remains the visual Source of Truth.
- Hanken Grotesk and established design tokens remain unchanged.
- Functional status badges remain.
- Decorative badges/pills, ornamental separators and redundant iconography must not be reintroduced.
- Functional UI takes priority over decoration.
- The standard street map is not redesigned.
- No redundant inventory workflow screens are introduced.

## Contextual UX backlog — after inventory stability

These improvements are valid but do not block the inventory milestone:

- no-results contextual banner + reset filters
- empty Media Kit guidance
- inter-city selection feedback
- reserved-support contextual explanation
- mobile add/remove feedback
- contact form conversion improvement
- lightweight contextual assistance/toasts

## Definition of DONE

The PMV is DONE when a real support can be imported once and then:

1. appear on the public inventory/map;
2. display its real data in the public card/detail;
3. be edited, cloned or copied in Dashboard;
4. have availability changed from Dashboard;
5. expose its real multimedia;
6. be selected by an advertiser;
7. be included in a Media Kit;
8. generate a usable PDF/PPT proposal;
9. create/manage the resulting commercial lead/reservation flow;
10. pass clean build, typecheck and responsive QA.

## Scope lock

Do not reopen visual exploration, rebuild the PMV, or introduce new product areas before the real inventory flow is operational.
