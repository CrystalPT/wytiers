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
      
      if (data.success && data.players) {
        const sorted = sortPlayersByTier(data.players as Player[]);
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
          <p className="text-text-muted text-lg mb-4">Minecraft Sword PVP Rankings</p>
          
          {/* Discord Button */}
          <a
            href="https://discord.gg/lopez"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
            </svg>
            Join Discord
          </a>
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
          <>
            {/* Column Headers */}
            <div className="flex items-center gap-4 px-3 pb-3 mb-2 border-b border-border-muted">
              <div className="min-w-[56px] text-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">#</span>
              </div>
              <div className="w-16">
                {/* Avatar space */}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Player</span>
              </div>
              <div className="min-w-[60px] text-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Region</span>
              </div>
              <div className="min-w-[60px] text-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tiers</span>
              </div>
            </div>

            {/* Player Cards */}
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
          </>
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
