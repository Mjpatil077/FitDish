# FitDish - Seeding Demo Data

## Quick Start

### 1. Seed the Database

Run the seed script to populate your database with demo data:

```bash
cd backend
npm run seed
```

This will create:
- 1 Demo User (demo@fitdish.com / password123)
- 6 Verified Chefs (Sanjeev Kapoor, Ranveer Brar, etc.)
- 21 Food Categories (Indian, Cultural, Global)
- 10 Free Video Tutorials

### 2. Start the Application

```bash
# From root directory
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Demo Credentials

**User Account:**
- Email: `demo@fitdish.com`
- Password: `password123`

**Chef Accounts:**
- All chefs use the same password: `password123`
- Emails: `sanjeev@fitdish.com`, `ranveer@fitdish.com`, etc.

## What's Included

### Chefs
1. **Sanjeev Kapoor** - North Indian, Punjabi, Festival Foods
2. **Ranveer Brar** - North Indian, Street Food, Regional Thalis
3. **Chef Kunal Kapur** - Healthy Indian, North Indian, Festival Foods
4. **Chef Maria Rossi** - Italian, Mediterranean
5. **Chef Kenji Tanaka** - Japanese, Healthy Meals
6. **Chef Priya Sharma** - South Indian, Gujarati, Temple Food

### Categories
- **Indian**: North Indian, South Indian, Gujarati, Rajasthani, Kashmiri, Punjabi, Maharashtrian, Bengali
- **Cultural**: Festival Foods, Temple Food, Street Food, Regional Thalis
- **Global**: Italian, Japanese, Mexican, Mediterranean, Chinese, Thai, Continental

### Videos
10 free video tutorials covering various cuisines and categories, all embedded from YouTube.

## Features After Seeding

✅ Home page with categories, featured chefs, and videos
✅ Categories dropdown in navbar
✅ Browse videos by category or chef
✅ View chef profiles with ratings
✅ Watch embedded YouTube videos
✅ No empty screens - everything is populated

## Re-seeding

To clear and re-seed the database:

```bash
cd backend
npm run seed
```

**Note:** This will delete all existing data and create fresh demo data.

