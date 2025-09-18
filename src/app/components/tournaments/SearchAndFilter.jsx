// src/components/tournaments/SearchAndFilter.jsx

import { Search, Filter } from 'lucide-react';

const SearchAndFilter = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tournaments ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-700"
        />
      </div>
      <button className="bg-zinc-900 border border-zinc-700 text-white px-6 py-3 rounded-lg font-medium flex items-center hover:bg-zinc-700">
        <Filter className="mr-2 w-5 h-5" />
        Filter
      </button>
    </div>
  );
};

export default SearchAndFilter;