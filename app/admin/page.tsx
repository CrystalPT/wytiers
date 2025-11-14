'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/lib/firestore';
import { TIERS } from '@/lib/tiers';
import { GAMEMODES } from '@/lib/gamemodes';
import TierBadge from '@/components/TierBadge';
import RegionBadge from '@/components/RegionBadge';
import Image from 'next/image';

const REGIONS = ['NA', 'EU', 'AS'];
const ADMIN_PASSCODE = 'MrSixSeven';
const TIER_OPTIONS = ['', ...TIERS]; // Empty string for unranked

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    uuid: '',
    region: 'EU',
    sword: '',
    vanilla: '',
    uhc: '',
    pot: '',
    nethop: '',
    smp: '',
    axe: '',
    mace: '',
  });
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [fetchingUUID, setFetchingUUID] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayers();
    }
  }, [isAuthenticated]);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUUID = async () => {
    if (!formData.username.trim()) {
      showMessage('error', 'Please enter a username');
      return;
    }

    setFetchingUUID(true);
    try {
      const response = await fetch(`/api/uuid?username=${encodeURIComponent(formData.username)}`);
      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, uuid: data.uuid });
        showMessage('success', `UUID fetched for ${data.username}`);
      } else {
        showMessage('error', data.error || 'Failed to fetch UUID');
      }
    } catch (error) {
      console.error('Error fetching UUID:', error);
      showMessage('error', 'Failed to fetch UUID');
    } finally {
      setFetchingUUID(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.uuid || !formData.region) {
      showMessage('error', 'Username, UUID, and Region are required');
      return;
    }

    // Check if at least one gamemode tier is set
    const hasAnyTier = formData.sword || formData.vanilla || formData.uhc || formData.pot || 
                       formData.nethop || formData.smp || formData.axe || formData.mace;
    
    if (!hasAnyTier) {
      showMessage('error', 'Please set at least one gamemode tier');
      return;
    }

    try {
      if (editingPlayer) {
        // Update existing player
        const response = await fetch(`/api/players/${editingPlayer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          showMessage('success', 'Player updated successfully');
          resetForm();
          fetchPlayers();
        } else {
          showMessage('error', data.error || 'Failed to update player');
        }
      } else {
        // Add new player
        const response = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          showMessage('success', 'Player added successfully');
          resetForm();
          fetchPlayers();
        } else {
          showMessage('error', data.error || 'Failed to add player');
        }
      }
    } catch (error) {
      console.error('Error saving player:', error);
      showMessage('error', 'Failed to save player');
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      username: player.username,
      uuid: player.uuid,
      region: player.region,
      sword: player.sword || '',
      vanilla: player.vanilla || '',
      uhc: player.uhc || '',
      pot: player.pot || '',
      nethop: player.nethop || '',
      smp: player.smp || '',
      axe: player.axe || '',
      mace: player.mace || '',
    });
  };

  const handleDelete = async (playerId: string | undefined) => {
    if (!playerId) return;
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        showMessage('success', 'Player deleted successfully');
        fetchPlayers();
      } else {
        showMessage('error', data.error || 'Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      showMessage('error', 'Failed to delete player');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      uuid: '',
      region: 'EU',
      sword: '',
      vanilla: '',
      uhc: '',
      pot: '',
      nethop: '',
      smp: '',
      axe: '',
      mace: '',
    });
    setEditingPlayer(null);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-bg border-2 border-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-text mb-2">Admin Panel</h1>
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
                Unlock Admin Panel
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
    <div className="min-h-screen bg-bg-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Admin Panel</h1>
          <p className="text-text-muted">Manage WYTiers players across all gamemodes</p>
          <a
            href="/"
            className="inline-block mt-4 text-primary hover:text-highlight transition-colors"
          >
            ← Back to Tierlist
          </a>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-success/20 text-success border border-success/50'
                : 'bg-danger/20 text-danger border border-danger/50'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Form - Takes 2 columns */}
          <div className="lg:col-span-2 bg-bg border border-border-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold text-text mb-6">
              {editingPlayer ? 'Edit Player' : 'Add New Player'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted text-sm mb-2">Username *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="flex-1 px-4 py-2 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                      placeholder="Enter username"
                      required
                    />
                    <button
                      type="button"
                      onClick={fetchUUID}
                      disabled={fetchingUUID}
                      className="px-4 py-2 bg-secondary hover:bg-highlight text-white rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {fetchingUUID ? 'Fetching...' : 'Fetch UUID'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted text-sm mb-2">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                    required
                  >
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">UUID *</label>
                <input
                  type="text"
                  value={formData.uuid}
                  onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary font-mono text-sm"
                  placeholder="Auto-filled or enter manually"
                  required
                />
              </div>

              {/* Gamemode Tiers */}
              <div>
                <label className="block text-text-muted text-sm mb-3">
                  Gamemode Tiers <span className="text-xs">(At least one required)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GAMEMODES.filter(gm => gm.key !== 'overall').map((gamemode) => (
                    <div key={gamemode.key} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={gamemode.icon}
                          alt={gamemode.name}
                          width={20}
                          height={20}
                          className="opacity-80"
                        />
                        <span className="text-text text-sm font-medium">{gamemode.name}</span>
                      </div>
                      <select
                        value={formData[gamemode.key] as string}
                        onChange={(e) => setFormData({ ...formData, [gamemode.key]: e.target.value })}
                        className="px-3 py-2 bg-bg-light border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">Unranked</option>
                        {TIERS.slice().reverse().map((tier) => (
                          <option key={tier} value={tier}>
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary hover:bg-highlight text-white font-semibold rounded-lg transition-colors"
                >
                  {editingPlayer ? 'Update Player' : 'Add Player'}
                </button>
                {editingPlayer && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-border hover:bg-border-muted text-text rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Player Search - Takes 1 column */}
          <div className="bg-bg border border-border-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold text-text mb-6">
              Find Player
            </h2>
            
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted"
              />
            </div>

            {loading ? (
              <div className="text-center text-text-muted py-8">Loading...</div>
            ) : searchQuery.trim() === '' ? (
              <div className="text-center text-text-muted py-8">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Enter a username to search</p>
              </div>
            ) : (() => {
              const filteredPlayers = players.filter(p => 
                p.username.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              return filteredPlayers.length === 0 ? (
                <div className="text-center text-text-muted py-8">
                  <p>No players found matching &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[700px] overflow-y-auto">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="p-3 bg-bg-light border border-border-muted rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-text">{player.username}</h3>
                          <div className="flex gap-2 mt-1">
                            <RegionBadge region={player.region} size="sm" />
                            <div className="px-2 py-0.5 bg-primary/20 rounded text-xs text-primary font-bold">
                              {player.overall} pts
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(player)}
                            className="px-2 py-1 text-xs bg-info hover:bg-info/80 text-white rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
                            className="px-2 py-1 text-xs bg-danger hover:bg-danger/80 text-white rounded transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                      
                      {/* Show gamemode tiers in compact grid */}
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {GAMEMODES.filter(gm => gm.key !== 'overall').map((gamemode) => {
                          const tier = player[gamemode.key];
                          return (
                            <div key={gamemode.key} className="text-center">
                              <Image
                                src={gamemode.icon}
                                alt={gamemode.name}
                                width={16}
                                height={16}
                                className="opacity-60 mx-auto mb-0.5"
                              />
                              {tier ? (
                                <TierBadge tier={tier} size="xs" />
                              ) : (
                                <span className="text-[10px] text-text-muted/50">-</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
