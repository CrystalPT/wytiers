'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/lib/firestore';
import { sortPlayersByTier } from '@/lib/tiers';
import SearchBar from '@/components/SearchBar';
import PlayerCard from '@/components/PlayerCard';
import PlayerModal from '@/components/PlayerModal';
import Image from 'next/image';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      
      if (data.success) {
        const sorted = sortPlayersByTier(data.players);
        setPlayers(sorted);
        setFilteredPlayers(sorted);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter((player) =>
        player.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  };

  const handlePlayerClick = (player: Player, rank: number) => {
    setSelectedPlayer(player);
    setSelectedRank(rank);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setSelectedRank(0);
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/sword.svg"
              alt="Sword"
              width={48}
              height={48}
              className="opacity-80"
            />
            <h1 className="text-5xl font-bold text-text">WYTiers</h1>
          </div>
          <p className="text-text-muted text-lg">Minecraft Sword PVP Rankings</p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} placeholder="Search players..." />

        {/* Loading State */}
        {loading && (
          <div className="text-center text-text-muted py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4">Loading players...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredPlayers.length === 0 && (
          <div className="text-center text-text-muted py-12">
            <p className="text-xl">
              {searchQuery ? 'No players found matching your search.' : 'No players yet.'}
            </p>
          </div>
        )}

        {/* Player List */}
        {!loading && filteredPlayers.length > 0 && (
          <div className="space-y-3">
            {filteredPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                rank={index + 1}
                onClick={() => handlePlayerClick(player, index + 1)}
              />
            ))}
          </div>
        )}

        {/* Player Modal */}
        {selectedPlayer && (
          <PlayerModal
            player={selectedPlayer}
            rank={selectedRank}
            isOpen={!!selectedPlayer}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </div>
  );
}
