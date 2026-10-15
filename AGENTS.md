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
- Store personal finance workspaces in Cloud behind unguessable HttpOnly cookie capabilities, with no public table access; the initial sample workspace is read-only until an explicit save creates a private copy.
- Use a shared finance screen and shell for dashboard, transactions, budgets, and categories, with separate leaf routes and metadata.
