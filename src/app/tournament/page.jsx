'use client';

// src/app/tournaments/page.jsx

import React, { useState } from 'react';
import { Crown, Star, Trophy } from 'lucide-react';

// Component imports
import Sidebar from '../../app/components/layout/Sidebar';
import SearchAndFilter from '../../app/components/tournaments/SearchAndFilter';
import TournamentTabs from '../../app/components/tournaments/TournamentTabs';
import FeaturedTournament from '../../app/components/tournaments/FeaturedTournament';
import TournamentGrid from '../../app/components/tournaments/TournamentGrid';

// Data and utilities
import { allTournaments, tabs } from '../../app/data/tournamentData';
import { filterTournaments } from '../../app/utils/tournamentHelpers';

const TournamentsPage = () => {
  const [activeTab, setActiveTab] = useState('Live');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tournaments based on search query
  const filteredTournaments = filterTournaments(allTournaments, searchQuery);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
            <p className="text-gray-400">Complete and win up to 1000x your investment.</p>
          </div>
          <button className="bg-gradient-to-r from-yellow-700 to-amber-100 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium flex items-center">
            <Crown className="mr-2 w-5 h-5" />
            Create Tournament
          </button>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter 
          searchQuery={searchQuery} 
          onSearchChange={handleSearch} 
        />

        {/* Featured Tournaments */}
        {filteredTournaments.featured.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Star className="mr-2 w-5 h-5 stroke-yellow-600" />
              Featured Tournament
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTournaments.featured.map((tournament) => (
                <FeaturedTournament key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {/* Tournament Tabs */}
        <TournamentTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />

        {/* Regular Tournaments Grid */}
        {filteredTournaments.regular.length > 0 && (
          <TournamentGrid tournaments={filteredTournaments.regular} />
        )}

        {/* Empty State */}
        {filteredTournaments.featured.length === 0 && filteredTournaments.regular.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No tournaments found</h3>
            <p className="text-gray-400">
              {searchQuery ? `No tournaments match "${searchQuery}"` : 'No tournaments are currently available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsPage;