'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/lib/firestore';
import { TIERS } from '@/lib/tiers';
import TierBadge from '@/components/TierBadge';
import RegionBadge from '@/components/RegionBadge';

const REGIONS = ['NA', 'EU', 'OCE'];

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    uuid: '',
    tier: 'LT5',
    region: 'EU',
  });
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [fetchingUUID, setFetchingUUID] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

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

    if (!formData.username || !formData.uuid || !formData.tier || !formData.region) {
      showMessage('error', 'All fields are required');
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
      tier: player.tier,
      region: player.region,
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
      tier: 'LT4',
      region: 'EU',
    });
    setEditingPlayer(null);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Admin Panel</h1>
          <p className="text-text-muted">Manage WYTiers players</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Form */}
          <div className="bg-bg border border-border-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold text-text mb-6">
              {editingPlayer ? 'Edit Player' : 'Add New Player'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-muted text-sm mb-2">Username</label>
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
                    className="px-4 py-2 bg-secondary hover:bg-highlight text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {fetchingUUID ? 'Fetching...' : 'Fetch UUID'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">UUID</label>
                <input
                  type="text"
                  value={formData.uuid}
                  onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  placeholder="Auto-filled or enter manually"
                  required
                />
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-light border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  required
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">Region</label>
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

              <div className="flex gap-2">
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

          {/* Player List */}
          <div className="bg-bg border border-border-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold text-text mb-6">All Players ({players.length})</h2>
            {loading ? (
              <div className="text-center text-text-muted py-8">Loading...</div>
            ) : players.length === 0 ? (
              <div className="text-center text-text-muted py-8">No players yet</div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 bg-bg-light border border-border-muted rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text">{player.username}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="px-3 py-1 text-sm bg-info hover:bg-info/80 text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="px-3 py-1 text-sm bg-danger hover:bg-danger/80 text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <RegionBadge region={player.region} size="sm" />
                      <TierBadge tier={player.tier} size="sm" />
                    </div>
                    <p className="text-xs text-text-muted mt-2 font-mono truncate">
                      UUID: {player.uuid}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

