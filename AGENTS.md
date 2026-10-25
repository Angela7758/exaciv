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
- Learning completion and attempt writes use authenticated database functions; completion uniqueness and recorded last-section validation prevent repeated XP; recommendation order never locks a published applicable lesson.
- User-owned reads use authenticated server functions and query loaders; root maintains one auth-state listener, preserving generated bearer middleware.

- Resumable learning sessions snapshot questions, answers, pathway and server deadline in Cloud; authenticated RPCs serialize answer submission and finalization so refresh never duplicates scoring.
- Lesson lists and practice entry pages are index children of Outlet layouts so detail and feedback URLs render independently.
- Personal revision AI uses an authenticated streaming API route and request-scoped server-only Gateway helpers; plans are owner-readable and terminal billing/access blocks persist server-side to prevent repeated billed calls.
- The public homepage hero is isolated in HomeHero with homepage-scoped styles so fidelity corrections do not change approved app screens or other public pages.
- The six primary public routes share one persistent Paris background in the root public shell; responsive scene dimensions never depend on leaf text or route, preventing recropping during navigation.
- Homepage scene uses absolute desktop composition and a mobile-only grid; do not let mobile positioning rules override the desktop reference.
- Official programme taxonomy and verified references live in src/config/official-programme.ts; legacy lessons and stored mistakes are mapped at read time, preserving session snapshots, answer order and earned progress. Official references never imply editorial QCM are the ministry's complete bank.
- Auth and session-entry reference styles are scoped to approved-auth and entry-shell; SessionStart reuses persistent RPCs with click-only creation/resume and theme-prefixed practice selection, preventing introductory visits from starting exam deadlines.

- Registration credentials remain in an in-memory draft only; non-sensitive objectives and diagnostic snapshots use scoped session storage so returning to step one never writes passwords to persistent storage.
- Practice question presentation is separate from feedback; recorded answers and server current index remain authoritative while previous-question viewing and tentative selections never alter scoring.
- Exam confirmation counts only recorded answers, navigation never validates tentative selections, and finalization is a separate authenticated idempotent RPC; all question indexes stay revisitable before submission.

- New public preparation screens use scoped nine-public/nine-auth styles; homepage overrides stay mobile-only to preserve approved desktop views.
- Subscription confirmation resolves a selected plan from the pricing configuration and uses the existing AppShell without creating subscription records before real payment is available.
- Registration welcome reads non-sensitive objective snapshots while credentials stay in memory; preparation destinations are allowlisted local learning paths to prevent external redirects.
- Batch 2 app presentation uses a shared mobile-only AppShell header and bottom navigation; desktop dashboard and session scoring remain unchanged so all device sizes read the same account/session data.
- Password recovery is granted only by a provider PASSWORD_RECOVERY event or verified recovery OTP; root captures the event once, both public reset URLs share one form, and ordinary logged-in sessions or URL flags do not grant password-reset access.
- Lesson sections use owner/pathway-scoped reading positions; explicit completion stays separate so opening a lesson cannot award XP.
- Consented guest diagnostic imports use stable question IDs and an idempotent key in learning_sessions; review answers also create sessions so mistakes, history and statistics share recorded answers.
- Historical mistakes are retained and mastery follows the newest recorded answer; exam finalization permits blanks, while practice requires all answers and expired exams finalize before a fresh start.
- Internal interface translations use an explicit source-message dictionary and the existing locale provider; pedagogical translations use a separate exact-French-source dictionary at display time, preserving authoritative Cloud snapshots, option order and scoring. Missing or changed source text falls back to French.
- Primary question content and audio remain French; shared QuestionAids alone translates visible fragments with independent help preferences, preserving answer order and withholding corrections until revealed.

- Keep supported interface locales aligned across browser dictionaries, account validators and profile constraints, so language selection survives reconnecting without changing learning data.
- Keep the React locale context in a dictionary-independent module so hot updates cannot split provider and consumer context identities.
- Lesson artwork is mapped by stable Cloud lesson ID and rendered with SafeImage; unverified editorial video inventory is never exposed as teaching content or counted as video learning.
- Signed-in shell dimensions (sidebar, topbar, content width, title levels) come from the shared --app-* tokens at the end of src/styles.css; page variants must not resize the shell, so every section feels like one product.

- Use SafeImage for inspected app artwork so failed media retains an accessible layout slot; preserve clean original CIVI poses and never repair transparency with blending.

- Administration writes use authenticated permission-checked RPCs with audit records; drafts/versioned option IDs publish into the existing catalogue and configured tests freeze independent session snapshots.
- Public and learning mobile menus use the existing Radix Sheet portal for focus trapping, scroll locking and dismiss behavior; shared drawer styling must remain independent of homepage header selectors.
- LearningAgenda is the single owner-scoped planning source for Dashboard and Progression; date keys are calendar dates in the browser timezone, distinct from recorded activities.
- AccountGreeting is shared by every AppShell page; breadcrumbs belong to content, never replace the greeting.
- Lesson French source remains visible while LessonTranslation owns separate assistance; local-audio coordinates reference speech and temporary recordings to prevent overlapping playback.
- Topic artwork is mapped by semantic theme, with local fallback images; unpublished theme counts never masquerade as completion.
- Practice entry uses start_classified_practice with shared strict validation; session snapshots store filter/correction/timer settings so navigation cannot reset their rules. Legacy and configured test entry points preserve their independent contracts.
- Question classification uses reviewed draft publication and a provenance guard; configured tests select the same persisted classification and sessions never update their historical snapshots.
- Published catalogue exposes pathway-scoped coverage; applicable lesson lists and completion intersections use one shared helper to avoid inflated progress after an objective change.
- Cache lesson assistance by exact French source and target locale; missing responses remain explicit errors rather than translated-looking French, preventing cross-section cache contamination.
