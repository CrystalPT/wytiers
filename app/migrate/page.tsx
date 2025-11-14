'use client';

import { useState } from 'react';
import Image from 'next/image';

const ADMIN_PASSCODE = 'MrSixSeven';

export default function MigratePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
      setPasscodeInput('');
    }
  };

  const handleMigrate = async () => {
    if (!confirm('This will migrate all players from the old "players" collection to the new "updated_players" collection. Continue?')) {
      return;
    }

    setMigrating(true);
    setResult(null);

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Migration error:', error);
      setResult({
        success: false,
        message: 'Failed to run migration',
      });
    } finally {
      setMigrating(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-bg border-2 border-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image
                  src="/sword.svg"
                  alt="Sword"
                  width={48}
                  height={48}
                  className="opacity-80"
                />
                <h1 className="text-4xl font-bold text-text">Migration Tool</h1>
              </div>
              <p className="text-text-muted">Enter passcode to access</p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-6">
              <div>
                <label className="block text-text-muted text-sm mb-2">Passcode</label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text text-center text-lg tracking-wider focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter passcode"
                  autoFocus
                />
              </div>

              {passcodeError && (
                <div className="p-3 bg-danger/20 text-danger border border-danger/50 rounded-lg text-sm text-center">
                  {passcodeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-highlight text-white font-semibold rounded-lg transition-colors"
              >
                Unlock Migration Tool
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-text-muted hover:text-primary transition-colors text-sm"
              >
                ← Back to Tierlist
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-bg border-2 border-border rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/sword.svg"
                alt="Sword"
                width={48}
                height={48}
                className="opacity-80"
              />
              <h1 className="text-4xl font-bold text-text">WYTiers Migration</h1>
            </div>
            <p className="text-text-muted">
              Migrate players from single-tier to multi-gamemode system
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-bg-light border border-border-muted rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-text mb-3">What this does:</h2>
            <ul className="space-y-2 text-text-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Reads all players from the old <code className="text-text bg-bg px-1 rounded">players</code> collection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Converts their single <code className="text-text bg-bg px-1 rounded">tier</code> field to the new <code className="text-text bg-bg px-1 rounded">sword</code> gamemode field</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Sets all other gamemode fields (vanilla, uhc, pot, etc.) to empty/unranked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Calculates overall points based on sword tier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Creates new documents in <code className="text-text bg-bg px-1 rounded">updated_players</code> collection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger">⚠</span>
                <span className="text-danger font-medium">The old collection will NOT be deleted (manual backup)</span>
              </li>
            </ul>
          </div>

          {/* Migration Button */}
          <div className="mb-6">
            <button
              onClick={handleMigrate}
              disabled={migrating}
              className="w-full px-6 py-4 bg-primary hover:bg-highlight text-white font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {migrating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Migrating...
                </span>
              ) : (
                'Run Migration'
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-success/20 text-success border border-success/50'
                  : 'bg-danger/20 text-danger border border-danger/50'
              }`}
            >
              <div className="font-bold mb-2">
                {result.success ? '✓ Success' : '✗ Error'}
              </div>
              <div className="text-sm mb-2">{result.message}</div>
              {result.details && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-bg rounded">
                      <div className="text-text-muted text-xs">Total Players</div>
                      <div className="font-bold text-lg">{result.details.total}</div>
                    </div>
                    <div className="p-2 bg-bg rounded">
                      <div className="text-text-muted text-xs">Added</div>
                      <div className="font-bold text-lg text-success">{result.details.added || result.details.migrated || 0}</div>
                    </div>
                    <div className="p-2 bg-bg rounded">
                      <div className="text-text-muted text-xs">Skipped</div>
                      <div className="font-bold text-lg text-warning">{result.details.skipped || 0}</div>
                    </div>
                    <div className="p-2 bg-bg rounded">
                      <div className="text-text-muted text-xs">Failed</div>
                      <div className="font-bold text-lg text-danger">{result.details.failed || 0}</div>
                    </div>
                  </div>
                  
                  {(result.details.addedPlayers || result.details.players) && (
                    <div className="text-xs p-3 bg-success/10 border border-success/30 rounded">
                      <div className="font-semibold mb-1">Added Players:</div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {(result.details.addedPlayers || result.details.players).map((player: any, idx: number) => (
                          <div key={idx} className="text-text-muted">• {player.username}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.details.skippedPlayers && (
                    <div className="text-xs p-3 bg-warning/10 border border-warning/30 rounded">
                      <div className="font-semibold mb-1">Skipped Players (already exist):</div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {result.details.skippedPlayers.map((player: any, idx: number) => (
                          <div key={idx} className="text-text-muted">• {player.username}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.details.errors && (
                    <div className="text-xs p-3 bg-danger/10 border border-danger/30 rounded">
                      <div className="font-semibold mb-1">Errors:</div>
                      <pre className="whitespace-pre-wrap text-text-muted">
                        {JSON.stringify(result.details.errors, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex gap-3 justify-center text-sm">
            <a
              href="/"
              className="text-text-muted hover:text-primary transition-colors"
            >
              ← Back to Tierlist
            </a>
            <span className="text-border">|</span>
            <a
              href="/admin"
              className="text-text-muted hover:text-primary transition-colors"
            >
              Admin Panel →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

