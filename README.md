# Palate — Hyper-Local Dish-First Food Discovery Platform (Navi Mumbai)

> **"Know what to order before you sit down."**  
> Built for the authentic municipal nodes of Navi Mumbai: **Vashi, Nerul, Belapur, Kharghar, Seawoods, and Sanpada**.

---

## 🍽️ The Vision: Why Dish-First?
Restaurants routinely print 60+ item menus, but only 2 or 3 dishes are truly unforgettable. Traditional review platforms rate the entire establishment as a blend of ambiance, parking, and random menu items, leading to misleading 4.1-star ratings.

**Palate solves this with binary dish-level consensus:**
- **Must Order (🟢 &ge;75% consensus):** The standout culinary marvels verified by local diners.
- **Safe to Skip (🔴 &le;40% consensus):** Overhyped, soggy, or mediocre items you shouldn't waste your money on.
- **3-Tap Logging Modal:** Instant diner contributions in 3 quick taps without writing heavy essays or slider forms.

---

## 🎨 Design System: "Warm Editorial Elite"
- **Light-Mode Exclusive:** No dark themes or harsh neon accents.
- **Canvas:** Warm French Linen (`#FAF8F5`)
- **Cards:** Crisp Porcelain White (`#FFFFFF`) with sharp hairline borders (`#E7E5E4`)
- **Typography:** Deep obsidian ink (`#1C1917`), modern sans-serif (`Plus Jakarta Sans`), and editorial serif accents (`Newsreader`).
- **Accents:** Cognac amber (`#A16207` & `#B45309`)

---

## 🏙️ Covered Navi Mumbai Municipal Nodes
1. **Vashi:** Bhagat Tarachand (Special Sev Tameta & Kutchi Beer Chaas), Gupta Sandwich (Cadbury Toast), Navratna Veg.
2. **Nerul:** Mamledar Misal (Kolhapuri Teekha Misal Pav), Tibbs Frankie, Shri Krishna Vada Pav (Sector 21).
3. **CBD Belapur:** Mahesh Lunch Home (Butter Garlic Surmai & Ghee Neer Dosa), Sea Lord Seafood (Crispy Bombil Rawa Fry).
4. **Kharghar:** Kerala Cafe (Malabar Beef Fry & Flaky Porotta), Utsav Fine Dine (Awadhi Dum Biryani).
5. **Seawoods:** Yoko Sizzlers (Grand Central), Madras Cafe Express.
6. **Sanpada:** Sai Swaad Dosa (Mysore Masala Dosa with Podi Butter), Gokul Refreshment.

---

## 🛠️ Tech Stack & Architecture
- **Framework:** Next.js 15+ (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS with custom Warm Editorial design tokens
- **Database / Backend:** Supabase (PostgreSQL schema in `supabase/schema.sql`)
  - `restaurants` table with node and sector indices
  - `dishes` table with auto-computed consensus ratios
  - `dining_logs` table for 3-tap log entries with automatic trigger updates
  - `dish_consensus_view` for consolidated community consensus
- **State & Fallback:** Instant optimistic updates with browser storage fallback, making the app immediately interactive out of the box even before remote Supabase credentials are connected.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd /Users/nikhilzagade/.gemini/antigravity-ide/scratch/palate-web
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view Palate.

### 3. Connect Supabase (Optional)
Copy `.env.example` to `.env.local` and add your project keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
Run the migration script in `supabase/schema.sql` via the Supabase SQL editor.
