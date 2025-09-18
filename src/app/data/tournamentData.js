// src/data/tournamentData.js

export const allTournaments = {
    featured: [
      {
        id: 1,
        title: 'Mega Million Monday',
        multiplier: '1000x',
        entry: '$10',
        level: 'Expert',
        category: 'featured',
        currentParticipants: 15420,
        maxParticipants: 20000,
        countdown: '1d 14h 32m',
        status: 'live',
      },
      {
        id: 2,
        title: 'Tech Giants Weekly',
        multiplier: '500X',
        entry: '$5',
        level: 'Intermediate',
        category: 'Tech',
        currentParticipants: 8420,
        maxParticipants: 10000,
        countdown: '3d 14h 32m',
        status: 'live'
      }
    ],
    regular: [
      {
        id: 3,
        title: 'Blue Chip Challenge',
        multiplier: '250X',
        level: 'Beginner',
        currentParticipants: 2341,
        maxParticipants: 5000,
        entryFee: '$25',
        countdown: '2h 15m',
        status: 'ending_soon'
      },
      {
        id: 4,
        title: 'Crypto Crusher',
        multiplier: '750X',
        level: 'Expert',
        currentParticipants: 2341,
        maxParticipants: 3000,
        entryFee: '$25',
        countdown: '5d 2h 15m',
        status: 'live'
      },
      {
        id: 5,
        title: 'Small Cap Hunters',
        multiplier: '300X',
        level: 'Beginner',
        currentParticipants: 2341,
        maxParticipants: 4000,
        entryFee: '$25',
        countdown: '2h 15m',
        status: 'ending_soon'
      },
      {
        id: 6,
        title: 'Forex Masters',
        multiplier: '400X',
        level: 'Expert',
        currentParticipants: 1850,
        maxParticipants: 2500,
        entryFee: '$50',
        countdown: '6h 45m',
        status: 'live'
      },
      {
        id: 7,
        title: 'Penny Stock Pro',
        multiplier: '150X',
        level: 'Beginner',
        currentParticipants: 4200,
        maxParticipants: 6000,
        entryFee: '$15',
        countdown: '12h 30m',
        status: 'live'
      },
      {
        id: 8,
        title: 'Options Elite',
        multiplier: '800X',
        level: 'Expert',
        currentParticipants: 1205,
        maxParticipants: 1500,
        entryFee: '$75',
        countdown: '1h 20m',
        status: 'ending_soon'
      }
    ]
  };
  
  export const tabs = [
    { name: 'Live', count: 3 },
    { name: 'Upcoming', count: 1 },
    { name: 'Complete', count: 4 }
  ];