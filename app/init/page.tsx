'use client';

import { useState } from 'react';

interface SamplePlayer {
  username: string;
  tier: string;
  region: string;
}

const samplePlayers: SamplePlayer[] = [
  { username: 'CrystalPT', tier: 'LT4', region: 'EU' },
  { username: 'Marlowww', tier: 'HT1', region: 'NA' },
  { username: 'ItzRealMe', tier: 'HT2', region: 'NA' },
  { username: 'Swight', tier: 'HT2', region: 'NA' },
  { username: 'coldified', tier: 'LT2', region: 'EU' },
  { username: 'Kylaz', tier: 'LT3', region: 'NA' },
  { username: 'BlvckWlf', tier: 'LT1', region: 'EU' },
  { username: 'janekv', tier: 'HT3', region: 'EU' },
];

export default function InitPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addPlayer = async (player: SamplePlayer) => {
    try {
      
      setStatus((prev) => [...prev, `Fetching UUID for ${player.username}...`]);
      const uuidResponse = await fetch(`/api/uuid?username=${encodeURIComponent(player.username)}`);
      const uuidData = await uuidResponse.json();

      if (!uuidData.success) {
        setStatus((prev) => [...prev, `❌ Failed to fetch UUID for ${player.username}: ${uuidData.error}`]);
        return false;
      }

      const uuid = uuidData.uuid;
      setStatus((prev) => [...prev, `✓ Got UUID for ${player.username}: ${uuid.substring(0, 8)}...`]);

      // Add player
      setStatus((prev) => [...prev, `Adding ${player.username} to database...`]);
      const addResponse = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: player.username,
          uuid: uuid,
          tier: player.tier,
          region: player.region,
        }),
      });

      const addData = await addResponse.json();

      if (addData.success) {
        setStatus((prev) => [...prev, `✅ Successfully added ${player.username} (${player.tier}, ${player.region})\n`]);
        return true;
      } else {
        setStatus((prev) => [...prev, `❌ Failed to add ${player.username}: ${addData.error}\n`]);
        return false;
      }
    } catch (error) {
      setStatus((prev) => [...prev, `❌ Error processing ${player.username}: ${error}\n`]);
      return false;
    }
  };

  const initializeData = async () => {
    setIsProcessing(true);
    setStatus(['Starting initialization...\n']);

    let successCount = 0;
    let failCount = 0;

    for (const player of samplePlayers) {
      const success = await addPlayer(player);
      if (success) successCount++;
      else failCount++;

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setStatus((prev) => [
      ...prev,
      '\n=== Initialization Complete ===',
      `Successfully added: ${successCount} players`,
      `Failed: ${failCount} players`,
      '\nYou can now visit the home page to see the tierlist!',
    ]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Initialize WYTiers Database</h1>
          <p className="text-text-muted">
            This page will add sample players to your Firestore database.
          </p>
          <p className="text-text-muted mt-2">
            Make sure you've configured Firebase in <code className="bg-bg px-2 py-1 rounded">lib/firebase.ts</code> before running this.
          </p>
        </div>

        <div className="bg-bg border border-border-muted rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-text mb-4">Players to Add:</h2>
          <div className="space-y-2">
            {samplePlayers.map((player, index) => (
              <div key={index} className="flex items-center gap-4 text-text-muted">
                <span className="w-8">{index + 1}.</span>
                <span className="flex-1 font-mono">{player.username}</span>
                <span className="px-2 py-1 bg-bg-light rounded text-sm">{player.tier}</span>
                <span className="px-2 py-1 bg-bg-light rounded text-sm">{player.region}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={initializeData}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-primary hover:bg-highlight text-white font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Initialize Database'}
          </button>
        </div>

        {status.length > 0 && (
          <div className="bg-bg border border-border-muted rounded-lg p-6">
            <h2 className="text-xl font-bold text-text mb-4">Status Log:</h2>
            <div className="bg-bg-dark p-4 rounded font-mono text-sm text-text-muted max-h-96 overflow-y-auto">
              {status.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-primary hover:text-highlight transition-colors"
          >
            ← Back to Home
          </a>
          <span className="mx-4 text-text-muted">|</span>
          <a
            href="/admin"
            className="text-primary hover:text-highlight transition-colors"
          >
            Go to Admin Panel →
          </a>
        </div>
      </div>
    </div>
  );
}

