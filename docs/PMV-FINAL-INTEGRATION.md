# PMV Final Integration

## Architecture baseline

- `main` is the canonical backend and application integration branch.
- `experiment/pmv-inventory-explorer` is the Golden UI/UX reference.
- `chore/pmv-final-audit-handoff` is the functional UX reference for the support-selection funnel.
- The final PMV combines those decisions; it does not merge the experimental repository wholesale.

## Selection funnel retained from handoff

1. Browse inventory.
2. Select only currently available supports.
3. Persist selection for the current browser session.
4. Reconcile selection when inventory changes.
5. Review selected supports in the Sticky Selection Bar / Media Kit panel.
6. Submit with explicit IDLE / LOADING / SUCCESS / ERROR states.
7. Prevent double submit while loading.
8. Revalidate availability server-side.
9. Return a requestId on success.
10. Clear selection only after successful completion.

## Visual baseline

The visual language follows the design tokens in `tokens-design.md` and the Golden UI reference. Avoid introducing parallel colors, typography scales, radii, or button styles.

## PMV scope

Keep the implementation simple and production-stable. PDF generation, CRM, advanced availability scheduling, concurrent reservation locking, and other roadmap items remain outside the PMV unless required to make the core funnel functional.
