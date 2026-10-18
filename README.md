# AniStream - Private Anime Streaming Vault

A fast, modern, and private anime streaming web application pulling streams from **Aniwave** and **Re Anime** multi-server mirror scrapers. Protected with mandatory login authentication, designed to run **100% Free Forever**.

---

## 🚀 Features

- 🔒 **Private Vault Authentication**: All routes and streaming pages require login before access. Middleware protects the website against unauthorized traffic.
- ⚡ **Aniwave & Re Anime Streaming Integration**:
  - Multi-server player switcher (Aniwave Mirror, Re Anime Stream, and Direct HLS / M3U8 player).
  - Sandboxed iframe players blocking rogue popups/redirects.
- 🎬 **Full Catalog & Search**:
  - Live Top Airing, Latest Episodes, and instant global anime search.
  - Episode selectors and automatic episode numbering.
- 💸 **100% Free Forever**:
  - Free global deployment on [Vercel](https://vercel.com).
  - Uses free serverless endpoints and client-side proxies with zero monthly fees or database subscriptions.

---

## 🔑 Default Credentials

Configured in `.env.local`:

- **Username**: `animefan`
- **Password**: `privatestreaming`

*(You can customize these credentials anytime in `.env.local` or in your Vercel Environment Variables).*

---

## 🛠 Local Setup & Running

```bash
cd "D:\Websites\anime-stream"

# Install packages (if needed)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Any attempt to visit the site will redirect directly to `/login`.

---

## 🌐 Deploy to Vercel (100% Free Forever)

### Option 1: Via GitHub + Vercel Dashboard (Recommended)

1. Create a **Private Repository** on your GitHub account (e.g. `private-anime-stream`).
2. Push this project to GitHub:
   ```bash
   cd "D:\Websites\anime-stream"
   git add .
   git commit -m "feat: complete private anime streaming web app"
   git remote add origin https://github.com/<your-username>/private-anime-stream.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
4. Import your private GitHub repository.
5. In **Environment Variables**, add:
   - `AUTH_SECRET`: Any random secret string (e.g., `vault-key-9284729183921`)
   - `ADMIN_USERNAME`: Your private username
   - `ADMIN_PASSWORD`: Your private password
6. Click **Deploy**. Vercel will host your site under a free `.vercel.app` domain (or custom domain) with free SSL and CDN forever.

### Option 2: Via Vercel CLI (Direct)

```bash
cd "D:\Websites\anime-stream"
npx vercel
```
Follow the interactive prompts to link and deploy in seconds!
