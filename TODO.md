# TODO - Clean Code + Correct Data + Working Pages

## Plan (fast path: build + working first)
- [ ] 1) Run lint/build to identify compile/runtime errors.
- [ ] 2) Fix `src/pages/Checkout.jsx` structure/state issues causing incorrect flow.
- [ ] 3) Fix `src/pages/Orders.jsx` structure/state issues (localStorage/Firebase sync + logic).
- [ ] 4) Fix `src/pages/spareparts.jsx` state/logic bugs (duplicate state, per-item error handling).
- [ ] 5) Verify order data model consistency across:
  - [ ] Checkout -> saved order shape
  - [ ] ConfirmOrders -> loading/updating
  - [ ] AdminOrders -> status updates
  - [ ] Orders -> rendering/controls
- [ ] 6) Run `npm run lint` again.
- [ ] 7) Run `npm run build` again.
- [ ] 8) Manual smoke test routes: /spareparts, /spareparts/:id, /checkout, /orders, /admin flows.
- [ ] 9) Final cleanup pass: remove unused imports/vars, normalize formatting.

