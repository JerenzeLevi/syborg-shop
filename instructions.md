# Getting SYBORG Shop live — Git, GitHub, Vercel

This walks through everything from zero to a live URL, assuming you've never
done this before. Do these in order.

## Part 0 — Check you have the tools

Open a terminal in the `syborg-shop` folder and run:

```
git --version
```

If that errors, install Git first: https://git-scm.com/downloads

You'll also need a free GitHub account (https://github.com) and a free
Vercel account (https://vercel.com — sign up with "Continue with GitHub",
it's easier).

## Part 1 — Turn this folder into a Git repo

Git tracks changes to your code over time. GitHub is just a website that
hosts a copy of your Git repo online so other tools (like Vercel) and other
people can access it.

```
git init
git add .
git commit -m "Initial commit"
```

- `git init` — starts tracking this folder with Git.
- `git add .` — stages all files (marks them to be saved in the next commit).
- `git commit -m "..."` — saves a snapshot with a message describing it.

Check `.gitignore` is already in place (it is) so `node_modules` and your
`.env` secrets don't get committed. Never remove `.env` from `.gitignore`.

## Part 2 — Create the GitHub repo

1. Go to https://github.com/new
2. Repository name: `syborg-shop` (or whatever you like)
3. Keep it **Public** or **Private**, your choice — Vercel works with either.
4. **Do NOT** check "Add a README" or ".gitignore" — you already have files
   locally and don't want conflicts.
5. Click **Create repository**. GitHub will show you a page with commands —
   ignore the "create a new repository" block, use the "push an existing
   repository" block instead. It looks like:

```
git remote add origin https://github.com/<your-username>/syborg-shop.git
git branch -M main
git push -u origin main
```

Run those three commands in your terminal. You'll be prompted to log in
(GitHub may ask you to authenticate via browser popup, or you'll need a
Personal Access Token instead of a password — GitHub will guide you if so).

Once it finishes, refresh the GitHub page — your files should all be there.

## Part 3 — How GitHub and Vercel work together

- **GitHub is the source of truth.** Your code lives there.
- **Vercel watches your GitHub repo.** Once connected, every time you `git
  push` new commits to GitHub, Vercel automatically detects the change,
  rebuilds the site, and deploys the new version — no manual upload needed.
- This means your workflow going forward is just:
  ```
  git add .
  git commit -m "describe what changed"
  git push
  ```
  ...and Vercel handles the rest within a minute or two.
- Vercel also gives you **preview deployments**: if you ever push to a
  branch other than `main` (or open a Pull Request), Vercel builds a
  separate preview URL for it, so you can test changes before merging them
  into `main` (which is what your live site actually runs).

## Part 4 — Deploy on Vercel

1. Go to https://vercel.com/new
2. Click **Import** next to your `syborg-shop` GitHub repo (you may need to
   click "Add GitHub Account" / grant access the first time).
3. Vercel auto-detects this is a Vite project — leave the build settings as
   default (Build Command: `vite build`, Output Directory: `dist`).
4. Before clicking Deploy, expand **Environment Variables** and add:
   - Name: `VITE_APPS_SCRIPT_URL`
   - Value: (paste your Apps Script `/exec` URL — the same one in your local
     `.env` file)
5. Click **Deploy**. Wait ~1 minute.
6. You'll get a live URL like `syborg-shop.vercel.app`. Open it and confirm
   the Shop page loads your catalog.

## Part 5 — Making changes after this point

Any time you or a teammate edits code locally:

```
git add .
git commit -m "what you changed"
git push
```

Vercel redeploys automatically. Check the "Deployments" tab on your Vercel
project dashboard to watch progress or see if a build failed.

## Common issues

- **`git push` asks for a password and rejects it** — GitHub no longer
  accepts your account password over HTTPS. Use a Personal Access Token
  (Settings → Developer settings → Personal access tokens on GitHub) as the
  password instead, or set up SSH keys.
- **Vercel build fails** — click into the failed deployment's logs on
  Vercel; it's almost always a missing environment variable or a typo in
  code that also fails `npm run build` locally.
- **Site loads but catalog is empty / shows demo data** — double check the
  `VITE_APPS_SCRIPT_URL` environment variable is set correctly in Vercel's
  project settings (Settings → Environment Variables), not just in your
  local `.env` (Vercel never reads your local `.env` file).
- **Changed an environment variable in Vercel but site didn't update** — you
  need to trigger a new deployment after changing env vars (Vercel dashboard
  → Deployments → "..." menu → Redeploy).
