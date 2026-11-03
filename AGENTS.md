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

## Architecture rules

- The admin panel is a single `/admin` route (`src/routes/admin.tsx`) with section switching by local state in `src/components/admin/AdminShell.tsx`; do not split sections into separate routes or a `/admin/*` route tree. Why: the spec requires mock/local state only and one login page.
- All admin entities live in the AppProvider store (`src/hooks/useAppStore.tsx`); never introduce a backend, API calls, or browser persistence beyond the admin-login flag.
- New record forms use `EntityFormModal` + `field()` from `src/components/admin/shared.tsx` (plain bracket access on `EntityRecord` breaks the `noPropertyAccessFromIndexSignature` typecheck rule).
