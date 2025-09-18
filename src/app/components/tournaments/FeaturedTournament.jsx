// src/components/tournaments/FeaturedTournament.jsx

import { Users, Clock, Trophy, Zap } from 'lucide-react';
import { getProgress, getLevelColor, handleJoinTournament } from '../../utils/tournamentHelpers';

const FeaturedTournament = ({ tournament }) => {
  const progress = getProgress(tournament.currentParticipants, tournament.maxParticipants);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 relative">
      <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-700 to-amber-100 text-xs font-bold text-black px-2 py-0.5 rounded-full">
        FEATURED
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{tournament.title}</h3>
        <div className="text-right">
          <div className="flex items-center font-bold text-yellow-600"> 
            <Zap className="mr-2 w-4 h-4" />
            <span className="text-xl">{tournament.multiplier}</span>
          </div>
          <div className="text-sm text-gray-400">Entry: {tournament.entry}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(tournament.level)}`}>
          {tournament.level}
        </span>
        <span className="bg-zinc-900 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
          {tournament.category}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <Users className="mr-2 w-4 h-4" />
          {tournament.currentParticipants !== undefined && tournament.maxParticipants !== undefined ? (
            <>
              {tournament.currentParticipants.toLocaleString()} / {tournament.maxParticipants.toLocaleString()}
            </>
          ) : (
            'Loading...'
          )}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 w-4 h-4" />
          {tournament.countdown}
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-600 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-700 to-amber-100 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <button 
        onClick={() => handleJoinTournament(tournament.id, tournament.title)}
        className="w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center"
      >
        <Trophy className="w-5 h-5" />
        Join Tournament - {tournament.entry}
      </button>
    </div>
  );
};

export default FeaturedTournament;