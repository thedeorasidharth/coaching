# EDUSPARK - Production Deployment Guide (Vercel)

This guide walks you through the step-by-step process of deploying the **EDUSPARK Study Center** platform to Vercel in a highly optimized, production-ready state.

---

## 1. Prerequisites
- A GitHub, GitLab, or Bitbucket account.
- A registered custom domain (e.g., `edusparksheoganj.com` via Namecheap, GoDaddy, Hostinger, etc.).
- A free Vercel account linked to your git provider.
- A Web3Forms Access Key (from [web3forms.com](https://web3forms.com)).

---

## 2. Git Repository Push
First, initialize git and push your local directory to a private GitHub repository:

```bash
# Initialize git
git init

# Add all files (excluding files in .gitignore)
git add .

# Create initial commit
git commit -m "chore: production launch release candidate"

# Create a main branch and push
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/edusparksheoganj.git
git push -u origin main
```

---

## 3. Launching on Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your `edusparksheoganj` repository.
4. **Environment Variables**:
   - Scroll down to the **Environment Variables** section.
   - Add the following variable:
     - **Key**: `NEXT_PUBLIC_WEB3FORMS_KEY`
     - **Value**: `YOUR_ACTUAL_WEB3FORMS_ACCESS_KEY` (Paste the key sent to your email by Web3Forms).
5. Click **Deploy**. Vercel will automatically compile the Next.js bundle and publish it to a global edge CDN network.

---

## 4. Connecting Custom Domain
Once the deployment succeeds, connect your professional custom domain:

1. In the Vercel project dashboard, go to **Settings** > **Domains**.
2. Type `edusparksheoganj.com` (and `www.edusparksheoganj.com`) and click **Add**.
3. Vercel will provide the DNS records to update with your domain registrar:
   - **For apex domain (`edusparksheoganj.com`)**:
     - Add an `A` record pointing to `76.76.21.21`.
   - **For subdomain (`www.edusparksheoganj.com`)**:
     - Add a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Wait 5–15 minutes. Vercel will automatically provision a free, auto-renewing Let's Encrypt SSL certificate.

---

## 5. Continuous Integration (CI/CD)
The platform is equipped with fully automated CI/CD:
- **Production Builds**: Any commit pushed to the `main` branch triggers an automatic build and production update on Vercel without downtime.
- **Preview Deployments**: Commits pushed to non-main branches automatically spawn private preview builds for staging testing.
