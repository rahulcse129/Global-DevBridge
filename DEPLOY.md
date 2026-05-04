# 🚀 Global DevBridge Deployment Guide

This guide covers exactly how to deploy your application so it is publicly accessible. 
We will deploy the **Database on Neon**, the **Backend on Render**, and the **Frontend on Vercel**.

---

## Step 1: Set up a Live Database (Neon.tech)
Currently, the app uses a local SQLite file (`dev.db`). Cloud services like Render erase local files every time they sleep or restart, so you **must** use a real cloud database.

1. Go to [Neon.tech](https://neon.tech/) and create a free account.
2. Create a new Postgres database.
3. Copy the **Connection String** (it starts with `postgresql://...`).

### Update your Codebase:
1. Open `backend/prisma/schema.prisma` and change the provider back to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Open `backend/.env` and replace the local SQLite URL with your new Neon Postgres URL:
   ```env
   DATABASE_URL="postgresql://your_neon_username:your_neon_password@your_neon_host.neon.tech/dbname?sslmode=require"
   ```
3. Open your terminal in the `backend` folder and push the schema to your live database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

## Step 2: Push to GitHub
Both Render and Vercel will automatically deploy your code straight from GitHub.
1. Create a new, empty repository on [GitHub](https://github.com).
2. Open your terminal in the root `Global DevBridge` folder and run:
   ```bash
   git init
   git add .
   git commit -m "Ready for production"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 3: Deploy the Backend (Render.com)
1. Go to [Render](https://render.com/) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository.
4. Configure the service with these exact settings:
   - **Name**: `global-devbridge-api` (or whatever you like)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
5. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL` = (Paste your Neon Postgres URL here)
   - `GEMINI_API_KEY` = (Paste your Gemini API key here)
   - `JWT_SECRET` = (Type a long random string of letters/numbers)
   - `PORT` = `5000`
6. Click **Create Web Service**. 
   > **Note:** Wait for it to finish building. Once it says "Live", copy the URL (e.g., `https://global-devbridge-api.onrender.com`).

---

## Step 4: Deploy the Frontend (Vercel.com)
1. Go to [Vercel](https://vercel.com/) and create an account.
2. Click **Add New... -> Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Vercel should automatically detect `Vite`.
   - **Root Directory**: Click "Edit" and select the `frontend` folder.
5. Expand the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://global-devbridge-api.onrender.com/api` *(Make sure you use your actual Render URL + /api)*
6. Click **Deploy**.

🎉 **You are live!** Vercel will give you a public URL (e.g., `https://global-devbridge.vercel.app`). Share it with the world!
