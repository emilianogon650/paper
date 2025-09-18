// src/components/tournaments/TournamentCard.jsx

import { Trophy, Zap } from 'lucide-react';
import { getLevelColor, getStatusColor, getStatusLabel, handleJoinTournament } from '../../utils/tournamentHelpers';

const TournamentCard = ({ tournament }) => {
  const status = getStatusLabel(tournament.status);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{tournament.title}</h3>
        <div className="flex items-center font-bold text-yellow-600">
          <Zap className="mr-2 w-4 h-4" />
          {tournament.multiplier}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
          {status}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(tournament.level)}`}>
          {tournament.level}
        </span>
      </div>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Participants</span>
          <span>{tournament.currentParticipants.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Entry Fee</span>
          <span>{tournament.entryFee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Time Left</span>
          <span>{tournament.countdown}</span>
        </div>
      </div>

      <button 
        onClick={() => handleJoinTournament(tournament.id, tournament.title)}
        className="w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center"
      >
        <Trophy className="w-5 h-5" />
        Join Tournament
      </button>
    </div>
  );
};

export default TournamentCard;