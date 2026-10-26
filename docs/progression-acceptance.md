# Progression redesign — acceptance record

Date: 2026-10-26. Base: cb6f1021d89ea162f8a2c1eb507f83f52a429ab3.

## Changes

- Replace four metric cards and the large chart with one compact overview, five theme rows, recent recorded activity and the existing agenda in planner mode.
- Match Dashboard's pathway-specific published lesson denominator and completion intersection. Historical records remain intact.
- Keep exam results separate from completed exercise attempts. Empty or short exams do not appear as a complete simulation. Unassessed accounts show no invented score.
- Exercise counts describe recorded attempts, not unique mastered questions. Ignore invalid selections and unfinished sessions.
- Reuse owner-scoped agenda queries and mutations. Preserve previous/next week, today, date picker and task CRUD. Dates without activities or plans have no dot.
- Scope responsive styles to Progression and preserve AppShell container tokens, approved logo and CIVI assets.
- Preserve existing languages, including Portuguese. The historical demo URL now explicitly shows actual account data rather than mixing invented results into the account.

## Verified

- 42 test files, 269 tests pass.
- TypeScript no-emit check passes.
- Production build passes (existing dependency deprecation notices remain).
- Changes contain no database migration, access grants, payment configuration or production data writes.

## Still required before merge/release

- Browser visual checks at 360, 390, 768, 1024 and 1440 px.
- Arabic right-to-left layout and long translated labels.
- Real session history, latest exam result link and agenda interactions in an authenticated preview.
- Compare the branch against any newer main changes before merging.
- This PR alone does not complete the content catalogue, teacher workspace, payments or full product acceptance.

The earlier uncommitted workspace was automatically pruned. This branch reconstructs the reviewed change from the same remote base and adds reproducible regression coverage. No live deployment has been performed.
