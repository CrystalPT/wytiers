'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Player } from '@/lib/firestore';
import { sortPlayersByOverall, sortPlayersByGamemodeTier } from '@/lib/tiers';
import { GAMEMODES, GamemodeKey, filterPlayersByGamemode, getPlayerTier } from '@/lib/gamemodes';
import SearchBar from '@/components/SearchBar';
import PlayerCard from '@/components/PlayerCard';
import PlayerModal from '@/components/PlayerModal';
import InfoModal from '@/components/InfoModal';
import Image from 'next/image';

const PLAYERS_PER_PAGE = 50;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  
  // Get current gamemode from URL (default to overall)
  const currentGamemode = (searchParams.get('mode') || 'overall') as GamemodeKey;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    // Re-filter and sort when gamemode changes
    if (players.length > 0) {
      filterAndSortPlayers(players, currentGamemode, searchQuery);
      setCurrentPage(1); // Reset to page 1 when gamemode changes
    }
  }, [currentGamemode]);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      
      if (data.success && data.players) {
        filterAndSortPlayers(data.players, currentGamemode, searchQuery);
        setPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPlayers = (allPlayers: Player[], gamemode: GamemodeKey, query: string) => {
    // First filter by gamemode
    let filtered = filterPlayersByGamemode(allPlayers, gamemode);
    
    // Then filter by search query
    if (query.trim() !== '') {
      filtered = filtered.filter((player) =>
        player.username.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Sort based on gamemode
    let sorted: Player[];
    if (gamemode === 'overall') {
      sorted = sortPlayersByOverall(filtered);
    } else {
      sorted = sortPlayersByGamemodeTier(filtered, (p) => getPlayerTier(p, gamemode));
    }
    
    setFilteredPlayers(sorted);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterAndSortPlayers(players, currentGamemode, query);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleGamemodeChange = (mode: GamemodeKey) => {
    // Update URL with new gamemode
    router.push(`/?mode=${mode}`);
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
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-bg border-b border-border-muted">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-5xl">
          {/* Mobile Layout */}
          <div className="flex sm:hidden flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Image
                  src="/sword.svg"
                  alt="Sword"
                  width={28}
                  height={28}
                  className="opacity-80"
                />
                <h1 className="text-xl font-bold text-text">WYTiers</h1>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <a
                  href="/"
                  className="flex items-center gap-1.5 text-text hover:text-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 279.82 243.16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M157.43 152.45v21.27c0 1.82.63 3.58 1.79 4.99l27.86 33.85c4.22 5.12.57 12.84-6.06 12.84H98.19c-6.64 0-10.28-7.72-6.06-12.84l27.89-33.84a7.85 7.85 0 0 0 1.79-4.99v-21.27c0-3.03-1.74-5.78-4.47-7.08l-41.52-19.83a7.85 7.85 0 0 1-4.47-7.08V29.54c0-7.22 5.85-13.07 13.07-13.07h110.34c7.22 0 13.07 5.85 13.07 13.07v88.92c0 3.02-1.74 5.78-4.47 7.08l-41.48 19.82a7.85 7.85 0 0 0-4.47 7.08Z" stroke="currentColor" strokeWidth="20.59" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M207.84 37.35h30.31c10.66 0 18.35 10.22 15.4 20.46L243.14 94a16.02 16.02 0 0 1-17.12 11.5l-18.18-1.95zM71.35 37.35H41.04c-10.66 0-18.35 10.22-15.4 20.46L36.05 94a16.02 16.02 0 0 0 17.12 11.5l18.18-1.95z" stroke="currentColor" strokeWidth="20.59" strokeMiterlimit="10"/>
                  </svg>
                  <span className="font-medium text-sm">Rankings</span>
                </a>

                <a
                  href="https://discord.gg/5hfTxMuc8W"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text hover:text-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                  </svg>
                  <span className="font-medium text-sm">Discord</span>
                </a>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full">
              <SearchBar onSearch={handleSearch} placeholder="Search player..." />
            </div>
          </div>

          {/* Desktop Layout - 3 Column Grid */}
          <div className="hidden sm:grid grid-cols-3 items-center gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/sword.svg"
                alt="Sword"
                width={32}
                height={32}
                className="opacity-80"
              />
              <h1 className="text-2xl font-bold text-text">WYTiers</h1>
            </div>

            {/* Center: Navigation Links */}
            <div className="flex items-center justify-center gap-6">
              <a
                href="/"
                className="flex items-center gap-2 text-text hover:text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 279.82 243.16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M157.43 152.45v21.27c0 1.82.63 3.58 1.79 4.99l27.86 33.85c4.22 5.12.57 12.84-6.06 12.84H98.19c-6.64 0-10.28-7.72-6.06-12.84l27.89-33.84a7.85 7.85 0 0 0 1.79-4.99v-21.27c0-3.03-1.74-5.78-4.47-7.08l-41.52-19.83a7.85 7.85 0 0 1-4.47-7.08V29.54c0-7.22 5.85-13.07 13.07-13.07h110.34c7.22 0 13.07 5.85 13.07 13.07v88.92c0 3.02-1.74 5.78-4.47 7.08l-41.48 19.82a7.85 7.85 0 0 0-4.47 7.08Z" stroke="currentColor" strokeWidth="20.59" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M207.84 37.35h30.31c10.66 0 18.35 10.22 15.4 20.46L243.14 94a16.02 16.02 0 0 1-17.12 11.5l-18.18-1.95zM71.35 37.35H41.04c-10.66 0-18.35 10.22-15.4 20.46L36.05 94a16.02 16.02 0 0 0 17.12 11.5l18.18-1.95z" stroke="currentColor" strokeWidth="20.59" strokeMiterlimit="10"/>
                </svg>
                <span className="font-medium">Rankings</span>
              </a>

              <a
                href="https://discord.gg/5hfTxMuc8W"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text hover:text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
                <span className="font-medium">Discord</span>
              </a>
            </div>

            {/* Right: Search Bar */}
            <div className="flex justify-end">
              <div className="w-80">
                <SearchBar onSearch={handleSearch} placeholder="Search player..." />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Gamemode Tabs */}
      <div className="bg-bg-dark border-b border-border-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-2 sm:gap-3 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pr-2">
              {GAMEMODES.map((gamemode) => {
                const isActive = currentGamemode === gamemode.key;
                return (
                  <button
                    key={gamemode.key}
                    onClick={() => handleGamemodeChange(gamemode.key)}
                    className={`flex flex-col items-center gap-1 sm:gap-1.5 px-3 sm:px-3 py-2 sm:py-2 rounded-lg transition-all whitespace-nowrap shrink-0 group ${
                      isActive
                        ? 'bg-primary/10 border border-primary/30'
                        : 'bg-bg hover:bg-bg-light border border-transparent'
                    }`}
                  >
                    {/* Icon Container */}
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-primary/20' 
                        : 'bg-bg-light group-hover:bg-bg-dark'
                    }`}>
                      <Image
                        src={gamemode.icon}
                        alt={gamemode.name}
                        width={22}
                        height={22}
                        className={`transition-opacity sm:w-6 sm:h-6 ${
                          isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                        }`}
                      />
                    </div>
                    {/* Label */}
                    <span className={`text-[10px] sm:text-[11px] font-semibold transition-colors ${
                      isActive ? 'text-primary' : 'text-text-muted group-hover:text-text'
                    }`}>
                      {gamemode.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Info Button */}
            <button
              onClick={() => setInfoModalOpen(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-bg hover:bg-bg-light border border-border-muted hover:border-primary transition-colors text-text-muted hover:text-text whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Info</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-6 sm:pb-8 max-w-5xl grow">

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
              {searchQuery ? 'No players found matching your search.' : 'No ranked players in this gamemode yet.'}
            </p>
          </div>
        )}

        {/* Player List */}
        {!loading && filteredPlayers.length > 0 && (
          <>
            {/* Column Headers - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-4 px-2 sm:px-3 pb-3 mb-2 border-b border-border-muted">
              <div className="min-w-[40px] sm:min-w-[56px] text-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">#</span>
              </div>
              <div className="w-12 sm:w-16">
                {/* Avatar space */}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Player</span>
              </div>
              {currentGamemode === 'overall' ? (
                <>
                  <div className="min-w-[50px] sm:min-w-[100px] text-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Region</span>
                  </div>
                  <div className="hidden lg:flex items-center justify-center" style={{ width: '360px' }}>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tiers</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="min-w-[50px] sm:min-w-[60px] text-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Region</span>
                  </div>
                  <div className="min-w-[50px] sm:min-w-[60px] text-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tier</span>
                  </div>
                </>
              )}
            </div>

            {/* Player Cards */}
            <div className="space-y-2 sm:space-y-3">
              {paginatedPlayers.map((player, index) => {
                const globalRank = startIndex + index + 1;
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    rank={globalRank}
                    gamemode={currentGamemode}
                    onClick={() => handlePlayerClick(player, globalRank)}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-bg border border-border rounded-lg hover:border-primary hover:bg-bg-light transition-colors text-text"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Page Info */}
                <div className="text-text-muted text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-bg border border-border rounded-lg hover:border-primary hover:bg-bg-light transition-colors text-text"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
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

        {/* Info Modal */}
        <InfoModal
          isOpen={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-bg border-t border-border-muted">
        <div className="container mx-auto px-4 py-6 max-w-7xl flex items-center justify-between">
          <div className="text-text-muted text-sm">
            © {new Date().getFullYear()} WYTiers. All rights reserved.
          </div>
          <div className="text-text-muted text-sm">
            Made by @crystalpt
          </div>
        </div>
      </footer>
    </div>
  );
}
