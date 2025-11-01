# WYTiers - Minecraft Sword PVP Rankings

A Next.js-based tierlist website for ranking Minecraft Sword PVP players.

## Features

- 🗡️ Sword PVP-specific tier rankings (LT5 to HT1)
- 🔍 Player search functionality
- 🌍 Regional categorization (NA, EU, OCE)
- 👤 Player profiles with NameMC integration
- ⚙️ Admin panel for managing players
- 🎨 Modern UI with OKLCH color system
- 🔥 Firebase Firestore backend

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Firebase Firestore database created

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd wytiers
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Open `lib/firebase.ts`
   - Replace the placeholder values with your Firebase project configuration
   - Get these from: Firebase Console > Project Settings > General > Your apps

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database (Start in production mode)

### 2. Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click on the Web app icon (</>)
4. Copy the configuration object
5. Paste it into `lib/firebase.ts`

### 3. Firestore Database Structure

The app uses a single collection called `players`:

```
players/
  {auto-generated-id}/
    username: string
    uuid: string
    tier: string (LT5, HT5, LT4, HT4, LT3, HT3, LT2, HT2, LT1, HT1)
    region: string (NA, EU, OCE)
```

### 4. Firestore Rules (Optional but Recommended)

Set up security rules in Firestore Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{player} {
      // Allow anyone to read
      allow read: if true;
      
      // Restrict write access (you can add authentication later)
      allow write: if false;
    }
  }
}
```

## Adding Players

### Method 1: Using the Admin Panel (Recommended)

1. Navigate to `/admin` in your browser
2. Enter the player's username
3. Click "Fetch UUID" to automatically get their Minecraft UUID
4. Select their tier and region
5. Click "Add Player"

### Method 2: Using the Seed Script (Initial Setup)

1. Install tsx as a dev dependency:
```bash
npm install -D tsx
```

2. Edit `scripts/seed-data.ts` to include your desired players

3. Set up Firebase Admin SDK:
   - Download service account key from Firebase Console
   - Save as `serviceAccountKey.json` in project root
   - Add to `.gitignore`

4. Run the seed script:
```bash
npx tsx scripts/seed-data.ts
```

### Method 3: Directly in Firebase Console

1. Go to Firestore Database in Firebase Console
2. Create a new document in the `players` collection
3. Add the fields: `username`, `uuid`, `tier`, `region`

## Tier System

The tier system ranks players from worst to best:

- **LT5** - Lowest Tier 5 (Worst)
- **HT5** - High Tier 5
- **LT4** - Lowest Tier 4
- **HT4** - High Tier 4
- **LT3** - Lowest Tier 3
- **HT3** - High Tier 3
- **LT2** - Lowest Tier 2
- **HT2** - High Tier 2
- **LT1** - Lowest Tier 1
- **HT1** - High Tier 1 (Best)

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with OKLCH colors
- **Firebase Firestore** - NoSQL cloud database
- **Mojang API** - Fetch player UUIDs
- **NameMC** - Player avatars and profiles

## Project Structure

```
wytiers/
├── app/
│   ├── admin/          # Admin panel for managing players
│   ├── api/            # API routes
│   │   ├── players/    # CRUD operations for players
│   │   ├── uuid/       # Fetch UUID from Mojang
│   │   └── avatar/     # Get player avatar URL
│   ├── globals.css     # Global styles with OKLCH colors
│   ├── layout.tsx      # Root layout with metadata
│   └── page.tsx        # Main tierlist page
├── components/
│   ├── PlayerCard.tsx     # Player card in list
│   ├── PlayerModal.tsx    # Player profile modal
│   ├── SearchBar.tsx      # Search functionality
│   ├── TierBadge.tsx      # Tier display component
│   └── RegionBadge.tsx    # Region display component
├── lib/
│   ├── firebase.ts     # Firebase configuration
│   ├── firestore.ts    # Firestore helper functions
│   └── tiers.ts        # Tier system utilities
├── public/
│   └── sword.svg       # Logo icon
└── scripts/
    └── seed-data.ts    # Database seeding script
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure build settings
4. Add your Firebase configuration as environment variables (if needed)
5. Deploy!

### Important Notes

- Make sure your Firebase configuration is set up before deploying
- Firestore security rules should be properly configured for production
- Consider adding authentication for the admin panel

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
