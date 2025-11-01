# WYTiers Setup Guide

Follow these steps to get your WYTiers website up and running!

## Step 1: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select an existing one)
3. Enable **Firestore Database**:
   - Click on "Firestore Database" in the left menu
   - Click "Create database"
   - Start in **production mode** (or test mode if you want to allow all access temporarily)
   - Choose a location close to your users

4. Get your Firebase configuration:
   - Go to Project Settings (gear icon) → General
   - Scroll down to "Your apps"
   - Click the web icon (`</>`) to add a web app
   - Register your app (you can name it "WYTiers")
   - Copy the `firebaseConfig` object

5. Update `lib/firebase.ts`:
   - Open the file
   - Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // Replace with your values
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

## Step 2: Install Dependencies (if not done already)

```bash
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

## Step 4: Initialize Database with Sample Data

1. Navigate to [http://localhost:3000/init](http://localhost:3000/init)
2. Click the "Initialize Database" button
3. Wait for all players to be added (it will fetch real UUIDs from Mojang API)
4. Once complete, go back to the home page

**The init page will add these players:**
- CrystalPT (LT4, EU)
- Marlowww (HT1, NA)
- ItzRealMe (HT2, NA)
- Swight (HT2, NA)
- coldified (LT2, EU)
- Kylaz (LT3, NA)
- BlvckWlf (LT1, EU)
- janekv (HT3, EU)

## Step 5: Explore Your Tierlist!

- **Home Page** (`/`): View the tierlist, search players, click on players to see their profiles
- **Admin Panel** (`/admin`): Add, edit, or delete players
- **Init Page** (`/init`): Re-run initialization if needed (it will add players again)

## Features Overview

### Main Page (/)
- View all players ranked by tier
- Search for specific players
- Click on any player to see their detailed profile modal
- Displays player rank, avatar, username, region, and tier

### Admin Panel (/admin)
- Add new players by entering their username
- Auto-fetch UUID from Mojang API with the "Fetch UUID" button
- Edit existing players
- Delete players
- Select tier from dropdown (LT5 to HT1)
- Select region (NA, EU, OCE)

### Player Profiles
- Minecraft avatar from NameMC
- Global ranking position
- Sword PVP tier badge
- Region badge
- Link to their NameMC profile

## Firestore Security Rules (Recommended)

For production, set up proper security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{player} {
      // Allow anyone to read player data
      allow read: if true;
      
      // Only allow writes from authenticated users (you can add auth later)
      // For now, you might want to allow writes temporarily for testing
      allow write: if true;  // Change to 'false' in production!
    }
  }
}
```

## Troubleshooting

### "Firebase not initialized" error
- Make sure you've updated `lib/firebase.ts` with your actual Firebase config
- Check that your Firebase project has Firestore enabled

### Players not showing up
- Make sure you've run the initialization at `/init`
- Check the browser console for errors
- Verify your Firestore rules allow reading data

### UUID fetch fails
- The Mojang API has rate limits
- If a username doesn't exist, it will fail
- You can manually enter UUIDs in the admin panel

### Styling looks off
- Make sure Tailwind CSS is properly configured
- Clear your browser cache
- Check that `globals.css` has been loaded

## Next Steps

1. **Add More Players**: Use the admin panel to add more players to your tierlist
2. **Customize Colors**: Modify the OKLCH color values in `app/globals.css`
3. **Add Authentication**: Protect the admin panel with Firebase Authentication
4. **Deploy**: Deploy your site to Vercel, Netlify, or another hosting platform

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will auto-detect Next.js settings
5. Deploy!

Your Firebase credentials are safe to include in the deployed app (they're meant to be public). Just make sure your Firestore security rules are properly configured!

## Need Help?

- Check the main README.md for more details
- Review the Firebase Console for any errors
- Check browser console for JavaScript errors
- Make sure all dependencies are installed

---

Enjoy your WYTiers website! 🗡️

