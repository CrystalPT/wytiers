/**
 * Seed Script for WYTiers
 * 
 * This script adds initial sample data to the Firestore database.
 * 
 * To run this script:
 * 1. Make sure your Firebase configuration is set up in lib/firebase.ts
 * 2. Run: npx tsx scripts/seed-data.ts
 * 
 * Note: You'll need to install tsx as a dev dependency: npm install -D tsx
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (you'll need to download your service account key)
// Get it from: Firebase Console > Project Settings > Service Accounts > Generate new private key
// Save it as 'serviceAccountKey.json' in the project root
// IMPORTANT: Add 'serviceAccountKey.json' to .gitignore!

if (!getApps().length) {
  try {
    // For local development - use service account key
    // const serviceAccount = require('../serviceAccountKey.json');
    // initializeApp({
    //   credential: cert(serviceAccount)
    // });
    
    // Alternative: Use environment variables
    initializeApp();
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
}

const db = getFirestore();

// Sample players data
const samplePlayers = [
  {
    username: 'CrystalPT',
    uuid: 'f1e8d0b3e4a84c4c8e8f7b3a4c5d6e7f', // This will be fetched automatically
    tier: 'LT4',
    region: 'EU',
  },
  {
    username: 'Marlowww',
    uuid: '71c6b6e4f1e24d1e8b5f3c4a5e6d7f8a',
    tier: 'HT1',
    region: 'NA',
  },
  {
    username: 'ItzRealMe',
    uuid: '81d7c7f5g2f35e2f9c6g4d5b6f7e8g9b',
    tier: 'HT2',
    region: 'NA',
  },
  {
    username: 'Swight',
    uuid: '92e8d8g6h3g46f3g0d7h5e6c7g8f9h0c',
    tier: 'HT2',
    region: 'NA',
  },
  {
    username: 'coldified',
    uuid: 'a3f9e9h7i4h57g4h1e8i6f7d8h9g0i1d',
    tier: 'LT2',
    region: 'EU',
  },
];

async function fetchUUID(username: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(`Failed to fetch UUID for ${username}:`, error);
    return null;
  }
}

async function seedData() {
  console.log('Starting data seeding...\n');

  const playersRef = db.collection('players');

  for (const player of samplePlayers) {
    try {
      // Fetch real UUID from Mojang API
      console.log(`Fetching UUID for ${player.username}...`);
      const uuid = await fetchUUID(player.username);
      
      if (uuid) {
        player.uuid = uuid;
        console.log(`✓ Found UUID: ${uuid}`);
      } else {
        console.log(`✗ Could not fetch UUID, using placeholder`);
      }

      // Add to Firestore
      const docRef = await playersRef.add(player);
      console.log(`✓ Added ${player.username} (${player.tier}, ${player.region}) - ID: ${docRef.id}\n`);
    } catch (error) {
      console.error(`✗ Failed to add ${player.username}:`, error);
    }
  }

  console.log('\nSeeding completed!');
  process.exit(0);
}

seedData();

