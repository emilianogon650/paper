// src/components/tournaments/TournamentGrid.jsx

import TournamentCard from './TournamentCard';

const TournamentGrid = ({ tournaments }) => {
  if (!tournaments || tournaments.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentGrid;