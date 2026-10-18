# Palate — Quiet Luxury Dish-First Food Discovery

> **A dish-first food discovery PWA for Navi Mumbai that tells diners WHAT to order and what to SKIP, not just where to eat.**

Designed with **"Quiet luxury, light theme"** aesthetics — evoking the understated elegance of a bespoke fine-dining menu.

---

## 🎨 Design System & Tokens

* **Light Theme Only** (`color-scheme: light`)
* **Ivory** (`#F8F4EC`): Canvas & background
* **Card** (`#FFFDF8`): Surfaces & sheet containers
* **Espresso** (`#1E1712`): Typography, primary CTA buttons
* **Muted** (`#7A6F62`): Captions, secondary labels
* **Gold** (`#A98443`): Accents, overlines (`10.5px uppercase tracking-[.18em]`)
* **Gold-Light** (`#D8BC7E`): Signature arch rings & hairlines
* **God-Tier Green** (`#1F6B52`): ORDER label & God-Tier badge
* **Skip Oxblood** (`#8C2F2B`): SKIP label & trap order alerts
* **Hairline** (`rgba(30, 23, 18, 0.12)`): Subtle divider strokes
* **Typography**:
  * **Headings & Score Numerals**: `Cormorant Garamond` (500/600/700)
  * **UI & Body**: `Manrope` (500/600/800)

### Signature Element: The Arch
Every dish image is framed as a custom arch (`border-radius: 999px 999px 22px 22px`) surrounded by a 1px `gold-light` ring, a 7px `ivory` gap, and an inner 1px hairline. Thumbnails and heroes maintain this architectural silhouette. When no photo is available, an art-directed radial plate placeholder is rendered.

---

## 📱 The 4 Screens

1. **Discover**:
   * Header with `"Palate."` wordmark (gold dot), location pill (`📍 Vashi · Sector 17`), and `"Decide for me"` button with haptic feedback.
   * Underline search field and category chips (*All, Must-Try Icons, Quick Bites, Late Night, Spicy*).
   * Slim live check-in strip with green pulse dot.
   * Dish cards with large serif God-Tier numerals, trust line (`"212 vouches · 41 this month · 9 share your taste"`), and distinct **ORDER** / **SKIP** rows.
2. **Search**:
   * *"What are you craving?"* natural-language search with trending craving chips.
   * Instant result rows with arch thumbnails, restaurant, and God-Tier score.
3. **DNA**:
   * Overline *"Palate DNA"* with espresso archetype card (*"Texture & Crunch Devotee"*).
   * 5 independent affinity bars (Crunch, Heat, Ghee, Tang, Sweet) labeled as independent (do not sum to 100).
   * Dietary split (*75% Pure Veg · 25% Non-Veg*) and primary corridor.
   * *"Early read: 10 of 25 logs"* progress meter.
   * `[SHARE MY PALATE]` shareable card generator.
4. **Vault**:
   * Saved dishes with arch thumbnails.
   * Curated empty state (*"Tap the heart on any dish"*).

### Bottom Sheet: Definitive Verdict
Opens when tapping `[SEE THE VERDICT]` or `"Decide for me"`. Features the arch hero, complete tasting notes, menu trap comparison, and `[RESERVE A TABLE]` / `[Order]` actions.

---

## ⚙️ Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **PWA**: Installable, safe-area inset aware, pinch-zoom enabled
* **Hosting**: Vercel ready

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Next.js development server
npm run dev

# 3. Open http://localhost:3000 in your mobile browser or viewport simulator (390px - 430px)
```

---

## 🌐 Deploy to Vercel

```bash
# Deploy with Vercel CLI
npx vercel

# Or push to GitHub main branch to trigger automatic deployment:
git push origin main
```

---

## ⏪ Reverting to Previous Version

The previous dark-mode version of Palate is fully preserved in git:
```bash
# Instant rollback to previous version
git checkout v1-dark-mode
# or
git reset --hard v1-dark-mode-snapshot
```
