# GitHub Push Pre-Flight Checklist

Before pushing to GitHub, run through this checklist:

## ✅ Security Checks

Run these commands to verify no sensitive data will be committed:

```bash
# Check if .env files exist (they should)
ls backend/.env
ls frontend/.env

# Verify .env files are ignored by git
git status --ignored | grep .env

# Search for potential credentials in tracked files
git grep -i "supabase_url"
git grep -i "supabase_anon_key"
git grep -i "api_key"
git grep -i "secret"
git grep -i "password"
```

## 📋 Pre-Push Checklist

- [ ] `.env` files exist with your actual credentials
- [ ] `.env.example` files have placeholder values only
- [ ] `.gitignore` files are properly configured
- [ ] `node_modules` folders are ignored
- [ ] No hardcoded credentials in source code
- [ ] Updated README.md with your information
- [ ] Tested the application locally
- [ ] All dependencies are in package.json
- [ ] Documentation is up to date

## 🚀 Push to GitHub

### First Time Setup

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Check what will be committed (verify no .env files!)
git status

# Commit
git commit -m "Initial commit: Website Analytics Tracker"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/analytical.git

# Push to GitHub
git push -u origin main
```

### Subsequent Pushes

```bash
# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push
git push
```

## 🔍 Final Security Verification

Before your first push, run:

```bash
# List all files that will be committed
git ls-files

# This should NOT include:
# - backend/.env
# - frontend/.env
# - node_modules/
# - dist/
# - Any files with credentials
```

## ❌ What Should NOT Be in Your Repository

```
backend/.env
frontend/.env
node_modules/
dist/
build/
.DS_Store
*.log
package-lock.json (optional, some prefer to commit it)
```

## ✅ What SHOULD Be in Your Repository

```
backend/.env.example
frontend/.env.example
backend/index.js
frontend/src/**
README.md
.gitignore
package.json
setup.sql
All source code
Documentation
```

## 🆘 If You Accidentally Committed Credentials

**STOP! Don't push yet!**

1. Remove the file from git:
   ```bash
   git rm --cached backend/.env
   git rm --cached frontend/.env
   ```

2. Commit the removal:
   ```bash
   git commit -m "Remove sensitive files"
   ```

3. Make sure .gitignore includes .env files

4. Now you can push safely

**If you already pushed credentials to GitHub:**

1. **Immediately revoke** all credentials in Supabase
2. **Generate new** credentials
3. **Update local** .env files
4. Consider the old credentials compromised
5. Follow [GitHub's guide to remove sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## 📝 Repository Setup Recommendations

### Description
```
A privacy-focused website analytics tracker with React dashboard and Express backend
```

### Topics/Tags
```
analytics, tracking, react, nodejs, express, supabase, vite, privacy
```

### .gitignore Template
Use "Node" template from GitHub when creating repository

## 🎉 You're Ready!

Once all checks pass, you're safe to push to GitHub!
