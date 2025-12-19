# Git History Cleanup Guide

⚠️ **WARNING:** This guide is for advanced users only. Rewriting git history can break existing clones and must be coordinated with all team members.

---

## Why Clean Git History?

The `.env` files were committed to the repository, which means the exposed credentials exist in the git history even though they've been removed from the current working tree. While the credentials should be rotated (making the historical exposure less critical), cleaning the history provides defense in depth.

---

## Before You Start

### Prerequisites
✅ All team members must be notified  
✅ All credentials have been rotated  
✅ All open PRs should be merged or noted  
✅ Backup the repository  
✅ Coordinate a time when no one is actively working

### Considerations
- This will **rewrite all commit history**
- All existing clones will need to be re-cloned
- Open PRs will need to be recreated
- CI/CD pipelines may need reconfiguration
- This is a disruptive operation

---

## Option 1: Using BFG Repo-Cleaner (Recommended)

BFG is faster and simpler than git-filter-branch.

### Step 1: Install BFG
```bash
# On macOS
brew install bfg

# On Ubuntu/Debian
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
alias bfg='java -jar bfg-1.14.0.jar'

# On Windows
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
```

### Step 2: Clone a Fresh Copy
```bash
# Clone a fresh mirror of the repo
git clone --mirror https://github.com/Shafi-prog/binaaHub.git binaaHub-cleanup.git
cd binaaHub-cleanup.git
```

### Step 3: Remove Sensitive Files
```bash
# Delete .env files from history
bfg --delete-files .env
bfg --delete-files .env.local
bfg --delete-files .env.vercel

# Alternative: Remove by pattern
bfg --delete-files '.env*' --no-blob-protection
```

### Step 4: Clean Up and Push
```bash
# Expire and garbage collect
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push the cleaned history (THIS REWRITES HISTORY)
git push --force
```

---

## Option 2: Using git-filter-repo (Modern Alternative)

git-filter-repo is the modern recommended tool.

### Step 1: Install git-filter-repo
```bash
# On macOS
brew install git-filter-repo

# On Ubuntu/Debian
apt-get install git-filter-repo

# On Windows (with Python)
pip install git-filter-repo
```

### Step 2: Clone and Clean
```bash
# Clone a fresh copy
git clone https://github.com/Shafi-prog/binaaHub.git binaaHub-cleanup
cd binaaHub-cleanup

# Remove .env files from history
git filter-repo --invert-paths --path .env --path .env.local --path .env.vercel

# Push the cleaned history (THIS REWRITES HISTORY)
git remote add origin https://github.com/Shafi-prog/binaaHub.git
git push --force --all
git push --force --tags
```

---

## Option 3: Using git filter-branch (Legacy)

⚠️ **Not recommended** - Use BFG or git-filter-repo instead.

```bash
git clone https://github.com/Shafi-prog/binaaHub.git binaaHub-cleanup
cd binaaHub-cleanup

# Remove .env files
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env .env.local .env.vercel' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push (THIS REWRITES HISTORY)
git push --force --all
git push --force --tags
```

---

## After History Cleanup

### For Repository Administrator

1. **Verify the cleanup:**
   ```bash
   # Check if files are gone from history
   git log --all --full-history -- .env
   git log --all --full-history -- .env.local
   git log --all --full-history -- .env.vercel
   ```

2. **Notify all team members:**
   - Send an announcement that history has been rewritten
   - Provide instructions for re-cloning
   - List all open PRs that need to be recreated

3. **Update CI/CD:**
   - Check if any CI/CD systems need cache clearing
   - Verify workflows run correctly

### For Team Members

All team members must delete their local clones and re-clone:

```bash
# Backup any local work first!
git stash  # If you have uncommitted changes

# Delete the old repo
cd ..
rm -rf binaaHub

# Clone fresh
git clone https://github.com/Shafi-prog/binaaHub.git
cd binaaHub

# Apply your stashed changes if needed
git stash pop
```

### For Open Pull Requests

1. Save the PR diff:
   ```bash
   # On the old branch
   git format-patch main
   ```

2. Create a new branch from updated main:
   ```bash
   git checkout -b feature-branch-new
   git am *.patch
   git push origin feature-branch-new
   ```

3. Close old PR and open new one

---

## Verification

After cleanup, verify that sensitive data is gone:

```bash
# Search for credential patterns in entire history
git log --all -p | grep -i 'BLvm0cs3qNqHCg0M'
git log --all -p | grep -i 'GOCSPX-'
git log --all -p | grep -i 'AIzaSy'

# Should return no results
```

---

## Alternative: Repository Reset (Nuclear Option)

If history cleanup is too complex, you can:

1. Create a new repository
2. Copy only the current working files (without git history)
3. Initialize new git repo
4. Push to new repository
5. Archive old repository
6. Update all references to point to new repo

This loses all history but is sometimes simpler for small teams.

---

## GitHub Security Features

After cleanup, enable these GitHub features:

1. **Secret Scanning:**
   - Settings → Security → Code security and analysis
   - Enable "Secret scanning"

2. **Dependabot Alerts:**
   - Settings → Security → Code security and analysis
   - Enable "Dependabot alerts"

3. **Code Scanning:**
   - Settings → Security → Code security and analysis
   - Enable "Code scanning"

4. **Push Protection:**
   - Settings → Security → Code security and analysis
   - Enable "Push protection for secret scanning"

---

## Resources

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Book: Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

---

## Decision Matrix

| Scenario | Recommended Action |
|----------|-------------------|
| Small team (<5 people) | Use BFG with coordination |
| Large team (>5 people) | Consider repository reset |
| Active development | Wait for quiet period |
| Many open PRs | Merge or document PRs first |
| Public repository | History cleanup is critical |
| Private repository | Credential rotation may be sufficient |

---

## Remember

- **Rewriting history is disruptive** - only do this if necessary
- **Credential rotation is mandatory** regardless of history cleanup
- **Coordinate with your team** before taking action
- **Backup everything** before starting
- **Test the process** on a test repository first if possible

**Note:** This guide is provided for reference. The most important action is rotating the exposed credentials, which should be done immediately regardless of whether you clean git history.
