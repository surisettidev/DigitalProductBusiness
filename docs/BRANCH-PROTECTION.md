# Branch Protection Setup — Freelancer OS

The Daily AI Agent must NEVER be able to push directly to `main`. The only mechanism preventing this is GitHub's branch protection rule. Set it once.

## Steps

1. Open https://github.com/surisettidev/DigitalProductBusiness/settings/branches
2. Click **"Add branch protection rule"** (or **Add rule** if first one)
3. Branch name pattern: `main`
4. Check the following:
   - ☑ **Require a pull request before merging**
     - ☑ Require approvals: **1**
     - ☑ Dismiss stale pull request approvals when new commits are pushed
   - ☑ **Require status checks to pass before merging** (once you have CI checks; Cloudflare Pages auto-deploy can be added later)
   - ☑ **Require conversation resolution before merging**
   - ☑ **Do not allow bypassing the above settings** (this is the critical one)
   - ☑ **Restrict who can push to matching branches** → add only your own GitHub user
5. Save / Create

## Verification

After saving, try this from a terminal (using any PAT, even the agent one):

```bash
git clone https://x-access-token:YOUR_PAT@github.com/surisettidev/DigitalProductBusiness.git
cd DigitalProductBusiness
echo "test" >> README.md
git commit -am "test push to main"
git push origin main
```

Expected: GitHub refuses with `protected branch hook declined`. ✅

If it succeeds, branch protection is NOT working — fix the rule.

## Kill-switch drill (do once)

1. Generate a temporary fine-grained PAT scoped to this repo, expiry 7 days
2. Test it works: `curl -H "Authorization: Bearer <PAT>" https://api.github.com/repos/surisettidev/DigitalProductBusiness` → 200 OK
3. Go to https://github.com/settings/personal-access-tokens → click the token → **Revoke**
4. Retest the curl → 401 Unauthorized ✅
5. You have proven the kill switch works.

Repeat this revocation/regeneration **monthly** as routine hygiene.
