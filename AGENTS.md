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
