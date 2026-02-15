# Environment Setup Guide

## 🔐 Important: Never commit .env files to GitHub!

This project uses environment variables to store sensitive information. Follow these steps to set up your environment:

---

## Backend Setup

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and add your actual values:**
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_actual_anon_key_here

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Get your Supabase credentials:**
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy the Project URL and anon/public key

---

## Frontend Setup

1. **Copy the example file:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit `.env` and add your actual values:**
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:3000

   # Supabase Configuration (optional)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

---

## 🚨 Security Checklist Before Pushing to GitHub

- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` files have no real credentials
- [ ] No hardcoded API keys or tokens in code
- [ ] Supabase URL and keys are in environment variables only
- [ ] `node_modules` is ignored
- [ ] Check with: `git status` before pushing

---

## ✅ Verify .env is Ignored

Run this command to make sure .env files won't be committed:

```bash
# This should return nothing (empty)
git status --ignored | grep .env
```

If you see .env files listed, they're properly ignored ✅

---

## 🔄 For Team Members Cloning the Repository

After cloning, each team member should:

1. Copy `.env.example` to `.env` in both backend and frontend folders
2. Ask the project admin for the actual credentials
3. Never commit their `.env` files
4. Never share credentials in public channels

---

## Production Deployment

For production, set environment variables in your hosting platform:

**Vercel/Netlify:**
- Add environment variables in project settings

**Heroku:**
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
```

**DigitalOcean/AWS:**
- Use their environment variable configuration

**Docker:**
```dockerfile
ENV SUPABASE_URL=your_url
ENV SUPABASE_ANON_KEY=your_key
```

---

## 📝 What's Safe to Commit?

✅ **Safe to commit:**
- `.env.example` (with placeholder values)
- `.gitignore` files
- Source code without hardcoded credentials
- Configuration files with environment variable references

❌ **Never commit:**
- `.env` files with real credentials
- API keys, tokens, passwords
- Database connection strings with credentials
- Private keys
- OAuth secrets

---

## 🆘 If You Accidentally Committed Credentials

1. **Revoke the credentials immediately** in Supabase dashboard
2. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Generate new credentials** in Supabase
4. **Update your local .env** with new credentials
5. **Force push** (if repository is not shared yet):
   ```bash
   git push origin --force --all
   ```

6. **If repository is public/shared:** Consider it compromised and rotate ALL credentials

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Environment Variables Best Practices](https://www.npmjs.com/package/dotenv)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
