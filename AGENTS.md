<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Plan prices and benefits live in src/config/pricing.ts; content (parcours, FAQ, resources, free-test questions) in src/config/*.ts — single source so copy/prices change in one place.
- Published learning questions and lessons live in the Cloud catalogue; config/free-test.ts is only a legacy scoring fixture, not live content, to avoid divergent question banks.
- Protected learning routes live under _authenticated/app with shared AppShell; public quiz has its own header so layouts match the supplied reference screens.
- Learning completion and attempt writes use authenticated database functions; completion uniqueness and sequential unlocks prevent repeated XP and forged progress.
- User-owned reads use authenticated server functions and query loaders; root maintains one auth-state listener, preserving generated bearer middleware.

- Resumable learning sessions snapshot questions, answers, pathway and server deadline in Cloud; authenticated RPCs serialize answer submission and finalization so refresh never duplicates scoring.
- Lesson lists and practice entry pages are index children of Outlet layouts so detail and feedback URLs render independently.
- Personal revision AI uses an authenticated streaming API route and request-scoped server-only Gateway helpers; plans are owner-readable and terminal billing/access blocks persist server-side to prevent repeated billed calls.
- The public homepage hero is isolated in HomeHero with homepage-scoped styles so fidelity corrections do not change approved app screens or other public pages.
- Official programme taxonomy and verified references live in src/config/official-programme.ts; legacy lessons and stored mistakes are mapped at read time, preserving session snapshots, answer order and earned progress. Official references never imply editorial QCM are the ministry's complete bank.
- Auth and session-entry reference styles are scoped to approved-auth and entry-shell; SessionStart reuses persistent RPCs with click-only creation/resume and theme-prefixed practice selection, preventing introductory visits from starting exam deadlines.

- Registration credentials remain in an in-memory draft only; non-sensitive objectives and diagnostic snapshots use scoped session storage so returning to step one never writes passwords to persistent storage.
- Practice question presentation is separate from feedback; recorded answers and server current index remain authoritative while previous-question viewing and tentative selections never alter scoring.
- Exam confirmation counts only recorded answers, navigation never validates tentative selections, and finalization is a separate authenticated idempotent RPC; all question indexes stay revisitable before submission.
