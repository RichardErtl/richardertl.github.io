# Deployment checklist

Everything below must happen before publication. The workflow in
`.github/workflows/deploy.yml` only runs when started by hand.

- [ ] Before the first push, make sure no unapproved draft sits in the tree or the history.
      The draft flag protects the build output, not the source in a public repository.
- [ ] Create the GitHub repository `richardertl.github.io`.
- [ ] Set the repository variable `SITE_URL` to `https://richardertl.github.io`.
- [ ] Set `publishedAt` on all three articles to the real publication day (provisional: 2026-11-06).
- [x] Write the legal notice and privacy notice for Austria, then remove their placeholder text.
- [ ] Enable GitHub Pages with GitHub Actions as the source.
- [ ] Start the workflow by hand and review the live site.
