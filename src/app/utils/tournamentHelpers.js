// src/utils/tournamentHelpers.js

// Progress Bar Calculation
export const getProgress = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };
  
  // Level color styling
  export const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      case 'Intermediate': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      case 'Beginner': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      default: return 'bg-black text-gray-800';
    }
  };
  
  // Status color styling
  export const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-emerald-400 text-black';
      case 'ending_soon': return 'bg-red-400 text-black';
      default: return 'bg-black text-gray-800';
    }
  };
  
  // Status label conversion
  export const getStatusLabel = (status) => {
    switch (status) {
      case 'live': return 'Live';
      case 'ending_soon': return 'Ending Soon';
      case 'complete': return 'Complete';
      case 'upcoming': return 'Upcoming';
      default: return 'Live';
    }
  };
  
  // Filter tournaments by search query
  export const filterTournaments = (tournaments, searchQuery) => {
    return {
      featured: tournaments.featured.filter(tournament =>
        tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      regular: tournaments.regular.filter(tournament =>
        tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  };
  
  // Handle tournament join action
  export const handleJoinTournament = (tournamentId, tournamentName) => {
    alert(`Joined "${tournamentName}" tournament!`);
  };