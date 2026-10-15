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

- Keep finance calculations and validation in a browser-safe module shared by charts, summaries, forms, and tests so financial values cannot drift.
- Persist finance data in browser localStorage via src/lib/finance-storage.ts (finance routes use ssr:false); sample data is written only when nothing valid is saved — cookies in the cross-site preview iframe were unreliable.
- Use a shared finance screen and shell for dashboard, transactions, budgets, categories, reports, and settings, with separate leaf routes and metadata.
